#!/usr/bin/env python3
"""Smoke-test the QA report generator with the workflow's exact CLI contract."""

from __future__ import annotations

import re
import subprocess
import sys
import tempfile
from pathlib import Path


TARGET_SHA = "0123456789abcdef0123456789abcdef01234567"


def workflow_flags(workflow: Path) -> list[str]:
    text = workflow.read_text(encoding="utf-8")
    match = re.search(
        r"python3 \.github/scripts/generate-qa-report\.py \\\n"
        r"(?P<arguments>(?:\s+--[^\n]+(?: \\\n)?)+)",
        text,
    )
    if not match:
        raise RuntimeError("The trusted QA report command was not found in lbfl-ci.yml.")
    flags = re.findall(r"--[a-z][a-z-]*", match.group("arguments"))
    if not flags:
        raise RuntimeError("The trusted QA report command has no arguments.")
    return flags


def main() -> int:
    repository = Path(__file__).resolve().parents[2]
    flags = workflow_flags(repository / ".github/workflows/lbfl-ci.yml")

    with tempfile.TemporaryDirectory() as directory:
        fixtures = Path(directory)
        fixture_content = {
            "status.env": "jekyll_build=PASS\n",
            "cloudflare-targets.json": "{}\n",
            "worker-contract.json": "{}\n",
            "merge-result.json": (
                '{"result":"PASS","merge_sha":"' + TARGET_SHA + '"}\n'
            ),
            "release-certification.json": (
                '{"result":"PASS","summary":"Fixture certification passed."}\n'
            ),
        }
        for name, content in fixture_content.items():
            (fixtures / name).write_text(content, encoding="utf-8")

        output = fixtures / "QA-REPORT.md"

        values = {
            "--status": fixtures / "status.env",
            "--targets": fixtures / "cloudflare-targets.json",
            "--worker-contract": fixtures / "worker-contract.json",
            "--merge-result": fixtures / "merge-result.json",
            "--release-certification": fixtures / "release-certification.json",
            "--sha": TARGET_SHA,
            "--output": output,
        }
        unknown = [flag for flag in flags if flag not in values]
        if unknown:
            raise RuntimeError(
                "The trusted workflow added unsupported QA report arguments: "
                + ", ".join(unknown)
            )

        command = [sys.executable, str(repository / ".github/scripts/generate-qa-report.py")]
        for flag in flags:
            command.extend((flag, str(values[flag])))
        subprocess.run(command, cwd=repository, check=True)

        report = output.read_text(encoding="utf-8")
        required_evidence = (
            "| Current PR merge-result build | PASS |",
            "| Exact-head release certification | PASS |",
        )
        missing = [evidence for evidence in required_evidence if evidence not in report]
        if missing:
            raise RuntimeError(
                "QA report omitted required fixture evidence: " + ", ".join(missing)
            )

    print("QA report generator exact workflow CLI contract: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
