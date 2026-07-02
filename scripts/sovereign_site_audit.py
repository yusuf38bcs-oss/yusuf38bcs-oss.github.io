#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
import sys
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urldefrag

ROOT = Path.cwd()
SITE = ROOT / "_site"
REPORT_DIR = ROOT / "audit-reports"
REPORT_DIR.mkdir(exist_ok=True)

SOURCE_EXTS = {".md", ".markdown", ".html", ".scss", ".css", ".js", ".yml", ".yaml"}
CONTENT_DIRS = [
    "_pages",
    "_posts",
    "_biology",
    "_concepts",
    "_includes",
    "_layouts",
    "_socratic",
    "_synaptic-bridge",
    "_life-practices",
    "_life-philosophy",
    "_mcq-arena",
    "assets",
]
PRIVATE_PARTS = {".git", "_site", "node_modules", "vendor", ".bundle", "audit-reports", ".github"}
FRAMEWORK_TERMS = ["LOLO", "LALA", "Bloom", "CQ Studio", "Practical Learning Framework", "Editorial Alignment"]
CRITICAL_LEAK_PATTERNS = [
    r"(^|>)\s*#{2,6}\s+",
    r"\{\%\s*(include|assign|if|endif|for|endfor)",
    r"\{\{\s*[^}]+\s*\}\}",
]


def root_rel(path: Path) -> str:
    return str(path.relative_to(ROOT)).replace("\\", "/")


def site_rel(path: Path) -> str:
    return str(path.relative_to(SITE)).replace("\\", "/")


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def site_html_files() -> list[Path]:
    return sorted(SITE.rglob("*.html")) if SITE.exists() else []


def source_files() -> list[Path]:
    out: list[Path] = []
    for base in CONTENT_DIRS:
        folder = ROOT / base
        if folder.exists():
            out.extend(f for f in folder.rglob("*") if f.is_file() and f.suffix.lower() in SOURCE_EXTS)
    return sorted(out)


def route_variants(route: str) -> set[str]:
    if not route.startswith("/"):
        route = "/" + route
    base = route.rstrip("/") or "/"
    variants = {route, base, base + "/", base + "/index.html"}
    if base.endswith("/index.html"):
        parent = base[:-10] or "/"
        variants.update({parent, parent.rstrip("/") + "/", parent.rstrip("/") + "/index.html"})
    if base.startswith("/en/") or base.startswith("/bn/"):
        stripped = base[3:] or "/"
        variants.update({stripped, stripped.rstrip("/") + "/", stripped.rstrip("/") + "/index.html"})
    else:
        variants.update({"/en" + base, "/en" + base + "/", "/en" + base + "/index.html"})
        variants.update({"/bn" + base, "/bn" + base + "/", "/bn" + base + "/index.html"})
    return variants


def declared_source_routes(src_files: list[Path]) -> set[str]:
    routes: set[str] = set()
    for f in src_files:
        text = read(f)
        if text.startswith("---"):
            parts = text.split("---", 2)
            if len(parts) >= 3:
                permalink = re.search(r"^permalink:\s*[\"']?([^\"'\n]+)", parts[1], re.MULTILINE)
                if permalink:
                    routes.update(route_variants(permalink.group(1).strip()))
    for f in ROOT.rglob("*.html"):
        if any(part in PRIVATE_PARTS or part.startswith("_") for part in f.parts):
            continue
        routes.update(route_variants("/" + root_rel(f)))
    return routes


def visible_html_for_leak_check(html: str) -> str:
    html = re.sub(r"<!--.*?-->", "", html, flags=re.DOTALL)
    html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r"<style\b[^>]*>.*?</style>", "", html, flags=re.DOTALL | re.IGNORECASE)
    return html


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links: list[str] = []
        self.images: list[dict[str, str]] = []
        self.ids: set[str] = set()
        self.title = ""
        self.meta_desc = False
        self.h1 = 0
        self._title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "img":
            self.images.append(attrs)
        if tag == "h1":
            self.h1 += 1
        if tag == "title":
            self._title = True
        if tag == "meta" and attrs.get("name", "").lower() == "description" and attrs.get("content", "").strip():
            self.meta_desc = True

    def handle_endtag(self, tag):
        if tag == "title":
            self._title = False

    def handle_data(self, data):
        if self._title:
            self.title += data.strip()


def add(phases, phase: str, status: str, message: str, evidence=None) -> None:
    phases[phase].append({"status": status, "message": message, "evidence": evidence or []})


def count_status(phases, status: str) -> int:
    return sum(1 for items in phases.values() for item in items if item["status"] == status)


