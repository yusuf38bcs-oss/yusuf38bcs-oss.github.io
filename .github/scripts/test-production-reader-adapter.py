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
print("Production reader wiring without legacy token: PASS")
