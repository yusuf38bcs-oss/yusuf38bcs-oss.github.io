#!/usr/bin/env python3
"""Fail-closed comparison for Cloudflare JSD-modified production HTML.

The canonical production response may be byte-for-byte identical to the exact
Pages deployment, or it may contain exactly one Cloudflare-managed JavaScript
Detection injection that is absent from the exact deployment. This tool
preserves both input artifacts, removes only one narrowly recognized Cloudflare
JSD inline script from a derived canonical copy when present, and then requires
byte-for-byte equality with the exact deployment artifact.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

CHALLENGE_MARKER = b"/cdn-cgi/challenge-platform/"
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


def normalize_canonical(canonical: bytes, exact: bytes) -> tuple[bytes, dict[str, object]]:
    if CHALLENGE_MARKER in exact:
        raise VerificationError(
            "Exact deployment unexpectedly contains a Cloudflare challenge-platform marker"
        )

    if canonical == exact:
        report: dict[str, object] = {
            "canonical_sha256": sha256_bytes(canonical),
            "exact_sha256": sha256_bytes(exact),
            "injection_count": 0,
            "jsd_path": None,
            "normalized_canonical_sha256": sha256_bytes(canonical),
            "normalized_match": True,
        }
        return canonical, report

    candidates: list[re.Match[bytes]] = []
    for match in SCRIPT_RE.finditer(canonical):
        if CHALLENGE_MARKER in match.group("body"):
            candidates.append(match)

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
    if normalized != exact:
        raise VerificationError(
            "Canonical production still differs from the exact deployment after JSD normalization"
        )

    report: dict[str, object] = {
        "canonical_sha256": sha256_bytes(canonical),
        "exact_sha256": sha256_bytes(exact),
        "injection_count": 1,
        "jsd_path": jsd_path,
        "normalized_canonical_sha256": sha256_bytes(normalized),
        "normalized_match": True,
    }
    return normalized, report


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
        print(f"Cloudflare JSD equivalence verification failed: {error}", file=sys.stderr)
        return 1

    args.normalized_output.parent.mkdir(parents=True, exist_ok=True)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.normalized_output.write_bytes(normalized)
    args.report.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
