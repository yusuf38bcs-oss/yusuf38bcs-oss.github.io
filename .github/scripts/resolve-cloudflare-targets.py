#!/usr/bin/env python3
"""Resolve Cloudflare previews and certify SHA equality only from trusted metadata."""

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


PAGES_URL_RE = re.compile(
    r"Preview URL:</strong>.*?<a href=['\"](https://[^'\"<>\s]+\.pages\.dev)['\"]",
    re.IGNORECASE | re.DOTALL,
)
WORKER_URL_RE = re.compile(
    r"<a href=['\"](https://[^'\"<>\s]+\.workers\.dev)['\"][^>]*>Commit Preview URL",
    re.IGNORECASE | re.DOTALL,
)
LATEST_COMMIT_RE = re.compile(
    r"<strong>\s*Latest\s+commit:\s*</strong>\s*</td>\s*<td>\s*<code>\s*([0-9a-f]{7,40})\s*</code>",
    re.IGNORECASE | re.DOTALL,
)
WORKER_COMMIT_RE = re.compile(
    r"^\|.*?Deployment successful!.*?\|\s*[^|]+\|\s*([0-9a-f]{7,40})\s*\|",
    re.IGNORECASE | re.MULTILINE,
)
WORKER_BUILD_UUID_RE = re.compile(
    r"/workers/services/view/[^/\s]+/production/builds/"
    r"([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})",
    re.IGNORECASE,
)
WORKER_VERSION_ID_RE = re.compile(
    r"Worker Version ID:\s*"
    r"([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})",
    re.IGNORECASE,
)

ENDPOINT_RE = re.compile(r'^\s*endpoint:\s*["\']?([^"\'\s#]+)', re.MULTILINE)
FULL_SHA_RE = re.compile(r"[0-9a-f]{40}")


def clean_url(value: str) -> str:
    return value.rstrip(".,)")


def cloudflare_url(value: Any, suffix: str) -> str:
    candidate = clean_url(str(value or "").strip())
    parsed = urllib.parse.urlparse(candidate)
    hostname = (parsed.hostname or "").lower()
    if parsed.scheme != "https" or not hostname or not hostname.endswith(suffix):
        return ""
    return candidate


def github_comments(repository: str, pr_number: str, token: str) -> list[dict[str, Any]]:
    if not pr_number or not token:
        return []
    url = f"https://api.github.com/repos/{repository}/issues/{pr_number}/comments?per_page=100"
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "lbfl-ci-cloudflare-preview-resolver",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError) as error:
        print(f"Cloudflare comment lookup skipped: {error}", file=sys.stderr)
        return []
    return payload if isinstance(payload, list) else []


def find_preview(
    comments: list[dict[str, Any]], target_sha: str, pattern: re.Pattern[str]
) -> tuple[str, str]:
    """Return a URL only when the same Cloudflare bot comment has a commit field."""
    for comment in reversed(comments):
        user = comment.get("user") or {}
        body = str(comment.get("body") or "")
        if user.get("login") != "cloudflare-workers-and-pages[bot]":
            continue
        if "Deploy successful" not in body and "Deployment successful" not in body:
            continue
        commit_match = LATEST_COMMIT_RE.search(body) or WORKER_COMMIT_RE.search(body)
        if not commit_match:
            continue
        commit_claim = commit_match.group(1).lower()
        if commit_claim != target_sha and not target_sha.startswith(commit_claim):
            continue
        url_match = pattern.search(body)
        if url_match:
            return clean_url(url_match.group(1)), commit_claim
    return "", ""


def find_worker_build_uuid(
    comments: list[dict[str, Any]], target_sha: str
) -> str:
    """Find the build UUID from the same trusted Worker deployment comment."""
    for comment in reversed(comments):
        user = comment.get("user") or {}
        body = str(comment.get("body") or "")
        if user.get("login") != "cloudflare-workers-and-pages[bot]":
            continue
        if "Deployment successful" not in body:
            continue
        commit_match = WORKER_COMMIT_RE.search(body)
        if not commit_match:
            continue
        commit_claim = commit_match.group(1).lower()
        if commit_claim != target_sha and not target_sha.startswith(commit_claim):
            continue
        if not WORKER_URL_RE.search(body):
            continue
        build_match = WORKER_BUILD_UUID_RE.search(body)
        if build_match:
            return build_match.group(1).lower()
    return ""