def parse_pages(html_files: list[Path]) -> dict[Path, PageParser]:
    parsed: dict[Path, PageParser] = {}
    for f in html_files:
        parser = PageParser()
        parser.feed(read(f))
        parsed[f] = parser
    return parsed


def main() -> int:
    phases = defaultdict(list)
    html_files = site_html_files()
    src_files = source_files()
    parsed = parse_pages(html_files)
    source_routes = declared_source_routes(src_files)

    add(
        phases,
        "00-build",
        "PASS" if SITE.exists() else "FAIL",
        "_site folder exists." if SITE.exists() else "_site folder missing; build did not run.",
        [] if SITE.exists() else ["_site"],
    )

    required = [
        "index.html",
        "biology/index.html",
        "about/index.html",
        "contact/index.html",
        "privacy-policy/index.html",
        "terms-and-conditions/index.html",
        "disclaimer/index.html",
        "editorial-policy/index.html",
        "mcq-arena/index.html",
        "socratic/index.html",
        "biology/higher-zoology-tree/animal-diversity/complete-matrix-rewritten-lectures/index.html",
        "biology/hsc-corner/practical/index.html",
        "biology/hsc-corner/model-test/index.html",
        "blog/index.html",
    ]
    missing = [r for r in required if not (SITE / r).exists()]
    add(phases, "01-repository-architecture", "FAIL" if missing else "PASS", "Required production routes checked.", missing)

    term_hits = {t: [] for t in FRAMEWORK_TERMS}
    blocks = defaultdict(list)
    for f in src_files:
        text = read(f)
        for t in FRAMEWORK_TERMS:
            if t in text:
                term_hits[t].append(root_rel(f))
        for block in re.split(r"\n\s*\n", text):
            plain = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", block)).strip()
            if len(plain) > 260:
                blocks[plain[:260]].append(root_rel(f))
    repeated = {k: sorted(set(v)) for k, v in blocks.items() if len(set(v)) > 2}
    heavy = {k: v[:12] for k, v in term_hits.items() if len(v) > 8}
    duplicate_status = "WARN" if repeated or heavy else "PASS"
    add(
        phases,
        "02-duplicate-content",
        duplicate_status,
        "Repeated long blocks and framework boilerplate checked across all output collections.",
        [{"repeated_groups": len(repeated)}, {"heavy_terms": heavy}],
    )

    site_paths = {"/" + site_rel(f) for f in html_files}
    site_files = {"/" + site_rel(f) for f in SITE.rglob("*") if f.is_file()} if SITE.exists() else set()
    site_dirs: set[str] = set()
    for f in html_files:
        p = "/" + site_rel(f)
        if p.endswith("/index.html"):
            d = p[:-10] or "/"
            site_dirs.update({d, d.rstrip("/") + "/"})

    broken = []
    for f, parser in parsed.items():
        page = "/" + site_rel(f)
        for href in parser.links:
            if href.startswith(("http://", "https://", "mailto:", "tel:", "#", "javascript:")):
                continue
            clean, _ = urldefrag(href)
            if not clean:
                continue
            target = clean if clean.startswith("/") else os.path.normpath(page.rsplit("/", 1)[0] + "/" + clean).replace("\\", "/")
            if not target.startswith("/"):
                target = "/" + target
            candidates = route_variants(target)
            exists = any(c in site_paths or c in site_dirs or c in site_files or c in source_routes for c in candidates)
            if not exists and not target.startswith("/assets/"):
                broken.append({"page": page, "href": href})
                if len(broken) >= 50:
                    break
        if len(broken) >= 50:
            break
    add(phases, "03-broken-links", "FAIL" if broken else "PASS", "Internal links checked.", broken)

    deep = [root_rel(f) for f in src_files if root_rel(f).startswith("_biology/") and root_rel(f).count("/") > 5]
    add(phases, "04-nested-folder-audit", "WARN" if deep else "PASS", "Deep source nesting checked.", deep[:40])

    large_assets = []
    if (ROOT / "assets").exists():
        for f in (ROOT / "assets").rglob("*"):
            if f.is_file() and f.stat().st_size > 600_000:
                large_assets.append({"file": root_rel(f), "kb": round(f.stat().st_size / 1024, 1)})
    add(phases, "05-css-js-audit", "WARN" if large_assets else "PASS", "Large asset budget checked.", large_assets[:30])

    include_hash = defaultdict(list)
    if (ROOT / "_includes").exists():
        for f in (ROOT / "_includes").rglob("*.html"):
            body = re.sub(r"\s+", " ", read(f)).strip()
            if len(body) > 400:
                include_hash[body].append(root_rel(f))
    include_dupes = [v for v in include_hash.values() if len(v) > 1]
    add(phases, "06-duplicate-include-audit", "WARN" if include_dupes else "PASS", "Duplicate includes checked.", include_dupes[:20])

    leakage = []
    for f in html_files:
        text = visible_html_for_leak_check(read(f))
        matched = next((p for p in CRITICAL_LEAK_PATTERNS if re.search(p, text, re.MULTILINE)), None)
        if matched:
            m = re.search(matched, text, re.MULTILINE)
            snippet = text[max(0, m.start() - 80):m.end() + 120].replace("\n", " ") if m else ""
            leakage.append({"page": site_rel(f), "pattern": matched, "snippet": snippet[:220]})
            if len(leakage) >= 40:
                break
    add(phases, "07-markdown-leakage", "FAIL" if leakage else "PASS", "Visible Markdown/Liquid leakage checked.", leakage)

    table_pages = [site_rel(f) for f in html_files if "<table" in read(f).lower()]
    add(phases, "08-responsive-audit", "WARN" if table_pages else "PASS", "Raw table mobile-risk pages checked.", table_pages[:40])

    img_no_alt, missing_h1 = [], []
    for f, parser in parsed.items():
        if parser.h1 == 0:
            missing_h1.append(site_rel(f))
        for img in parser.images:
            if "alt" not in img:
                img_no_alt.append(site_rel(f))
    add(phases, "09-accessibility", "WARN" if img_no_alt or missing_h1 else "PASS", "Basic accessibility heuristics checked.", [{"images_missing_alt": img_no_alt[:30]}, {"pages_missing_h1": missing_h1[:30]}])

    titles = Counter(p.title for p in parsed.values() if p.title)
    no_desc = [site_rel(f) for f, p in parsed.items() if not p.meta_desc]
    dup_titles = [t for t, c in titles.items() if c > 3]
    add(phases, "10-seo", "WARN" if dup_titles or len(no_desc) > 25 else "PASS", "Title and description coverage checked.", [{"duplicate_titles": dup_titles[:20]}, {"missing_description_sample": no_desc[:30]}])

    ads_missing = [
        r for r in [
            "privacy-policy/index.html",
            "terms-and-conditions/index.html",
            "disclaimer/index.html",
            "contact/index.html",
            "editorial-policy/index.html",
            "ads.txt",
        ]
        if not (SITE / r).exists()
    ]
    thin_ignore = {"google218dd4de4fb99bef.html", "bn/google218dd4de4fb99bef.html"}
    thin = []
    for f in html_files:
        r = site_rel(f)
        words = re.findall(r"[A-Za-z\u0980-\u09FF]+", re.sub(r"<[^>]+>", " ", read(f)))
        if len(words) < 80 and r not in thin_ignore:
            thin.append(r)
    add(phases, "11-adsense-readiness", "FAIL" if ads_missing else ("WARN" if thin else "PASS"), "Legal pages and thin page sample checked.", [{"missing": ads_missing}, {"thin_pages_sample": thin[:40]}])

    site_size = sum(f.stat().st_size for f in SITE.rglob("*") if f.is_file()) if SITE.exists() else 0
    add(phases, "12-performance-budget", "WARN" if site_size > 150_000_000 else "PASS", "Built site size checked.", [{"site_size_mb": round(site_size / 1024 / 1024, 2)}])

    cardless = [site_rel(f) for f in html_files if "Lecture Matrix" in read(f) and not re.search(r"class=\"[^\"]*(card|grid)[^\"]*\"", read(f))]
    add(phases, "13-visual-regression", "WARN" if cardless else "PASS", "Static card/grid consistency checked.", cardless[:30])

    fails = count_status(phases, "FAIL")
    warns = count_status(phases, "WARN")
    score = max(0, 100 - fails * 20 - warns * 3)
    final_status = "PASS" if fails == 0 and score >= 85 else "FAIL"
    add(phases, "14-final-production-certification", final_status, f"Final score: {score}/100. Critical failures: {fails}. Warnings: {warns}.", [{"score": score, "failures": fails, "warnings": warns}])

    report = {"audit": "Sovereign Site Audit v4", "score": score, "failures": fails, "warnings": warns, "phases": phases}
    report_path = REPORT_DIR / "sovereign-site-audit-v4.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print("Sovereign Site Audit v4")
    print(f"Score: {score}/100 | Failures: {fails} | Warnings: {warns}")
    for phase, items in phases.items():
        for item in items:
            print(f"[{item['status']}] {phase}: {item['message']}")
            if item["evidence"]:
                sample = item["evidence"][:3] if isinstance(item["evidence"], list) else item["evidence"]
                print(json.dumps(sample, ensure_ascii=False)[:1000])

    return 1 if final_status == "FAIL" else 0


if __name__ == "__main__":
    sys.exit(main())
