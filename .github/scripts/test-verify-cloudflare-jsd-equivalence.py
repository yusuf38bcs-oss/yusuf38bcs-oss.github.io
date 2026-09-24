#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("verify-cloudflare-jsd-equivalence.py")
SPEC = importlib.util.spec_from_file_location("verify_cloudflare_jsd_equivalence", SCRIPT_PATH)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)

VerificationError = MODULE.VerificationError
normalize_canonical = MODULE.normalize_canonical

EXACT = b"<!doctype html>\n<html><body><main data-homepage-v2>LBFL</main>\n  </body></html>\n"
VALID_JSD = (
    b"<script>(function(){function c(){var b=a.contentDocument||(a.contentWindow&&a.contentWindow.document);"
    b"if(b){var d=b.createElement('script');d.innerHTML=\"window.__CF$cv$params={r:'abc',t:'xyz'};"
    b"var a=document.createElement('script');a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';"
    b"document.getElementsByTagName('head')[0].appendChild(a);\";b.getElementsByTagName('head')[0].appendChild(d)}}"
    b"if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';"
    b"a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();"
    b"else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);}})();</script>"
)

FONT_PRECONNECT_1 = b'<link rel="preconnect" href="https://fonts.googleapis.com">'
FONT_PRECONNECT_2 = b'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
FONT_STYLESHEET = (
    b'<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400'
    b'&family=Open+Sans:wght@400&display=swap" rel="stylesheet">'
)
CF_FONT_STYLE = (
    b'<style type="text/css">'
    b"@font-face {font-family:'Inter';font-style:normal;font-weight:400;"
    b"src:url(/cf-fonts/v/inter/5.2.8/latin/wght/normal.woff2);font-display:swap;}"
    b"@font-face {font-family:'Open Sans';font-style:normal;font-weight:400;"
    b"src:url(/cf-fonts/v/open-sans/5.2.7/latin/wght/normal.woff2);font-display:swap;}"
    b"</style>"
)
EXACT_WITH_FONTS = (
    b"<!doctype html>\n<html><head>\n"
    + FONT_PRECONNECT_1 + b"\n"
    + FONT_PRECONNECT_2 + b"\n"
    + FONT_STYLESHEET + b"\n"
    + b"</head><body><main class=\"lbfl-home-v3\">LBFL</main>\n  </body></html>\n"
)
CANONICAL_WITH_FONTS = (
    EXACT_WITH_FONTS
    .replace(FONT_PRECONNECT_1, b"    ")
    .replace(FONT_PRECONNECT_2, b"    ")
    .replace(FONT_STYLESHEET, CF_FONT_STYLE)
)


def canonical_with(*scripts: bytes, suffix: bytes = b"") -> bytes:
    injection = b"".join(scripts) + suffix
    return EXACT.replace(b"</body>", injection + b"</body>")


def require_failure(canonical: bytes, exact: bytes, expected_fragment: str) -> None:
    try:
        normalize_canonical(canonical, exact)
    except VerificationError as error:
        assert expected_fragment in str(error), (expected_fragment, str(error))
    else:
        raise AssertionError("Expected verification to fail")


def test_valid_single_injection() -> None:
    normalized, report = normalize_canonical(canonical_with(VALID_JSD), EXACT)
    assert normalized == EXACT
    assert report["injection_count"] == 1
    assert report["cloudflare_fonts_rewrite_count"] == 0
    assert report["normalized_match"] is True
    assert report["jsd_path"] == "/cdn-cgi/challenge-platform/scripts/jsd/main.js"


def test_zero_injection_exact_match_passes() -> None:
    normalized, report = normalize_canonical(EXACT, EXACT)
    assert normalized == EXACT
    assert report["injection_count"] == 0
    assert report["cloudflare_fonts_rewrite_count"] == 0
    assert report["normalized_match"] is True
    assert report["jsd_path"] is None


