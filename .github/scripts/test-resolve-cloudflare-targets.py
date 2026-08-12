#!/usr/bin/env python3
"""Fixture tests for trusted Cloudflare preview resolution."""

from __future__ import annotations

import importlib.util
import os
import unittest
from pathlib import Path
from types import SimpleNamespace
from typing import Any
from unittest.mock import patch


SCRIPT = Path(__file__).with_name("resolve-cloudflare-targets.py")
SPEC = importlib.util.spec_from_file_location("resolve_cloudflare_targets", SCRIPT)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("Could not load resolve-cloudflare-targets.py")
resolver = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(resolver)

TARGET_SHA = "a6af620338baa5a7d3f232dc955f8122133c5da9"
BUILD_UUID = "2e99cdd4-26b5-499c-84b8-1c33d3cdf466"
VERSION_ID = "75099c3d-38c5-4549-8199-7289fceb9117"
BOT = {"login": "cloudflare-workers-and-pages[bot]"}


class ResolveCloudflareTargetsTest(unittest.TestCase):
    def test_pages_production_deployment_requires_exact_successful_sha(self) -> None:
        calls: list[str] = []

        def deployment(
            deployment_id: str,
            sha: str,
            environment: str,
            status: str,
            *,
            is_skipped: bool = False,
        ) -> dict[str, Any]:
            return {
                "id": deployment_id,
                "url": f"https://{deployment_id}.example.pages.dev",
                "environment": environment,
                "deployment_trigger": {
                    "metadata": {
                        "branch": "main",
                        "commit_dirty": False,
                        "commit_hash": sha,
                    }
                },
                "is_skipped": is_skipped,
                "latest_stage": {"status": status},
            }

        def fake_get(path: str, token: str) -> Any:
            calls.append(path)
            return [
                deployment("wrong-sha", "0" * 40, "production", "success"),
                deployment("wrong-environment", TARGET_SHA, "preview", "success"),
                deployment("not-ready", TARGET_SHA, "production", "failure"),
                deployment(
                    "skipped", TARGET_SHA, "production", "success", is_skipped=True
                ),
                deployment("exact-production", TARGET_SHA, "production", "success"),
            ]

        original = resolver.cloudflare_api_get
        resolver.cloudflare_api_get = fake_get
        try:
            actual = resolver.cloudflare_pages_deployment(
                "account", "project", TARGET_SHA, "token", "production"
            )
        finally:
            resolver.cloudflare_api_get = original

        self.assertEqual(
            actual,
            {
                "branch": "main",
                "commit_hash": TARGET_SHA,
                "deployment_id": "exact-production",
                "environment": "production",
                "status": "success",
                "url": "https://exact-production.example.pages.dev",
            },
        )
        self.assertEqual(len(calls), 1)
        self.assertIn("env=production", calls[0])

    def test_pages_success_fixture_matches_current_head_prefix(self) -> None:
        body = """## Deploying yusuf38bcs-oss-github-io with Cloudflare Pages

<table><tr><td><strong>Latest commit:</strong> </td><td>
<code>a6af620</code>
</td></tr>
<tr><td><strong>Status:</strong></td><td> ✅ Deploy successful!</td></tr>
<tr><td><strong>Preview URL:</strong></td><td>
<a href='https://deadbeef.yusuf38bcs-oss-github-io.pages.dev'>preview</a>
</td></tr></table>
"""
        url, claim = resolver.find_preview(
            [{"user": BOT, "body": body}],
            TARGET_SHA,
            resolver.PAGES_URL_RE,
        )
        self.assertEqual(
            url, "https://deadbeef.yusuf38bcs-oss-github-io.pages.dev"
        )
        self.assertEqual(claim, TARGET_SHA[:7])

    def test_workers_success_fixture_matches_current_head_prefix(self) -> None:
        body = """## Deploying with Cloudflare Workers

| Status | Name | Latest Commit | Preview URL | Updated (UTC) |
| -|-|-|-|-|
| ✅ Deployment successful! | synapticai-proxy | a6af6203 | <a href='https://deadbeef-synapticai-proxy.example.workers.dev'>Commit Preview URL</a> | Aug 08 2026 |
"""
        url, claim = resolver.find_preview(
            [{"user": BOT, "body": body}],
            TARGET_SHA,
            resolver.WORKER_URL_RE,
        )
        self.assertEqual(
            url, "https://deadbeef-synapticai-proxy.example.workers.dev"
        )
        self.assertEqual(claim, TARGET_SHA[:8])

    def test_worker_versions_api_queries_one_version_at_a_time(self) -> None:
        version_one = "11111111-1111-1111-1111-111111111111"
        version_two = "22222222-2222-2222-2222-222222222222"
        calls: list[str] = []

        def fake_get(path: str, token: str) -> Any:
            calls.append(path)
            if path.endswith("/versions"):
                return [
                    {"id": version_one},
                    {"id": version_two},
                ]
            if f"version_ids={version_one}" in path:
                return {
                    "builds": {
                        version_one: {
                            "build_trigger_metadata": {"commit_hash": "0" * 40}
                        }
                    }
                }
            if f"version_ids={version_two}" in path:
                return {
                    "builds": {
                        version_two: {
                            "build_trigger_metadata": {"commit_hash": TARGET_SHA}
                        }
                    }
                }
            self.fail(f"Unexpected API path: {path}")

        original = resolver.cloudflare_api_get
        resolver.cloudflare_api_get = fake_get
        try:
            actual = resolver.cloudflare_worker_version_for_sha(
                "account", "synapticai-proxy", TARGET_SHA, "token"
            )
        finally:
            resolver.cloudflare_api_get = original

        self.assertEqual(actual, version_two)
        build_calls = [path for path in calls if "/builds/builds?" in path]
        self.assertEqual(len(build_calls), 2)
        self.assertTrue(all("%2C" not in path and "," not in path for path in build_calls))

    def test_worker_build_uuid_is_extracted_from_matching_bot_comment(self) -> None:
        body = f"""## Deploying with Cloudflare Workers

[View logs](https://dash.cloudflare.com/?to=/account/workers/services/view/synapticai-proxy/production/builds/{BUILD_UUID})

| Status | Name | Latest Commit | Preview URL | Updated (UTC) |
| -|-|-|-|-|
| Deployment successful! | synapticai-proxy | {TARGET_SHA[:8]} | <a href='https://{VERSION_ID[:8]}-synapticai-proxy.example.workers.dev'>Commit Preview URL</a> | Aug 08 2026 |
"""
        actual = resolver.find_worker_build_uuid(
            [{"user": BOT, "body": body}], TARGET_SHA
        )
        self.assertEqual(actual, BUILD_UUID)

    def test_worker_build_log_fallback_binds_exact_version(self) -> None:
        calls: list[str] = []

        def fake_get(path: str, token: str) -> Any:
            calls.append(path)

            if path == f"/accounts/account/builds/builds/{BUILD_UUID}":
                return {
                    "build_uuid": BUILD_UUID,
                    "build_trigger_metadata": {"commit_hash": TARGET_SHA},
                }

            if path == f"/accounts/account/builds/builds/{BUILD_UUID}/logs":
                return {
                    "lines": [
                        ["1786191880342", "Uploaded synapticai-proxy"],
                        ["1786191880342", f"Worker Version ID: {VERSION_ID}"],
                    ],
                    "cursor": None,
                    "truncated": False,
                }

            if path == (
                f"/accounts/account/workers/scripts/synapticai-proxy/"
                f"versions/{VERSION_ID}"
            ):
                return {
                    "id": VERSION_ID,
                    "resources": {
                        "bindings": [
                            {
                                "name": "CF_VERSION_METADATA",
                                "type": "version_metadata",
                            }
                        ]
                    },
                }

            self.fail(f"Unexpected API path: {path}")

        original = resolver.cloudflare_api_get
        resolver.cloudflare_api_get = fake_get
        try:
            actual = resolver.cloudflare_worker_version_from_build_log(
                "account",
                "synapticai-proxy",
                TARGET_SHA,
                f"https://{VERSION_ID[:8]}-synapticai-proxy.example.workers.dev",
                BUILD_UUID,
                "token",
            )
        finally:
            resolver.cloudflare_api_get = original

        self.assertEqual(actual, VERSION_ID)
        self.assertIn(
            f"/accounts/account/builds/builds/{BUILD_UUID}/logs",
            calls,
        )

    def test_worker_build_log_fallback_rejects_wrong_full_sha(self) -> None:
        def fake_get(path: str, token: str) -> Any:
            if path == f"/accounts/account/builds/builds/{BUILD_UUID}":
                return {
                    "build_uuid": BUILD_UUID,
                    "build_trigger_metadata": {"commit_hash": "0" * 40},
                }
            self.fail(f"Unexpected API path after SHA mismatch: {path}")

        original = resolver.cloudflare_api_get
        resolver.cloudflare_api_get = fake_get
        try:
            actual = resolver.cloudflare_worker_version_from_build_log(
                "account",
                "synapticai-proxy",
                TARGET_SHA,
                f"https://{VERSION_ID[:8]}-synapticai-proxy.example.workers.dev",
                BUILD_UUID,
                "token",
            )
        finally:
            resolver.cloudflare_api_get = original

        self.assertEqual(actual, "")

    def test_pages_deployment_requires_explicit_clean_unskipped_booleans(
        self,
    ) -> None:
        missing = object()

        def candidate(
            is_skipped: Any = missing,
            commit_dirty: Any = missing,
        ) -> dict[str, Any]:
            metadata: dict[str, Any] = {
                "branch": "main",
                "commit_hash": TARGET_SHA,
            }
            if commit_dirty is not missing:
                metadata["commit_dirty"] = commit_dirty

            deployment: dict[str, Any] = {
                "id": "candidate",
                "url": "https://candidate.example.pages.dev",
                "environment": "production",
                "deployment_trigger": {"metadata": metadata},
                "latest_stage": {"status": "success"},
            }
            if is_skipped is not missing:
                deployment["is_skipped"] = is_skipped
            return deployment

        rejected = (
            ("missing-is-skipped", missing, False),
            ("null-is-skipped", None, False),
            ("string-is-skipped", "false", False),
            ("integer-is-skipped", 0, False),
            ("missing-commit-dirty", False, missing),
            ("null-commit-dirty", False, None),
            ("string-commit-dirty", False, "false"),
            ("integer-commit-dirty", False, 0),
        )

        for name, is_skipped, commit_dirty in rejected:
            with self.subTest(name=name):
                with patch.object(
                    resolver,
                    "cloudflare_api_get",
                    return_value=[candidate(is_skipped, commit_dirty)],
                ):
                    actual = resolver.cloudflare_pages_deployment(
                        "account",
                        "project",
                        TARGET_SHA,
                        "token",
                        "production",
                    )
                self.assertEqual(actual, {})

    def test_production_worker_metadata_accepts_authenticated_exact_version(
        self,
    ) -> None:
        args = SimpleNamespace(
            repository="yusuf38bcs-oss/yusuf38bcs-oss.github.io",
            pr_number="",
            pages_environment="production",
            cloudflare_account_id="account",
            cloudflare_pages_project="project",
            cloudflare_worker_script="synapticai-proxy",
            pages_override="",
            worker_override="",
            site_config="_data/ai.yml",
        )

        with (
            patch.dict(os.environ, {"CLOUDFLARE_API_TOKEN": "token"}),
            patch.object(resolver, "github_comments") as comments,
            patch.object(
                resolver,
                "cloudflare_pages_deployment",
                return_value={},
            ),
            patch.object(
                resolver,
                "cloudflare_worker_version_for_sha",
                return_value=VERSION_ID,
            ),
            patch.object(
                resolver,
                "configured_worker_endpoint",
                return_value="https://api.learningbiologyforlife.org/api/health",
            ),
        ):
            result = resolver.resolve_once(args, TARGET_SHA)

        comments.assert_not_called()
        self.assertEqual(result["worker"]["version_id"], VERSION_ID)
        self.assertTrue(result["worker"]["metadata_exact_head"])

    def test_preview_worker_metadata_still_requires_trusted_comment_url(
        self,
    ) -> None:
        args = SimpleNamespace(
            repository="yusuf38bcs-oss/yusuf38bcs-oss.github.io",
            pr_number="240",
            pages_environment="preview",
            cloudflare_account_id="account",
            cloudflare_pages_project="project",
            cloudflare_worker_script="synapticai-proxy",
            pages_override="",
            worker_override="",
            site_config="_data/ai.yml",
        )

        with (
            patch.dict(os.environ, {"CLOUDFLARE_API_TOKEN": "token"}),
            patch.object(resolver, "github_comments", return_value=[]) as comments,
            patch.object(
                resolver,
                "cloudflare_pages_deployment",
                return_value={},
            ),
            patch.object(
                resolver,
                "cloudflare_worker_version_for_sha",
                return_value=VERSION_ID,
            ),
            patch.object(
                resolver,
                "configured_worker_endpoint",
                return_value="https://api.learningbiologyforlife.org/api/health",
            ),
        ):
            result = resolver.resolve_once(args, TARGET_SHA)

        comments.assert_called_once()
        self.assertEqual(result["worker"]["version_id"], VERSION_ID)
        self.assertFalse(result["worker"]["metadata_exact_head"])


if __name__ == "__main__":
    unittest.main()
