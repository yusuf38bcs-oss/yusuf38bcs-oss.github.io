#!/usr/bin/env python3
"""Production reader adapter; preserve the immutable predecessor resolver."""
import importlib.util
import os
from pathlib import Path
import urllib.error

spec = importlib.util.spec_from_file_location("trusted_targets", Path(__file__).with_name("resolve-cloudflare-targets.py"))
resolver = importlib.util.module_from_spec(spec)
spec.loader.exec_module(resolver)
original_get = resolver.cloudflare_api_get

def reader_get(path, token):
    key = "CLOUDFLARE_PAGES_READ_TOKEN" if "/pages/" in path else "CLOUDFLARE_WORKER_READ_TOKEN"
    selected = os.environ.get(key) or token
    try:
        return original_get_strict(path, selected)
    except urllib.error.HTTPError as error:
        if error.code in (401, 403):
            raise SystemExit(f"Cloudflare metadata permission failure: HTTP {error.code} for {path}; check reader account/resource scope.") from None
        return {}

def original_get_strict(path, token):
    if not token:
        return {}
    import json, urllib.request
    request = urllib.request.Request("https://api.cloudflare.com/client/v4" + path,
        headers={"Accept": "application/json", "Authorization": "Bearer " + token})
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.load(response)
    return payload.get("result", {}) if payload.get("success") is True else {}

resolver.cloudflare_api_get = reader_get
if __name__ == "__main__":
    raise SystemExit(resolver.main())
