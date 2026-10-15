#!/usr/bin/env python3
"""Fail-closed production reader adapter; preserve the prior resolver."""
import importlib.util
import os
from pathlib import Path
import sys
import urllib.error

spec = importlib.util.spec_from_file_location(
    "trusted_targets", Path(__file__).with_name("resolve-cloudflare-targets.py")
)
resolver = importlib.util.module_from_spec(spec)
spec.loader.exec_module(resolver)
original_resolve_once = resolver.resolve_once


def reader_get(path, _legacy_token):
    # Never let a generic or deploy-capable token escape into verification.
    if "/pages/" in path:
        key = "CLOUDFLARE_PAGES_READ_TOKEN"
    elif "/workers/" in path or "/builds/" in path:
        key = "CLOUDFLARE_WORKER_READ_TOKEN"
    else:
        raise SystemExit("Unsupported Cloudflare certification metadata endpoint")

    selected = os.environ.get(key, "")
    if not selected:
        raise SystemExit(f"Required read-only credential {key} is missing")

    try:
        return original_get_strict(path, selected)
    except urllib.error.HTTPError as error:
        # Workers Builds is an OPTIONAL provenance path. Some read-only tokens
        # cannot call its API. The resolver must then prove an exact SHA using
        # the independently read Worker version annotations, or return no match.
        if error.code in (401, 403) and "/builds/" in path:
            print(
                "Optional Workers Builds metadata inaccessible to read-only "
                "credential; exact Worker version annotation is required.",
                file=sys.stderr,
            )
            return {}
        if error.code in (401, 403):
            raise SystemExit(
                f"Cloudflare metadata permission failure: HTTP {error.code} "
                f"for {path}; check reader account/resource scope."
            ) from None
        return {}


def original_get_strict(path, token):
    if not token:
        return {}
    import json
    import urllib.request

    request = urllib.request.Request(
        "https://api.cloudflare.com/client/v4" + path,
        headers={"Accept": "application/json", "Authorization": "Bearer " + token},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.load(response)
    return payload.get("result", {}) if payload.get("success") is True else {}


def resolve_with_readers(args, sha):
    pages = os.environ.get("CLOUDFLARE_PAGES_READ_TOKEN", "")
    worker = os.environ.get("CLOUDFLARE_WORKER_READ_TOKEN", "")
    if not pages or not worker:
        raise SystemExit(
            "Production certification requires both distinct Pages and Worker "
            "read-only credential bindings; no legacy-token fallback."
        )

    # The predecessor resolver has a nonempty legacy-token presence gate.
    # The temporary value is only a compatibility marker: all API reads are
    # routed through reader_get, which ignores the original token argument.
    previous = os.environ.get("CLOUDFLARE_API_TOKEN")
    os.environ["CLOUDFLARE_API_TOKEN"] = pages
    try:
        return original_resolve_once(args, sha)
    finally:
        if previous is None:
            os.environ.pop("CLOUDFLARE_API_TOKEN", None)
        else:
            os.environ["CLOUDFLARE_API_TOKEN"] = previous


resolver.resolve_once = resolve_with_readers
resolver.cloudflare_api_get = reader_get
if __name__ == "__main__":
    raise SystemExit(resolver.main())
