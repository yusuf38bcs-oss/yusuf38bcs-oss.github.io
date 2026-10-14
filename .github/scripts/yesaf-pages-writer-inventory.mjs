#!/usr/bin/env node
// YESAF M1.C: read-only inventory of declared Cloudflare Pages writer paths.
// Does not use credentials, deploy, mutate rulesets, or certify runtime origin.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function inspectWorkflow(filename, text) {
  const effective = text.split('\n').filter(line => !/^\s*#/.test(line)).join('\n');
  const name = effective.match(/^name:\s*(.+?)\s*$/m)?.[1] || path.basename(filename);
  const attempts = [...effective.matchAll(/\bpages\s+deploy\b/g)].map(match => {
    const context = effective.slice(match.index, match.index + 620).replace(/\\\s*\n/g, ' ');
    const branchMain = /--branch\s+main(?:\s|$)/.test(context);
    const dynamicBranch = /--branch\s+["']?\$[A-Za-z{]/.test(context);
    return { target: branchMain ? 'production-main' : dynamicBranch ? 'dynamic-branch' : 'undetermined' };
  });
  if (attempts.length === 0) return null;
  return {
    workflow: filename,
    name,
    invocations: attempts.length,
    declaredTargets: [...new Set(attempts.map(a => a.target))],
    hasNamedCloudflareCredential: /secrets\.CLOUDFLARE_API_TOKEN\b/.test(effective),
    hasPushMainTrigger: /on:\s*\n(?:[\s\S]*?\n)?\s{2}push:\s*\n\s{4}branches:\s*\["main"\]/.test(effective),
    classification: attempts.some(a => a.target === 'production-main')
      ? 'PRODUCTION_WRITER_CAPABILITY'
      : 'PREVIEW_OR_DYNAMIC_WRITER_REVIEW',
  };
}

export function inventory(contents) {
  const paths = Object.entries(contents).map(([filename, text]) => inspectWorkflow(filename, text))
    .filter(Boolean).sort((a, b) => a.workflow.localeCompare(b.workflow));
  return {
    schema: 'yesaf.m1c.pages-writers.v1',
    static_scan: 'COMPLETE',
    authority_decision: 'HOLD',
    observed_live_writers_certified: false,
    potential_production_writers: paths.filter(x => x.classification === 'PRODUCTION_WRITER_CAPABILITY').length,
    note: 'Source capability inventory is not authenticated deployment or publisher identity proof. Cross-correlate with Cloudflare audit logs.',
    paths,
  };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2] || '.github/workflows';
  const files = fs.readdirSync(dir).filter(f => /\.(yml|yaml)$/.test(f)).sort();
  const data = Object.fromEntries(files.map(f => [path.join(dir, f), fs.readFileSync(path.join(dir, f), 'utf8')]));
  const result = inventory(data);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  if (process.argv.includes('--enforce-single-writer') && result.potential_production_writers > 0) {
    process.exitCode = 1;
  }
}
