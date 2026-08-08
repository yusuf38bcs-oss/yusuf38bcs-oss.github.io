#!/usr/bin/env python3
"""Fixture tests for trusted Cloudflare preview resolution."""

from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path
from typing import Any


SCRIPT = Path(__file__).with_name("resolve-cloudflare-targets.py")
SPEC = importlib.util.spec_from_file_location("resolve_cloudflare_targets", SCRIPT)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("Could not load resolve-cloudflare-targets.py")
resolver = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(resolver)

TARGET_SHA = "a6af620338baa5a7d3f232dc955f8122133c5da9"
BOT = {"login": "cloudflare-workers-and-pages[bot]"}


class ResolveCloudflareTargetsTest(unittest.TestCase):
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

    def test_worker_builds_api_queries_one_version_at_a_time(self) -> None:
        version_one = "11111111-1111-1111-1111-111111111111"
        version_two = "22222222-2222-2222-2222-222222222222"
        calls: list[str] = []

        def fake_get(path: str, token: str) -> Any:
            calls.append(path)
            if path.endswith("/deployments"):
                return {
                    "deployments": [
                        {
                            "versions": [
                                {"percentage": 100, "version_id": version_one},
                                {"percentage": 100, "version_id": version_two},
                            ]
                        }
                    ]
                }
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


if __name__ == "__main__":
    unittest.main()
