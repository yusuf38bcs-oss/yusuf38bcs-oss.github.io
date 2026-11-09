#!/usr/bin/env python3
"""Pure source-level shadow test. This never calls Cloudflare or GitHub APIs."""
from pathlib import Path
w = Path(".github/workflows/ops-verify-pages-artifact.yml").read_text(encoding="utf-8")
required = [
    'name: Verify Pages Build and Optional Cache Purge',
    'DENY cache purge mutation in verification workflow',
    "github.event_name == 'workflow_dispatch' && inputs.purge_cache",
    'Cache purging is prohibited here;',
    'permissions:\n  contents: read\n  actions: read',
    'exit 1',
]
for x in required:
    assert x in w, f"HOLD: missing read-only contract {x!r}"
for x in [
    'secrets.CLOUDFLARE_API_TOKEN','secrets.CF_API_TOKEN',
    'secrets.CLOUDFLARE_TOKEN','secrets.CLOUDFLARE_ZONE_ID',
    'secrets.CF_ZONE_ID','/purge_cache','curl -fsS -X POST',
    'cf_token=', 'wrangler pages deploy',
]:
    assert x not in w, f"HOLD: legacy cache writer or write-capable secret reference: {x}"
assert w.index('DENY cache purge mutation') < w.index('Resolve target SHA')
print("YESAF_E7_OPS_READONLY_SHADOW=PASS (no Cloudflare write credentials/paths)")
