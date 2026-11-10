import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const source = readFileSync(new URL('../../../.github/workflows/lbfl-shadow-app-auth-manual-gate.yml', import.meta.url), 'utf8');
const start = source.indexOf("              . as $root |");
const end = source.indexOf("' <<< \"$runs\"", start);
const predicate = source.slice(start, end);
const sha = '0df178d625e278e629e864077c0963f09b2a9660';
const base = 'a'.repeat(40);
const repo = 'yusuf38bcs-oss/yusuf38bcs-oss.github.io';
const definitions = [
  ['LBFL Attestor Shadow Authentication Tests', 380813901, 38112206848, 'lbfl-attestor-shadow-auth-tests.yml'],
  ['CodeQL Exact-Head Security Scan', 347431559, 38112206853, 'codeql-exact-head.yml'],
  ['Validate Jekyll PR', 309407614, 38112206894, 'validate-jekyll-pr.yml'],
  ['Sovereign Site Audit v4', 305284928, 38112206854, 'sovereign-site-audit.yml'],
];
const fixture = () => ({ total_count: 4, workflow_runs: definitions.map(([name, workflow_id, id, file]) => ({ name, workflow_id, id, path: '.github/workflows/' + file, head_sha: sha, event: 'pull_request', head_branch: 'frozen', head_repository: { full_name: repo }, status: 'completed', conclusion: 'success', pull_requests: [{ number: 476, head: { sha }, base: { sha: base } }] })) });
function evaluate(input) {
  const result = spawnSync('jq', ['-e', '--arg', 'sha', sha, '--arg', 'base', base, '--arg', 'repo', repo, '--arg', 'head_ref', 'frozen', predicate], { input: JSON.stringify(input), encoding: 'utf8' });
  assert.ok(result.status === 0 || result.status === 1, result.stderr);
  return result.status === 0;
}
test('actual workflow predicate accepts frozen reviewed runs', () => assert.equal(evaluate(fixture()), true));
for (const [name, mutate] of [
  ['renamed substitute workflow', r => { r.workflow_id++; }],
  ['same workflow different run', r => { r.id++; }],
  ['wrong workflow path', r => { r.path = '.github/workflows/fake.yml'; }],
  ['different PR', r => { r.pull_requests[0].number = 475; }],
  ['stale base', r => { r.pull_requests[0].base.sha = 'b'.repeat(40); }],
  ['stale head', r => { r.head_sha = 'c'.repeat(40); }],
  ['failed run', r => { r.conclusion = 'failure'; }],
  ['missing PR association', r => { r.pull_requests = []; }],
]) test('actual workflow rejects ' + name, () => { const input = fixture(); mutate(input.workflow_runs[0]); assert.equal(evaluate(input), false); });
test('actual workflow rejects duplicate success and pagination overflow', () => {
  const duplicate = fixture(); duplicate.workflow_runs.push(duplicate.workflow_runs[0]); assert.equal(evaluate(duplicate), false);
  const overflow = fixture(); overflow.total_count = 101; assert.equal(evaluate(overflow), false);
});
