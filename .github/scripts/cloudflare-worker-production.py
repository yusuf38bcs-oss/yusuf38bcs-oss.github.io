#!/usr/bin/env python3
"""Observe and verify the LBFL production Worker without hiding provenance."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

API_BASE = "https://api.cloudflare.com/client/v4"
SCRIPT_NAME = "lbfl-socratic-ai"
CANONICAL_HEALTH = "https://api.learningbiologyforlife.org/api/health"
DIRECT_HEALTH = "https://lbfl-socratic-ai.yusuf-38bcs.workers.dev/api/health"
UUID_RE = re.compile(r"^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$", re.I)
SHA_RE = re.compile(r"^[0-9a-f]{40}$")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def request_json(path: str, token: str) -> Any:
    request = urllib.request.Request(
        f"{API_BASE}{path}",
        headers={
            "Accept": "application/json",
            "Authorization": f"Bearer {token}",
            "User-Agent": "lbfl-worker-production-verifier",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")[:1600]
        raise RuntimeError(f"Cloudflare API GET {path} failed: HTTP {error.code}: {detail}") from error
    except (urllib.error.URLError, json.JSONDecodeError) as error:
        raise RuntimeError(f"Cloudflare API GET {path} failed: {error}") from error
    require(isinstance(payload, dict), f"Cloudflare API {path} did not return an object")
    require(payload.get("success") is True, f"Cloudflare API {path} returned success=false")
    return payload.get("result")


def records(value: Any, *keys: str) -> list[dict[str, Any]]:
    if isinstance(value, list):
        return [item for item in value if isinstance(item, dict)]
    if isinstance(value, dict):
        for key in keys:
            candidate = value.get(key)
            if isinstance(candidate, list):
                return [item for item in candidate if isinstance(item, dict)]
    return []


def worker_exists(account_id: str, token: str) -> dict[str, Any]:
    result = request_json(
        f"/accounts/{urllib.parse.quote(account_id, safe='')}/workers/scripts",
        token,
    )
    for item in records(result, "items", "scripts"):
        if str(item.get("id") or "") == SCRIPT_NAME:
            return item
    raise RuntimeError(f"Cloudflare Worker {SCRIPT_NAME!r} was not found")


def version_details(account_id: str, version_id: str, token: str) -> dict[str, Any]:
    account = urllib.parse.quote(account_id, safe="")
    worker = urllib.parse.quote(SCRIPT_NAME, safe="")
    # The beta Worker-version resource exposes provenance annotations such as
    # workers/commit_sha, workers/repository_url, workers/message and workers/tag.
    result = request_json(
        f"/accounts/{account}/workers/workers/{worker}/versions/{urllib.parse.quote(version_id, safe='')}",
        token,
    )
    require(isinstance(result, dict), "Worker version lookup did not return an object")
    return result


def list_version_ids(account_id: str, token: str) -> list[str]:
    account = urllib.parse.quote(account_id, safe="")
    worker = urllib.parse.quote(SCRIPT_NAME, safe="")
    result = request_json(f"/accounts/{account}/workers/scripts/{worker}/versions", token)
    values = records(result, "items", "versions")
    ids = [str(item.get("id") or "") for item in values]
    return [value for value in ids if UUID_RE.fullmatch(value)]


def version_for_sha(account_id: str, target_sha: str, token: str) -> tuple[str, dict[str, Any]]:
    expected_tag = f"main-{target_sha[:12]}"
    expected_message = f"LBFL exact-main {target_sha}"
    for version_id in list_version_ids(account_id, token)[:50]:
        details = version_details(account_id, version_id, token)
        annotations = details.get("annotations")
        annotations = annotations if isinstance(annotations, dict) else {}
        commit_sha = str(annotations.get("workers/commit_sha") or "").lower()
        tag = str(annotations.get("workers/tag") or "")
        message = str(annotations.get("workers/message") or "")
        repository_url = str(annotations.get("workers/repository_url") or "")
        if (
            commit_sha == target_sha
            or (tag == expected_tag and message == expected_message)
        ):
            if repository_url:
                require(
                    "yusuf38bcs-oss/yusuf38bcs-oss.github.io" in repository_url,
                    "Exact-SHA Worker version reports an unexpected repository URL",
                )
            return version_id, details
    return "", {}


def active_version(account_id: str, token: str) -> tuple[str, dict[str, Any]]:
    account = urllib.parse.quote(account_id, safe="")
    worker = urllib.parse.quote(SCRIPT_NAME, safe="")
    result = request_json(f"/accounts/{account}/workers/scripts/{worker}/deployments", token)
    deployments = records(result, "deployments")
    require(bool(deployments), "No active Worker deployment was returned")
    deployment = deployments[0]
    versions = deployment.get("versions")
    require(isinstance(versions, list) and versions, "Active deployment has no versions")
    live = [
        item for item in versions
        if isinstance(item, dict) and float(item.get("percentage") or 0) >= 99.999
    ]
    require(len(live) == 1, "Production Worker is not a single 100% version deployment")
    version_id = str(live[0].get("version_id") or "")
    require(UUID_RE.fullmatch(version_id) is not None, "Active Worker version is not a UUID")
    return version_id, deployment


def probe_health(url: str) -> dict[str, Any]:
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/json",
            "Origin": "https://learningbiologyforlife.org",
            "User-Agent": "lbfl-worker-production-verifier",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            status = response.getcode()
            content_type = response.headers.get("content-type", "")
            header_version = response.headers.get("x-lbfl-worker-version", "")
            body = json.loads(response.read().decode("utf-8"))
    except (urllib.error.HTTPError, urllib.error.URLError, json.JSONDecodeError) as error:
        raise RuntimeError(f"Worker health probe failed for {url}: {error}") from error
    require(status == 200, f"{url} returned HTTP {status}")
    require(content_type.lower().startswith("application/json"), f"{url} did not return JSON")
    require(isinstance(body, dict) and body.get("ok") is True, f"{url} did not report ok=true")
    require(UUID_RE.fullmatch(header_version) is not None, f"{url} did not expose a Worker UUID")
    require(str(body.get("worker_version_id") or "") == header_version, f"{url} header/body Worker UUID mismatch")
    require(body.get("environment") == "production", f"{url} environment is not production")
    require(body.get("provider") == "openai", f"{url} provider is not openai")
    require(body.get("model") == "gpt-5.6-terra", f"{url} model is not gpt-5.6-terra")
    return {
        "url": url,
        "status": status,
        "worker_version_id": header_version,
        "environment": body.get("environment"),
        "provider": body.get("provider"),
        "model": body.get("model"),
        "service": body.get("service"),
        "version": body.get("version"),
    }


def ingress_pair(expected_version_id: str | None = None) -> dict[str, Any]:
    canonical = probe_health(CANONICAL_HEALTH)
    direct = probe_health(DIRECT_HEALTH)
    require(
        canonical["worker_version_id"] == direct["worker_version_id"],
        "Canonical API and workers.dev are serving different Worker versions",
    )
    for field in ("environment", "provider", "model", "service", "version"):
        require(canonical[field] == direct[field], f"Canonical/direct Worker {field} mismatch")
    if expected_version_id:
        require(
            canonical["worker_version_id"].lower() == expected_version_id.lower(),
            "Live ingress is not serving the expected exact Worker version",
        )
    return {"canonical": canonical, "direct": direct}


def write_outputs(path: str, values: dict[str, str]) -> None:
    if not path:
        return
    with open(path, "a", encoding="utf-8") as handle:
        for key, value in values.items():
            handle.write(f"{key}={value}\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("preflight", "verify"), required=True)
    parser.add_argument("--sha", default="")
    parser.add_argument("--output", required=True)
    parser.add_argument("--github-output", default="")
    args = parser.parse_args()

    account_id = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "").strip()
    token = os.environ.get("CLOUDFLARE_API_TOKEN", "").strip()
    require(bool(account_id), "CLOUDFLARE_ACCOUNT_ID is missing")
    require(bool(token), "CLOUDFLARE_API_TOKEN is missing")
    worker = worker_exists(account_id, token)

    if args.sha:
        args.sha = args.sha.lower()
        require(SHA_RE.fullmatch(args.sha) is not None, "--sha must be an exact lowercase 40-character SHA")

    if args.mode == "preflight":
        active_id, deployment = active_version(account_id, token)
        live = ingress_pair(active_id)
        evidence = {
            "mode": "preflight",
            "script_name": SCRIPT_NAME,
            "worker_metadata": {
                "id": worker.get("id"),
                "tag": worker.get("tag"),
                "modified_on": worker.get("modified_on"),
            },
            "active_version_id": active_id,
            "active_deployment_id": deployment.get("id"),
            "live_ingress": live,
        }
        write_outputs(args.github_output, {"active_worker_version_id": active_id})
    else:
        require(bool(args.sha), "--sha is required in verify mode")
        version_id = ""
        details: dict[str, Any] = {}
        for _ in range(60):
            version_id, details = version_for_sha(account_id, args.sha, token)
            if version_id:
                break
            time.sleep(5)
        require(bool(version_id), "No Worker version provenance is bound to exact main SHA")

        deployment: dict[str, Any] = {}
        for _ in range(60):
            active_id, deployment = active_version(account_id, token)
            if active_id.lower() == version_id.lower():
                break
            time.sleep(5)
        else:
            raise RuntimeError("Exact-main Worker version did not become the 100% active deployment")

        live: dict[str, Any] = {}
        last_error = ""
        for _ in range(60):
            try:
                live = ingress_pair(version_id)
                break
            except RuntimeError as error:
                last_error = str(error)
                time.sleep(5)
        require(bool(live), f"Both production ingress paths did not converge: {last_error}")

        annotations = details.get("annotations")
        annotations = annotations if isinstance(annotations, dict) else {}
        evidence = {
            "mode": "verify",
            "script_name": SCRIPT_NAME,
            "target_sha": args.sha,
            "worker_version_id": version_id,
            "version_number": details.get("number"),
            "version_created_on": details.get("created_on"),
            "version_annotations": {
                key: value
                for key, value in annotations.items()
                if key in {
                    "workers/commit_sha",
                    "workers/repository_url",
                    "workers/message",
                    "workers/tag",
                    "workers/triggered_by",
                }
            },
            "active_deployment_id": deployment.get("id"),
            "live_ingress": live,
        }
        write_outputs(
            args.github_output,
            {
                "worker_version_id": version_id,
                "deployment_id": str(deployment.get("id") or ""),
            },
        )

    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(json.dumps(evidence, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(evidence, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"LBFL Worker production verification failed: {error}", file=sys.stderr)
        raise SystemExit(1)
