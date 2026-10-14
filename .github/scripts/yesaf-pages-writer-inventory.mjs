#!/usr/bin/env node
// YESAF M1.C — shadow inventory only. No tokens, API calls, production writes, or GO decision.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function uncommented(source) {
  return String(source).split('\n').filter(line => !line.trimStart().startsWith('#')).join('\n');
}

export function findPagesWriters(files) {
  const candidates = [];
  for (const file of files) {
    const source = uncommented(file.content);
    // These patterns are evidence of capability, not evidence that a job executed.
    const wrangler = /\bpages[ \t]+deploy[ \t]+(?:_site|\.\/_site|dist|\.\/dist)\b/.test(source);
    const directApi = /\b(?:POST|PUT)\b[^\n]*\/pages\/projects\/[^\s]*\/deployments\b/i.test(source);
    if (!wrangler && !directApi) continue;
    const triggers = source.split(/^jobs:[ \t]*$/m)[0];
    candidates.push({
      path: file.path,
      main_push_trigger: /(^|\n)  push:[ \t]*\n[^\n]*branches:[^\n]*main/m.test(triggers),
      manual_trigger: /(^|\n)  workflow_dispatch:[ \t]*$/m.test(triggers),
      credential_reference: /secrets\.CLOUDFLARE_API_TOKEN\b|secrets\.CLOUDFLARE_PAGES_[A-Z_]+\b/.test(source),
      write_capability: wrangler ? 'WRANGLER_PAGES_DEPLOY' : 'DIRECT_PAGES_DEPLOYMENT_API',
    });
  }
  return candidates.sort((a, b) => a.path.localeCompare(b.path));
}

export function report(files) {
  const candidates = findPagesWriters(files);
  return {
    schema: 'yesaf.m1c.pages-writer-shadow.v1',
    scan: 'STATIC_SOURCE_CAPABILITY_ONLY',
    scanned_workflows: files.length,
    potential_production_writers: candidates.length,
    production_cutover: 'HOLD',
    mandatory_gate: 'NOT_AUTHORIZED_BY_THIS_SHADOW_REPORT',
    limitations: [
      'Does not establish who executed a deploy or what permissions the secret actually has',
      'Does not inventory local Wrangler, dashboard writes, API tokens, or other repositories',
      'Does not parse every possible dynamic shell command or indirect deployment script',
    ],
    candidates,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = '.github/workflows';
  const files = readdirSync(dir).filter(name => /\.ya?ml$/.test(name))
    .map(name => ({ path: dir + '/' + name, content: readFileSync(dir + '/' + name, 'utf8') }));
  const result = report(files);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  // A future, separately authorized release gate may fail closed on writers.
  if (process.argv.includes('--require-no-writers') && result.potential_production_writers !== 0) {
    process.exitCode = 1;
  }
}
