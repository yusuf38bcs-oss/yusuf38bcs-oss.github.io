// YESAF E4 — non-authorizing, adversarial assertions for five new local-only browser jobs.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
const workflow = readFileSync('.github/workflows/yesaf-e4-practical-five-readonly-successors.yml','utf8');
const historical = Object.freeze({
  appendages:'e54ef0b8aa2bd8669cd56c607e4920cbddcd0c6e',
  dissection:'3db9c53ed15106276ac73bc4d5e99bf1727b8cf5',
  'permanent-slides':'d2da3d58a08bef6c70e27ef17b0d191ed07b07c0',
  'temporary-mounts':'c0922971ae0ef6897d7274d0955ab17c8959a7fa',
  'whole-mounts':'71055f8823024d3f32b4cd729608cf197ed9d5bd',
});
const forbidden = [
  /\bpush:\s*\n\s+branches:/,
  /\bworkflow_dispatch\s*:/,
  /\bpull_request_target\s*:/,
  /\bworkflow_run\s*:/,
  /\bschedule\s*:/,
  /\b(?:pages|id-token|statuses|deployments):\s*write\b/,
  /secrets\./,
  /CLOUDFLARE_(?:API_TOKEN|PAGES_DEPLOY_TOKEN|WORKER_DEPLOY_TOKEN)/,
  /wrangler\s+(?:pages\s+)?deploy\b/,
  /cloudflare\/wrangler-action/,
  /actions\/deploy-pages@/,
  /\bcurl\b[^\n]*\s-X\s*(?:POST|PUT|PATCH|DELETE)\b/,
];
function defects(w) { return forbidden.map((rule,i)=>rule.test(w) ? String(i) : '').filter(Boolean); }
test('successor stays purely candidate-PR and unprivileged',()=>{
  assert.match(workflow,/\non:\s*\n\s+pull_request:\s*\n/);
  assert.match(workflow,/\npermissions:\s*\n\s+contents:\s*read\s*\n/);
  assert.equal(defects(workflow).length,0,'production writer signature found');
  assert.doesNotMatch(workflow,/environment:\s*(?:production|github-pages)/);
  assert.match(workflow,/ref:\s*\$\{\{ github\.event\.pull_request\.head\.sha \}\}/);
  assert.match(workflow,/persist-credentials:\s*false/);
  assert.match(workflow,/node --test .*test-yesaf-e4-five-practical-readonly\.mjs/);
  assert.match(workflow,/git ls-remote origin refs\/heads\/main/);
  assert.match(workflow,/127\.0\.0\.1:4173/);
});
test('all five original browser assertions remain unchanged and still run',()=>{
  for(const [name,sha] of Object.entries(historical)){
    const file = '.github/scripts/conv04f-zoology-practical-' + name + '-browser-certification.mjs';
    const actual = execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim();
    assert.equal(actual,sha,'source assertion drift: '+name);
    assert.match(workflow,new RegExp('conv04f-zoology-practical-'+name+'-browser-certification\\.mjs'));
  }
  for(const subject of Object.keys(historical)) assert.ok(workflow.includes(subject));
  assert.match(workflow,/fail-fast:\s*false/);
  assert.match(workflow,/--base-url "http:\/\/127\.0\.0\.1:4173"/);
});
test('injected writer, trigger or secret always fails negative fixture',()=>{
  for(const probe of [
    '\n  push:\n    branches: [main]\n',
    '\n  workflow_dispatch:\n',
    '\n  pull_request_target:\n',
    '\n  pages: write\n',
    '\n  id-token: write\n',
    '\n  secrets.CLOUDFLARE_API_TOKEN\n',
    '\n  wrangler pages deploy _site\n',
    '\n  actions/deploy-pages@v4\n',
  ]) assert.ok(defects(workflow+probe).length>0,'failed to catch '+probe);
});
