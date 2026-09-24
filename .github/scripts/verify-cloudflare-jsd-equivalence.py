#!/usr/bin/env python3
"""Fail-closed comparison for Cloudflare-managed production HTML transforms.

The canonical production response may be byte-for-byte identical to the exact
Pages deployment, or Cloudflare may apply narrowly recognized managed transforms:
1. JavaScript Detection (JSD) injection at the end of <body>.
2. Cloudflare Fonts replacement of Google Fonts loading tags with inline
   @font-face rules whose sources are restricted to /cf-fonts/v/.

Both original artifacts are preserved. Only those explicitly validated
transforms, plus whitespace left behind on otherwise blank transformed lines,
are removed from derived comparison copies. Any other difference fails closed.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

CHALLENGE_MARKER = b"/cdn-cgi/challenge-platform/"
CF_FONTS_MARKER = b"/cf-fonts/"
SCRIPT_RE = re.compile(rb"<script>(?P<body>.*?)</script>", re.DOTALL)
QUOTED_CHALLENGE_PATH_RE = re.compile(
    rb"['\"](?P<value>/cdn-cgi/challenge-platform/[^'\"<>\s]+)['\"]"
)
REQUIRED_SIGNATURES = (
    b"(function(){function c(){",
    b"window.__CF$cv$params=",
    b"document.createElement('iframe')",
    b"document.addEventListener('DOMContentLoaded',c)",
)
GOOGLE_PRECONNECT_LINE_RE = re.compile(
    rb'(?m)^[ \t]*<link rel="preconnect" href="https://fonts\.(?:googleapis|gstatic)\.com"(?: crossorigin)?>[ \t]*$'
)
GOOGLE_STYLESHEET_LINE_RE = re.compile(
    rb'(?m)^[ \t]*<link href="(?P<url>https://fonts\.googleapis\.com/css2\?[^\"]+)" rel="stylesheet"(?P<attrs>[^>]*)>[ \t]*$'
)
CF_FONT_STYLE_LINE_RE = re.compile(
    rb'(?m)^[ \t]*<style type="text/css">(?P<body>[^\n]*?/cf-fonts/[^\n]*?)</style>[ \t]*$'
)
FONT_FAMILY_RE = re.compile(
    rb"font-family\s*:\s*['\"](?P<family>[^'\"]+)['\"]"
)
FONT_SRC_RE = re.compile(rb"src\s*:\s*url\((?P<url>[^)]+)\)")
BLANK_LINE_TRAILING_WHITESPACE_RE = re.compile(rb"(?m)^[ \t]+$")


class VerificationError(RuntimeError):
    pass


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def validate_jsd_path(raw_value: bytes) -> str:
    try:
        value = raw_value.decode("ascii")
    except UnicodeDecodeError as error:
        raise VerificationError("Cloudflare challenge path must be ASCII") from error

    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or parsed.fragment:
        raise VerificationError("Cloudflare JSD path must be an origin-relative URL")
    if not parsed.path.startswith("/cdn-cgi/challenge-platform/"):
        raise VerificationError("Cloudflare JSD path escaped the challenge-platform prefix")
    if "\\" in parsed.path or "//" in parsed.path or ".." in parsed.path.split("/"):
        raise VerificationError("Cloudflare JSD path contains a forbidden path form")

    segments = [segment for segment in parsed.path.split("/") if segment]
    if "jsd" not in segments:
        raise VerificationError("Cloudflare challenge path is not a /jsd/ resource")
    jsd_index = segments.index("jsd")
    if jsd_index < 2 or jsd_index == len(segments) - 1:
        raise VerificationError("Cloudflare JSD path has an invalid /jsd/ shape")

    return value


def remove_jsd_injection(
    canonical: bytes,
    exact: bytes,
) -> tuple[bytes, int, str | None]:
    if CHALLENGE_MARKER in exact:
        raise VerificationError(
            "Exact deployment unexpectedly contains a Cloudflare challenge-platform marker"
        )

    candidates = [
        match for match in SCRIPT_RE.finditer(canonical)
        if CHALLENGE_MARKER in match.group("body")
    ]
    if not candidates:
        return canonical, 0, None

    if len(candidates) != 1:
        raise VerificationError(
            f"Expected exactly one Cloudflare challenge-platform script; found {len(candidates)}"
        )

    candidate = candidates[0]
    body = candidate.group("body")

    for signature in REQUIRED_SIGNATURES:
        if signature not in body:
            raise VerificationError(
                "Challenge-platform script does not match the recognized Cloudflare JSD wrapper"
            )

    path_matches = list(QUOTED_CHALLENGE_PATH_RE.finditer(body))
    if len(path_matches) != 1:
        raise VerificationError(
            f"Expected exactly one quoted Cloudflare challenge path; found {len(path_matches)}"
        )

    jsd_path = validate_jsd_path(path_matches[0].group("value"))

    body_close = canonical.rfind(b"</body>")
    if body_close < 0:
        raise VerificationError("Canonical HTML does not contain </body>")
    if candidate.end() > body_close:
        raise VerificationError("Cloudflare JSD script is not inside the body")
    if canonical[candidate.end() : body_close].strip():
        raise VerificationError(
            "Cloudflare JSD script is not the final non-whitespace content before </body>"
        )

    normalized = canonical[: candidate.start()] + canonical[candidate.end() :]
    return normalized, 1, jsd_path


def google_font_families(raw_url: bytes) -> list[str]:
    try:
        url = raw_url.decode("ascii")
    except UnicodeDecodeError as error:
        raise VerificationError("Google Fonts URL must be ASCII") from error

    parsed = urlsplit(url)
    if parsed.scheme != "https" or parsed.netloc != "fonts.googleapis.com":
        raise VerificationError("Google Fonts stylesheet URL escaped fonts.googleapis.com")
    if parsed.path != "/css2":
        raise VerificationError("Google Fonts stylesheet URL has an unexpected path")

    query = parse_qs(parsed.query, keep_blank_values=True)
    families: list[str] = []
    for specification in query.get("family", []):
        family = specification.split(":", 1)[0].strip()
        if not family:
            raise VerificationError("Google Fonts stylesheet contains an empty family")
        families.append(family)

    if not families:
        raise VerificationError("Google Fonts stylesheet does not declare any family")

    return sorted(set(families))


def validate_cloudflare_font_style(body: bytes, expected_families: list[str]) -> list[str]:
    lowered = body.lower()
    forbidden = (b"@import", b"http://", b"https://", b"javascript:", b"<", b">")
    if any(token in lowered for token in forbidden):
        raise VerificationError("Cloudflare Fonts style contains an unexpected construct")
    if body.count(b"@font-face") == 0:
        raise VerificationError("Cloudflare Fonts style has no @font-face rules")

    sources = [match.group("url").strip(b"'\"") for match in FONT_SRC_RE.finditer(body)]
    if not sources:
        raise VerificationError("Cloudflare Fonts style has no font source URLs")
    if any(not source.startswith(b"/cf-fonts/v/") for source in sources):
        raise VerificationError("Cloudflare Fonts style contains a non-/cf-fonts/ source")

    families = sorted(
        {
            match.group("family").decode("utf-8")
            for match in FONT_FAMILY_RE.finditer(body)
        }
    )
    if families != expected_families:
        raise VerificationError(
            f"Cloudflare Fonts family mismatch: expected {expected_families}, got {families}"
        )

    return families


def normalize_cloudflare_fonts(
    canonical: bytes,
    exact: bytes,
) -> tuple[bytes, bytes, list[list[str]]]:
    style_matches = list(CF_FONT_STYLE_LINE_RE.finditer(canonical))
    if not style_matches:
        if CF_FONTS_MARKER in canonical:
            raise VerificationError("Unrecognized Cloudflare Fonts rewrite")
        return canonical, exact, []

    if CF_FONTS_MARKER in exact:
        raise VerificationError(
            "Exact deployment unexpectedly contains a Cloudflare Fonts marker"
        )

    stylesheet_matches = list(GOOGLE_STYLESHEET_LINE_RE.finditer(exact))
    if len(style_matches) != len(stylesheet_matches):
        raise VerificationError(
            "Cloudflare Fonts rewrite count mismatch: "
            f"canonical={len(style_matches)} exact={len(stylesheet_matches)}"
        )

    preconnect_matches = list(GOOGLE_PRECONNECT_LINE_RE.finditer(exact))
    expected_preconnects = 2 * len(stylesheet_matches)
    if len(preconnect_matches) != expected_preconnects:
        raise VerificationError(
            "Google Fonts preconnect count mismatch: "
            f"expected {expected_preconnects}, found {len(preconnect_matches)}"
        )

    family_sets: list[list[str]] = []
    for style_match, stylesheet_match in zip(style_matches, stylesheet_matches):
        expected_families = google_font_families(stylesheet_match.group("url"))
        family_sets.append(
            validate_cloudflare_font_style(
                style_match.group("body"),
                expected_families,
            )
        )

    normalized_canonical = CF_FONT_STYLE_LINE_RE.sub(b"", canonical)
    normalized_exact = GOOGLE_PRECONNECT_LINE_RE.sub(b"", exact)
    normalized_exact = GOOGLE_STYLESHEET_LINE_RE.sub(b"", normalized_exact)

    # Cloudflare may preserve indentation from removed preconnect lines.
    # Normalize horizontal whitespace only on otherwise blank lines.
    normalized_canonical = BLANK_LINE_TRAILING_WHITESPACE_RE.sub(
        b"",
        normalized_canonical,
    )
    normalized_exact = BLANK_LINE_TRAILING_WHITESPACE_RE.sub(
        b"",
        normalized_exact,
    )

    return normalized_canonical, normalized_exact, family_sets


def normalize_canonical(canonical: bytes, exact: bytes) -> tuple[bytes, dict[str, object]]:
    original_canonical = canonical
    original_exact = exact

    canonical, injection_count, jsd_path = remove_jsd_injection(canonical, exact)

    font_family_sets: list[list[str]] = []
    normalized_exact = exact
    if canonical != exact:
        canonical, normalized_exact, font_family_sets = normalize_cloudflare_fonts(
            canonical,
            exact,
        )

    if canonical != normalized_exact:
        raise VerificationError(
            "Canonical production still differs from the exact deployment "
            "after trusted Cloudflare transform normalization"
        )

    report: dict[str, object] = {
        "canonical_sha256": sha256_bytes(original_canonical),
        "exact_sha256": sha256_bytes(original_exact),
        "injection_count": injection_count,
        "jsd_path": jsd_path,
        "cloudflare_fonts_rewrite_count": len(font_family_sets),
        "cloudflare_font_families": font_family_sets,
        "normalized_canonical_sha256": sha256_bytes(canonical),
        "normalized_exact_sha256": sha256_bytes(normalized_exact),
        "normalized_match": True,
    }
    return canonical, report


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--canonical", required=True, type=Path)
    parser.add_argument("--exact", required=True, type=Path)
    parser.add_argument("--normalized-output", required=True, type=Path)
    parser.add_argument("--report", required=True, type=Path)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    canonical = args.canonical.read_bytes()
    exact = args.exact.read_bytes()

    try:
        normalized, report = normalize_canonical(canonical, exact)
    except VerificationError as error:
        print(
            f"Cloudflare managed-transform equivalence verification failed: {error}",
            file=sys.stderr,
        )
        return 1

    args.normalized_output.parent.mkdir(parents=True, exist_ok=True)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.normalized_output.write_bytes(normalized)
    args.report.write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
