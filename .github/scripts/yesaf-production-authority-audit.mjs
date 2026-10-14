#!/usr/bin/env node
// YESAF M1: static, read-only protection audit; never deploys or accesses secrets.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function auditWorkflow(source) {
  const violations = [];
  const record = (id, explanation) => violations.push({ id, explanation });
  const deployHeaders = [...source.matchAll(/^  deploy:[ \t]*$/gm)];
  if (deployHeaders.length !== 1) {
    record('MISSING_DEPLOY_JOB', 'Expected exactly one Worker deploy job; missing or duplicate');
  }
  const deploymentJob = deployHeaders.length === 1
    ? source.slice(deployHeaders[0].index + deployHeaders[0][0].length).split(/^  [a-z][a-z0-9_-]*:[ \t]*$/m)[0]
    : '';
  const preflight = deployHeaders.length === 1 ? source.slice(0, deployHeaders[0].index) : '';
  const conditions = [...deploymentJob.matchAll(/^    if:[ \t]*(.+?)[ \t]*$/gm)].map(m => m[1].trim());
  if (conditions.length !== 1) {
    record('AMBIGUOUS_DEPLOY_GUARD', 'Deploy job must have exactly one explicit job-level if condition');
  }
  if (!/^    environment:\s*production\s*$/m.test(deploymentJob)) {
    record('ENVIRONMENT_UNPROTECTED', 'Deploy job lacks explicit production environment');
  }
  const disabled = conditions.length === 1 && conditions[0] === '${{ false }}';
  // This source check cannot authorize production: live authentication remains a separate gate.
  const activePreflight = preflight.split('\n').filter(line => !line.trimStart().startsWith('#')).join('\n');
  const liveProof = /--mode\s+preflight\b/.test(activePreflight) && /verify-worker-contract\.mjs/.test(activePreflight);
  const designatedBindings = [...deploymentJob.matchAll(/^      CLOUDFLARE_API_TOKEN:[ \t]*(.+?)[ \t]*$/gm)]
    .map(m => m[1].trim());
  const designated = designatedBindings.length === 1
    && designatedBindings[0] === '${{ secrets.CLOUDFLARE_WORKER_DEPLOY_TOKEN }}';
  const otherSecrets = /secrets\.(?:CF_API_TOKEN|CLOUDFLARE_TOKEN|CLOUDFLARE_API_TOKEN)\b/.test(deploymentJob);
  const fallback = /candidates=\(|trying the next configured credential|for name in "\${candidates\[@\]\}"/.test(deploymentJob);
  if (!designated || otherSecrets || fallback) {
    record('CREDENTIAL_FALLBACK', 'Worker deploy must have exactly one designated CLOUDFLARE_WORKER_DEPLOY_TOKEN and no fallback');
  }
  const concurrencyHeaders = [...source.matchAll(/^concurrency:[ \t]*$/gm)];
  const concurrency = concurrencyHeaders.length === 1
    ? source.slice(concurrencyHeaders[0].index).split(/^jobs:[ \t]*$/m)[0]
    : '';
  const groups = [...concurrency.matchAll(/^  group:[ \t]*(.+?)[ \t]*$/gm)].map(m => m[1].trim());
  const cancellations = [...concurrency.matchAll(/^  cancel-in-progress:[ \t]*(.+?)[ \t]*$/gm)]
    .map(m => m[1].trim());
  const lock = groups.length === 1
    && groups[0] === "worker-production-${{ github.event_name == 'pull_request' && github.event.pull_request.number || 'production' }}"
    && cancellations.length === 1 && cancellations[0] === 'false';
  if (!lock) record('NON_SERIAL_PRODUCTION', 'Production deployments must share one fixed non-cancelling lock, not a per-SHA lock');
  if (!disabled && !liveProof) record('ACTIVE_WITHOUT_LIVE_PREFLIGHT', 'Active deployment cannot follow static-only preflight');
  if (!disabled && !/^    needs:\s*preflight\s*$/m.test(deploymentJob)) {
    record('NO_PREFLIGHT_DEPENDENCY', 'Active deploy job must depend on preflight');
  }
  return {
    schema: 'yesaf.m1.authority-audit.v1',
    static_safety: violations.length === 0 ? 'PASS' : 'FAIL',
    production_cutover: 'HOLD',
    deploy_state: disabled ? 'DISABLED_BY_WORKFLOW' : 'ACTIVE_OR_UNCONFIRMED',
    live_preflight_in_source: liveProof,
    limitation: 'Static source examination only; does not attest rulesets, credentials, external writers, live deployment or rollback',
    violations,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const filepath = process.argv[2] || '.github/workflows/worker-production-deployment.yml';
  const result = auditWorkflow(readFileSync(filepath, 'utf8'));
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  if (result.static_safety !== 'PASS') process.exitCode = 1;
}
