import test from 'node:test';
import assert from 'node:assert/strict';
import { auditWorkflow } from './yesaf-production-authority-audit.mjs';

const base = `name: Worker Production Deployment
permissions:
  contents: read
concurrency:
  group: worker-production-\${{ github.event_name == 'pull_request' && github.event.pull_request.number || 'production' }}
  cancel-in-progress: false
jobs:
  preflight:
    steps:
      - run: echo static
  deploy:
    needs: preflight
    environment: production
    if: \${{ false }}
    env:
      CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_WORKER_DEPLOY_TOKEN }}
`;
const has = (r, id) => r.violations.some(v => v.id === id);
test('static-only designated-token configuration is safe but NOT certified for cutover', () => {
  const x = auditWorkflow(base);
  assert.equal(x.static_safety, 'PASS');
  assert.equal(x.production_cutover, 'HOLD');
  assert.equal(x.deploy_state, 'DISABLED_BY_WORKFLOW');
});
test('active deploy without live preflight fails closed', () => {
  const x = auditWorkflow(base.replace('if: \${{ false }}', 'if: \${{ github.ref == "refs/heads/main" }}'));
  assert.equal(x.static_safety, 'FAIL');
  assert.ok(has(x, 'ACTIVE_WITHOUT_LIVE_PREFLIGHT'));
});
test('credential fallback is rejected even when the job is disabled', () => {
  const x = auditWorkflow(base.replace('CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_WORKER_DEPLOY_TOKEN }}', 'CLOUDFLARE_API_TOKEN: \${{ secrets.CF_API_TOKEN }}'));
  assert.ok(has(x, 'CREDENTIAL_FALLBACK'));
});
test('per-SHA concurrency is rejected', () => {
  const x = auditWorkflow(base.replace("'production'", 'github.sha'));
  assert.ok(has(x, 'NON_SERIAL_PRODUCTION'));
});
test('fake green must never become production GO', () => {
  const x = auditWorkflow(base.replace('echo static', '--mode preflight && node verify-worker-contract.mjs'));
  assert.equal(x.production_cutover, 'HOLD');
});
test('missing deploy job is not presumed safe', () => {
  const x = auditWorkflow(base.split('  deploy:')[0]);
  assert.ok(has(x, 'MISSING_DEPLOY_JOB'));
});


test('duplicate job-level if conditions fail even if one says false', () => {
  const altered = base.replace('    if: ${{ false }}',
    '    if: ${{ false }}\n    if: ${{ github.ref == "refs/heads/main" }}');
  const x = auditWorkflow(altered);
  assert.ok(has(x, 'AMBIGUOUS_DEPLOY_GUARD'));
  assert.equal(x.static_safety, 'FAIL');
});
test('SHA-derived lock with a production fallback is not serial', () => {
  const altered = base.replace(
    "worker-production-${{ github.event_name == 'pull_request' && github.event.pull_request.number || 'production' }}",
    "worker-production-${{ github.sha || 'production' }}"
  );
  const x = auditWorkflow(altered);
  assert.ok(has(x, 'NON_SERIAL_PRODUCTION'));
});
test('duplicate designated credential assignments fail closed', () => {
  const altered = base.replace(
    '      CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_WORKER_DEPLOY_TOKEN }}',
    '      CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_WORKER_DEPLOY_TOKEN }}\n' +
    '      CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_WORKER_DEPLOY_TOKEN }}'
  );
  const x = auditWorkflow(altered);
  assert.ok(has(x, 'CREDENTIAL_FALLBACK'));
});
test('missing explicit deploy job guard fails closed', () => {
  const altered = base.replace('    if: ${{ false }}\n', '');
  const x = auditWorkflow(altered);
  assert.ok(has(x, 'AMBIGUOUS_DEPLOY_GUARD'));
});
