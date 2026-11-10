import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { runAuthenticationProbe, EXPECTED } from '../src/index.mjs';

const pem = generateKeyPairSync('rsa', { modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' } }).privateKey;
const nowMs = Date.parse('2026-10-11T00:00:00Z');
const repo = { name: EXPECTED.repo, full_name: EXPECTED.fullName, owner: { login: EXPECTED.owner } };
function scenario({ permissions = { contents: 'read', pull_requests: 'read' },
  expiresAt = new Date(nowMs + 30 * 60 * 1000).toISOString(), repositories = [repo] } = {}) {
  const requests = [];
  const fetchImpl = async (url, options) => {
    const path = new URL(url).pathname;
    requests.push({ path, method: options.method, body: options.body });
    let data;
    if (path === '/app') data = { id: EXPECTED.appId, slug: EXPECTED.appSlug, owner: { login: EXPECTED.owner } };
    else if (path.endsWith('/installation') && options.method === 'GET')
      data = { id: 123, app_id: EXPECTED.appId, account: { login: EXPECTED.owner }, repository_selection: 'selected' };
    else if (path === '/app/installations/123/access_tokens') data = { token: 'mock-token-only-12345', permissions, expires_at: expiresAt };
    else if (path === '/installation/repositories') data = { total_count: repositories.length, repositories };
    else throw new Error('Unexpected API request: ' + path);
    return { ok: true, json: async () => data };
  };
  return { requests, run: () => runAuthenticationProbe({
    env: { LBFL_RELEASE_ATTESTOR_PRIVATE_KEY: { get: async () => pem } }, fetchImpl, nowMs }) };
}
test('read-only exact-single-repository grant passes', async () => {
  const s = scenario();
  const receipt = await s.run();
  assert.equal(receipt.result, 'PASS');
  assert.equal(receipt.selected_repository_count, 1);
  assert.equal(s.requests.length, 4);
  const grant = s.requests.find(r => r.path.endsWith('/access_tokens'));
  assert.equal(grant.method, 'POST');
  assert.deepEqual(JSON.parse(grant.body), {
    repositories: [EXPECTED.repo],
    permissions: { contents: 'read', pull_requests: 'read' },
  });
});
test('write permission fails closed', async () =>
  assert.rejects(scenario({ permissions: { contents: 'write', pull_requests: 'read' } }).run(), /permissions/));
test('additional permission fails closed', async () =>
  assert.rejects(scenario({ permissions: { contents: 'read', pull_requests: 'read', issues: 'write' } }).run(), /permissions/));
test('expired grant fails closed', async () =>
  assert.rejects(scenario({ expiresAt: new Date(nowMs - 1).toISOString() }).run(), /expiry/));
test('wrong repository fails closed', async () =>
  assert.rejects(scenario({ repositories: [{ ...repo, name: 'other' }] }).run(), /scope/));
test('multiple repositories fail closed', async () =>
  assert.rejects(scenario({ repositories: [repo, repo] }).run(), /scope/));
