#!/usr/bin/env python3
"""Create a portable QA-REPORT.md from workflow evidence without secrets."""

from __future__ import annotations

import argparse
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


def read_status(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.is_file():
        return values
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        if "=" not in raw_line:
            continue
        key, value = raw_line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


def read_json(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {}
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}
    return value if isinstance(value, dict) else {}


def state(status: dict[str, str], key: str) -> str:
    return status.get(key, "UNKNOWN")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--status", required=True)
    parser.add_argument("--targets", required=True)
    parser.add_argument("--worker-contract", required=True)
    parser.add_argument("--merge-result", default="")
    parser.add_argument("--release-certification", required=True)
    parser.add_argument("--sha", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    status = read_status(Path(args.status))
    targets = read_json(Path(args.targets))
    contract = read_json(Path(args.worker_contract))
    merge_result = read_json(Path(args.merge_result))
    certification = read_json(Path(args.release_certification))
    pages = targets.get("pages") if isinstance(targets.get("pages"), dict) else {}
    worker = targets.get("worker") if isinstance(targets.get("worker"), dict) else {}
    health = contract.get("contracts", {}).get("health", {}) if contract else {}
    socratic = contract.get("contracts", {}).get("socratic", {}) if contract else {}
    binding = health.get("deployment_binding") if isinstance(health, dict) else {}
    worker_bound = bool(worker.get("metadata_exact_head")) and isinstance(binding, dict) and binding.get("result") == "PASS"

    report = [
        "# LBFL QA Report",
        "",
        f"- Generated (UTC): {datetime.now(UTC).isoformat()}",
        f"- Repository: `{status.get('repository', 'unknown')}`",
        f"- Event: `{status.get('event', 'unknown')}`",
        f"- Exact tested SHA: `{args.sha}`",
        f"- Workflow run: {status.get('run_url', 'unavailable')}",
        "",
        "## Required checks",
        "",
        "| Gate | Result | Evidence |",
        "| --- | --- | --- |",
        f"| Jekyll production build | {state(status, 'jekyll_build')} | `_site/index.html` and `jekyll-site.tar.gz` |",
        f"| Cloudflare Pages preview | {state(status, 'pages_preview')} | {pages.get('url') or 'exact preview pending'} |",
        f"| Pages deployed SHA equals tested SHA | {'PASS' if pages.get('exact_head') else 'PENDING'} | source: `{pages.get('source', 'unknown')}` |",
        f"| Worker health contract | {state(status, 'worker_contract')} | service: `{health.get('service', 'unknown')}` |",
        f"| Socratic invalid-request contract | {socratic.get('result', 'UNKNOWN')} | status: `{socratic.get('invalid_payload_status', 'unknown')}`; no model invocation |",
        f"| Worker deployed SHA equals tested SHA | {'PASS' if worker_bound else 'NOT APPLICABLE / PENDING'} | source: `{worker.get('source', 'unknown')}` |",
        f"| Current PR merge-result build | {merge_result.get('result', 'NOT REQUESTED (Draft PR)')} | merge SHA: `{merge_result.get('merge_sha', 'unavailable')}` |",
        f"| Exact-head release certification | {certification.get('result', 'NOT REQUESTED (Draft PR)')} | {certification.get('summary', 'Draft PRs collect evidence without promotion authority.')} |",
        "",
        "## SHA equality decision",
        "",
    ]

    if pages.get("exact_head"):
        report.append(
            "`tested SHA = deployed Pages SHA` is evidenced by trusted Cloudflare deployment metadata "
            f"or a full SHA comment (source: `{pages.get('source', 'unknown')}`)."
        )
    else:
        report.append("Not certified: an exact-head Cloudflare Pages commit preview was not available to this run.")

    if merge_result.get("result") == "PASS":
        report.append(
            "The current PR merge result was rebuilt at "
            f"`{merge_result.get('merge_sha')}` against base `{merge_result.get('base_sha')}`. "
            "A staging advance triggers a fresh QA dispatch; release certification also fails closed if the base changes during the merge-result build."
        )

    report.extend(
        [
            "",
            "## Artifact contents",
            "",
            "- `QA-REPORT.md` — this report",
            "- `jekyll-site.tar.gz` — exact rebuilt static output when the build passed",
            "- `cloudflare-targets.json` — preview-resolution evidence",
            "- `pages-preview.headers` and `pages-preview.html` — preview health evidence when available",
            "- `worker-contract.json` — `/api/health` and `/api/socratic` contract evidence",
            "- `merge-result.json` and `merge-result-site.tar.gz` — immutable current PR merge-result evidence for non-Draft PRs",
            "- `release-certification.json` — fail-closed exact-head decision for non-Draft PRs",
            "",
            "No merge, deployment, cache purge, or repair publication is authorised by this report.",
            "",
        ]
    )
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(report), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
