import importlib.util
from pathlib import Path
import unittest
from urllib.parse import parse_qs, urlsplit

spec = importlib.util.spec_from_file_location('reader', Path(__file__).with_name('resolve-pages-preview-reader.py'))
reader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reader)
SHA = 'a' * 40
PATH = '/accounts/account/pages/projects/project/deployments?env=preview&per_page=25'


def deployment(index, sha='b' * 40):
    return {'id': str(index), 'environment': 'preview', 'is_skipped': False,
            'latest_stage': {'status': 'success'}, 'url': 'https://test.example.pages.dev',
            'deployment_trigger': {'metadata': {'commit_hash': sha, 'commit_dirty': False}}}


class Pagination(unittest.TestCase):
    def test_exact_sha_on_second_page_is_verified_by_original_resolver(self):
        calls = []
        def get(path, token):
            calls.append(path)
            return [deployment(i) for i in range(25)] if len(calls) == 1 else [deployment(26, SHA)]
        original = reader.resolver.cloudflare_api_get
        reader.resolver.cloudflare_api_get = lambda path, token: reader.preview_records(get, path, token, SHA)
        try:
            result = reader.resolver.cloudflare_pages_deployment('account', 'project', SHA, 'fixture')
        finally:
            reader.resolver.cloudflare_api_get = original
        self.assertEqual(result['commit_hash'], SHA)
        self.assertEqual(len(calls), 2)
        self.assertEqual(parse_qs(urlsplit(calls[1]).query)['page'], ['2'])

    def test_repeated_full_page_fails_closed(self):
        with self.assertRaises(SystemExit):
            reader.preview_records(lambda *_: [deployment(i) for i in range(25)], PATH, 'fixture', SHA)

    def test_invalid_exact_candidate_does_not_end_search(self):
        bad = deployment(0, SHA); bad['is_skipped'] = True
        calls = []
        def get(path, token):
            calls.append(path)
            return [bad] + [deployment(i) for i in range(1, 25)] if len(calls) == 1 else [deployment(26, SHA)]
        self.assertEqual(len(reader.preview_records(get, PATH, 'fixture', SHA)), 26)
        self.assertEqual(len(calls), 2)

    def test_empty_error_result_never_invents_exact_metadata(self):
        self.assertEqual(reader.preview_records(lambda *_: {}, PATH, 'fixture', SHA), [])

    def test_production_and_worker_calls_are_unchanged(self):
        for path in ['/accounts/a/pages/projects/p', '/accounts/a/workers/scripts/w/versions', '/accounts/a/pages/projects/p/deployments?env=production']:
            calls = []
            result = reader.preview_records(lambda p, t: calls.append((p, t)) or {'original': True}, path, 'fixture', SHA)
            self.assertEqual(result, {'original': True})
            self.assertEqual(calls, [(path, 'fixture')])

    def test_scan_limit_remains_pending_for_outer_poll(self):
        calls = []
        def get(path, token):
            calls.append(path)
            return [deployment(len(calls) * 25 + i) for i in range(25)]
        self.assertEqual(reader.preview_records(get, PATH, 'fixture', SHA), [])
        self.assertEqual(len(calls), 100)

    def test_full_sha_comment_cannot_substitute_for_api_metadata(self):
        result = {'pages': {'exact_head': True, 'source': 'cloudflare_full_sha_commit_comment', 'commit_claim': SHA}}
        self.assertFalse(reader.enforce_api_identity(result, SHA)['pages']['exact_head'])

    def test_api_metadata_requires_all_identity_fields(self):
        fields = {'source': 'cloudflare_pages_preview_deployment_api_full_sha', 'deployed_sha': SHA, 'deployment_id': 'uuid', 'environment': 'preview', 'status': 'success'}
        self.assertTrue(reader.enforce_api_identity({'pages': dict(fields)}, SHA)['pages']['exact_head'])
        for key in fields:
            missing = dict(fields); missing.pop(key)
            self.assertFalse(reader.enforce_api_identity({'pages': missing}, SHA)['pages']['exact_head'])


if __name__ == '__main__':
    unittest.main()
