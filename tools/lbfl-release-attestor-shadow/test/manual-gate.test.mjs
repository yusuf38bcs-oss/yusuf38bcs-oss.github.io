import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(
  new URL('../../../.github/workflows/lbfl-shadow-app-auth-manual-gate.yml', import.meta.url),
  'utf8',
);

test('manual gate cannot run automatically or invoke privileged PR events', () => {
  assert.match(workflow, /^on:\n\s+workflow_dispatch:/m);
  assert.doesNotMatch(workflow, /^\s+(?:pull_request|pull_request_target|push|schedule|workflow_run):/m);
  assert.match(workflow, /GITHUB_REF.*refs\/heads\/main/);
});

test('prepared live stage is unconditionally hard-disabled', () => {
  const live = workflow.split('\n  live-authentication:\n')[1];
  assert.ok(live, 'live job must be separately identifiable');
  assert.match(live, /^\s+if:\s+\$\{\{ false \}\}/m);
  assert.match(live, /exit 1/);
  assert.match(live, /lbfl-shadow-app-auth-protected/);
});

test('staged workflow has no Cloudflare credential reference or live invocation', () => {
  assert.doesNotMatch(workflow, /secrets\.|CLOUDFLARE_API_TOKEN|CLOUDFLARE_API_KEY/);
  assert.doesNotMatch(workflow, /wrangler\s+(?:dev|deploy)|\/__scheduled/);
  assert.match(workflow, /live_authentication:"NOT_RUN"/);
});
