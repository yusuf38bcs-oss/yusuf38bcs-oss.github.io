#!/usr/bin/env python3
"""Configure or observe exact-main Cloudflare Workers Builds for LBFL."""

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
PRODUCTION_BRANCH = "main"
CANONICAL_HEALTH = "https://api.learningbiologyforlife.org/api/health"
DIRECT_HEALTH = "https://lbfl-socratic-ai.yusuf-38bcs.workers.dev/api/health"
UUID_RE = re.compile(r"^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$", re.I)
SHA_RE = re.compile(r"^[0-9a-f]{40}$")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def request_json(method: str, path: str, token: str, payload: dict[str, Any] | None = None) -> Any:
    body = None
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {token}",
        "User-Agent": "lbfl-worker-production-controller",
    }
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(f"{API_BASE}{path}", data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")[:2000]
        raise RuntimeError(f"Cloudflare API {method} {path} failed: HTTP {error.code}: {detail}") from error
    except (urllib.error.URLError, json.JSONDecodeError) as error:
        raise RuntimeError(f"Cloudflare API {method} {path} failed: {error}") from error
    require(isinstance(data, dict), f"Cloudflare API {path} did not return an object")
    require(data.get("success") is True, f"Cloudflare API {path} returned success=false: {data.get('errors')}")
    return data.get("result")


def records(value: Any, *keys: str) -> list[dict[str, Any]]:
    if isinstance(value, list):
        return [item for item in value if isinstance(item, dict)]
    if isinstance(value, dict):
        for key in keys:
            candidate = value.get(key)
            if isinstance(candidate, list):
                return [item for item in candidate if isinstance(item, dict)]
    return []


def find_worker_tag(account_id: str, token: str) -> str:
    result = request_json("GET", f"/accounts/{urllib.parse.quote(account_id)}/workers/scripts", token)
    for item in records(result, "items", "scripts"):
        if str(item.get("id") or "") == SCRIPT_NAME:
            tag = str(item.get("tag") or item.get("external_script_id") or "")
            require(bool(tag), f"{SCRIPT_NAME} exists but has no Worker tag")
            return tag
    raise RuntimeError(f"Cloudflare Worker {SCRIPT_NAME!r} was not found")


def production_triggers(account_id: str, worker_tag: str, token: str) -> list[dict[str, Any]]:
    tag = urllib.parse.quote(worker_tag, safe="")
    result = request_json("GET", f"/accounts/{urllib.parse.quote(account_id)}/builds/workers/{tag}/triggers", token)
    candidates: list[dict[str, Any]] = []
    for trigger in records(result, "items", "triggers"):
        includes = [str(v) for v in (trigger.get("branch_includes") or [])]
        excludes = [str(v) for v in (trigger.get("branch_excludes") or [])]
        if PRODUCTION_BRANCH in includes and PRODUCTION_BRANCH not in excludes:
            candidates.append(trigger)
    return candidates


def select_build_token(account_id: str, worker_tag: str, token: str) -> dict[str, Any]:
    account = urllib.parse.quote(account_id, safe="")
    result = request_json("GET", f"/accounts/{account}/builds/tokens?per_page=200", token)
    tokens = [
        item for item in records(result, "items", "tokens")
        if UUID_RE.fullmatch(str(item.get("build_token_uuid") or "")) is not None
    ]
    require(bool(tokens), "No Cloudflare Workers Builds token is available")
    by_uuid = {str(item.get("build_token_uuid")): item for item in tokens}

    if len(tokens) == 1:
        return tokens[0]

    tag = urllib.parse.quote(worker_tag, safe="")
    try:
        history = request_json("GET", f"/accounts/{account}/builds/workers/{tag}/builds", token)
    except RuntimeError:
        history = []
    for build in records(history, "items", "builds"):
        build_token_uuid = str(build.get("build_token_uuid") or "")
        if not build_token_uuid:
            trigger = build.get("trigger")
            if isinstance(trigger, dict):
                build_token_uuid = str(trigger.get("build_token_uuid") or "")
        if build_token_uuid in by_uuid:
            return by_uuid[build_token_uuid]

    preferred = [
        item for item in tokens
        if any(
            needle in str(item.get("build_token_name") or "").lower()
            for needle in ("lbfl", "socratic")
        )
    ]
    if len(preferred) == 1:
        return preferred[0]

    safe = [
        f"{item.get('build_token_name') or '<unnamed>'} [{item.get('build_token_uuid')}]"
        for item in tokens
    ]
    raise RuntimeError(
        "Multiple Workers Builds tokens exist and no token can be bound to lbfl-socratic-ai "
        "from prior build history or an unambiguous LBFL-specific name; available tokens: "
        + ", ".join(safe)
    )

def ensure_repo_connection(account_id: str, token: str) -> dict[str, Any]:
    owner_id = os.environ.get("LBFL_GITHUB_OWNER_ID", "").strip()
    repo_id = os.environ.get("LBFL_GITHUB_REPO_ID", "").strip()
    owner = os.environ.get("LBFL_GITHUB_OWNER", "").strip()
    repo_name = os.environ.get("LBFL_GITHUB_REPO", "").strip()
    require(owner_id.isdigit(), "LBFL_GITHUB_OWNER_ID is missing or invalid")
    require(repo_id.isdigit(), "LBFL_GITHUB_REPO_ID is missing or invalid")
    require(bool(owner), "LBFL_GITHUB_OWNER is missing")
    require(bool(repo_name), "LBFL_GITHUB_REPO is missing")
    account = urllib.parse.quote(account_id, safe="")
    result = request_json(
        "PUT",
        f"/accounts/{account}/builds/repos/connections",
        token,
        {
            "provider_type": "github",
            "provider_account_id": owner_id,
            "provider_account_name": owner,
            "repo_id": repo_id,
            "repo_name": repo_name,
        },
    )
    require(isinstance(result, dict), "Repository connection upsert did not return an object")
    require(UUID_RE.fullmatch(str(result.get("repo_connection_uuid") or "")) is not None, "Repository connection UUID is missing")
    return result


def ensure_production_trigger(account_id: str, worker_tag: str, token: str) -> tuple[dict[str, Any], bool]:
    candidates = production_triggers(account_id, worker_tag, token)
    require(len(candidates) <= 1, f"Expected at most one production trigger for main; found {len(candidates)}")
    if candidates:
        return candidates[0], False

    build_token = select_build_token(account_id, worker_tag, token)
    connection = ensure_repo_connection(account_id, token)
    account = urllib.parse.quote(account_id, safe="")
    created = request_json(
        "POST",
        f"/accounts/{account}/builds/triggers",
        token,
        {
            "external_script_id": worker_tag,
            "repo_connection_uuid": connection["repo_connection_uuid"],
            "build_token_uuid": build_token["build_token_uuid"],
            "trigger_name": "LBFL exact-main production Worker",
            "build_command": "cd worker && npm ci --ignore-scripts",
            "deploy_command": "./worker/node_modules/.bin/wrangler deploy --config wrangler.jsonc",
            "root_directory": "/",
            "branch_includes": [PRODUCTION_BRANCH],
            "branch_excludes": [],
            "path_includes": [
                "worker/**",
                "wrangler.jsonc",
                "_data/ai.yml",
                ".github/scripts/cloudflare-worker-production.py",
                ".github/workflows/worker-production-deployment.yml",
                ".github/workflows/production-certification.yml",
            ],
            "path_excludes": [],
            "build_caching_enabled": True,
        },
    )
    require(isinstance(created, dict), "Cloudflare did not return the created production trigger")
    require(UUID_RE.fullmatch(str(created.get("trigger_uuid") or "")) is not None, "Created trigger UUID is missing")
    return created, True


def validate_trigger(trigger: dict[str, Any]) -> None:
    require(UUID_RE.fullmatch(str(trigger.get("trigger_uuid") or "")) is not None, "Production trigger UUID is missing")
    require(PRODUCTION_BRANCH in [str(v) for v in (trigger.get("branch_includes") or [])], "Production trigger does not include main")
    require(PRODUCTION_BRANCH not in [str(v) for v in (trigger.get("branch_excludes") or [])], "Production trigger excludes main")
    require(str(trigger.get("root_directory") or "") == "/", "Production trigger root_directory must be /")
    require(
        str(trigger.get("deploy_command") or "") == "./worker/node_modules/.bin/wrangler deploy --config wrangler.jsonc",
        "Production trigger deploy command is not the governed Wrangler command",
    )


def active_version(account_id: str, token: str) -> tuple[str, dict[str, Any]]:
    account = urllib.parse.quote(account_id, safe="")
    script = urllib.parse.quote(SCRIPT_NAME, safe="")
    result = request_json("GET", f"/accounts/{account}/workers/scripts/{script}/deployments", token)
    deployments = records(result, "deployments")
    require(bool(deployments), "No active Worker deployments were returned")
    deployment = deployments[0]
    versions = deployment.get("versions")
    require(isinstance(versions, list) and versions, "Active Worker deployment has no versions")
    live = [
        version for version in versions
        if isinstance(version, dict) and float(version.get("percentage") or 0) >= 99.999
    ]
    require(len(live) == 1, "Active Worker deployment is not a single 100% version")
    version_id = str(live[0].get("version_id") or "")
    require(UUID_RE.fullmatch(version_id) is not None, "Active Worker version is not a UUID")
    return version_id, deployment


def probe_health(url: str) -> dict[str, Any]:
    req = urllib.request.Request(
        url,
        headers={
            "Accept": "application/json",
            "Origin": "https://learningbiologyforlife.org",
            "User-Agent": "lbfl-worker-production-controller",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            status = response.getcode()
            content_type = response.headers.get("content-type", "")
            version_id = response.headers.get("x-lbfl-worker-version", "")
            payload = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError) as error:
        raise RuntimeError(f"Worker health probe failed for {url}: {error}") from error
    require(status == 200, f"{url} health returned HTTP {status}")
    require(content_type.lower().startswith("application/json"), f"{url} health did not return JSON")
    require(isinstance(payload, dict) and payload.get("ok") is True, f"{url} health did not report ok=true")
    require(UUID_RE.fullmatch(version_id) is not None, f"{url} did not expose a Worker version UUID")
    require(str(payload.get("worker_version_id") or "") == version_id, f"{url} header/body Worker version mismatch")
    require(payload.get("environment") == "production", f"{url} did not report environment=production")
    require(payload.get("provider") == "openai", f"{url} did not report provider=openai")
    require(payload.get("model") == "gpt-5.6-terra", f"{url} did not report model=gpt-5.6-terra")
    return {
        "url": url,
        "status": status,
        "worker_version_id": version_id,
        "environment": payload.get("environment"),
        "provider": payload.get("provider"),
        "model": payload.get("model"),
        "service": payload.get("service"),
        "version": payload.get("version"),
    }


def verify_ingress_pair(expected_version_id: str | None = None) -> dict[str, Any]:
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
            "Live ingress is not serving the exact deployed Worker version",
        )
    return {"canonical": canonical, "direct": direct}


def build_for_version(account_id: str, version_id: str, token: str) -> dict[str, Any] | None:
    account = urllib.parse.quote(account_id, safe="")
    query = urllib.parse.urlencode({"version_ids": version_id})
    result = request_json("GET", f"/accounts/{account}/builds/builds?{query}", token)
    if isinstance(result, dict):
        builds = result.get("builds")
        if isinstance(builds, dict):
            candidate = builds.get(version_id)
            if isinstance(candidate, dict):
                return candidate
    return None


def version_for_sha(account_id: str, token: str, target_sha: str) -> tuple[str, dict[str, Any] | None]:
    account = urllib.parse.quote(account_id, safe="")
    script = urllib.parse.quote(SCRIPT_NAME, safe="")
    result = request_json("GET", f"/accounts/{account}/workers/scripts/{script}/versions", token)
    versions = records(result, "items", "versions")
    for version in versions[:50]:
        version_id = str(version.get("id") or "")
        if not UUID_RE.fullmatch(version_id):
            continue
        build = build_for_version(account_id, version_id, token)
        metadata = build.get("build_trigger_metadata") if isinstance(build, dict) else {}
        metadata = metadata if isinstance(metadata, dict) else {}
        if (
            str(metadata.get("commit_hash") or "").lower() == target_sha
            and str(metadata.get("branch") or "") == PRODUCTION_BRANCH
            and str(build.get("build_outcome") or "").lower() == "success"
        ):
            return version_id, build
    return "", None


def wait_for_exact_version(account_id: str, token: str, target_sha: str) -> tuple[str, dict[str, Any]]:
    for _ in range(120):
        version_id, build = version_for_sha(account_id, token, target_sha)
        if version_id and isinstance(build, dict):
            return version_id, build
        time.sleep(10)
    raise RuntimeError("Timed out resolving a successful Worker build/version for exact main")


def wait_for_active_version(account_id: str, token: str, expected_version_id: str) -> dict[str, Any]:
    for _ in range(90):
        current, deployment = active_version(account_id, token)
        if current.lower() == expected_version_id.lower():
            return deployment
        time.sleep(10)
    raise RuntimeError("Timed out waiting for exact Worker version to become the 100% active deployment")


def wait_for_live_ingress(expected_version_id: str) -> dict[str, Any]:
    last_error = ""
    for _ in range(90):
        try:
            return verify_ingress_pair(expected_version_id)
        except RuntimeError as error:
            last_error = str(error)
            time.sleep(10)
    raise RuntimeError(f"Timed out waiting for both Worker ingress paths: {last_error}")


def write_github_outputs(path: str, values: dict[str, str]) -> None:
    if not path:
        return
    with open(path, "a", encoding="utf-8") as handle:
        for key, value in values.items():
            handle.write(f"{key}={value}\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("configure", "await"), required=True)
    parser.add_argument("--sha", default="")
    parser.add_argument("--output", required=True)
    parser.add_argument("--github-output", default="")
    args = parser.parse_args()

    account_id = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "").strip()
    token = os.environ.get("CLOUDFLARE_API_TOKEN", "").strip()
    require(bool(account_id), "CLOUDFLARE_ACCOUNT_ID is missing")
    require(bool(token), "CLOUDFLARE_API_TOKEN is missing")

    if args.sha:
        args.sha = args.sha.lower()
        require(SHA_RE.fullmatch(args.sha) is not None, "--sha must be an exact 40-character lowercase SHA")

    worker_tag = find_worker_tag(account_id, token)
    trigger, trigger_created = ensure_production_trigger(account_id, worker_tag, token)
    validate_trigger(trigger)
    current_version_id, current_deployment = active_version(account_id, token)
    current_ingress = verify_ingress_pair(current_version_id)

    evidence: dict[str, Any] = {
        "mode": args.mode,
        "script_name": SCRIPT_NAME,
        "worker_tag": worker_tag,
        "production_branch": PRODUCTION_BRANCH,
        "trigger_uuid": trigger.get("trigger_uuid"),
        "trigger_name": trigger.get("trigger_name"),
        "trigger_created": trigger_created,
        "root_directory": trigger.get("root_directory"),
        "build_command": trigger.get("build_command"),
        "deploy_command": trigger.get("deploy_command"),
        "current_active_version_id": current_version_id,
        "current_deployment_id": current_deployment.get("id"),
        "current_ingress": current_ingress,
    }

    if args.mode == "await":
        require(bool(args.sha), "--sha is required for await mode")
        version_id, build = wait_for_exact_version(account_id, token, args.sha)
        metadata = build.get("build_trigger_metadata")
        metadata = metadata if isinstance(metadata, dict) else {}
        require(str(metadata.get("commit_hash") or "").lower() == args.sha, "Resolved build commit SHA is not exact main")
        require(str(metadata.get("branch") or "") == PRODUCTION_BRANCH, "Resolved build branch is not main")
        require(str(build.get("build_outcome") or "").lower() == "success", "Resolved build did not succeed")
        deployment = wait_for_active_version(account_id, token, version_id)
        ingress = wait_for_live_ingress(version_id)
        build_uuid = str(build.get("build_uuid") or "")
        require(UUID_RE.fullmatch(build_uuid) is not None, "Resolved exact-main build UUID is missing")

        evidence.update({
            "target_sha": args.sha,
            "build_uuid": build_uuid,
            "build_outcome": build.get("build_outcome"),
            "build_trigger_metadata": metadata,
            "worker_version_id": version_id,
            "active_deployment_id": deployment.get("id"),
            "live_ingress": ingress,
        })
        write_github_outputs(
            args.github_output,
            {
                "build_uuid": build_uuid,
                "worker_version_id": version_id,
                "worker_tag": worker_tag,
                "trigger_uuid": str(trigger["trigger_uuid"]),
            },
        )
    else:
        write_github_outputs(
            args.github_output,
            {
                "active_worker_version_id": current_version_id,
                "worker_tag": worker_tag,
                "trigger_uuid": str(trigger["trigger_uuid"]),
                "trigger_created": "true" if trigger_created else "false",
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
        print(f"LBFL Worker production controller failed: {error}", file=sys.stderr)
        raise SystemExit(1)
