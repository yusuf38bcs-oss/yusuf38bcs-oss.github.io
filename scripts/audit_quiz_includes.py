#!/usr/bin/env python3
"""Audit Jekyll quiz-render includes against _data/quizzes.yml.

This intentionally uses only the Python standard library so it can run in
restricted build/review environments before Ruby gems are installed.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUIZ_DATA = ROOT / "_data" / "quizzes.yml"
INCLUDE_PATTERN = re.compile(r"{%\s*include\s+(?:components/)?quiz-render\.html(?P<args>.*?)%}")
QUIZ_ID_PATTERN = re.compile(r"\bquiz_id\s*=\s*(?P<quote>['\"]?)(?P<id>[^'\"\s%}]+)(?P=quote)")
TOP_LEVEL_KEY_PATTERN = re.compile(r"^(?P<key>[A-Za-z0-9_-]+):\s*(?:#.*)?$")
SKIP_DIRS = {
    ".git",
    ".jekyll-cache",
    "_site",
    "node_modules",
    "vendor",
}


def quiz_ids() -> set[str]:
    ids: set[str] = set()
    for line in QUIZ_DATA.read_text(encoding="utf-8").splitlines():
        if line[:1].isspace() or not line.strip() or line.lstrip().startswith("#"):
            continue
        match = TOP_LEVEL_KEY_PATTERN.match(line)
        if match:
            ids.add(match.group("key"))
    return ids


def content_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts):
            continue
        if path.suffix.lower() in {".md", ".markdown", ".html"}:
            files.append(path)
    return sorted(files)


def line_number(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def main() -> int:
    available_ids = quiz_ids()
    issues: list[str] = []

    for path in content_files():
        text = path.read_text(encoding="utf-8")
        rel = path.relative_to(ROOT)
        for match in INCLUDE_PATTERN.finditer(text):
            args = match.group("args")
            include_line = line_number(text, match.start())
            quiz_match = QUIZ_ID_PATTERN.search(args)
            if not quiz_match:
                issues.append(
                    f"{rel}:{include_line}: missing quiz_id on quiz-render include"
                )
                continue

            quiz_id = quiz_match.group("id")
            if quiz_id.startswith("include."):
                # Wrapper includes such as _includes/quiz-render.html pass through
                # the caller's id; the concrete caller is audited separately.
                continue
            if quiz_id not in available_ids:
                issues.append(
                    f"{rel}:{include_line}: quiz_id '{quiz_id}' is not defined in _data/quizzes.yml"
                )

    if issues:
        print("Quiz include audit found issues:")
        for issue in issues:
            print(f"- {issue}")
        return 1

    print(f"Quiz include audit passed: {len(available_ids)} quiz ids available and all includes are wired.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
