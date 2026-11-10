import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  CONTRACT, certifyProduction, fetchProductionReadOnly, runReadOnlyCertification,
} from './yesaf-pages-readonly-verifier.mjs';

const SHA = 'a'.repeat(40);
const UUID = '12345678-abcd-4000-9000-123456789abc';

function fixture() {
  const d = {
    id: UUID, project_name: CONTRACT.project, environment: 'production',
    created_on: '2026-10-14T09:55:52Z',
    latest_stage: { name: 'deploy', status: 'success' },
    deployment_trigger: {
      type: 'github:push',
      metadata: { branch: 'main', commit_hash: SHA, commit_dirty: false },
    },
    aliases: [CONTRACT.canonicalAlias, 'https://staging.learningbiologyforlife.org'],
  };
  return {
    project: {
      name: CONTRACT.project, production_branch: 'main',
      source: { type: 'github', config: {
        owner: CONTRACT.owner, repo_name: CONTRACT.repo, production_branch: 'main',
        production_deployments_enabled: true,
      } },
      canonical_deployment: d,
    },
    detail: structuredClone(d),
  };
}

function mockCloudflare(value = fixture(), status = 200) {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    return { ok: status === 200, status, json: async () => ({
      success: status === 200,
      errors: status === 200 ? [] : [{ message: 'Forbidden' }],
      result: url.endsWith('/deployments/' + UUID) ? value.detail : value.project,
    }) };
  };
  return { fetcher, calls };
}

test('P01 provider canonical production SHA and UUID match, cutover remains HOLD', () => {
  const f = fixture();
  const result = certifyProduction(f.project, f.detail, SHA);
  assert.equal(result.source_sha, SHA);
  assert.equal(result.pages_deployment_uuid, UUID);
  assert.equal(result.outcome, 'READ_ONLY_IDENTITY_PASS');
  assert.equal(result.production_cutover, 'HOLD');
  assert.equal(result.single_writer_certified, false);
  assert.equal(result.live_browser_parity, 'NOT_TESTED');
});

const negatives = [
  ['invalid request SHA', x => x.detail, 'nothex', /invalid exact-main SHA/],
  ['stale canonical SHA', x => { x.project.canonical_deployment.deployment_trigger.metadata.commit_hash = 'b'.repeat(40); }, SHA, /mismatched commit SHA/],
  ['stale deployment details', x => { x.detail.deployment_trigger.metadata.commit_hash = 'b'.repeat(40); }, SHA, /mismatched commit SHA/],
  ['ad hoc Pages writer', x => { x.detail.deployment_trigger.type = 'ad_hoc'; }, SHA, /noncanonical publishing trigger/],
  ['failed deployment', x => { x.detail.latest_stage.status = 'failure'; }, SHA, /not successfully deployed/],
  ['preview deploy', x => { x.detail.environment = 'preview'; }, SHA, /not production/],
  ['non-main branch', x => { x.project.canonical_deployment.deployment_trigger.metadata.branch = 'staging'; }, SHA, /non-main branch/],
  ['wrong repository owner', x => { x.project.source.config.owner = 'attacker'; }, SHA, /GitHub source identity mismatch/],
  ['wrong repository name', x => { x.project.source.config.repo_name = 'other'; }, SHA, /GitHub source identity mismatch/],
  ['canonical UUID drift', x => { x.detail.id = 'ffffffff-abcd-4000-9000-123456789abc'; }, SHA, /UUID differs/],
  ['missing production alias', x => { x.project.canonical_deployment.aliases = ['https://preview.pages.dev']; }, SHA, /canonical alias/],
  ['dirty commit provenance', x => { x.detail.deployment_trigger.metadata.commit_dirty = true; }, SHA, /dirty or unverified/],
  ['invalid provider time', x => { x.detail.created_on = 'not-a-date'; }, SHA, /timestamp/],
  ['disabled canonical GitHub source', x => { x.project.source.config.production_deployments_enabled = false; }, SHA, /publishing disabled/],
  ['incorrect production branch', x => { x.project.production_branch = 'staging'; }, SHA, /production branch/],
  ['not GitHub source', x => { x.project.source.type = 'direct_upload'; }, SHA, /not GitHub/],
];

