#!/usr/bin/env python3
"""
Learning Biology For Life — Site Audit Engine

Static repository audit for Jekyll production readiness:
- routes/front matter
- trust-policy routes
- stale fallback text
- Liquid balance in runtime templates
- educational/non-clinical boundary coverage
- thin pages, placeholder text, raw Markdown risks
- bilingual route pairing
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

TEXT_EXTENSIONS = {
    ".md", ".markdown", ".html", ".htm", ".yml", ".yaml", ".json", ".js", ".css",
    ".scss", ".txt", ".xml", ".rb", ".py", ".toml", ".cjs", ".mjs", ".csv"
}
CONTENT_EXTENSIONS = {".md", ".markdown", ".html", ".htm"}

EXCLUDED_DIRS = {
    ".git", "_site", "_backup", ".jekyll-cache", ".sass-cache", "node_modules", "vendor",
    ".bundle", ".cache", ".idea", ".vscode", "audit-reports"
}

PUBLIC_CONTENT_DIR_PREFIXES = (
    "_posts/", "_pages/", "_biology/", "_mcq-arena/", "_socratic/", "_synaptic-bridge/",
    "_life-practices/", "_life-philosophy/", "_concepts/"
)
PUBLIC_ROOT_CONTENT_FILES = {
    "index.md", "index.html", "index.bn.html", "about.md", "about.bn.md",
    "privacy-policy.md", "disclaimer.md", "terms-and-conditions.md", "contact.md", "categories.md",
}
NON_RUNTIME_CONTROL_FILES = {
    "README.md", "_config.yml", "cloudflare-worker-prompt.txt",
    "cloudflare-hello-world-domain-guide.md", "gmail-gemini-ai-workplan.md",
    "wrangler.jsonc", "Gemfile", "Gemfile.lock",
}
LEGAL_REQUIRED_ROUTES = {
    "/about/", "/contact/", "/editorial-policy/", "/privacy-policy/",
    "/terms-and-conditions/", "/disclaimer/", "/cookie-preferences/", "/categories/",
}
BAD_TRANSLATION_PHRASES = [
    "Native Bangla Gateway", "structured academic hub", "learning framework", "stale fallback",
    "Ban বোতাম", "Deployment refresh", "Official website for Learning Biology For Life", ".github.io",
]
PLACEHOLDER_PATTERNS = [
    r"\bTODO\b", r"\bFIXME\b", r"\bTBD\b", r"\bLorem ipsum\b",
    r"\[Image of [^\]]+\]", r"Insert Your", r"coming soon", r"No items found for this archive",
]
SECRET_PATTERNS = [
    r"cfat_[A-Za-z0-9_-]{20,}", r"sk-proj-[A-Za-z0-9_-]{20,}", r"sk-[A-Za-z0-9_-]{30,}",
    r"AIza[0-9A-Za-z\-_]{20,}", r"(?i)OPENAI_API_KEY\s*[:=]\s*['\"]?[^'\"\s]+",
    r"(?i)CLOUDFLARE_API_TOKEN\s*[:=]\s*['\"]?[^'\"\s]+",
    r"(?i)GOOGLE_CLIENT_SECRET\s*[:=]\s*['\"]?[^'\"\s]+", r"(?i)Bearer\s+[A-Za-z0-9._\-]{30,}",
]
HEALTH_KEYWORDS = [
    "disease", "treatment", "symptom", "medicine", "surgery", "diagnosis", "therapy",
    "heart attack", "angina", "hypertension", "pneumonia", "tuberculosis", "asthma",
    "depression", "personality", "medical", "clinical", "patient", "prescription",
    "রোগ", "চিকিৎসা", "লক্ষণ", "ওষুধ", "সার্জারি", "রোগনির্ণয়", "মানসিক",
    "ডিপ্রেশন", "হার্ট", "শ্বাসকষ্ট", "প্রেসক্রিপশন",
]
DISCLAIMER_KEYWORDS = [
    "educational only", "educational understanding", "for education only", "for learning only",
    "learning only", "not medical", "not diagnosis", "not treatment", "not psychological",
    "not clinical", "not legal", "physician", "healthcare", "qualified healthcare professional",
    "educational boundary", "medical safety boundary", "health education boundary",
    "শিক্ষামূলক", "শেখার উদ্দেশ্যে", "রোগনির্ণয় নয়", "চিকিৎসা-পরামর্শ নয়",
    "চিকিৎসক", "ব্যক্তিগত চিকিৎসা", "জরুরি চিকিৎসা", "মানসিক স্বাস্থ্য",
]
LIQUID_PAIRS = [("{{", "}}"), ("{%", "%}")]


@dataclass
class Finding:
    severity: str
    code: str
    path: str
    message: str
    line: Optional[int] = None
    evidence: Optional[str] = None


@dataclass
class PageRecord:
    path: str
    route: Optional[str]
    title: Optional[str]
    layout: Optional[str]
    lang: Optional[str]
    collection: Optional[str]
    has_front_matter: bool
    word_count: int


@dataclass
class AuditReport:
    generated_at: str
    root: str
    files_scanned: int = 0
    text_files_scanned: int = 0
    content_files_scanned: int = 0
    pages: List[PageRecord] = field(default_factory=list)
    findings: List[Finding] = field(default_factory=list)
    duplicate_routes: Dict[str, List[str]] = field(default_factory=dict)
    missing_required_routes: List[str] = field(default_factory=list)


def read_text(path: Path) -> Optional[str]:
    try:
        return path.read_text(encoding="utf-8-sig")
    except UnicodeDecodeError:
        try:
            return path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            return None
    except Exception:
        return None


def iter_repo_files(root: Path) -> Iterable[Path]:
    for current_root, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDED_DIRS]
        for filename in filenames:
            yield Path(current_root) / filename


def relpath(root: Path, path: Path) -> str:
    return path.relative_to(root).as_posix()


def add_finding(report: AuditReport, severity: str, code: str, path: str, message: str, line: Optional[int] = None, evidence: Optional[str] = None) -> None:
    report.findings.append(Finding(severity, code, path, message, line, evidence))


def line_number_for(text: str, pattern: str, regex: bool = False) -> Optional[int]:
    for idx, line in enumerate(text.splitlines(), start=1):
        if (re.search(pattern, line, flags=re.IGNORECASE) if regex else pattern in line):
            return idx
    return None


def extract_front_matter(text: str) -> Tuple[bool, Dict[str, str], str]:
    normalized = text.replace("\r\n", "\n")
    if not normalized.startswith("---\n"):
        return False, {}, text
    parts = normalized.split("---\n", 2)
    if len(parts) < 3:
        return True, {}, text
    fm_text, body = parts[1], parts[2]
    fm: Dict[str, str] = {}
    for line in fm_text.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if ":" in line and not line.startswith(" ") and not line.startswith("-"):
            key, value = line.split(":", 1)
            fm[key.strip()] = value.strip().strip('"').strip("'")
    return True, fm, body


def infer_collection(path: str) -> Optional[str]:
    if path.startswith("_") and "/" in path:
        return path.split("/", 1)[0].lstrip("_")
    return None


def normalize_permalink(route: str) -> str:
    if not route.startswith("/"):
        route = "/" + route
    if not route.endswith("/") and not route.endswith(".txt") and not route.endswith(".xml"):
        route += "/"
    return route


def is_reviewed_polyglot_bn_source(path: str, fm: Dict[str, str]) -> bool:
    if not ((fm.get("lang") == "bn") or (fm.get("language") == "bn")):
        return False
    return path.endswith(".bn.md") or path.endswith(".bn.html") or path == "index.bn.html"


def route_from_front_matter_or_path(path: str, fm: Dict[str, str]) -> Optional[str]:
    if fm.get("published") == "false":
        return None
    route = fm.get("permalink")
    if not route:
        return None
    route = normalize_permalink(route)
    if is_reviewed_polyglot_bn_source(path, fm):
        if route == "/":
            return "/bn/"
        if not route.startswith("/bn/"):
            return normalize_permalink("/bn" + route)
    return route


def infer_lang(path: str, route: Optional[str], fm: Dict[str, str]) -> Optional[str]:
    explicit = fm.get("lang") or fm.get("language")
    if explicit:
        return explicit
    if route and route.startswith("/bn/"):
        return "bn"
    if is_reviewed_polyglot_bn_source(path, fm):
        return "bn"
    if route:
        return "en"
    return None


def count_words(text: str) -> int:
    stripped = re.sub(r"<[^>]+>", " ", text)
    stripped = re.sub(r"[`*_#>\[\](){}|\-]", " ", stripped)
    return len(re.findall(r"[\w\u0980-\u09FF]+", stripped, flags=re.UNICODE))


def is_public_content_file(path: str) -> bool:
    return path in PUBLIC_ROOT_CONTENT_FILES or path.startswith(PUBLIC_CONTENT_DIR_PREFIXES)


def is_internal_repo_control_file(path: str) -> bool:
    return (
        path in NON_RUNTIME_CONTROL_FILES
        or path.startswith(".github/")
        or path.startswith("scripts/")
        or path.startswith("docs/")
        or path.startswith("worker/")
    )


def is_runtime_template_file(path: str) -> bool:
    return path.startswith("_includes/") or path.startswith("_layouts/") or path.startswith("_sass/") or path.startswith("assets/")


def strip_ignored_liquid_text(text: str) -> str:
    text = re.sub(r"```.*?```", "", text, flags=re.DOTALL)
    text = re.sub(r"`[^`\n]*`", "", text)
    text = re.sub(r"\{%\s*raw\s*%\}.*?\{%\s*endraw\s*%\}", "", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"\{%\s*comment\s*%\}.*?\{%\s*endcomment\s*%\}", "", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    text = re.sub(r"<script\b.*?</script>", "", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<style\b.*?</style>", "", text, flags=re.DOTALL | re.IGNORECASE)
    return text


def should_check_liquid_balance(path: str, suffix: str, has_front_matter: bool, text: str) -> bool:
    if is_internal_repo_control_file(path):
        return False
    if path.startswith("assets/") or suffix in {".js", ".css", ".scss", ".py", ".json", ".txt", ".csv"}:
        return False
    if path.startswith("_includes/") or path.startswith("_layouts/"):
        return True
    # Content files often contain mathematical braces. Check them only when they use actual Liquid syntax.
    liquid_indicators = ("{% ", "{%-", "{{ page.", "{{ site.", "{{ content", "{% include", "{% assign", "{% for", "{% if")
    return has_front_matter and suffix in CONTENT_EXTENSIONS and any(marker in text for marker in liquid_indicators)


def site_has_global_educational_boundary(root: Path, layout: Optional[str]) -> bool:
    if layout not in {"single", "concept_node", "concept-node"}:
        return False
    include_text = read_text(root / "_includes" / "components" / "educational-boundary.html") or ""
    single_layout = read_text(root / "_layouts" / "single.html") or ""
    concept_layout = read_text(root / "_layouts" / "concept_node.html") or ""
    include_ok = (
        "educational-boundary" in include_text
        and "not medical" in include_text.lower()
        and "not diagnosis" in include_text.lower()
        and "not treatment" in include_text.lower()
        and "qualified healthcare professional" in include_text.lower()
    )
    if not include_ok:
        return False
    if layout == "single":
        return "educational-boundary.html" in single_layout
    return "educational-boundary.html" in concept_layout


def has_health_boundary(root: Path, text: str, fm: Dict[str, str], layout: Optional[str]) -> bool:
    if (fm.get("health_boundary") or fm.get("educational_boundary") or "").lower() in {"true", "educational", "yes"}:
        return True
    lower_text = text.lower()
    if any(keyword.lower() in lower_text for keyword in DISCLAIMER_KEYWORDS):
        return True
    return site_has_global_educational_boundary(root, layout)


def raw_markdown_risk(text: str) -> Optional[str]:
    patterns = [
        r"<div(?![^>]*markdown=[\"']1[\"'])[^>]*>\s*\n\s*#{1,6}\s+",
        r"<section(?![^>]*markdown=[\"']1[\"'])[^>]*>\s*\n\s*#{1,6}\s+",
        r"<article(?![^>]*markdown=[\"']1[\"'])[^>]*>\s*\n\s*#{1,6}\s+",
        r"markdown=[\"']0[\"']",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE | re.MULTILINE)
        if match:
            return match.group(0)[:120]
    return None


def audit_text_file(report: AuditReport, root: Path, path: Path, text: str) -> Optional[PageRecord]:
    rpath = relpath(root, path)
    suffix = path.suffix.lower()
    if text.startswith("\ufeff"):
        add_finding(report, "medium", "UTF8_BOM", rpath, "File starts with UTF-8 BOM; Jekyll front matter may be affected.", 1)
    for pattern in SECRET_PATTERNS:
        match = re.search(pattern, text)
        if match:
            add_finding(report, "critical", "POSSIBLE_SECRET", rpath, "Possible secret/token pattern found. Verify and revoke if real.", line_number_for(text, pattern, regex=True), match.group(0)[:80])

    has_fm, fm, body = extract_front_matter(text) if suffix in CONTENT_EXTENSIONS else (False, {}, text)
    route = route_from_front_matter_or_path(rpath, fm) if suffix in CONTENT_EXTENSIONS else None

    if should_check_liquid_balance(rpath, suffix, has_fm, text):
        liquid_text = strip_ignored_liquid_text(text)
        for open_token, close_token in LIQUID_PAIRS:
            if liquid_text.count(open_token) != liquid_text.count(close_token):
                add_finding(report, "high", "LIQUID_PAIR_MISMATCH", rpath, f"Liquid token mismatch for {open_token} ... {close_token}.")

    if not (is_internal_repo_control_file(rpath) or is_runtime_template_file(rpath)):
        for phrase in BAD_TRANSLATION_PHRASES:
            if phrase in text:
                add_finding(report, "high", "BAD_TRANSLATION_OR_STALE_FALLBACK", rpath, f"Stale or unreviewed translation/fallback phrase found: {phrase}", line_number_for(text, phrase), phrase)

    if not is_internal_repo_control_file(rpath) and not rpath.startswith("_layouts/"):
        for pattern in PLACEHOLDER_PATTERNS:
            match = re.search(pattern, text, flags=re.IGNORECASE)
            if match:
                add_finding(report, "medium", "PLACEHOLDER_TEXT", rpath, "Placeholder or unfinished text detected.", line_number_for(text, pattern, regex=True), match.group(0)[:120])

    if route or rpath.startswith("_includes/") or rpath.startswith("_layouts/"):
        risk = raw_markdown_risk(text)
        if risk:
            add_finding(report, "medium", "RAW_MARKDOWN_RENDER_RISK", rpath, "Markdown may render as raw text inside an HTML block.", None, risk)

    if suffix not in CONTENT_EXTENSIONS:
        return None

    if is_public_content_file(rpath) and not has_fm:
        add_finding(report, "high", "MISSING_FRONT_MATTER", rpath, "Public content file has no Jekyll front matter.", 1)
    if has_fm and not fm:
        add_finding(report, "high", "BROKEN_FRONT_MATTER", rpath, "File begins with front matter delimiter but key-value extraction failed; check YAML syntax.", 1)

    lang = infer_lang(rpath, route, fm)
    explicit_lang = fm.get("lang") or fm.get("language")
    title = fm.get("title")
    layout = fm.get("layout")
    collection = infer_collection(rpath)
    words = count_words(body)

    if route and words < 120 and is_public_content_file(rpath):
        if layout not in {"archive", "null"} and fm.get("sitemap") != "false":
            add_finding(report, "medium", "THIN_PUBLIC_PAGE", rpath, f"Public route has low word count ({words}). Check whether this is intentional.", None, route)
    if route and not title:
        add_finding(report, "medium", "MISSING_TITLE", rpath, "Page has route but no title in front matter.", None, route)
    if route and not layout:
        add_finding(report, "medium", "MISSING_LAYOUT", rpath, "Page has route but no layout in front matter.", None, route)
    if route and is_public_content_file(rpath) and not explicit_lang and route.startswith("/bn/"):
        add_finding(report, "medium", "MISSING_LANGUAGE", rpath, "Bangla public route has no explicit lang/language metadata.", None, route)

    if route and is_public_content_file(rpath):
        lower_text = text.lower()
        if any(k.lower() in lower_text for k in HEALTH_KEYWORDS):
            if not has_health_boundary(root, text, fm, layout):
                add_finding(report, "high", "MISSING_HEALTH_BOUNDARY", rpath, "Health/medical/behaviour content may need an educational/non-clinical boundary.", None, route)

    if route:
        if route.startswith("/en/") and lang and lang != "en":
            add_finding(report, "high", "LANG_ROUTE_MISMATCH", rpath, "Route starts with /en/ but lang is not en.", None, route)
        if route.startswith("/bn/") and lang and lang != "bn":
            add_finding(report, "high", "LANG_ROUTE_MISMATCH", rpath, "Route starts with /bn/ but lang is not bn.", None, route)

    return PageRecord(rpath, route, title, layout, lang, collection, has_fm, words)


def compute_duplicate_routes(report: AuditReport) -> None:
    route_map: Dict[str, List[str]] = {}
    for page in report.pages:
        if page.route:
            route_map.setdefault(page.route, []).append(page.path)
    for route, paths in route_map.items():
        if len(paths) > 1:
            report.duplicate_routes[route] = paths
            for path in paths:
                add_finding(report, "critical", "DUPLICATE_PERMALINK", path, f"Duplicate permalink route: {route}", None, ", ".join(paths))


def compute_required_routes(report: AuditReport) -> None:
    routes = {p.route for p in report.pages if p.route}
    missing = sorted(route for route in LEGAL_REQUIRED_ROUTES if route not in routes)
    report.missing_required_routes = missing
    for route in missing:
        add_finding(report, "critical", "MISSING_REQUIRED_ROUTE", "<site>", f"Required trust/AdSense route missing: {route}")


def compute_route_pairs(report: AuditReport) -> None:
    by_route = {p.route: p for p in report.pages if p.route}
    for route, page in by_route.items():
        if route is None:
            continue
        if page.lang == "bn" and route.startswith("/bn/"):
            expected_en = "/" if route == "/bn/" else route.replace("/bn/", "/", 1)
            if expected_en not in by_route:
                add_finding(report, "medium", "MISSING_ENGLISH_SOURCE", page.path, f"Bangla localized page does not have English source route at {expected_en}.", None, route)
        elif page.lang == "bn" and not route.startswith("/bn/"):
            expected_en = "/en" + route
            if expected_en not in by_route:
                add_finding(report, "medium", "MISSING_ENGLISH_MIRROR", page.path, f"Bangla page does not have an English mirror at {expected_en}.", None, route)
        elif page.lang == "en" and route.startswith("/en/"):
            expected_bn = route.replace("/en/", "/", 1)
            if expected_bn not in by_route:
                add_finding(report, "medium", "MISSING_BANGLA_MIRROR", page.path, f"English mirror does not have Bangla source route at {expected_bn}.", None, route)


def run_audit(root: Path) -> AuditReport:
    report = AuditReport(generated_at=dt.datetime.now(dt.UTC).isoformat(), root=str(root))
    for path in iter_repo_files(root):
        report.files_scanned += 1
        if path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        text = read_text(path)
        if text is None:
            add_finding(report, "medium", "UNREADABLE_TEXT", relpath(root, path), "Text-like file could not be read as UTF-8.")
            continue
        report.text_files_scanned += 1
        page = audit_text_file(report, root, path, text)
        if page:
            report.content_files_scanned += 1
            report.pages.append(page)
    compute_duplicate_routes(report)
    compute_required_routes(report)
    compute_route_pairs(report)
    return report


def severity_counts(findings: List[Finding]) -> Dict[str, int]:
    counts = {"critical": 0, "high": 0, "medium": 0, "low": 0}
    for finding in findings:
        counts[finding.severity] = counts.get(finding.severity, 0) + 1
    return counts


def write_reports(report: AuditReport, output_dir: Path) -> Tuple[Path, Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    stamp = dt.datetime.now(dt.UTC).strftime("%Y%m%d-%H%M%S")
    json_path = output_dir / f"site-audit-{stamp}.json"
    md_path = output_dir / f"site-audit-{stamp}.md"
    json_path.write_text(json.dumps(asdict(report), ensure_ascii=False, indent=2), encoding="utf-8")
    counts = severity_counts(report.findings)
    lines: List[str] = [
        "# Learning Biology For Life — Site Audit Report", "",
        f"Generated: `{report.generated_at}`", f"Root: `{report.root}`", "",
        "## Summary", "",
        f"- Files scanned: **{report.files_scanned}**",
        f"- Text files scanned: **{report.text_files_scanned}**",
        f"- Content files scanned: **{report.content_files_scanned}**",
        f"- Pages/routes detected: **{len([p for p in report.pages if p.route])}**",
        f"- Critical findings: **{counts.get('critical', 0)}**",
        f"- High findings: **{counts.get('high', 0)}**",
        f"- Medium findings: **{counts.get('medium', 0)}**", "",
    ]
    if report.missing_required_routes:
        lines.extend(["## Missing Required Routes", ""])
        lines.extend(f"- `{route}`" for route in report.missing_required_routes)
        lines.append("")
    if report.duplicate_routes:
        lines.extend(["## Duplicate Routes", ""])
        for route, paths in sorted(report.duplicate_routes.items()):
            lines.append(f"- `{route}` → {', '.join(f'`{p}`' for p in paths)}")
        lines.append("")
    lines.extend(["## Routes Detected", "", "| Route | Lang | Title | Source | Words |", "|---|---:|---|---|---:|"])
    for page in sorted([p for p in report.pages if p.route], key=lambda p: p.route or ""):
        title = (page.title or "").replace("|", "\\|")
        lines.append(f"| `{page.route}` | `{page.lang or ''}` | {title} | `{page.path}` | {page.word_count} |")
    lines.append("")
    lines.extend(["## Findings", ""])
    if not report.findings:
        lines.append("No findings detected by static audit.")
    else:
        lines.extend(["| Severity | Code | Source | Line | Message | Evidence |", "|---|---|---|---:|---|---|"])
        severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        for finding in sorted(report.findings, key=lambda f: (severity_order.get(f.severity, 9), f.path, f.line or 0)):
            evidence = (finding.evidence or "").replace("|", "\\|").replace("\n", " ")[:140]
            message = finding.message.replace("|", "\\|")
            lines.append(f"| {finding.severity} | `{finding.code}` | `{finding.path}` | {finding.line or ''} | {message} | {evidence} |")
    lines.append("")
    md_path.write_text("\n".join(lines), encoding="utf-8")
    return json_path, md_path


def main() -> int:
    parser = argparse.ArgumentParser(description="Run Learning Biology For Life repository audit.")
    parser.add_argument("--root", default=".", help="Repository root. Default: current directory.")
    parser.add_argument("--output-dir", default="audit-reports", help="Report output directory.")
    parser.add_argument("--fail-on", choices=["none", "critical", "high", "medium"], default="none", help="Exit non-zero when findings at or above this severity exist.")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    report = run_audit(root)
    json_path, md_path = write_reports(report, Path(args.output_dir))
    counts = severity_counts(report.findings)
    print(f"Audit complete: {report.files_scanned} files scanned, {len(report.pages)} content files inspected.")
    print(f"Markdown report: {md_path}")
    print(f"JSON report: {json_path}")
    print(f"Findings: critical={counts.get('critical',0)}, high={counts.get('high',0)}, medium={counts.get('medium',0)}, low={counts.get('low',0)}")
    thresholds = {"none": [], "critical": ["critical"], "high": ["critical", "high"], "medium": ["critical", "high", "medium"]}
    if any(f.severity in thresholds[args.fail_on] for f in report.findings):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
