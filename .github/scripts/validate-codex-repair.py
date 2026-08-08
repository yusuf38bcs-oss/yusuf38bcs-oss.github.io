#!/usr/bin/env python3
"""Fail closed unless a Codex repair changes only a small, approved file set."""

from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import PurePosixPath


ALLOWED_PREFIXES = (
    "_includes/",
    "_layouts/",
    "_pages/",
    "assets/css/",
    "assets/js/",
    "assets/images/",
    "docs/",
    "worker/src/",
    "worker/test/",
)
ALLOWED_EXACT = {"_data/homepage.yml"}
BLOCKED_PREFIXES = (".github/", "node_modules/", "vendor/")
BLOCKED_EXACT = {
    "_config.yml",
    "CNAME",
    "Gemfile",
    "Gemfile.lock",
    "package.json",
    "package-lock.json",
    "wrangler.jsonc",
    "wrangler.toml",
    "worker/package.json",
    "worker/package-lock.json",
    "worker/wrangler.toml",
    ".env",
    ".env.local",
}
MAX_CHANGED_FILES = 8
MAX_INSERTIONS = 600
MAX_DELETIONS = 600


def git_bytes(*args: str) -> bytes:
    return subprocess.check_output(["git", *args])


def normalise(path: str) -> str:
    value = str(PurePosixPath(path.replace("\\", "/")))
    if value.startswith("../") or value in {"..", "."} or value.startswith("/"):
        raise ValueError(f"unsafe path: {value}")
    return value


def allowed(path: str) -> bool:
    return path in ALLOWED_EXACT or path.startswith(ALLOWED_PREFIXES)


def parse_name_status(base: str) -> list[tuple[str, list[str]]]:
    parts = git_bytes("diff", "--name-status", "-z", base).decode("utf-8").split("\0")
    entries: list[tuple[str, list[str]]] = []
    index = 0
    while index < len(parts) and parts[index]:
        status = parts[index]
        index += 1
        count = 2 if status[:1] in {"R", "C"} else 1
        paths = parts[index : index + count]
        index += count
        entries.append((status, paths))
    return entries


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", required=True)
    parser.add_argument("--report", required=True)
    args = parser.parse_args()

    violations: list[str] = []
    entries = parse_name_status(args.base)
    changed_paths: list[str] = []
    for status, paths in entries:
        if status[:1] in {"R", "C"}:
            violations.append(f"renames and copies are not allowed: {status} {paths}")
        for raw_path in paths:
            try:
                path = normalise(raw_path)
            except ValueError as error:
                violations.append(str(error))
                continue
            changed_paths.append(path)
            if path in BLOCKED_EXACT or path.startswith(BLOCKED_PREFIXES):
                violations.append(f"blocked repair path: {path}")
            elif not allowed(path):
                violations.append(f"path is outside the repair allowlist: {path}")

    if not changed_paths:
        violations.append("repair patch contains no changed paths")
    if len(changed_paths) > MAX_CHANGED_FILES:
        violations.append(f"too many changed files: {len(changed_paths)} > {MAX_CHANGED_FILES}")

    additions = 0
    deletions = 0
    for line in git_bytes("diff", "--numstat", args.base).decode("utf-8").splitlines():
        added, removed, _ = line.split("\t", 2)
        if added == "-" or removed == "-":
            violations.append("binary changes are not allowed in controlled repairs")
            continue
        additions += int(added)
        deletions += int(removed)
    if additions > MAX_INSERTIONS or deletions > MAX_DELETIONS:
        violations.append(
            f"repair diff exceeds size limit: +{additions}/-{deletions}; "
            f"maximum +{MAX_INSERTIONS}/-{MAX_DELETIONS}"
        )

    result = {
        "base": args.base,
        "changed_files": changed_paths,
        "changed_file_count": len(changed_paths),
        "insertions": additions,
        "deletions": deletions,
        "allowed_prefixes": list(ALLOWED_PREFIXES),
        "allowed_exact": sorted(ALLOWED_EXACT),
        "violations": violations,
        "status": "PASS" if not violations else "FAIL",
    }
    with open(args.report, "w", encoding="utf-8") as report:
        json.dump(result, report, indent=2)
        report.write("\n")
    print(json.dumps(result, indent=2))
    return 0 if not violations else 1


if __name__ == "__main__":
    raise SystemExit(main())