for (const [label, mutate, requestedSha, pattern] of negatives) {
  test('N ' + label + ' fails closed', () => {
    const f = fixture();
    mutate(f);
    assert.throws(() => certifyProduction(f.project, f.detail, requestedSha), pattern);
  });
}

test('read-only provider client makes ONLY authenticated GET requests', async () => {
  const mock = mockCloudflare();
  const { project, detail } = await fetchProductionReadOnly({ token: 'test-redacted-value', fetcher: mock.fetcher });
  assert.equal(certifyProduction(project, detail, SHA).source_sha, SHA);
  assert.equal(mock.calls.length, 2);
  for (const { url, options } of mock.calls) {
    assert.ok(url.startsWith('https://api.cloudflare.com/client/v4/accounts/' + CONTRACT.accountId));
    assert.equal(options.method, 'GET');
    assert.equal(options.redirect, 'error');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.headers.Authorization, 'Bearer test-redacted-value');
  }
});

test('missing read-only credential cannot become a green', async () => {
  await assert.rejects(fetchProductionReadOnly({ token: '' }), /missing separately scoped/);
});

test('wrong account is rejected before any provider request', async () => {
  const mock = mockCloudflare();
  await assert.rejects(fetchProductionReadOnly({
    token: 'test', accountId: 'wrong', fetcher: mock.fetcher,
  }), /account mismatch/);
  assert.equal(mock.calls.length, 0);
});

test('provider error cannot become a green', async () => {
  const mock = mockCloudflare(fixture(), 403);
  await assert.rejects(fetchProductionReadOnly({
    token: 'test', fetcher: mock.fetcher,
  }), /provider GET refused/);
});

test('non-main dispatch cannot contact Cloudflare', async () => {
  const mock = mockCloudflare();
  await assert.rejects(runReadOnlyCertification({
    expectedSha: SHA, githubRef: 'refs/heads/feature',
    githubSha: SHA, repository: CONTRACT.owner + '/' + CONTRACT.repo,
    token: 'test', outputPath: '/tmp/none', fetcher: mock.fetcher,
  }), /not running from protected main/);
  assert.equal(mock.calls.length, 0);
});

test('stale workflow-dispatch event SHA cannot contact Cloudflare', async () => {
  const mock = mockCloudflare();
  await assert.rejects(runReadOnlyCertification({
    expectedSha: SHA, githubRef: 'refs/heads/main',
    githubSha: 'b'.repeat(40), repository: CONTRACT.owner + '/' + CONTRACT.repo,
    token: 'test', outputPath: '/tmp/none', fetcher: mock.fetcher,
  }), /workflow event SHA/);
  assert.equal(mock.calls.length, 0);
});

test('read-only pass creates a credential-free one-shot evidence file', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'yesaf-m1c-readonly-'));
  try {
    const outputPath = join(dir, 'evidence.json');
    const mock = mockCloudflare();
    const evidence = await runReadOnlyCertification({
      expectedSha: SHA, githubRef: 'refs/heads/main', githubSha: SHA,
      repository: CONTRACT.owner + '/' + CONTRACT.repo,
      token: 'TOP_SECRET_SHOULD_NOT_APPEAR', outputPath, fetcher: mock.fetcher,
    });
    const raw = await readFile(outputPath, 'utf8');
    assert.equal(JSON.parse(raw).pages_deployment_uuid, UUID);
    assert.equal(evidence.production_cutover, 'HOLD');
    assert.equal(raw.includes('TOP_SECRET_SHOULD_NOT_APPEAR'), false);
    await assert.rejects(runReadOnlyCertification({
      expectedSha: SHA, githubRef: 'refs/heads/main', githubSha: SHA,
      repository: CONTRACT.owner + '/' + CONTRACT.repo,
      token: 'TOP_SECRET_SHOULD_NOT_APPEAR', outputPath, fetcher: mock.fetcher,
    }), /EEXIST/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
