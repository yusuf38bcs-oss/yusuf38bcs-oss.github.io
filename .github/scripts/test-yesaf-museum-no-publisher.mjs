#!/usr/bin/env node
// Additive unprivileged Museum successor; old F-09 workflow must remain immutable.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const successor = readFileSync(new URL('../workflows/yesaf-museum-readonly-certification.yml', import.meta.url), 'utf8');
const legacy = readFileSync(new URL('../workflows/conv04f-zoology-practical-museum-certification.yml', import.meta.url), 'utf8');
const runner = readFileSync(new URL('../workflows/yesaf-museum-no-publisher-tests.yml', import.meta.url), 'utf8');
const PINNED_OLD_BLOB = '3d13e59f5401aaf42a3459e997399014924a9b5a';
function gitBlobSha(text) {
  return createHash('sha1').update('blob ' + Buffer.byteLength(text, 'utf8') + '\0' + text).digest('hex');
}
function defects(s) {
  const bad = [], h = s.split('\npermissions:\n')[0];
  if (!/\non:\n  pull_request:\n/.test(h) || !/\n  workflow_dispatch:\n/.test(h) ||
      /\n  (?:push|pull_request_target|workflow_run|schedule):\n/.test(h)) bad.push('TRIGGER');
  if (!/\npermissions:\n  contents: read\n/.test(s) ||
      /^\s+(?:pages|id-token|contents): write\s*$/m.test(s)) bad.push('PERMISSIONS');
  if (/CLOUDFLARE_(?:PAGES_DEPLOY_TOKEN|API_TOKEN)|secrets\.(?:CF_API_TOKEN|CLOUDFLARE_TOKEN)|wrangler.*pages deploy|actions\/deploy-pages@|cloudflare\/wrangler-action|curl[^\n]*-X (?:POST|PUT|DELETE)/i.test(s)) bad.push('WRITER_SECRET');
  if (/\n  preview:\n|\n  preview_deploy:\n|\n    needs: \[preview\]/.test(s) ||
      !/\n  certify:\n/.test(s)) bad.push('PREVIEW');
  if (!/github\.event_name == 'pull_request' \|\| github\.event_name == 'workflow_dispatch'/.test(s)) bad.push('CERT_EVENT');
  for (const marker of [
    'bundle exec jekyll build --trace',
    'validate-conv04f-zoology-practical-museum.rb',
    'conv04f-zoology-practical-museum-browser-certification.mjs',
    'upload-artifact@v4',
    'Authenticate exact head and live base',
  ]) if (!s.includes(marker)) bad.push('LOST_CERT:' + marker);
  return bad;
}
test('legacy F-09 protected workflow bytes are identical to protected-main Git blob', () => {
  assert.equal(gitBlobSha(legacy), PINNED_OLD_BLOB);
});
test('additive successor retains science/browser exact-head checks without any Cloudflare writer', () => {
  assert.deepEqual(defects(successor), []);
});
const mutations = [
  ['push publishing trigger', s => s.replace('\n  workflow_dispatch:', '\n  push:\n    branches: [main]\n  workflow_dispatch:')],
  ['Cloudflare writer credential', s => s + '\n# secrets.CLOUDFLARE_PAGES_DEPLOY_TOKEN\n'],
  ['Wrangler Pages production command', s => s + '\n# wrangler pages deploy _site --branch main\n'],
  ['Pages elevated permission', s => s.replace('  contents: read\n', '  contents: read\n  pages: write\n')],
  ['preview job restored', s => s + '\n  preview:\n    runs-on: ubuntu-latest\n'],
  ['scientific Jekyll build removed', s => s.replaceAll('bundle exec jekyll build --trace', 'omitted build')],
  ['browser certification removed', s => s.replaceAll('conv04f-zoology-practical-museum-browser-certification.mjs', 'omitted')],
  ['exact-head verification removed', s => s.replaceAll('Authenticate exact head and live base', 'omitted')],
  ['write permission substituted', s => s.replace('  contents: read\n', '  contents: write\n')],
  ['manual event removed', s => s.replace('\n  workflow_dispatch:\n', '\n  workflow_dispatch_disabled:\n')],
  ['preview deployment job reintroduced', s => s + '\n  preview_deploy:\n    runs-on: ubuntu-latest\n'],
];
for (const [name, mutate] of mutations) test('negative: ' + name, () => {
  const bad = mutate(successor);
  assert.notEqual(bad, successor, 'fixture must change the source');
  assert.notDeepEqual(defects(bad), [], 'must fail closed');
});
test('mutation of protected legacy workflow detected by blob binding', () => {
  assert.notEqual(gitBlobSha(legacy + '\n'), PINNED_OLD_BLOB);
});
test('test-runner is unprivileged and verifies exact PR head', () => {
  assert.match(runner, /pull_request:/);
  assert.match(runner, /permissions:\s*\n\s+contents: read/);
  assert.match(runner, /persist-credentials: false/);
  assert.match(runner, /node --test \.github\/scripts\/test-yesaf-museum-no-publisher\.mjs/);
  assert.doesNotMatch(runner, /pull_request_target:|pages: write|id-token: write|secrets\.|wrangler|deploy-pages@/);
});
test('successor preserves Ruby 3.2, Node 24 and Practical-213106 scientific validation', () => {
  assert.match(successor, /ruby-version: "3\.2"/);
  assert.match(successor, /node-version: "24"/);
  assert.match(successor, /ruby scripts\/zoology\/validate_practical_213106\.rb/);
  assert.match(successor, /python3 scripts\/academic\/validate_botany_learner_content\.py/);
});


