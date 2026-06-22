#!/usr/bin/env python3
"""Audit Jekyll quiz-render includes against _data/quizzes.yml.

The audit has a checked-in baseline for known legacy wiring gaps. New missing
or mistyped quiz ids fail the command, while baseline entries are still printed
as per-issue comments for maintainers. The script intentionally uses only the
Python standard library so it can run before Ruby gems are installed.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUIZ_DATA = ROOT / "_data" / "quizzes.yml"
BASELINE = ROOT / "scripts" / "quiz_include_audit_baseline.txt"
INCLUDE_PATTERN = re.compile(r"{%\s*include\s+(?:components/)?quiz-render\.html(?P<args>.*?)%}")
QUIZ_ID_PATTERN = re.compile(
    r"\bquiz_id\s*=\s*(?:\"(?P<double>[^\"]+)\"|\'(?P<single>[^\']+)\'|(?P<bare>[^\s%}]+))"
)
TOP_LEVEL_KEY_PATTERN = re.compile(r"^(?P<key>[A-Za-z0-9_-]+):\s*(?:#.*)?$")
SKIP_DIRS = {
    ".git",
    ".jekyll-cache",
    "_site",
    "node_modules",
    "vendor",
}
DYNAMIC_MARKERS = (".", "|", "[", "]", "{{", "}}", "{%", "%}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--update-baseline",
        action="store_true",
        help="rewrite the known-issues baseline from the current audit output",
    )
    return parser.parse_args()


def quiz_ids() -> set[str]:
    ids: set[str] = set()
    for line in QUIZ_DATA.read_text(encoding="utf-8").splitlines():
        if line[:1].isspace() or not line.strip() or line.lstrip().startswith("#"):
            continue
        match = TOP_LEVEL_KEY_PATTERN.match(line)
        if match:
            ids.add(match.group("key"))
    return ids


def baseline_issues() -> set[str]:
    if not BASELINE.exists():
        return set()
    return {
        line.strip()
        for line in BASELINE.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    }


def write_baseline(issues: list[str]) -> None:
    header = [
        "# Known legacy quiz-render include wiring gaps.",
        "# Run `scripts/audit_quiz_includes.py --update-baseline` only after reviewing intentional baseline changes.",
        "# Remove entries as each page is wired to a real _data/quizzes.yml id.",
    ]
    BASELINE.write_text("\n".join(header + sorted(issues)) + "\n", encoding="utf-8")


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


def front_matter_quiz_id(text: str) -> str | None:
    """Read a simple top-level quiz_id value from YAML front matter."""
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None

    for line in lines[1:]:
        if line.strip() == "---":
            return None
        if line[:1].isspace() or line.lstrip().startswith("#"):
            continue
        key, separator, value = line.partition(":")
        if separator and key.strip() == "quiz_id":
            value = value.split(" #", 1)[0].strip()
            return value.strip("'\"") or None
    return None


def quiz_id_value(match: re.Match[str]) -> tuple[str, bool]:
    """Return the quiz id/expression and whether it was quoted."""
    if match.group("double") is not None:
        return match.group("double").strip(), True
    if match.group("single") is not None:
        return match.group("single").strip(), True
    return match.group("bare").strip(), False


def is_dynamic_quiz_id(quiz_id: str, quoted: bool) -> bool:
    # Bare Liquid paths, filtered values, and quoted Liquid interpolation are
    # runtime expressions. Static quoted ids such as "genetics" remain audited.
    return any(marker in quiz_id for marker in DYNAMIC_MARKERS)


def check_page_quiz_id(
    *,
    text: str,
    rel: Path,
    include_line: int,
    available_ids: set[str],
    issues: list[str],
    dynamic_comments: list[str],
) -> None:
    resolved = front_matter_quiz_id(text)
    if resolved is None:
        issues.append(f"{rel}:{include_line}: page.quiz_id used but no quiz_id front matter found")
        return
    if resolved not in available_ids:
        issues.append(
            f"{rel}:{include_line}: page.quiz_id resolves to '{resolved}' but it is not defined in _data/quizzes.yml"
        )
        return
    dynamic_comments.append(
        f"{rel}:{include_line}: page.quiz_id resolves to '{resolved}' and is defined in _data/quizzes.yml"
    )


def audit() -> tuple[list[str], list[str]]:
    available_ids = quiz_ids()
    issues: list[str] = []
    dynamic_comments: list[str] = []

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

            quiz_id, quoted = quiz_id_value(quiz_match)
            if quiz_id == "include.quiz_id":
                dynamic_comments.append(
                    f"{rel}:{include_line}: include.quiz_id pass-through wrapper is accepted and checked by callers"
                )
                continue
            if quiz_id == "page.quiz_id":
                check_page_quiz_id(
                    text=text,
                    rel=rel,
                    include_line=include_line,
                    available_ids=available_ids,
                    issues=issues,
                    dynamic_comments=dynamic_comments,
                )
                continue
            if is_dynamic_quiz_id(quiz_id, quoted):
                dynamic_comments.append(
                    f"{rel}:{include_line}: dynamic quiz_id expression '{quiz_id}' is accepted and checked at render time"
                )
                continue
            if quiz_id not in available_ids:
                issues.append(
                    f"{rel}:{include_line}: quiz_id '{quiz_id}' is not defined in _data/quizzes.yml"
                )

    return sorted(issues), sorted(dynamic_comments)


def print_comments(title: str, comments: list[str]) -> None:
    if comments:
        print(title)
        for comment in comments:
            print(f"- {comment}")


def main() -> int:
    args = parse_args()
    issues, dynamic_comments = audit()

    if args.update_baseline:
        write_baseline(issues)
        print(f"Quiz include audit baseline updated with {len(issues)} known issues.")
        print_comments("Dynamic quiz_id comments:", dynamic_comments)
        return 0

    baseline = baseline_issues()
    current = set(issues)
    new_issues = sorted(current - baseline)
    resolved_issues = sorted(baseline - current)
    known_issues = sorted(current & baseline)

    print_comments("Dynamic quiz_id comments:", dynamic_comments)
    print_comments("Known baseline quiz include issues:", known_issues)
    print_comments("Resolved baseline entries to remove:", resolved_issues)
    print_comments("New quiz include issues:", new_issues)

    if new_issues or resolved_issues:
        return 1

    print(
        f"Quiz include audit passed: {len(known_issues)} known baseline issues, "
        f"{len(dynamic_comments)} dynamic quiz_id include(s), and no baseline drift."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
