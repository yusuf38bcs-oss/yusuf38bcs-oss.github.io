#!/usr/bin/env python3
"""Sovereign Site Audit v3 for Learning Biology For Life.

Runs after Jekyll build and checks production risks that normal builds miss:
architecture, duplicate content, links, nesting, CSS/includes, markdown leakage,
responsive table risk, accessibility, SEO, AdSense readiness, performance budget,
visual consistency, and final certification.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import sys
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urldefrag, urlparse

ROOT = Path.cwd()
SITE = ROOT / "_site"
REPORT_DIR = ROOT / "audit-reports"
REPORT_DIR.mkdir(exist_ok=True)

SOURCE_EXTS = {".md", ".markdown", ".html", ".scss", ".css", ".js", ".yml", ".yaml"}
CONTENT_DIRS = ["_pages", "_posts", "_biology", "_includes", "_layouts", "assets"]
IGNORE_PARTS = {".git", "_site", ".bundle", "node_modules", "vendor", "Gemfile.lock"}


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT)).replace("\\", "/")


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def site_html_files() -> list[Path]:
    return sorted(SITE.rglob("*.html")) if SITE.exists() else []


def source_files() -> list[Path]:
    out = []
    for base in CONTENT_DIRS:
        p = ROOT / base
        if not p.exists():
            continue
        for f in p.rglob("*"):
            if f.is_file() and f.suffix.lower() in SOURCE_EXTS and not any(part in IGNORE_PARTS for part in f.parts):
                out.append(f)
    return sorted(out)


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
        self.images = []
        self.title = ""
        self._in_title = False
        self.meta_desc = False
        self.h1 = 0
        self.buttons = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs.get("href"))
        if tag == "img":
            self.images.append(attrs)
        if tag == "title":
            self._in_title = True
        if tag == "meta" and attrs.get("name", "").lower() == "description" and attrs.get("content", "").strip():
            self.meta_desc = True
        if tag == "h1":
            self.h1 += 1
        if tag in {"button", "summary"}:
            self.buttons.append(attrs)

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data.strip()


def add(phases, phase, status, message, evidence=None, severity="info"):
    phases[phase].append({
        "status": status,
        "severity": severity,
        "message": message,
        "evidence": evidence or [],
    })


def fail_count(phases):
    return sum(1 for items in phases.values() for i in items if i["status"] == "FAIL")


def warn_count(phases):
    return sum(1 for items in phases.values() for i in items if i["status"] == "WARN")


def main() -> int:
    phases = defaultdict(list)

    if not SITE.exists():
        add(phases, "00-build-presence", "FAIL", "_site folder is missing; run Jekyll build first.", ["_site"], "critical")
    html_files = site_html_files()
    src_files = source_files()

    # Phase 1: Repository Architecture
    required_routes = [
        "index.html", "biology/index.html", "about/index.html", "contact/index.html",
        "privacy-policy/index.html", "terms-and-conditions/index.html", "disclaimer/index.html",
        "editorial-policy/index.html", "mcq-arena/index.html", "socratic/index.html",
        "biology/higher-zoology-tree/animal-diversity/complete-matrix-rewritten-lectures/index.html",
        "biology/hsc-corner/practical/index.html", "biology/hsc-corner/model-test/index.html",
    ]
    missing = [r for r in required_routes if not (SITE / r).exists()]
    add(phases, "01-repository-architecture", "FAIL" if missing else "PASS", "Required production routes checked.", missing, "critical" if missing else "info")

    # Phase 2: Duplicate Content Detection
    boilerplate_terms = ["LOLO", "LALA", "Bloom", "CQ Studio", "Practical Learning Framework", "Editorial Alignment"]
    term_hits = {t: [] for t in boilerplate_terms}
    paragraph_hashes = defaultdict(list)
    for f in src_files:
        text = read(f)
        for t in boilerplate_terms:
            if t in text:
                term_hits[t].append(rel(f))
        for para in re.split(r"\n\s*\n", text):
            plain = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", para)).strip()
            if len(plain) > 220:
                paragraph_hashes[hashlib.sha1(plain.encode()).hexdigest()].append(rel(f))
    dupes = {h: paths for h, paths in paragraph_hashes.items() if len(set(paths)) > 2}
    heavy_terms = {k: v[:10] for k, v in term_hits.items() if len(v) > 8}
    status = "WARN" if dupes or heavy_terms else "PASS"
    add(phases, "02-duplicate-content", status, "Duplicate educational boilerplate and long repeated paragraphs checked.", [{"repeated_paragraph_groups": len(dupes)}, {"heavy_framework_terms": heavy_terms}], "warning" if status == "WARN" else "info")

    # Phase 3: Broken Link Detection
    site_paths = {"/" + rel(f.relative_to(SITE)) for f in html_files}
    site_dirs = set()
    for f in html_files:
        p = "/" + rel(f.relative_to(SITE))
        if p.endswith("/index.html"):
            site_dirs.add(p[:-10])
            if p[:-10] == "":
                site_dirs.add("/")
    broken = []
    anchors = {}
    parsed = {}
    for f in html_files:
        parser = LinkParser(); parser.feed(read(f)); parsed[f] = parser; anchors["/" + rel(f.relative_to(SITE))] = parser.ids
    for f, parser in parsed.items():
        current_url = "/" + rel(f.relative_to(SITE))
        for href in parser.links:
            if href.startswith(("http://", "https://", "mailto:", "tel:", "#", "javascript:")):
                continue
            clean, frag = urldefrag(href)
            if not clean:
                continue
            if clean.startswith("/"):
                target = clean
            else:
                base = current_url.rsplit("/", 1)[0]
                target = os.path.normpath(base + "/" + clean).replace("\\", "/")
                if not target.startswith("/"):
                    target = "/" + target
            candidates = {target, target + "/index.html", target.rstrip("/") + "/index.html"}
            exists = any(c in site_paths or c in site_dirs for c in candidates)
            if not exists and not target.startswith("/assets/"):
                broken.append({"page": current_url, "href": href})
                if len(broken) > 50:
                    break
        if len(broken) > 50:
            break
    add(phases, "03-broken-links", "FAIL" if broken else "PASS", "Internal link integrity checked.", broken[:50], "critical" if broken else "info")

    # Phase 4: Nested Folder Audit
    too_deep = []
    for f in src_files:
        r = rel(f)
        if r.startswith("_biology/") and r.count("/") > 5:
            too_deep.append(r)
    add(phases, "04-nested-folder-audit", "WARN" if too_deep else "PASS", "Deep content nesting checked.", too_deep[:40], "warning" if too_deep else "info")

    # Phase 5: CSS/JS Audit
    css_files = list((ROOT / "assets").rglob("*.css")) + list((ROOT / "_sass").rglob("*.scss")) if (ROOT / "assets").exists() else []
    large_assets = []
    for f in list((ROOT / "assets").rglob("*")) if (ROOT / "assets").exists() else []:
        if f.is_file() and f.stat().st_size > 600_000:
            large_assets.append({"file": rel(f), "kb": round(f.stat().st_size / 1024, 1)})
    add(phases, "05-css-js-audit", "WARN" if large_assets else "PASS", "Large CSS/JS/image assets checked.", large_assets[:30], "warning" if large_assets else "info")

    # Phase 6: Duplicate Include Audit
    include_hash = defaultdict(list)
    inc_dir = ROOT / "_includes"
    if inc_dir.exists():
        for f in inc_dir.rglob("*.html"):
            body = re.sub(r"\s+", " ", read(f)).strip()
            if len(body) > 400:
                include_hash[hashlib.sha1(body.encode()).hexdigest()].append(rel(f))
    include_dupes = [v for v in include_hash.values() if len(v) > 1]
    add(phases, "06-duplicate-include-audit", "WARN" if include_dupes else "PASS", "Duplicate include bodies checked.", include_dupes[:20], "warning" if include_dupes else "info")

    # Phase 7: Markdown Leakage
    leakage = []
    leak_patterns = [r"(^|>)\s*#{2,6}\s+", r"\{\%\s*(include|assign|if|endif|for|endfor)", r"\{\{\s*[^}]+\s*\}\}"]
    for f in html_files:
        text = read(f)
        for pat in leak_patterns:
            if re.search(pat, text, re.MULTILINE):
                leakage.append(rel(f.relative_to(SITE)))
                break
        if len(leakage) > 40:
            break
    add(phases, "07-markdown-leakage", "FAIL" if leakage else "PASS", "Visible Markdown/Liquid leakage checked.", leakage[:40], "critical" if leakage else "info")

    # Phase 8: Responsive Audit
    raw_table_pages = []
    for f in html_files:
        if "<table" in read(f).lower():
            raw_table_pages.append(rel(f.relative_to(SITE)))
            if len(raw_table_pages) > 40:
                break
    add(phases, "08-responsive-audit", "WARN" if raw_table_pages else "PASS", "Raw table mobile-risk pages checked.", raw_table_pages[:40], "warning" if raw_table_pages else "info")

    # Phase 9: Accessibility
    img_no_alt = []
    missing_h1 = []
    for f, parser in parsed.items():
        if parser.h1 == 0:
            missing_h1.append(rel(f.relative_to(SITE)))
        for img in parser.images:
            if "alt" not in img:
                img_no_alt.append(rel(f.relative_to(SITE)))
        if len(img_no_alt) > 40:
            break
    acc_status = "WARN" if img_no_alt or missing_h1 else "PASS"
    add(phases, "09-accessibility", acc_status, "Basic heading and image alt checks completed.", [{"images_missing_alt": img_no_alt[:30]}, {"pages_missing_h1": missing_h1[:30]}], "warning" if acc_status == "WARN" else "info")

    # Phase 10: SEO
    title_counter = Counter()
    no_desc = []
    for f, parser in parsed.items():
        if parser.title:
            title_counter[parser.title] += 1
        if not parser.meta_desc:
            no_desc.append(rel(f.relative_to(SITE)))
    duplicate_titles = [t for t, c in title_counter.items() if c > 3 and t.strip()]
    seo_status = "WARN" if duplicate_titles or len(no_desc) > 25 else "PASS"
    add(phases, "10-seo", seo_status, "Title and meta-description coverage checked.", [{"duplicate_titles": duplicate_titles[:20]}, {"pages_without_meta_description_sample": no_desc[:30]}], "warning" if seo_status == "WARN" else "info")

    # Phase 11: AdSense Readiness
    adsense_required = ["privacy-policy/index.html", "terms-and-conditions/index.html", "disclaimer/index.html", "contact/index.html", "editorial-policy/index.html", "ads.txt"]
    ads_missing = [r for r in adsense_required if not (SITE / r).exists()]
    thin_pages = []
    for f in html_files:
        text = re.sub(r"<[^>]+>", " ", read(f))
        words = re.findall(r"[A-Za-z\u0980-\u09FF]+", text)
        if len(words) < 80 and not rel(f.relative_to(SITE)).startswith("assets/"):
            thin_pages.append(rel(f.relative_to(SITE)))
    ads_status = "FAIL" if ads_missing else ("WARN" if thin_pages else "PASS")
    add(phases, "11-adsense-readiness", ads_status, "Legal pages, ads.txt, and thin content sample checked.", [{"missing": ads_missing}, {"thin_pages_sample": thin_pages[:40]}], "critical" if ads_missing else "warning" if thin_pages else "info")

    # Phase 12: Performance Budget
    site_size = sum(f.stat().st_size for f in SITE.rglob("*") if f.is_file()) if SITE.exists() else 0
    perf_status = "WARN" if site_size > 150_000_000 else "PASS"
    add(phases, "12-performance-budget", perf_status, "Built site size checked.", [{"site_size_mb": round(site_size / 1024 / 1024, 2)}], "warning" if perf_status == "WARN" else "info")

    # Phase 13: Visual Regression Static Heuristics
    cardless_matrix = []
    for f in html_files:
        text = read(f)
        if "Lecture Matrix" in text and not re.search(r"class=\"[^\"]*(card|grid)[^\"]*\"", text):
            cardless_matrix.append(rel(f.relative_to(SITE)))
    add(phases, "13-visual-regression", "WARN" if cardless_matrix else "PASS", "Static card/grid consistency checked.", cardless_matrix, "warning" if cardless_matrix else "info")

    # Phase 14: Final Certification
    fails = fail_count(phases)
    warns = warn_count(phases)
    score = max(0, 100 - fails * 20 - warns * 3)
    cert_status = "PASS" if fails == 0 and score >= 85 else "FAIL"
    add(phases, "14-final-production-certification", cert_status, f"Final score: {score}/100. Critical failures: {fails}. Warnings: {warns}.", [{"score": score, "failures": fails, "warnings": warns}], "critical" if cert_status == "FAIL" else "info")

    report = {"audit": "Sovereign Site Audit v3", "score": score, "failures": fails, "warnings": warns, "phases": phases}
    (REPORT_DIR / "sovereign-site-audit-v3.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print("Sovereign Site Audit v3")
    print(f"Score: {score}/100 | Failures: {fails} | Warnings: {warns}")
    for phase, items in phases.items():
        for item in items:
            print(f"[{item['status']}] {phase}: {item['message']}")
            if item["evidence"]:
                print(json.dumps(item["evidence"][:3] if isinstance(item["evidence"], list) else item["evidence"], ensure_ascii=False)[:800])

    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
