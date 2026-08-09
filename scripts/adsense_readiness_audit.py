#!/usr/bin/env python3
"""Evidence-oriented AdSense controls audit for Learning Biology For Life.

The default is report-only. Use ``--fail-on`` in CI only after the existing
inventory findings are remediated and a rendered Jekyll artifact is available.
The auditor uses only Python's standard library so GitHub Actions can run it
without adding a dependency.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable


PUBLISHER_CLIENT_RE = re.compile(r"^ca-pub-(\d{10,})$")
ADSENSE_SCRIPT_HOST = "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
VERIFICATION_META_NAME = "google-adsense-account"
CENTRAL_ADSENSE_INCLUDE = Path("_includes/head/adsense.html")
ANALYTICS_CONSENT_INCLUDE = Path("_includes/head/analytics-consent.html")
HEAD_ENTRYPOINTS = (
    Path("_includes/head/head.html"),
    Path("_includes/head/homepage-v2-critical.html"),
)
RUNTIME_ROOTS = (Path("_includes"), Path("_layouts"), Path("assets/js"))
PUBLIC_PLACEHOLDER_ROOTS = (
    Path("_posts"),
    Path("_pages"),
    Path("_biology"),
    Path("_life-practices"),
    Path("_life-philosophy"),
    Path("_socratic"),
    Path("_mcq-arena"),
)
OPERATIONAL_ROOT_FILES = (
    "feed.atom",
    "feed_restore.py",
    "convert_atom.py",
    "neural_candidates.csv",
    "Repository-Guardian.ps1",
)
REQUIRED_RENDERED_ROUTES = (
    "index.html",
    "privacy-policy/index.html",
    "terms-and-conditions/index.html",
    "disclaimer/index.html",
    "contact/index.html",
    "editorial-policy/index.html",
    "cookie-preferences/index.html",
)
SEVERITY_RANK = {"critical": 3, "high": 2, "medium": 1, "low": 0}


@dataclass(frozen=True)
class Finding:
    severity: str
    code: str
    path: str
    message: str
    evidence: str | None = None


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8-sig")
    except (OSError, UnicodeDecodeError):
        return ""


def find_config_value(config: str, key: str) -> str | None:
    """Read one scalar nested under the top-level ``adsense`` mapping."""

    in_adsense = False
    for raw_line in config.splitlines():
        if not raw_line.strip() or raw_line.lstrip().startswith("#"):
            continue
        if not raw_line.startswith((" ", "\t")):
            in_adsense = raw_line.strip() == "adsense:"
            continue
        if not in_adsense:
            continue
        match = re.match(rf"^\s+{re.escape(key)}\s*:\s*(.*?)\s*$", raw_line)
        if match:
            return match.group(1).strip("\"'")
    return None


def find_scalar(config: str, key: str) -> str | None:
    """Read one top-level scalar from a small dedicated YAML data file."""

    for raw_line in config.splitlines():
        if not raw_line.strip() or raw_line.lstrip().startswith("#"):
            continue
        match = re.match(rf"^{re.escape(key)}\s*:\s*(.*?)\s*$", raw_line)
        if match:
            return match.group(1).strip("\"'")
    return None


def iter_text_files(root: Path, relative_roots: Iterable[Path]) -> Iterable[Path]:
    allowed = {".html", ".htm", ".js", ".md", ".markdown", ".yml", ".yaml"}
    for relative_root in relative_roots:
        absolute_root = root / relative_root
        if not absolute_root.exists():
            continue
        for path in absolute_root.rglob("*"):
            if path.is_file() and path.suffix.lower() in allowed:
                yield path


def config_excludes(config: str, filename: str) -> bool:
    in_exclude = False
    for raw_line in config.splitlines():
        if re.match(r"^exclude\s*:\s*$", raw_line):
            in_exclude = True
            continue
        if in_exclude and raw_line and not raw_line.startswith((" ", "\t")):
            return False
        if in_exclude:
            match = re.match(r"^\s*-\s+(.+?)\s*$", raw_line)
            if match and match.group(1).strip("\"'") == filename:
                return True
    return False


def source_findings(root: Path) -> tuple[list[Finding], dict[str, str | bool | None]]:
    findings: list[Finding] = []
    config_path = root / "_config.yml"
    config = read_text(config_path)
    controls_path = root / "_data/adsense.yml"
    controls = read_text(controls_path)
    client = find_config_value(config, "client")
    mode = (find_scalar(controls, "mode") or "").lower()
    cmp_raw = (find_scalar(controls, "certified_cmp_ready") or "").lower()
    cmp_ready = cmp_raw == "true"

    if not config:
        findings.append(Finding("critical", "CONFIG_MISSING", "_config.yml", "AdSense configuration is unavailable."))
    if not controls:
        findings.append(Finding("critical", "CONTROL_DATA_MISSING", str(controls_path.relative_to(root)), "AdSense control data is unavailable."))
    if not client or not PUBLISHER_CLIENT_RE.fullmatch(client):
        findings.append(Finding("critical", "INVALID_PUBLISHER_CLIENT", "_config.yml", "adsense.client must be a valid ca-pub identifier.", client))
    if mode not in {"review", "live"}:
        findings.append(Finding("critical", "INVALID_ADSENSE_MODE", str(controls_path.relative_to(root)), "mode must be explicitly review or live.", mode or "missing"))
    if mode == "review" and cmp_ready:
        findings.append(Finding("critical", "REVIEW_MODE_CMP_ENABLED", str(controls_path.relative_to(root)), "Review mode must keep certified_cmp_ready false."))

    central_path = root / CENTRAL_ADSENSE_INCLUDE
    central = read_text(central_path)
    if not central:
        findings.append(Finding("critical", "CENTRAL_BOUNDARY_MISSING", str(CENTRAL_ADSENSE_INCLUDE), "Central AdSense boundary is missing."))
    else:
        required_tokens = (
            VERIFICATION_META_NAME,
            "lbfl_adsense_mode == 'live'",
            "site.data.adsense.certified_cmp_ready == true",
            "page.ads_eligible == true",
            ADSENSE_SCRIPT_HOST,
        )
        for token in required_tokens:
            if token not in central:
                findings.append(Finding("critical", "BOUNDARY_CONDITION_MISSING", str(CENTRAL_ADSENSE_INCLUDE), "Central boundary is missing a required fail-closed condition.", token))

    for entrypoint in HEAD_ENTRYPOINTS:
        text = read_text(root / entrypoint)
        if "{% include head/adsense.html %}" not in text:
            findings.append(Finding("critical", "VERIFICATION_INCLUDE_MISSING", str(entrypoint), "Head entrypoint does not include the central AdSense boundary."))

    analytics = read_text(root / ANALYTICS_CONSENT_INCLUDE)
    if not analytics:
        findings.append(Finding("critical", "ANALYTICS_RUNTIME_MISSING", str(ANALYTICS_CONSENT_INCLUDE), "Central analytics-choice runtime is missing."))
    else:
        if ADSENSE_SCRIPT_HOST in analytics or "loadAdSense" in analytics:
            findings.append(Finding("critical", "ANALYTICS_LOADS_ADS", str(ANALYTICS_CONSENT_INCLUDE), "The analytics-choice runtime must never load AdSense."))
        for field in ("ad_storage", "ad_user_data", "ad_personalization"):
            if re.search(rf"{field}[^\n]{{0,100}}granted", analytics, re.IGNORECASE):
                findings.append(Finding("critical", "ANALYTICS_GRANTS_AD_CONSENT", str(ANALYTICS_CONSENT_INCLUDE), "The LBFL analytics choice must not grant advertising consent.", field))

    central_resolved = central_path.resolve()
    for path in iter_text_files(root, RUNTIME_ROOTS):
        if path.resolve() == central_resolved:
            continue
        text = read_text(path)
        if ADSENSE_SCRIPT_HOST in text or "ADSENSE_SRC" in text or "loadAdSense" in text:
            findings.append(Finding("critical", "BYPASS_AD_LOADER", str(path.relative_to(root)), "AdSense loading exists outside the central boundary."))
        if re.search(r"ad_(?:storage|user_data|personalization)[^\n]{0,100}(?:\?|:)\s*[\"']?granted", text, re.IGNORECASE):
            findings.append(Finding("critical", "RUNTIME_GRANTS_AD_CONSENT", str(path.relative_to(root)), "A site runtime can grant advertising consent outside a certified CMP."))

    if mode == "review":
        for path in iter_text_files(root, PUBLIC_PLACEHOLDER_ROOTS):
            text = read_text(path)
            if re.search(r"ads_eligible\s*:\s*true", text, re.IGNORECASE):
                findings.append(Finding("critical", "REVIEW_PAGE_ELIGIBLE", str(path.relative_to(root)), "No page may be ad-eligible in review mode."))
            if re.search(r"AdSense\s+Responsive\s+Unit|adsense-placeholder", text, re.IGNORECASE):
                findings.append(Finding("high", "PUBLIC_AD_PLACEHOLDER", str(path.relative_to(root)), "Visible ad placeholder remains in public content."))

    ads_txt = read_text(root / "ads.txt").strip()
    expected_ads_txt = None
    if client and PUBLISHER_CLIENT_RE.fullmatch(client):
        publisher_number = PUBLISHER_CLIENT_RE.fullmatch(client).group(1)
        expected_ads_txt = f"google.com, pub-{publisher_number}, DIRECT, f08c47fec0942fa0"
        if ads_txt != expected_ads_txt:
            findings.append(Finding("critical", "ADS_TXT_MISMATCH", "ads.txt", "ads.txt does not exactly match the configured publisher.", ads_txt or "missing"))

    for filename in OPERATIONAL_ROOT_FILES:
        if (root / filename).exists() and not config_excludes(config, filename):
            findings.append(Finding("high", "OPERATIONAL_FILE_PUBLIC", filename, "Root operational file is not excluded from Jekyll output."))

    state: dict[str, str | bool | None] = {
        "client": client,
        "mode": mode or None,
        "certified_cmp_ready": cmp_ready,
        "expected_ads_txt": expected_ads_txt,
    }
    return findings, state


def rendered_findings(site_dir: Path | None, state: dict[str, str | bool | None]) -> list[Finding]:
    if site_dir is None:
        return [Finding("medium", "RENDERED_AUDIT_PENDING", "_site", "Rendered Jekyll artifact was not supplied; source checks cannot certify final HTML.")]
    if not site_dir.is_dir():
        return [Finding("critical", "RENDERED_SITE_MISSING", str(site_dir), "Rendered site directory does not exist.")]

    findings: list[Finding] = []
    client = state.get("client")
    expected_meta = f'<meta name="{VERIFICATION_META_NAME}" content="{client}">' if client else ""

    for relative in REQUIRED_RENDERED_ROUTES:
        path = site_dir / relative
        html = read_text(path)
        if not html:
            findings.append(Finding("critical", "RENDERED_ROUTE_MISSING", relative, "Required rendered route is missing."))
            continue
        if expected_meta and html.count(expected_meta) != 1:
            findings.append(Finding("critical", "VERIFICATION_META_COUNT", relative, "Rendered route must contain exactly one AdSense verification meta tag.", str(html.count(expected_meta))))
        if state.get("mode") == "review" and ADSENSE_SCRIPT_HOST in html:
            findings.append(Finding("critical", "REVIEW_MODE_AD_SCRIPT", relative, "Rendered review-mode page contains an AdSense script request."))

    expected_ads_txt = state.get("expected_ads_txt")
    rendered_ads_txt = read_text(site_dir / "ads.txt").strip()
    if expected_ads_txt and rendered_ads_txt != expected_ads_txt:
        findings.append(Finding("critical", "RENDERED_ADS_TXT_MISMATCH", "ads.txt", "Rendered ads.txt does not match the configured publisher.", rendered_ads_txt or "missing"))

    for filename in OPERATIONAL_ROOT_FILES:
        if (site_dir / filename).exists():
            findings.append(Finding("high", "RENDERED_OPERATIONAL_FILE", filename, "Operational file is present in the rendered public artifact."))
    return findings


def write_report(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix.lower() == ".json":
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return

    counts = payload["counts"]
    lines = [
        "# LBFL AdSense Readiness Audit",
        "",
        f"Generated: `{payload['generated_at']}`",
        f"Mode: `{payload['state'].get('mode') or 'unknown'}`",
        f"Certified CMP ready: `{str(payload['state'].get('certified_cmp_ready')).lower()}`",
        "",
        "## Findings",
        "",
        f"- Critical: **{counts['critical']}**",
        f"- High: **{counts['high']}**",
        f"- Medium: **{counts['medium']}**",
        f"- Low: **{counts['low']}**",
        "",
    ]
    if payload["findings"]:
        for finding in payload["findings"]:
            lines.append(f"- **{finding['severity'].upper()} · {finding['code']}** — `{finding['path']}`: {finding['message']}")
    else:
        lines.append("No findings.")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit LBFL AdSense controls and rendered readiness.")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="Repository root.")
    parser.add_argument("--site-dir", type=Path, help="Optional rendered _site directory.")
    parser.add_argument("--output", type=Path, help="Optional .json or Markdown report path.")
    parser.add_argument("--fail-on", choices=("none", "critical", "high", "medium", "low"), default="none", help="Default none keeps the initial rollout report-only.")
    args = parser.parse_args()

    root = args.root.resolve()
    source, state = source_findings(root)
    rendered = rendered_findings(args.site_dir.resolve() if args.site_dir else None, state)
    findings = source + rendered
    counts = {severity: sum(1 for item in findings if item.severity == severity) for severity in SEVERITY_RANK}
    payload = {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "root": str(root),
        "site_dir": str(args.site_dir.resolve()) if args.site_dir else None,
        "state": state,
        "counts": counts,
        "findings": [asdict(item) for item in findings],
    }

    if args.output:
        write_report(args.output, payload)

    print(
        "AdSense audit complete: "
        + ", ".join(f"{severity}={counts[severity]}" for severity in ("critical", "high", "medium", "low"))
    )
    for item in findings:
        print(f"[{item.severity.upper()}] {item.code} {item.path}: {item.message}")

    if args.fail_on == "none":
        return 0
    threshold = SEVERITY_RANK[args.fail_on]
    return 1 if any(SEVERITY_RANK[item.severity] >= threshold for item in findings) else 0


if __name__ == "__main__":
    sys.exit(main())
