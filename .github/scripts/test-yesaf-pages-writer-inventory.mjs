import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectWorkflow, inventory } from './yesaf-pages-writer-inventory.mjs';

const prod = [
  'name: Zoology parity',
  'on:',
  '  push:',
  '    branches: ["main"]',
  'jobs:',
  '  production:',
  '    steps:',
  '      - name: Deploy',
  '        env:',
  '          CLOUDFLARE_API_TOKEN: secrets.CLOUDFLARE_API_TOKEN',
  '        run: |',
  '          npx --yes wrangler@4.147.0 pages deploy _site \\',
  '            --project-name yusuf38bcs-oss-github-io \\',
  '            --branch main \\',
  '            --commit-hash "$TARGET_SHA"',
].join('\n') + '\n';
test('explicit main Wrangler publisher is classified as production authority', () => {
  const found = inspectWorkflow('r101.yml', prod);
  assert.equal(found.classification, 'PRODUCTION_WRITER_CAPABILITY');
  assert.equal(found.hasNamedCloudflareCredential, true);
  assert.equal(found.hasPushMainTrigger, true);
});
test('dynamic branch preview is not falsely identified as confirmed main writer', () => {
  const found = inspectWorkflow('preview.yml', prod.replace('--branch main', '--branch "$TARGET_BRANCH"'));
  assert.equal(found.classification, 'PREVIEW_OR_DYNAMIC_WRITER_REVIEW');
  assert.deepEqual(found.declaredTargets, ['dynamic-branch']);
});
test('source comments are not executable publishing instructions', () => {
  const found = inspectWorkflow('notes.yml', 'name: Notes\n# wrangler pages deploy _site --branch main\njobs:\n  build:\n    run: echo noop\n');
  assert.equal(found, null);
});
test('build-only GitHub Pages action does not count as Cloudflare Pages writer', () => {
  assert.equal(inspectWorkflow('jekyll.yml', 'name: Deploy GitHub Pages\nuses: actions/deploy-pages@v5'), null);
});
test('multiple production-capable workflows count independently and decision remains HOLD', () => {
  const report = inventory({ 'r91.yml':prod, 'r101.yml':prod, 'preview.yml': prod.replace('--branch main', '--branch "$TARGET_BRANCH"')});
  assert.equal(report.potential_production_writers, 2);
  assert.equal(report.paths.length, 3);
  assert.equal(report.authority_decision, 'HOLD');
  assert.equal(report.observed_live_writers_certified, false);
});
test('empty inventory is not falsely promoted into single-writer certification', () => {
  const report = inventory({});
  assert.equal(report.potential_production_writers, 0);
  assert.equal(report.authority_decision, 'HOLD');
  assert.equal(report.observed_live_writers_certified, false);
});
