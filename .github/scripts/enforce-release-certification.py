#!/usr/bin/env python3
"""Fail closed before a non-Draft PR can be release-certified."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


def read_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return {}
    return value if isinstance(value, dict) else {}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--targets", required=True)
    parser.add_argument("--worker-contract", required=True)
    parser.add_argument("--merge-result", required=True)
    parser.add_argument("--sha", required=True)
    parser.add_argument("--base-sha", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    targets = read_json(Path(args.targets))
    contract = read_json(Path(args.worker_contract))
    merge_result = read_json(Path(args.merge_result))
    pages = targets.get("pages") if isinstance(targets.get("pages"), dict) else {}
    worker = targets.get("worker") if isinstance(targets.get("worker"), dict) else {}
    contracts = contract.get("contracts") if isinstance(contract.get("contracts"), dict) else {}
    health = contracts.get("health") if isinstance(contracts.get("health"), dict) else {}
    socratic = contracts.get("socratic") if isinstance(contracts.get("socratic"), dict) else {}

    target_sha = args.sha.lower()
    base_sha = args.base_sha.lower()

    reasons: list[str] = []
    if targets.get("target_sha") != target_sha:
        reasons.append("Cloudflare target evidence does not identify the exact tested SHA.")
    if not re.fullmatch(r"[0-9a-f]{40}", base_sha):
        reasons.append("The PR base SHA is not an exact 40-character commit SHA.")
    if merge_result.get("result") != "PASS":
        reasons.append("The immutable current PR merge result has not built successfully.")
    if merge_result.get("head_sha") != target_sha:
        reasons.append("The merge-result build does not identify the exact tested PR head SHA.")
    if merge_result.get("base_sha") != base_sha:
        reasons.append("The merge-result build does not identify the current PR base SHA.")
    if not re.fullmatch(r"[0-9a-f]{40}", str(merge_result.get("merge_sha") or "")):
        reasons.append("The merge-result build does not provide an immutable merge commit SHA.")
    if not pages.get("exact_head"):
        reasons.append("Cloudflare Pages does not provide an exact-head commit preview.")
    if not pages.get("url"):
        reasons.append("Cloudflare Pages preview URL is unavailable.")
    if not worker.get("metadata_exact_head"):
        reasons.append("Cloudflare Worker metadata does not identify an exact-head preview version.")
    if not worker.get("url"):
        reasons.append("Cloudflare Worker preview URL is unavailable.")
    if health.get("result") != "PASS":
        reasons.append("GET /api/health contract has not passed on the exact Worker preview.")
    binding = health.get("deployment_binding") if isinstance(health.get("deployment_binding"), dict) else {}
    if binding.get("result") != "PASS":
        reasons.append("The Worker preview URL has not proved its exact Cloudflare version binding.")
    if socratic.get("result") != "PASS":
        reasons.append("POST /api/socratic invalid-request contract has not passed on the exact Worker preview.")

    result = {
        "result": "PASS" if not reasons else "FAIL",
        "target_sha": target_sha,
        "base_sha": base_sha,
        "merge_sha": merge_result.get("merge_sha", ""),
        "summary": "Current merge-result build and exact-head Pages and Worker certification passed."
        if not reasons
        else "Release certification is blocked: " + " ".join(reasons),
        "reasons": reasons,
    }
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")

    if reasons:
        for reason in reasons:
            print(f"Release certification blocked: {reason}")
        return 1
    print("Exact-head Cloudflare release certification passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
