import test from 'node:test';
import assert from 'node:assert/strict';
import { findPagesWriters, report } from './yesaf-pages-writer-inventory.mjs';

const file = (path, content) => ({ path, content });
const writer = [
  'name: Field Report Parity',
  'on:',
  '  push:',
  '    branches: ["main"]',
  'permissions:',
  '  contents: read',
  'jobs:',
  '  production:',
  '    steps:',
  '      - name: Deploy',
  '        env:',
  '          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}',
  '        run: wrangler pages deploy _site --project-name "$PROJECT" --branch main',
].join('\n');

test('detects explicit main-push Wrangler Pages writer', () => {
  const found = findPagesWriters([file('field.yml', writer)]);
  assert.equal(found.length, 1);
  assert.equal(found[0].main_push_trigger, true);
  assert.equal(found[0].credential_reference, true);
  assert.equal(found[0].write_capability, 'WRANGLER_PAGES_DEPLOY');
});

test('detects Wrangler at a pinned binary path', () => {
  assert.equal(findPagesWriters([
    file('pin.yml', 'run: "$RUNNER_TEMP/wrangler-tool/node_modules/.bin/wrangler" pages deploy _site --branch main'),
  ]).length, 1);
});

test('detects explicit Pages deployment API writer', () => {
  const x = findPagesWriters([file('api.yml',
    'run: curl -X POST https://api.cloudflare.com/client/v4/accounts/abc/pages/projects/p/deployments')]);
  assert.equal(x[0]?.write_capability, 'DIRECT_PAGES_DEPLOYMENT_API');
});

test('does not mistake read-only metadata and site checks for publishers', () => {
  const x = findPagesWriters([file('reader.yml',
    'run: curl -fsS https://api.cloudflare.com/client/v4/accounts/abc/pages/projects/p/deployments')]);
  assert.equal(x.length, 0);
});

test('commented-out deployment command does not constitute active capability', () => {
  const x = findPagesWriters([file('comment.yml',
    'run: |\n  # wrangler pages deploy _site\n  echo read-only')]);
  assert.equal(x.length, 0);
});

test('report always preserves production cutover HOLD', () => {
  for (const files of [[], [file('writer.yml', writer)]]) {
    const x = report(files);
    assert.equal(x.production_cutover, 'HOLD');
    assert.equal(x.mandatory_gate, 'NOT_AUTHORIZED_BY_THIS_SHADOW_REPORT');
  }
});

test('inventory results are sorted for stable forensic diffs', () => {
  const x = findPagesWriters([file('z.yml', writer), file('a.yml', writer)]);
  assert.deepEqual(x.map(z => z.path), ['a.yml', 'z.yml']);
});


test('distinguishes PR-only preview publisher from main production writer', () => {
  const preview = [
    'name: Museum Preview',
    'on:',
    '  pull_request:',
    '    branches: ["main"]',
    '  workflow_dispatch:',
    'jobs:',
    '  preview:',
    "    if: ${{ github.event_name == 'pull_request' }}",
    '    env:',
    '      TARGET_BRANCH: ${{ github.event.pull_request.head.ref }}',
    '    run: npx wrangler pages deploy _site --branch "$TARGET_BRANCH"',
  ].join('\n');
  const result = report([file('preview.yml', preview), file('production.yml', writer)]);
  assert.equal(result.pages_write_paths, 2);
  assert.equal(result.potential_production_writers, 1);
  assert.equal(result.preview_publish_paths, 1);
  assert.equal(result.candidates[0].writer_class, 'PR_PREVIEW_WRITE_CAPABILITY');
  assert.equal(result.candidates[1].writer_class, 'PRODUCTION_CAPABLE_WRITE');
  assert.equal(result.production_cutover, 'HOLD');
});