def cloudflare_api_get(path: str, token: str) -> Any:
    if not token:
        return {}
    request = urllib.request.Request(
        f"https://api.cloudflare.com/client/v4{path}",
        headers={
            "Accept": "application/json",
            "Authorization": f"Bearer {token}",
            "User-Agent": "lbfl-ci-cloudflare-preview-resolver",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")[:1000]
        print(
            f"Cloudflare deployment metadata lookup skipped for {path}: "
            f"HTTP {error.code}: {detail}",
            file=sys.stderr,
        )
        return {}
    except (urllib.error.URLError, json.JSONDecodeError) as error:
        print(
            f"Cloudflare deployment metadata lookup skipped for {path}: {error}",
            file=sys.stderr,
        )
        return {}
    if not isinstance(payload, dict) or payload.get("success") is not True:
        print("Cloudflare deployment metadata lookup returned no successful result.", file=sys.stderr)
        return {}
    return payload.get("result", {})


def as_records(value: Any, key: str) -> list[dict[str, Any]]:
    if isinstance(value, list):
        return [item for item in value if isinstance(item, dict)]
    if isinstance(value, dict) and isinstance(value.get(key), list):
        return [item for item in value[key] if isinstance(item, dict)]
    return []


def cloudflare_pages_deployment(
    account_id: str,
    project_name: str,
    target_sha: str,
    token: str,
    environment: str = "preview",
) -> dict[str, Any]:
    if not account_id or not project_name or not token:
        return {}
    account = urllib.parse.quote(account_id, safe="")
    project = urllib.parse.quote(project_name, safe="")

    canonical_deployment_id = ""
    if environment == "production":
        project_result = cloudflare_api_get(
            f"/accounts/{account}/pages/projects/{project}", token
        )
        canonical_deployment = (
            project_result.get("canonical_deployment")
            if isinstance(project_result, dict)
            else None
        )
        deployments = (
            [canonical_deployment]
            if isinstance(canonical_deployment, dict)
            else []
        )
        canonical_deployment_id = str(
            canonical_deployment.get("id") or ""
        ) if isinstance(canonical_deployment, dict) else ""
    else:
        query = urllib.parse.urlencode({"env": environment, "per_page": 25})
        result = cloudflare_api_get(
            f"/accounts/{account}/pages/projects/{project}/deployments?{query}",
            token,
        )
        deployments = as_records(result, "deployments")

    for deployment in deployments:
        trigger = deployment.get("deployment_trigger")
        metadata = trigger.get("metadata") if isinstance(trigger, dict) else {}
        commit_hash = str(metadata.get("commit_hash") or "").lower()
        deployment_id = str(deployment.get("id") or "")
        latest_stage = deployment.get("latest_stage")
        latest_status = latest_stage.get("status") if isinstance(latest_stage, dict) else ""
        is_canonical = (
            environment == "production"
            and bool(deployment_id)
            and deployment_id == canonical_deployment_id
        )
        if (
            commit_hash == target_sha
            and deployment.get("environment") == environment
            and latest_status == "success"
            and deployment.get("is_skipped") is False
            and metadata.get("commit_dirty") is False
            and (environment != "production" or is_canonical)
        ):
            url = cloudflare_url(deployment.get("url"), ".pages.dev")
            if url:
                return {
                    "branch": str(metadata.get("branch") or ""),
                    "canonical": is_canonical,
                    "commit_hash": commit_hash,
                    "deployment_id": deployment_id,
                    "environment": environment,
                    "status": latest_status,
                    "url": url,
                }
    return {}


def cloudflare_pages_preview(
    account_id: str, project_name: str, target_sha: str, token: str
) -> str:
    """Backward-compatible preview URL helper for existing callers."""
    deployment = cloudflare_pages_deployment(
        account_id, project_name, target_sha, token, "preview"
    )
    return deployment.get("url", "")


def cloudflare_worker_version_for_sha(
    account_id: str, script_name: str, target_sha: str, token: str
) -> str:
    """Find the exact PR-preview Worker version through Cloudflare build metadata."""
    if not account_id or not script_name or not token:
        return ""
    account = urllib.parse.quote(account_id, safe="")
    script = urllib.parse.quote(script_name, safe="")
    versions_result = cloudflare_api_get(
        f"/accounts/{account}/workers/scripts/{script}/versions", token
    )
    versions = as_records(versions_result, "versions")
    version_ids = [
        str(version.get("id") or "")
        for version in versions
        if str(version.get("id") or "")
    ]
    if not version_ids:
        return ""

    unique_version_ids = list(dict.fromkeys(version_ids))[:50]
    for version_id in unique_version_ids:
        # Cloudflare documents one version ID per request even though the query
        # parameter is plural. Comma-joining IDs returns HTTP 400.
        query = urllib.parse.urlencode({"version_ids": version_id})
        builds_result = cloudflare_api_get(
            f"/accounts/{account}/builds/builds?{query}", token
        )
        builds = builds_result.get("builds") if isinstance(builds_result, dict) else {}
        if not isinstance(builds, dict):
            continue
        build = builds.get(version_id)
        metadata = build.get("build_trigger_metadata") if isinstance(build, dict) else {}
        commit_hash = str(metadata.get("commit_hash") or "").lower()
        if commit_hash == target_sha:
            return version_id
    return ""


def cloudflare_build_log_text(
    account_id: str, build_uuid: str, token: str
) -> str:
    """Read all available Cloudflare build-log pages as trusted text."""
    if not account_id or not build_uuid or not token:
        return ""

    account = urllib.parse.quote(account_id, safe="")
    build = urllib.parse.quote(build_uuid, safe="")
    base_path = f"/accounts/{account}/builds/builds/{build}/logs"
    cursor = ""
    chunks: list[str] = []

    for _ in range(50):
        path = base_path
        if cursor:
            path += "?" + urllib.parse.urlencode({"cursor": cursor})

        result = cloudflare_api_get(path, token)
        if not isinstance(result, dict):
            return ""

        lines = result.get("lines")
        if isinstance(lines, list):
            for row in lines:
                if isinstance(row, list):
                    chunks.append(" ".join(str(part) for part in row))
                elif isinstance(row, dict):
                    chunks.append(" ".join(str(part) for part in row.values()))
                else:
                    chunks.append(str(row))

        if not result.get("truncated"):
            break

        cursor = str(result.get("cursor") or "")
        if not cursor:
            break

    return "\n".join(chunks)


def cloudflare_worker_version_from_build_log(
    account_id: str,
    script_name: str,
    target_sha: str,
    preview_url: str,
    build_uuid: str,
    token: str,
) -> str:
    """Recover a Worker version only through an exact-SHA authenticated build."""
    if not account_id or not script_name or not target_sha or not build_uuid or not token:
        return ""

    preview = cloudflare_url(preview_url, ".workers.dev")
    if not preview:
        return ""

    account = urllib.parse.quote(account_id, safe="")
    script = urllib.parse.quote(script_name, safe="")
    build = urllib.parse.quote(build_uuid, safe="")

    build_result = cloudflare_api_get(
        f"/accounts/{account}/builds/builds/{build}", token
    )
    if not isinstance(build_result, dict):
        return ""

    returned_build_uuid = str(build_result.get("build_uuid") or "").lower()
    metadata = build_result.get("build_trigger_metadata")
    metadata = metadata if isinstance(metadata, dict) else {}
    commit_hash = str(metadata.get("commit_hash") or "").lower()

    if returned_build_uuid != build_uuid.lower() or commit_hash != target_sha:
        return ""

    log_text = cloudflare_build_log_text(account_id, build_uuid, token)
    version_match = WORKER_VERSION_ID_RE.search(log_text)
    if not version_match:
        return ""

    version_id = version_match.group(1).lower()

    hostname = (urllib.parse.urlparse(preview).hostname or "").lower()
    if not hostname.startswith(version_id[:8] + "-"):
        return ""

    version_result = cloudflare_api_get(
        f"/accounts/{account}/workers/scripts/{script}/versions/{version_id}",
        token,
    )
    if not isinstance(version_result, dict):
        return ""

    if str(version_result.get("id") or "").lower() != version_id:
        return ""

    resources = version_result.get("resources")
    resources = resources if isinstance(resources, dict) else {}
    bindings = resources.get("bindings")
    bindings = bindings if isinstance(bindings, list) else []

    has_version_metadata = any(
        isinstance(binding, dict)
        and binding.get("name") == "CF_VERSION_METADATA"
        and binding.get("type") == "version_metadata"
        for binding in bindings
    )
    if not has_version_metadata:
        return ""

    return version_id


def configured_worker_endpoint(site_config: Path) -> str:
    if not site_config.is_file():
        return ""
    match = ENDPOINT_RE.search(site_config.read_text(encoding="utf-8"))
    return clean_url(match.group(1)) if match else ""


def resolve_once(args: argparse.Namespace, target_sha: str) -> dict[str, Any]:
    token = os.environ.get("CLOUDFLARE_API_TOKEN", "")
    comments = (
        github_comments(
            args.repository, args.pr_number, os.environ.get("GH_TOKEN", "")
        )
        if args.pages_environment == "preview"
        else []
    )
    pages_comment_url, pages_commit_claim = find_preview(comments, target_sha, PAGES_URL_RE)
    worker_comment_url, worker_commit_claim = find_preview(comments, target_sha, WORKER_URL_RE)
    worker_build_uuid = find_worker_build_uuid(comments, target_sha)
    pages_deployment = cloudflare_pages_deployment(
        args.cloudflare_account_id,
        args.cloudflare_pages_project,
        target_sha,
        token,
        args.pages_environment,
    )
    pages_api_url = pages_deployment.get("url", "")
    worker_version_id = cloudflare_worker_version_for_sha(
        args.cloudflare_account_id, args.cloudflare_worker_script, target_sha, token
    )
    worker_version_source = (
        "cloudflare_worker_build_api_full_sha_pending_endpoint_version_binding"
        if worker_version_id
        else ""
    )

    if not worker_version_id and worker_comment_url and worker_build_uuid:
        worker_version_id = cloudflare_worker_version_from_build_log(
            args.cloudflare_account_id,
            args.cloudflare_worker_script,
            target_sha,
            worker_comment_url,
            worker_build_uuid,
            token,
        )
        if worker_version_id:
            worker_version_source = (
                "cloudflare_worker_build_log_full_sha_version_bound_pending_contract_probe"
            )

    pages_override = (
        cloudflare_url(args.pages_override, ".pages.dev")
        if args.pages_environment == "preview"
        else ""
    )
    worker_override = cloudflare_url(args.worker_override, ".workers.dev")
    configured_worker = configured_worker_endpoint(Path(args.site_config))
    pages_exact_head = bool(pages_api_url) or pages_commit_claim == target_sha
    # The Worker contract probe must confirm this version ID at the tested URL
    # before release certification can claim exact-head evidence.
    # Preview certification also requires a trusted deployment-comment URL.
    # Production resolves immutable Worker metadata directly, then the workflow
    # binds the live health response to that exact version ID.
    worker_metadata_exact_head = bool(worker_version_id) and (
        args.pages_environment == "production" or bool(worker_comment_url)
    )
    pages_url = pages_api_url or pages_comment_url or pages_override
    worker_url = worker_comment_url or worker_override or configured_worker

    if pages_api_url:
        pages_source = (
            "cloudflare_pages_project_canonical_deployment_api_full_sha"
            if args.pages_environment == "production"
            else "cloudflare_pages_preview_deployment_api_full_sha"
        )
    elif pages_commit_claim == target_sha:
        pages_source = "cloudflare_full_sha_commit_comment"
    elif pages_comment_url:
        pages_source = "cloudflare_structured_short_sha_comment_unverified"
    elif pages_override:
        pages_source = "manual_override_unverified"
    else:
        pages_source = "pending"

    if worker_metadata_exact_head:
        worker_source = (
            worker_version_source
            or "cloudflare_worker_build_api_full_sha_pending_endpoint_version_binding"
        )
    elif worker_comment_url:
        worker_source = "cloudflare_structured_short_sha_comment_unverified"
    elif worker_override:
        worker_source = "manual_override_unverified"
    else:
        worker_source = "site_config_fallback"

    return {
        "target_sha": target_sha,
        "short_sha": target_sha[:7],
        "cloudflare_api": {
            "configured": bool(token),
            "pages_project_configured": bool(args.cloudflare_pages_project),
            "worker_script_configured": bool(args.cloudflare_worker_script),
        },
        "pages": {
            "url": pages_url,
            "source": pages_source,
            "commit_claim": pages_commit_claim,
            "branch": pages_deployment.get("branch", ""),
            "canonical": pages_deployment.get("canonical", False),
            "deployed_sha": pages_deployment.get("commit_hash", ""),
            "deployment_id": pages_deployment.get("deployment_id", ""),
            "environment": pages_deployment.get("environment", ""),
            "status": pages_deployment.get("status", ""),
            "exact_head": pages_exact_head,
        },
        "worker": {
            "url": worker_url,
            "source": worker_source,
            "commit_claim": worker_commit_claim,
            "version_id": worker_version_id,
            "metadata_exact_head": worker_metadata_exact_head,
            "exact_head": False,
        },
    }


def write_github_output(path: str, values: dict[str, str]) -> None:
    if not path:
        return
    with Path(path).open("a", encoding="utf-8") as output:
        for key, value in values.items():
            output.write(f"{key}={value}\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repository", required=True)
    parser.add_argument("--sha", required=True)
    parser.add_argument("--pr-number", default="")
    parser.add_argument("--pages-override", default="")
    parser.add_argument("--worker-override", default="")
    parser.add_argument("--cloudflare-account-id", default="")
    parser.add_argument("--cloudflare-pages-project", default="")
    parser.add_argument(
        "--pages-environment",
        choices=("preview", "production"),
        default="preview",
    )
    parser.add_argument("--cloudflare-worker-script", default="")
    parser.add_argument("--wait-seconds", type=int, default=0)
    parser.add_argument("--poll-interval-seconds", type=int, default=20)
    parser.add_argument("--site-config", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--github-output", default="")
    args = parser.parse_args()

    sha = args.sha.lower()
    if not FULL_SHA_RE.fullmatch(sha):
        raise SystemExit("--sha must be an exact 40-character lowercase hexadecimal SHA")
    if args.wait_seconds < 0 or args.poll_interval_seconds <= 0:
        raise SystemExit("Preview polling values must be positive.")

    deadline = time.monotonic() + args.wait_seconds
    while True:
        result = resolve_once(args, sha)
        if result["pages"]["exact_head"] and result["worker"]["exact_head"]:
            break
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            break
        time.sleep(min(args.poll_interval_seconds, remaining))

    Path(args.output).write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    write_github_output(
        args.github_output,
        {
            "pages_url": str(result["pages"]["url"]),
            "pages_exact_head": str(result["pages"]["exact_head"]).lower(),
            "pages_branch": str(result["pages"]["branch"]),
            "pages_canonical": str(result["pages"]["canonical"]).lower(),
            "pages_deployed_sha": str(result["pages"]["deployed_sha"]),
            "pages_deployment_id": str(result["pages"]["deployment_id"]),
            "pages_environment": str(result["pages"]["environment"]),
            "pages_status": str(result["pages"]["status"]),
            "worker_url": str(result["worker"]["url"]),
            "worker_metadata_exact_head": str(result["worker"]["metadata_exact_head"]).lower(),
            "worker_version_id": str(result["worker"]["version_id"]),
        },
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
