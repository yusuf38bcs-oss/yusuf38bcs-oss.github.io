#!/usr/bin/env node
// Unprivileged G1 regression suite; checks proposed YAML as inert source.
// These tests do NOT authorize production publication or publish a trusted status.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pages = readFileSync(new URL('../workflows/jekyll-gh-pages.yml', import.meta.url), 'utf8');
const ops = readFileSync(new URL('../workflows/ops-verify-pages-artifact.yml', import.meta.url), 'utf8');
const runner = readFileSync(new URL('../workflows/yesaf-g1-pages-publisher-tests.yml', import.meta.url), 'utf8');

function jobBlock(doc, name) {
  const start = doc.indexOf('\n  ' + name + ':\n');
  assert.ok(start >= 0, 'Missing job ' + name);
  const tail = doc.slice(start + 1);
  const end = tail.slice(3).search(/^  [a-z][a-z0-9_-]*:\n/m);
  return end === -1 ? tail : tail.slice(0, end + 3);
}
function triggers(doc) {
  return doc.split('\npermissions:\n')[0];
}
function defects(pub, verifier) {
  const issues = [];
  const header = triggers(pub);
  const authorize = jobBlock(pub, 'authorize');
  const build = jobBlock(pub, 'build');
  const deploy = jobBlock(pub, 'deploy');
  if (!/^\s{2}workflow_dispatch:\s*$/m.test(header)) issues.push('MISSING_MANUAL_EVENT');
  if (/^\s{2}(push|pull_request|pull_request_target|workflow_run|schedule):/m.test(header)) issues.push('AUTO_PUBLISH_TRIGGER');
  if (!/expected_main_sha:\n\s+description:.*\n\s+required: true\n\s+type: string/m.test(header)) issues.push('MISSING_EXACT_SHA_INPUT');
  if (!/GITHUB_EVENT_NAME.*workflow_dispatch/.test(authorize) || !/GITHUB_REF.*refs\/heads\/main/.test(authorize)) issues.push('BAD_REF_EVENT');
  if (!/DISPATCH_ACTOR.*yusuf38bcs-oss/.test(authorize) || !/RERUN_ACTOR.*yusuf38bcs-oss/.test(authorize)) issues.push('OWNER_GATE_MISSING');
  if (!/EXPECTED_MAIN_SHA.*\^\[0-9a-f\]\{40\}\$/.test(authorize) || !/DISPATCH_SHA.*EXPECTED_MAIN_SHA/.test(authorize)) issues.push('EXACT_SHA_GUARD_MISSING');
  if (!/git ls-remote/.test(authorize) || !/live_main.*EXPECTED_MAIN_SHA/.test(authorize)) issues.push('LIVE_MAIN_PRECHECK_MISSING');
  // Important: manual-release source must be the event commit, never an input-controlled ref.
  const checkout = build.split('      - name: Checkout immutable workflow event SHA\n')[1]?.split('\n      - name:')[0] ?? '';
  if (!/needs: authorize/.test(build) ||
      !/uses: actions\/checkout@v4/.test(checkout) ||
      !/persist-credentials: false/.test(checkout) ||
      /^\s*ref:/m.test(checkout) ||
      /git\s+(?:checkout|switch|fetch)[^\n]*\$\{?\{?\s*inputs[.\[]/m.test(build)) issues.push('BUILD_UNBOUND');
  if (!/git rev-parse HEAD/.test(build) || !/git ls-remote origin refs\/heads\/main/.test(build)) issues.push('BUILD_SOURCE_UNVERIFIED');
  if (!/needs: build/.test(deploy) || !/environment:\s*\n\s+name: github-pages/.test(deploy)) issues.push('DEPLOY_ORDER_OR_ENVIRONMENT');
  if (!/pages: write/.test(deploy) || !/id-token: write/.test(deploy) || !/git ls-remote/.test(deploy)) issues.push('DEPLOY_PERMISSION_OR_RECHECK');
  if (!/DISPATCH_ACTOR.*yusuf38bcs-oss/.test(deploy) || !/RERUN_ACTOR.*yusuf38bcs-oss/.test(deploy) || !/live_main="\$\(git ls-remote/.test(deploy) || !/test "\$live_main" = "\$EXPECTED_MAIN_SHA"/.test(deploy)) issues.push('DEPLOY_AUTHORIZATION_GAP');
  if (!/cancel-in-progress: false/.test(pub) || !/lbfl-g1-github-pages-manual-production/.test(pub)) issues.push('UNSAFE_PUBLISHER_CONCURRENCY');
  const opsHeader = triggers(verifier);
  if (!/^\s{2}workflow_dispatch:\s*$/m.test(opsHeader) || /^\s{2}(push|pull_request|workflow_run):/m.test(opsHeader)) issues.push('OPS_AUTO_TRIGGER');
  if (!/\.event == "workflow_dispatch"/.test(verifier) || /\.event == "push"/.test(verifier)) issues.push('OPS_ACCEPTS_LEGACY_PUSH');
  if (!/authorize_conclusion="\$\(jq -r/.test(verifier) || !/build_conclusion="\$\(jq -r/.test(verifier) || !/deploy_conclusion="\$\(jq -r/.test(verifier)) issues.push('OPS_NOT_CHECKING_FULL_RELEASE');
  if (!/github\.event_name == 'workflow_dispatch' && inputs\.purge_cache/.test(verifier) || !/default: false/.test(verifier)) issues.push('CACHE_PURGE_OPT_IN_LOST');
  const denyName = '      - name: DENY cache purge mutation in verification workflow';
  const denial = verifier.split(denyName)[1]?.split('\n      - name:')[0] ?? '';
  if (!denial.includes("github.event_name == 'workflow_dispatch' && inputs.purge_cache") ||
      !/exit 1/.test(denial) ||
      verifier.indexOf(denyName) < 0 ||
      verifier.indexOf(denyName) > verifier.indexOf('      - name: Require owner-controlled main dispatch')) {
    issues.push('OPS_PURGE_NOT_DENIED');
  }
  const forbiddenWriteRefs = [
    'secrets.CLOUDFLARE_API_TOKEN', 'secrets.CF_API_TOKEN', 'secrets.CLOUDFLARE_TOKEN',
    'secrets.CLOUDFLARE_ZONE_ID', 'secrets.CF_ZONE_ID', '/purge_cache',
    'curl -fsS -X POST', 'cf_token=', 'wrangler pages deploy',
  ];
  if (forbiddenWriteRefs.some(value => verifier.includes(value))) issues.push('OPS_WRITER_LEAK');
  return issues;
}
test('G1 publisher and verifier satisfy fail-closed static boundary', () => {
  assert.deepEqual(defects(pages,ops), []);
});
test('removing owner authorization must fail', () => {
  assert.ok(defects(pages.replace('test "$DISPATCH_ACTOR" = "yusuf38bcs-oss"','test "$DISPATCH_ACTOR" = "anyone"'),ops).includes('OWNER_GATE_MISSING'));
});
test('restoring automatic main push must fail', () => {
  assert.ok(defects(pages.replace('  workflow_dispatch:', '  push:\n    branches: [main]\n  workflow_dispatch:'),ops).includes('AUTO_PUBLISH_TRIGGER'));
});
test('restoring an input-controlled checkout revision must fail', () => {
  const mutated = pages.replace(
    '          persist-credentials: false',
    '          ref: ${{ inputs.expected_main_sha }}\n          persist-credentials: false',
  );
  assert.notEqual(mutated, pages, 'test fixture must change the checkout');
  assert.ok(defects(mutated, ops).includes('BUILD_UNBOUND'));
});
test('checkout must not use any arbitrary ref even if hardcoded', () => {
  const mutated = pages.replace(
    '          persist-credentials: false',
    '          ref: main\n          persist-credentials: false',
  );
  assert.notEqual(mutated, pages);
  assert.ok(defects(mutated, ops).includes('BUILD_UNBOUND'));
});
test('losing deploy-time source recheck must fail', () => {
  const index=pages.indexOf('  deploy:\n');
  assert.ok(index >= 0, 'deploy job missing');
  const after=pages.slice(index).replace('live_main="$(git ls-remote','remote_snapshot="$(git ls-remote');
  assert.ok(defects(pages.slice(0,index)+after,ops).includes('DEPLOY_AUTHORIZATION_GAP'));
});
test('losing current-main approval SHA must fail', () => {
  assert.ok(defects(pages.replace('test "$DISPATCH_SHA" = "$EXPECTED_MAIN_SHA"','test "$DISPATCH_SHA" = "any"'),ops).includes('EXACT_SHA_GUARD_MISSING'));
});
test('old automatic publication evidence must not be accepted by verifier', () => {
  assert.ok(defects(pages,ops.replace('.event == "workflow_dispatch"', '.event == "push"')).includes('OPS_ACCEPTS_LEGACY_PUSH'));
});
test('missing authorize evidence must fail verifier boundary', () => {
  assert.ok(defects(pages,ops.replace('authorize_conclusion="$(jq -r', 'missing_authorize="$(jq -r')).includes('OPS_NOT_CHECKING_FULL_RELEASE'));
});
test('publisher uses least privilege and retains original artifact contract', () => {
  const common=pages.split('\nconcurrency:\n')[0];
  assert.doesNotMatch(common,/pages: write|id-token: write/);
  assert.match(pages,/actions\/upload-pages-artifact@v4/);
  assert.match(pages,/name: github-pages-\$\{\{ github\.run_id \}\}-\$\{\{ github\.run_attempt \}\}/);
  assert.match(pages,/actions\/deploy-pages@v5/);
  assert.match(pages,/artifact_name: github-pages-\$\{\{ github\.run_id \}\}-\$\{\{ github\.run_attempt \}\}/);
});
test('build can read GitHub Pages setup but only deploy may write', () => {
  const build = jobBlock(pages, 'build');
  const deploy = jobBlock(pages, 'deploy');
  assert.match(build, /permissions:\s*\n\s+contents: read\s*\n\s+actions: read\s*\n\s+pages: read/);
  assert.doesNotMatch(build, /pages: write|id-token: write/);
  assert.match(deploy, /pages: write/);
  assert.match(deploy, /id-token: write/);
});
test('original Jekyll publication content validations stay in scope', () => {
  assert.match(pages, /bundle exec jekyll build --trace/);
  assert.match(pages, /Validate Build Output/);
  assert.match(pages, /graph_manifest\.json/);
  assert.match(pages, /validate-homepage-body\.py/);
});
test('verifier retains complete release job checks', () => {
  assert.match(ops, /run_status.*completed/s);
  assert.match(ops, /run_conclusion.*success/s);
  assert.match(ops, /authorize_conclusion.*success/s);
  assert.match(ops, /build_conclusion.*success/s);
  assert.match(ops, /deploy_conclusion.*success/s);
});
test('candidate test lane cannot publish or read production secrets', () => {
  assert.match(runner, /pull_request:/);
  assert.match(runner, /permissions:\s*\n\s+contents: read/);
  assert.doesNotMatch(runner, /pull_request_target:|pages: write|id-token: write|secrets\.|deploy-pages@|wrangler deploy/);
  assert.match(runner, /persist-credentials: false/);
  assert.match(runner, /node --test \.github\/scripts\/test-g1-pages-publisher-boundary\.mjs/);
});
test('candidate fixture workflow is scoped only to G1 files', () => {
  for (const path of [
    '.github/workflows/jekyll-gh-pages.yml',
    '.github/workflows/ops-verify-pages-artifact.yml',
    '.github/workflows/yesaf-g1-pages-publisher-tests.yml',
    '.github/scripts/test-g1-pages-publisher-boundary.mjs',
  ]) assert.ok(runner.includes(path), 'untracked G1 fixture path: ' + path);
  assert.doesNotMatch(triggers(runner), /^\s{2}(push|workflow_dispatch|pull_request_target):/m);
});

test('removing purge denial must fail the verifier contract', () => {
  const mutated = ops.replace('      - name: DENY cache purge mutation in verification workflow',
                              '      - name: UNSAFE: purge allowed');
  assert.notEqual(mutated, ops);
  assert.ok(defects(pages, mutated).includes('OPS_PURGE_NOT_DENIED'));
});
test('reintroducing Cloudflare write token must fail the verifier contract', () => {
  const mutated = ops.replace('      GH_TOKEN: ${{ github.token }}',
      '      GH_TOKEN: ${{ github.token }}\n      CF_TOKEN_PRIMARY: ${{ secrets.CLOUDFLARE_API_TOKEN }}');
  assert.notEqual(mutated, ops);
  assert.ok(defects(pages, mutated).includes('OPS_WRITER_LEAK'));
});
test('reintroducing Cloudflare cache mutation must fail', () => {
  const mutated = ops + '\n      - name: unsafe-cache-write\n        run: curl -fsS -X POST https://api.cloudflare.com/client/v4/zones/placeholder/purge_cache\n';
  assert.ok(defects(pages, mutated).includes('OPS_WRITER_LEAK'));
});
