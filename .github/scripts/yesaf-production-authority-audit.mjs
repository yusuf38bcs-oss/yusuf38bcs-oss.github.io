#!/usr/bin/env node
// YESAF M1: static, read-only protection audit; never deploys or accesses secrets.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function auditWorkflow(source) {
  const violations = [];
  const record = (id, explanation) => violations.push({ id, explanation });
  const deploymentJob = source.match(/^  deploy:\s*$([\s\S]*)/m)?.[1] ?? '';
  const preflight = source.split(/^  deploy:\s*$/m)[0] ?? '';
  if (!deploymentJob) record('MISSING_DEPLOY_JOB', 'Expected Worker deploy job not found; source needs human review');
  if (!/^    environment:\s*production\s*$/m.test(deploymentJob)) {
    record('ENVIRONMENT_UNPROTECTED', 'Deploy job lacks explicit production environment');
  }
  const disabled = /^    if:\s*\$\{\{\s*false\s*\}\}\s*$/m.test(deploymentJob);
  const liveProof = /--mode\s+preflight\b/.test(preflight) && /verify-worker-contract\.mjs/.test(preflight);
  const designated = /CLOUDFLARE_API_TOKEN:\s*\$\{\{\s*secrets\.CLOUDFLARE_WORKER_DEPLOY_TOKEN\s*\}\}/.test(deploymentJob);
  const otherSecrets = /secrets\.(?:CF_API_TOKEN|CLOUDFLARE_TOKEN|CLOUDFLARE_API_TOKEN)\b/.test(deploymentJob);
  const fallback = /candidates=\(|trying the next configured credential|for name in "\$\{candidates\[@\]\}"/.test(deploymentJob);
  if (!designated || otherSecrets || fallback) record('CREDENTIAL_FALLBACK', 'Worker deploy must use only CLOUDFLARE_WORKER_DEPLOY_TOKEN');
  const concurrency = source.match(/^concurrency:\s*\n([\s\S]*?)(?=^jobs:\s*$)/m)?.[1] ?? '';
  const lock = /group:\s*worker-production-.*(?:'production'|"production")/.test(concurrency) && /cancel-in-progress:\s*false/.test(concurrency);
  if (!lock) record('NON_SERIAL_PRODUCTION', 'Production deployments must share one non-cancelling lock independent of commit SHA');
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