def test_cloudflare_fonts_rewrite_passes() -> None:
    normalized, report = normalize_canonical(CANONICAL_WITH_FONTS, EXACT_WITH_FONTS)
    assert report["injection_count"] == 0
    assert report["cloudflare_fonts_rewrite_count"] == 1
    assert report["cloudflare_font_families"] == [["Inter", "Open Sans"]]
    assert report["normalized_match"] is True
    assert b"/cf-fonts/" not in normalized
    assert b"fonts.googleapis.com" not in normalized


def test_cloudflare_fonts_plus_jsd_passes() -> None:
    canonical = CANONICAL_WITH_FONTS.replace(
        b"</body>",
        VALID_JSD + b"</body>",
    )
    normalized, report = normalize_canonical(canonical, EXACT_WITH_FONTS)
    assert report["injection_count"] == 1
    assert report["cloudflare_fonts_rewrite_count"] == 1
    assert report["normalized_match"] is True
    assert b"/cdn-cgi/challenge-platform/" not in normalized


def test_cloudflare_fonts_family_mismatch_fails() -> None:
    invalid = CANONICAL_WITH_FONTS.replace(b"'Open Sans'", b"'Roboto'")
    require_failure(invalid, EXACT_WITH_FONTS, "family mismatch")


def test_cloudflare_fonts_external_source_fails() -> None:
    invalid = CANONICAL_WITH_FONTS.replace(
        b"/cf-fonts/v/inter/5.2.8/latin/wght/normal.woff2",
        b"https://example.com/inter.woff2",
    )
    require_failure(invalid, EXACT_WITH_FONTS, "unexpected construct")


def test_multiple_injections_fail() -> None:
    require_failure(canonical_with(VALID_JSD, VALID_JSD), EXACT, "found 2")


def test_non_jsd_challenge_path_fails() -> None:
    invalid = VALID_JSD.replace(
        b"/cdn-cgi/challenge-platform/scripts/jsd/main.js",
        b"/cdn-cgi/challenge-platform/scripts/main.js",
    )
    require_failure(canonical_with(invalid), EXACT, "not a /jsd/ resource")


def test_unrecognized_wrapper_fails() -> None:
    fake = b"<script>var x='/cdn-cgi/challenge-platform/scripts/jsd/main.js';</script>"
    require_failure(canonical_with(fake), EXACT, "recognized Cloudflare JSD wrapper")


def test_unrelated_content_difference_fails() -> None:
    changed = canonical_with(VALID_JSD).replace(b"LBFL", b"LBFL changed")
    require_failure(changed, EXACT, "still differs")


def test_script_must_be_last_non_whitespace_body_content() -> None:
    require_failure(
        canonical_with(VALID_JSD, suffix=b"<p>unexpected</p>"),
        EXACT,
        "final non-whitespace",
    )


def test_exact_artifact_must_not_contain_challenge_marker() -> None:
    exact_with_marker = EXACT.replace(
        b"LBFL",
        b"LBFL /cdn-cgi/challenge-platform/scripts/jsd/api.js",
    )
    require_failure(
        canonical_with(VALID_JSD),
        exact_with_marker,
        "Exact deployment unexpectedly",
    )


def run_all() -> None:
    tests = [
        test_valid_single_injection,
        test_zero_injection_exact_match_passes,
        test_cloudflare_fonts_rewrite_passes,
        test_cloudflare_fonts_plus_jsd_passes,
        test_cloudflare_fonts_family_mismatch_fails,
        test_cloudflare_fonts_external_source_fails,
        test_multiple_injections_fail,
        test_non_jsd_challenge_path_fails,
        test_unrecognized_wrapper_fails,
        test_unrelated_content_difference_fails,
        test_script_must_be_last_non_whitespace_body_content,
        test_exact_artifact_must_not_contain_challenge_marker,
    ]
    for test in tests:
        test()
        print(f"PASS {test.__name__}")


if __name__ == "__main__":
    run_all()
