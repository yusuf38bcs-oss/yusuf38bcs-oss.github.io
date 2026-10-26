#!/usr/bin/env python3
"""Regression: split readers must reach the immutable resolver's API calls."""
import importlib.util
import os
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("adapter", Path(__file__).with_name("resolve-production-targets.py"))
adapter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter)
args = SimpleNamespace(repository="owner/repo", pr_number="", pages_environment="production",
    cloudflare_account_id="account", cloudflare_pages_project="pages",
    cloudflare_worker_script="worker", pages_override="", worker_override="", site_config="unused")
calls = []
def get(path, token):
    calls.append((path, token))
    return {}
with patch.dict(os.environ, {"CLOUDFLARE_PAGES_READ_TOKEN": "pages-fixture", "CLOUDFLARE_WORKER_READ_TOKEN": "worker-fixture"}, clear=True):
    with patch.object(adapter, "original_get_strict", side_effect=get), patch.object(adapter.resolver, "configured_worker_endpoint", return_value=""):
        adapter.resolve_with_readers(args, "a" * 40)
    assert "CLOUDFLARE_API_TOKEN" not in os.environ
assert any("/pages/" in path and token == "pages-fixture" for path, token in calls)
assert any("/workers/" in path and token == "worker-fixture" for path, token in calls)

# Adversarial credential-boundary and read-only permission fixtures.
from urllib.error import HTTPError

with patch.dict(
    os.environ,
    {"CLOUDFLARE_PAGES_READ_TOKEN": "pages-fixture",
     "CLOUDFLARE_API_TOKEN": "legacy-write-fixture"},
    clear=True,
):
    try:
        adapter.resolve_with_readers(args, "a" * 40)
    except SystemExit as error:
        assert "both distinct Pages and Worker" in str(error)
    else:
        raise AssertionError("Missing Worker reader must fail even with legacy token")

with patch.dict(os.environ, {
    "CLOUDFLARE_WORKER_READ_TOKEN": "worker-fixture",
    "CLOUDFLARE_API_TOKEN": "legacy-write-fixture"}, clear=True):
    try:
        adapter.resolve_with_readers(args, "a" * 40)
    except SystemExit as error:
        assert "both distinct Pages and Worker" in str(error)
    else:
        raise AssertionError("Missing Pages reader must fail even with legacy token")

with patch.dict(os.environ, {
    "CLOUDFLARE_PAGES_READ_TOKEN": "pages-fixture",
    "CLOUDFLARE_WORKER_READ_TOKEN": "worker-fixture"}, clear=True):
    with patch.object(adapter, "original_get_strict", side_effect=get):
        assert adapter.reader_get("/accounts/a/pages/projects/p", "legacy-write") == {}
        assert adapter.reader_get("/accounts/a/workers/scripts/w/versions", "legacy-write") == {}
        assert adapter.reader_get("/accounts/a/builds/builds?version_ids=v", "legacy-write") == {}
    try:
        adapter.reader_get("/accounts/a/tokens", "legacy-write")
    except SystemExit as error:
        assert "Unsupported" in str(error)
    else:
        raise AssertionError("Unknown Cloudflare endpoint must be rejected")

assert calls[-3:] == [
    ("/accounts/a/pages/projects/p", "pages-fixture"),
    ("/accounts/a/workers/scripts/w/versions", "worker-fixture"),
    ("/accounts/a/builds/builds?version_ids=v", "worker-fixture"),
]

target_sha = "a" * 40
version_id = "11111111-1111-4111-8111-111111111111"
trace = []
def worker_metadata(path, token, annotation_sha=target_sha):
    assert token == "worker-fixture"
    trace.append(path)
    if path.endswith("/workers/scripts/lbfl-socratic-ai/versions"):
        return {"items": [{"id": version_id}]}
    if "/builds/" in path:
        raise HTTPError(path, 403, "Forbidden", {}, None)
    if "/workers/workers/lbfl-socratic-ai/versions/" in path:
        return {"annotations": {"workers/commit_sha": annotation_sha}}
    raise AssertionError("Unexpected Cloudflare metadata endpoint " + path)

with patch.dict(os.environ, {"CLOUDFLARE_PAGES_READ_TOKEN": "pages-fixture",
                             "CLOUDFLARE_WORKER_READ_TOKEN": "worker-fixture"}, clear=True):
    with patch.object(adapter, "original_get_strict", side_effect=worker_metadata):
        assert adapter.resolver.cloudflare_worker_version_for_sha(
            "a", "lbfl-socratic-ai", target_sha, "legacy-write"
        ) == version_id
    assert any("/builds/" in path for path in trace)
    assert any("/workers/workers/" in path for path in trace)

    trace.clear()
    with patch.object(
        adapter, "original_get_strict",
        side_effect=lambda path, token: worker_metadata(
            path, token, annotation_sha="b" * 40
        ),
    ):
        assert adapter.resolver.cloudflare_worker_version_for_sha(
            "a", "lbfl-socratic-ai", target_sha, "legacy-write"
        ) == ""

    with patch.object(
        adapter, "original_get_strict",
        side_effect=HTTPError("https://cloudflare.invalid", 403, "Forbidden", {}, None),
    ):
        try:
            adapter.reader_get("/accounts/a/workers/scripts/lbfl-socratic-ai/versions", "legacy-write")
        except SystemExit as error:
            assert "HTTP 403" in str(error)
        else:
            raise AssertionError("Worker version API permission denial must fail closed")

workflow = (Path(__file__).resolve().parent.parent /
            "workflows" / "production-certification.yml").read_text(encoding="utf-8")
assert workflow.count(
    "CLOUDFLARE_PAGES_READ_TOKEN: ${{ secrets.CLOUDFLARE_PAGES_READ_TOKEN }}"
) == 2
assert workflow.count(
    "CLOUDFLARE_WORKER_READ_TOKEN: ${{ secrets.CLOUDFLARE_WORKER_READ_TOKEN }}"
) == 2
assert "secrets.CLOUDFLARE_WORKER_DEPLOY_TOKEN" not in workflow
assert "secrets.CLOUDFLARE_API_TOKEN" not in workflow

# The GET-only probe must verify Pages as account-owned and Worker as user-owned.
assert "account_root + '/tokens/verify'" in workflow
assert workflow.count("metadata_get(pages, '/accounts/' + account + '/tokens/verify')") == 1
assert workflow.count("metadata_get(worker, '/user/tokens/verify')") == 1
assert "if path not in allowed_paths:" in workflow
assert "method='GET'" in workflow
assert workflow.count("'/user/tokens/verify'") == 2

print("Production read-only credential boundary and annotation fallback: PASS")
