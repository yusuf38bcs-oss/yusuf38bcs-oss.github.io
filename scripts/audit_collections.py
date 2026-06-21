#!/usr/bin/env python3
"""Audit Jekyll collection posts for common production issues.

Targets:
  _biology, _life-practices, _life-philosophy, _mcq-arena

Checks:
  - UTF-8 BOM and mojibake markers
  - missing/invalid YAML front matter basics
  - duplicate normalized slugs (underscore/hyphen variants)
  - old/broken internal route patterns
  - empty image alt text
  - inline color-pair contrast risk markers

Usage:
  python scripts/audit_collections.py
  python scripts/audit_collections.py --fix-safe

--fix-safe only performs low-risk textual fixes:
  - replace /socratic/mcq-arena/ with /mcq-arena/
  - replace empty alt="" with alt="Learning Biology For Life educational visual"
It does not rewrite Bengali mojibake automatically because that should be reviewed.
"""
from __future__ import annotations

import argparse
import os
import re
from collections import defaultdict
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
TARGET_DIRS = [
    "_biology",
    "_life-practices",
    "_life-philosophy",
    "_mcq-arena",
]
MOJIBAKE_MARKERS = ("à¦", "à§", "à¥", "ðŸ", "âœ", "â€", "Â")
OLD_ROUTE_REPLACEMENTS = {
    "/socratic/mcq-arena/": "/mcq-arena/",
}
REQUIRED_FRONTMATTER = ("title",)


def iter_posts() -> Iterable[Path]:
    for folder in TARGET_DIRS:
        base = ROOT / folder
        if not base.exists():
            continue
        yield from sorted(base.rglob("*.md"))
        yield from sorted(base.rglob("*.html"))


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def split_frontmatter(text: str):
    if not text.startswith("---\n"):
        return None, text
    end = text.find("\n---", 4)
    if end == -1:
        return text, ""
    fm = text[4:end]
    body = text[end + 4 :]
    return fm, body


def frontmatter_has_key(fm: str | None, key: str) -> bool:
    if fm is None:
        return False
    return re.search(rf"(?m)^\s*{re.escape(key)}\s*:", fm) is not None


def normalized_slug(path: Path) -> str:
    return path.stem.lower().replace("_", "-")


def has_empty_alt(text: str) -> bool:
    return bool(re.search(r"<img\b(?=[^>]*\balt\s*=\s*(['\"])\s*\1)", text, re.I))


def missing_alt_count(text: str) -> int:
    count = 0
    for m in re.finditer(r"<img\b([^>]*)>", text, re.I):
        if "alt=" not in m.group(1).lower():
            count += 1
    return count


def contrast_risks(text: str) -> list[str]:
    # Heuristic only: dark text on dark bg, light text on light bg in inline styles.
    risks = []
    for m in re.finditer(r"style\s*=\s*(['\"])(.*?)\1", text, re.I | re.S):
        style = m.group(2).lower().replace(" ", "")
        if "background:#0" in style and ("color:#222" in style or "color:#333" in style or "color:#2c3e50" in style):
            risks.append("dark background with dark text")
        if "background:#fff" in style and ("color:#fff" in style or "color:white" in style):
            risks.append("light background with light text")
    return risks


def audit(fix_safe: bool = False) -> int:
    issues = []
    slug_map: dict[str, list[Path]] = defaultdict(list)
    changed_files = []

    for path in iter_posts():
        rel = path.relative_to(ROOT)
        text = read_text(path)
        original = text
        slug_map[normalized_slug(path)].append(rel)

        if text.startswith("\ufeff"):
            issues.append((rel, "UTF8_BOM", "File starts with UTF-8 BOM"))
            if fix_safe:
                text = text.lstrip("\ufeff")

        if any(marker in text for marker in MOJIBAKE_MARKERS):
            issues.append((rel, "MOJIBAKE", "Possible Bengali/emoji mojibake marker found"))

        fm, body = split_frontmatter(text)
        if fm is None:
            issues.append((rel, "FRONTMATTER", "Missing opening YAML front matter"))
        else:
            for key in REQUIRED_FRONTMATTER:
                if not frontmatter_has_key(fm, key):
                    issues.append((rel, "SEO", f"Missing front matter key: {key}"))
            if not (frontmatter_has_key(fm, "excerpt") or frontmatter_has_key(fm, "description")):
                issues.append((rel, "SEO", "Missing excerpt/description"))

        for old, new in OLD_ROUTE_REPLACEMENTS.items():
            if old in text:
                issues.append((rel, "BROKEN_ROUTE", f"Uses old route {old}; prefer {new}"))
                if fix_safe:
                    text = text.replace(old, new)

        if has_empty_alt(text):
            issues.append((rel, "IMAGE_ALT", "Has empty alt attribute"))
            if fix_safe:
                text = re.sub(r"alt\s*=\s*(['\"])\s*\1", 'alt="Learning Biology For Life educational visual"', text, flags=re.I)
        missing = missing_alt_count(text)
        if missing:
            issues.append((rel, "IMAGE_ALT", f"{missing} <img> tag(s) missing alt attribute"))

        for risk in contrast_risks(text):
            issues.append((rel, "CONTRAST", risk))

        if fix_safe and text != original:
            path.write_text(text, encoding="utf-8", newline="\n")
            changed_files.append(rel)

    for slug, paths in sorted(slug_map.items()):
        if len(paths) > 1:
            issues.append((Path(slug), "DUPLICATE_SLUG", ", ".join(str(p) for p in paths)))

    print("# Collection Audit Report")
    print(f"Target folders: {', '.join(TARGET_DIRS)}")
    print(f"Files scanned: {sum(1 for _ in iter_posts())}")
    print(f"Issues found: {len(issues)}")
    print()
    for rel, code, msg in issues:
        print(f"- [{code}] {rel}: {msg}")

    if changed_files:
        print("\n# Safe fixes written")
        for rel in changed_files:
            print(f"- {rel}")

    return 1 if issues else 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--fix-safe", action="store_true", help="apply low-risk fixes")
    args = parser.parse_args()
    raise SystemExit(audit(fix_safe=args.fix_safe))
