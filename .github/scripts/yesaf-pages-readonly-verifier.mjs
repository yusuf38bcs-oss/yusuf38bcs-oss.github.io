#!/usr/bin/env node
// YESAF M1.C-R2: read Cloudflare Pages production identity; NEVER publish.
// This verifier is non-authorizing until an independent main-based release gate
// and the complete eight-writer retirement programme are certified.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const CONTRACT = Object.freeze({
  accountId: '13e317d6883a0f258ad7ed490699f849',
  project: 'yusuf38bcs-oss-github-io',
  owner: 'yusuf38bcs-oss',
  repo: 'yusuf38bcs-oss.github.io',
  branch: 'main',
  canonicalAlias: 'https://learningbiologyforlife.org',
});

const shaPattern = /^[0-9a-f]{40}$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function requireCondition(ok, label) {
  if (!ok) throw new Error('YESAF M1.C-R2 FAIL-CLOSED: ' + label);
}

function validateDeployment(deployment, expectedSha, label) {
  requireCondition(deployment && typeof deployment === 'object', label + ': missing deployment');
  requireCondition(uuidPattern.test(deployment.id || ''), label + ': invalid deployment UUID');
  requireCondition(deployment.project_name === CONTRACT.project, label + ': wrong project identity');
  requireCondition(deployment.environment === 'production', label + ': not production');
  requireCondition(deployment.latest_stage?.status === 'success', label + ': not successfully deployed');
  requireCondition(deployment.deployment_trigger?.type === 'github:push', label + ': noncanonical publishing trigger');
  const meta = deployment.deployment_trigger?.metadata;
  requireCondition(meta?.branch === 'main', label + ': non-main branch');
  requireCondition(meta?.commit_hash === expectedSha, label + ': stale or mismatched commit SHA');
  requireCondition(meta.commit_dirty === false, label + ': dirty or unverified build source');
  requireCondition(Array.isArray(deployment.aliases) &&
    deployment.aliases.includes(CONTRACT.canonicalAlias), label + ': canonical alias not bound');
  requireCondition(Number.isFinite(Date.parse(deployment.created_on)), label + ': missing provider timestamp');
}

export function certifyProduction(project, deployment, expectedSha) {
  requireCondition(shaPattern.test(expectedSha || ''), 'invalid exact-main SHA');
  requireCondition(project?.name === CONTRACT.project, 'unexpected Pages project');
  requireCondition(project.production_branch === CONTRACT.branch, 'wrong Pages production branch');
  requireCondition(project.source?.type === 'github', 'Pages source is not GitHub');
  const git = project.source?.config;
  requireCondition(git?.owner === CONTRACT.owner && git?.repo_name === CONTRACT.repo,
    'GitHub source identity mismatch');
  requireCondition(git?.production_branch === CONTRACT.branch, 'GitHub source production branch mismatch');
  requireCondition(git.production_deployments_enabled === true,
    'GitHub-connected production publishing disabled');
  const canonical = project.canonical_deployment;
  validateDeployment(canonical, expectedSha, 'canonical');
  validateDeployment(deployment, expectedSha, 'deployment detail');
  requireCondition(canonical.id === deployment.id, 'canonical UUID differs from deployment-details UUID');
  requireCondition(canonical.created_on === deployment.created_on, 'deployment timestamp mismatch');
  return Object.freeze({
    schema: 'YESAF-M1C-R2-PAGES-READONLY-EVIDENCE-v1',
    outcome: 'READ_ONLY_IDENTITY_PASS',
    production_cutover: 'HOLD',
    single_writer_certified: false,
    live_browser_parity: 'NOT_TESTED',
    rollback_rehearsal: 'NOT_TESTED',
    source: CONTRACT.owner + '/' + CONTRACT.repo,
    source_sha: expectedSha,
    account_id: CONTRACT.accountId,
    pages_project: CONTRACT.project,
    pages_deployment_uuid: deployment.id,
    provider_timestamp: deployment.created_on,
    provider_trigger: deployment.deployment_trigger.type,
    production_url: CONTRACT.canonicalAlias,
    evidence_note: 'Provider read-only exact-SHA/UUID identity; not proof of exclusive writer or deploy authorization',
  });
}

export async function fetchProductionReadOnly({
  token, accountId = CONTRACT.accountId, fetcher = globalThis.fetch,
  apiRoot = 'https://api.cloudflare.com/client/v4',
} = {}) {
  requireCondition(typeof token === 'string' && token.trim().length > 0,
    'missing separately scoped CLOUDFLARE_PAGES_READ_TOKEN');
  requireCondition(accountId === CONTRACT.accountId, 'Cloudflare account mismatch');
  requireCondition(typeof fetcher === 'function', 'GET-only fetch unavailable');
  requireCondition(apiRoot === 'https://api.cloudflare.com/client/v4', 'API host override forbidden');
  const prefix = apiRoot + '/accounts/' + accountId + '/pages/projects/' + CONTRACT.project;
  async function get(path) {
    const response = await fetcher(prefix + path, {
      method: 'GET',
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + token },
      redirect: 'error',
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
    requireCondition(response?.ok, 'provider GET refused or unavailable (HTTP ' + (response?.status ?? 'unknown') + ')');
    const data = await response.json();
    requireCondition(data && data.success === true && data.result && (!data.errors || data.errors.length === 0),
      'provider API returned non-success');
    return data.result;
  }
  const project = await get('');
  requireCondition(uuidPattern.test(project?.canonical_deployment?.id || ''),
    'canonical UUID missing; no detail request allowed');
  const detail = await get('/deployments/' + project.canonical_deployment.id);
  return { project, detail };
}

export async function runReadOnlyCertification({ expectedSha, token, githubRef, githubSha,
  repository, outputPath, fetcher } = {}) {
  requireCondition(githubRef === 'refs/heads/main', 'not running from protected main');
  requireCondition(repository === CONTRACT.owner + '/' + CONTRACT.repo, 'wrong GitHub repository');
  requireCondition(shaPattern.test(expectedSha || ''), 'invalid exact-main SHA');
  requireCondition(githubSha === expectedSha, 'workflow event SHA does not match exact-main request');
  requireCondition(typeof outputPath === 'string' && outputPath.length > 0, 'evidence output path missing');
  const { project, detail } = await fetchProductionReadOnly({ token, fetcher });
  const evidence = certifyProduction(project, detail, expectedSha);
  const destination = resolve(outputPath);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, JSON.stringify(evidence, null, 2) + '\n',
    { encoding: 'utf8', flag: 'wx', mode: 0o600 });
  return evidence;
}

async function main() {
  const args = process.argv.slice(2);
  requireCondition(args.length === 2 && args[0] === '--expected-main-sha',
    'usage: node yesaf-pages-readonly-verifier.mjs --expected-main-sha <40hex>');
  const evidence = await runReadOnlyCertification({
    expectedSha: args[1],
    token: process.env.CLOUDFLARE_PAGES_READ_TOKEN,
    githubRef: process.env.GITHUB_REF,
    githubSha: process.env.GITHUB_SHA,
    repository: process.env.GITHUB_REPOSITORY,
    outputPath: process.env.YESAF_PAGES_EVIDENCE_OUT || '',
  });
  process.stdout.write('YESAF M1.C-R2 READ_ONLY_IDENTITY_PASS: ' +
    evidence.pages_deployment_uuid + ' @ ' + evidence.source_sha +
    '; PRODUCTION_CUTOVER=HOLD\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message || 'YESAF M1.C-R2 failed closed');
    process.exitCode = 1;
  });
}
