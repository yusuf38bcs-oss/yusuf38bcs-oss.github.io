#!/usr/bin/env python3
"""Paginate preview metadata without editing the immutable legacy resolver."""
import importlib.util
from pathlib import Path
import sys
import urllib.parse

spec = importlib.util.spec_from_file_location('legacy_targets', Path(__file__).with_name('resolve-cloudflare-targets.py'))
resolver = importlib.util.module_from_spec(spec)
spec.loader.exec_module(resolver)


def preview_records(get, path, token, sha):
    parsed = urllib.parse.urlsplit(path)
    query = dict(urllib.parse.parse_qsl(parsed.query))
    if not parsed.path.endswith('/deployments') or '/pages/projects/' not in parsed.path or query.get('env') != 'preview':
        return get(path, token)
    records = []
    seen = set()
    for page in range(1, 101):
        query.update(page=page, per_page=25)
        result = get(parsed.path + '?' + urllib.parse.urlencode(query), token)
        current = resolver.as_records(result, 'deployments')
        if not current:
            return records
        fingerprint = tuple(str(item.get('id', '')) for item in current)
        if fingerprint in seen:
            raise SystemExit('Preview metadata pagination repeated a page; no certification issued.')
        seen.add(fingerprint)
        records.extend(current)
        for item in current:
            metadata = (item.get('deployment_trigger') or {}).get('metadata') or {}
            if (metadata.get('commit_hash') == sha and metadata.get('commit_dirty') is False
                    and item.get('environment') == 'preview' and item.get('is_skipped') is False
                    and (item.get('latest_stage') or {}).get('status') == 'success'
                    and resolver.cloudflare_url(item.get('url'), '.pages.dev')):
                return records
        if len(current) < 25:
            return records
    # A new preview may not exist yet. Leave it pending so the workflow can poll
    # again, rather than terminating before Cloudflare finishes the build.
    print('Preview metadata scan limit reached; exact preview remains pending.', file=sys.stderr)
    return []


def enforce_api_identity(result, sha):
    pages = result['pages']
    pages['exact_head'] = bool(
        pages.get('source') == 'cloudflare_pages_preview_deployment_api_full_sha'
        and pages.get('deployed_sha') == sha and pages.get('deployment_id')
        and pages.get('environment') == 'preview' and pages.get('status') == 'success'
    )
    return result


def main():
    if '--sha' not in sys.argv:
        raise SystemExit('An exact --sha is required.')
    sha = sys.argv[sys.argv.index('--sha') + 1]
    if not resolver.FULL_SHA_RE.fullmatch(sha):
        raise SystemExit('An exact 40-character lowercase --sha is required.')
    original_get = resolver.cloudflare_api_get
    original_once = resolver.resolve_once
    resolver.cloudflare_api_get = lambda path, token: preview_records(original_get, path, token, sha)
    resolver.resolve_once = lambda args, target: (
        enforce_api_identity(original_once(args, target), target)
        if args.pages_environment == 'preview' else original_once(args, target)
    )
    return resolver.main()


if __name__ == '__main__':
    raise SystemExit(main())