// P2 regression: original F-09 PR path trigger set is an exact security contract.
// These checks fail closed if a protected original dependency is not monitored.
function museumPaths(yaml) {
  const lines = yaml.split('\n');
  const index = lines.indexOf('    paths:');
  if (index < 0) return null;
  const entries = [];
  for (const line of lines.slice(index + 1)) {
    const match = line.match(/^      - "([^"]+)"$/);
    if (!match) break;
    entries.push(match[1]);
  }
  return entries.length ? entries : null;
}
const originalTriggers = museumPaths(legacy);
const successorYamlPath = '.github/workflows/yesaf-museum-readonly-certification.yml';
const fixturesScriptPath = '.github/scripts/test-yesaf-museum-no-publisher.mjs';
const fixturesRunnerPath = '.github/workflows/yesaf-museum-no-publisher-tests.yml';
function pathCoverageDefects(yaml, expected) {
  const observed = museumPaths(yaml);
  if (!observed) return ['MISSING_EXACT_PATH_LIST'];
  const violations = [];
  if (observed.length !== expected.length) violations.push('COUNT_MISMATCH');
  if (new Set(observed).size !== observed.length) violations.push('DUPLICATE_PATH');
  for (const required of expected) if (!observed.includes(required)) violations.push('MISSING:' + required);
  for (const actual of observed) if (!expected.includes(actual)) violations.push('UNEXPECTED:' + actual);
  if (observed.some(x => x.includes('*') || x.endsWith('/'))) violations.push('BROAD_GLOB');
  return violations;
}
const expectedSuccessorTriggers = [...originalTriggers, successorYamlPath];
const expectedRunnerTriggers = [...originalTriggers, successorYamlPath, fixturesScriptPath, fixturesRunnerPath];
test('P2 original Museum F-09 trigger inventory remains immutable: 17 exact paths', () => {
  assert.equal(gitBlobSha(legacy), PINNED_OLD_BLOB);
  assert.equal(originalTriggers.length, 17);
  assert.equal(new Set(originalTriggers).size, 17);
});
test('P2 academic successor exactly matches all predecessor protected PR triggers', () => {
  assert.deepEqual(pathCoverageDefects(successor, expectedSuccessorTriggers), []);
});
test('P2 security-fixture runner exactly monitors all predecessor protected PR triggers', () => {
  assert.deepEqual(pathCoverageDefects(runner, expectedRunnerTriggers), []);
});
for (const protectedPath of originalTriggers) {
  for (const [label, contents, expected] of [
    ['science', successor, expectedSuccessorTriggers],
    ['fixtures', runner, expectedRunnerTriggers],
  ]) {
    const exactLine = '      - "' + protectedPath + '"\n';
    test('negative: removal of protected ' + label + ' trigger ' + protectedPath, () => {
      assert.ok(contents.includes(exactLine));
      assert.ok(pathCoverageDefects(contents.replace(exactLine, ''), expected).some(s => s.startsWith('MISSING:')));
    });
    test('negative: rename of protected ' + label + ' trigger ' + protectedPath, () => {
      assert.ok(contents.includes(exactLine));
      assert.ok(pathCoverageDefects(contents.replace(exactLine, '      - "untrusted/renamed-path"\n'), expected).length > 0);
    });
  }
}
for (const [label, contents, expected] of [
  ['science', successor, expectedSuccessorTriggers],
  ['fixtures', runner, expectedRunnerTriggers],
]) {
  const first = '      - "' + originalTriggers[0] + '"\n';
  test('negative: duplicate original ' + label + ' trigger', () => {
    assert.ok(pathCoverageDefects(contents.replace(first, first + first), expected).includes('DUPLICATE_PATH'));
  });
  test('negative: wildcard original ' + label + ' trigger', () => {
    assert.ok(pathCoverageDefects(contents.replace(first, '      - "**"\n'), expected).length > 0);
  });
  test('negative: original ' + label + ' paths key disabled', () => {
    assert.ok(pathCoverageDefects(contents.replace('    paths:\n', '    paths_disabled:\n'), expected).length > 0);
  });
}
