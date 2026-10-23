#!/usr/bin/env node
// Non-authorizing static containment tests; never import untrusted publication code.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../workflows/conv04f-zoology-practical-museum-certification.yml', import.meta.url), 'utf8');
const runner = readFileSync(new URL('../workflows/yesaf-museum-no-publisher-tests.yml', import.meta.url), 'utf8');
function defects(s) {
  const bad = [], h = s.split('\npermissions:\n')[0];
  if (!/\non:\n  pull_request:\n/.test(h) || !/\n  workflow_dispatch:\n/.test(h) ||
      /\n  (?:push|pull_request_target|workflow_run|schedule):\n/.test(h)) bad.push('TRIGGER');
  if (!/\npermissions:\n  contents: read\n/.test(s) ||
      /^\s+(?:pages|id-token|contents): write\s*$/m.test(s)) bad.push('PERMISSIONS');
  if (/CLOUDFLARE_(?:PAGES_DEPLOY_TOKEN|API_TOKEN)|secrets\.(?:CF_API_TOKEN|CLOUDFLARE_TOKEN)|wrangler.*pages deploy|actions\/deploy-pages@|cloudflare\/wrangler-action|curl[^\n]*-X (?:POST|PUT|DELETE)/i.test(s)) bad.push('WRITER_OR_SECRET');
  if (/\n  preview:\n|\n  preview_deploy:\n|\n    needs: \[preview\]/.test(s) ||
      !/\n  certify:\n/.test(s)) bad.push('PREVIEW_DEPENDENCY');
  if (!/github\.event_name == 'pull_request' \|\| github\.event_name == 'workflow_dispatch'/.test(s)) bad.push('EVENT');
  for (const marker of [
    'bundle exec jekyll build --trace',
    'validate-conv04f-zoology-practical-museum.rb',
    'conv04f-zoology-practical-museum-browser-certification.mjs',
    'upload-artifact@v4',
    'Authenticate exact head and live base',
  ]) if (!s.includes(marker)) bad.push('LOST_CERTIFICATION:' + marker);
  return bad;
}
test('no Museum PR-triggered Cloudflare Pages writer; retained academic/browser certification', () => {
  assert.deepEqual(defects(src), []);
});
const mutations = [
  ['main push publisher', s => s.replace('\n  workflow_dispatch:', '\n  push:\n    branches: [main]\n  workflow_dispatch:')],
  ['Cloudflare credential exposure', s => s + '\n# secrets.CLOUDFLARE_PAGES_DEPLOY_TOKEN\n'],
  ['Wrangler writer', s => s + '\n# wrangler pages deploy _site --branch main\n'],
  ['Pages write permission', s => s.replace('  contents: read\n', '  contents: read\n  pages: write\n')],
  ['preview job returned', s => s + '\n  preview:\n    runs-on: ubuntu-latest\n'],
  ['lost Jekyll build', s => s.replaceAll('bundle exec jekyll build --trace', 'echo skipped')],
  ['lost browser certification', s => s.replaceAll('conv04f-zoology-practical-museum-browser-certification.mjs', 'omitted')],
  ['lost exact head base authentication', s => s.replaceAll('Authenticate exact head and live base', 'omitted')],
  ['write-scoped token', s => s.replace('  contents: read\n', '  contents: write\n')],
  ['lost owner manual certification', s => s.replace('\n  workflow_dispatch:\n', '\n  workflow_dispatch_disabled:\n')],
  ['preview deployment job restored', s => s + '\n  preview_deploy:\n    runs-on: ubuntu-latest\n'],
];
for (const [name, mutate] of mutations) {
  test('negative: ' + name, () => {
    const tampered = mutate(src);
    assert.notEqual(tampered, src, 'mutation must have changed fixture');
    assert.notDeepEqual(defects(tampered), [], 'must fail closed');
  });
}
test('static test runner cannot publish or obtain production secrets', () => {
  assert.match(runner, /pull_request:/);
  assert.match(runner, /permissions:\s*\n\s+contents: read/);
  assert.match(runner, /persist-credentials: false/);
  assert.match(runner, /node --test \.github\/scripts\/test-yesaf-museum-no-publisher\.mjs/);
  assert.doesNotMatch(runner, /pull_request_target:|pages: write|id-token: write|secrets\.|wrangler|deploy-pages@/);
});
test('academic contract and 24 Node browser regression remain in workflow', () => {
  assert.match(src, /ruby-version: "3\.2"/);
  assert.match(src, /node-version: "24"/);
  assert.match(src, /ruby scripts\/zoology\/validate_practical_213106\.rb/);
  assert.match(src, /python3 scripts\/academic\/validate_botany_learner_content\.py/);
});
