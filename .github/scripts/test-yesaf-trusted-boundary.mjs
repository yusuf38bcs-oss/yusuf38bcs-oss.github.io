import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
const workflow = readFileSync(new URL('../workflows/yesaf-production-authority-audit.yml', import.meta.url), 'utf8');

const trusted = workflow.split('\n  trusted-policy:\n')[1] || '';
const shadow = workflow.split('\n  shadow-audit:\n')[1]?.split('\n  trusted-policy:\n')[0] || '';

test('trusted authority runs on protected-main workflow event', () => {
  assert.match(workflow, /\n  pull_request_target:\s*\n/);
  assert.match(workflow, /\n  push:\s*\n    branches:\s*\["main"\]/);
});
test('two trigger types cannot cancel each other by PR concurrency', () => {
  assert.match(workflow, /group:\s*yesaf-m1-audit-\$\{\{ github\.event_name \}\}-/);
});
test('shadow lane has read-only token; required writer isolated to trusted lane', () => {
  assert.match(shadow, /permissions:\s*\n\s+contents:\s*read/);
  assert.doesNotMatch(shadow, /statuses:\s*write/);
  assert.match(trusted, /permissions:\s*\n\s+contents:\s*read\s*\n\s+pull-requests:\s*read\s*\n\s+statuses:\s*write/);
});
test('authoritative policy never executes scripts from candidate tree', () => {
  assert.match(trusted, /node --test trusted\/\.github\/scripts\/test-yesaf-production-authority-audit\.mjs/);
  assert.match(trusted, /node trusted\/\.github\/scripts\/yesaf-production-authority-audit\.mjs "\$RUNNER_TEMP\/yesaf-candidate-worker\.yml"/);
  assert.match(trusted, /github\.rest\.repos\.getContent/);
  assert.doesNotMatch(trusted, /path: candidate/);
  assert.doesNotMatch(trusted, /(?:node|bash|sh)\s+candidate\//);
  assert.doesNotMatch(trusted, /working-directory:\s*candidate/);
});
test('untrusted modifications to authority control-plane are rejected', () => {
  for (const path of [
    '.github/workflows/yesaf-production-authority-audit.yml',
    '.github/scripts/yesaf-production-authority-audit.mjs',
    '.github/scripts/test-yesaf-production-authority-audit.mjs',
    '.github/scripts/test-yesaf-trusted-boundary.mjs',
  ]) assert.ok(trusted.includes(path), 'missing immutable control plane: ' + path);
  assert.match(trusted, /trustedBytes\.equals\(raw\)/);
  assert.match(trusted, /data\.type !== 'file'/);
  assert.match(trusted, /crypto\.createHash\('sha1'\)/);
});
test('exact identity is checked before publishing authority', () => {
  assert.match(trusted, /git -C trusted rev-parse HEAD/);
  assert.match(trusted, /CANDIDATE_SHA/);
  assert.match(trusted, /path: rel, ref: sha/);
  assert.match(trusted, /git -C trusted ls-remote origin refs\/heads\/main/);
  assert.match(trusted, /pr\.data\.head\.sha === exactHead/);
  assert.match(trusted, /main\.data\.commit\.sha === exactBase/);
});
test('only trusted workflow publishes PR HEAD status; no Cloudflare secret', () => {
  assert.match(trusted, /context:\s*'YESAF M1 Trusted Static Authority'/);
  assert.match(trusted, /sha:\s*exactHead/);
  assert.match(trusted, /safe \? 'success' : 'failure'/);
  assert.doesNotMatch(workflow, /secrets\./);
});
test('status writer is fail closed on any skipped or failed authority step', () => {
  assert.match(trusted, /if:\s*\$\{\{ always\(\) && github\.event_name == 'pull_request_target' \}\}/);
  assert.match(trusted, /outcomes\.every\(o => o === 'success'\)/);
  assert.match(trusted, /core\.setFailed/);
});

test('trusted GitHub Script status publishers parse as executable async JavaScript', () => {
  const lines = workflow.split('\n');
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] !== '          script: |') continue;
    const parts = [];
    for (let j = i + 1; j < lines.length && (lines[j].startsWith('            ') || !lines[j].trim()); j++) {
      parts.push(lines[j].startsWith('            ') ? lines[j].slice(12) : '');
    }
    blocks.push(parts.join('\n'));
  }
  assert.equal(blocks.length, 4, 'verify shadow reader, pending status, trusted reader and final head-status publisher');
  for (const code of blocks) assert.doesNotThrow(() => new Script('(async () => {\n' + code + '\n})()'));
});


test('failed trusted control-plane invariants must force a failure status', async () => {
  const marker = '      - name: Publish fail-closed exact-head trusted status\n';
  const offset = workflow.indexOf(marker);
  assert.ok(offset >= 0, 'missing authoritative status publisher');
  const tail = workflow.slice(offset);
  const scriptMarker = '          script: |\n';
  const scriptStart = tail.indexOf(scriptMarker);
  assert.ok(scriptStart >= 0, 'missing GitHub Script source');
  const scriptLines = [];
  for (const line of tail.slice(scriptStart + scriptMarker.length).split('\n')) {
    if (line.startsWith('            ')) scriptLines.push(line.slice(12));
    else if (!line.trim()) scriptLines.push('');
    else break;
  }
  const statuses = [];
  let rejected = false;
  const exactHead = 'a'.repeat(40);
  const exactBase = 'b'.repeat(40);
  const env = {
    CHECKOUT_TRUSTED: 'success', CANDIDATE_SOURCE_OUTCOME: 'success',
    IDENTITY_OUTCOME: 'success', SETUP_OUTCOME: 'success',
    TESTS_OUTCOME: 'success', POLICY_INVARIANTS_OUTCOME: 'failure',
    AUDIT_OUTCOME: 'success',
  };
  const sandbox = {
    process: { env },
    context: {
      payload: { pull_request: { head: { sha: exactHead }, base: { sha: exactBase } } },
      issue: { number: 486 }, repo: { owner: 'fixture', repo: 'repo' },
      serverUrl: 'https://github.example.test', runId: 42,
    },
    github: { rest: {
      pulls: { get: async () => ({ data: {
        state: 'open', draft: false, head: { sha: exactHead },
        base: { ref: 'main', sha: exactBase },
      } }) },
      repos: {
        getBranch: async () => ({ data: { commit: { sha: exactBase } } }),
        createCommitStatus: async request => { statuses.push(request); },
      },
    } },
    core: { warning: () => {}, setFailed: () => { rejected = true; } },
  };
  const script = new Script('(async () => {\n' + scriptLines.join('\n') + '\n})()');
  await script.runInNewContext(sandbox);
  assert.equal(statuses.length, 1);
  assert.equal(statuses[0].sha, exactHead);
  assert.equal(statuses[0].context, 'YESAF M1 Trusted Static Authority');
  assert.equal(statuses[0].state, 'failure');
  assert.equal(rejected, true);
});


test('shadow lane cannot checkout PR head or execute candidate scripts', () => {
  assert.match(shadow, /ref: main/);
  assert.match(shadow, /github\.rest\.repos\.getContent/);
  assert.doesNotMatch(shadow, /ref:\s*\$\{\{ github\.event\.pull_request\.head\.sha/);
  assert.doesNotMatch(shadow, /(?:node|bash|sh)\s+candidate\//);
  assert.match(shadow, /node --test \.github\/scripts\/test-yesaf-production-authority-audit\.mjs/);
});

test('API data-only download rejects tampered blob SHA before any policy comparison', async () => {
  const marker = '      - name: Download immutable candidate workflow as inert data\n';
  const offset = workflow.indexOf(marker);
  assert.ok(offset >= 0);
  const tail = workflow.slice(offset);
  const scriptStart = tail.indexOf('          script: |\n');
  assert.ok(scriptStart >= 0);
  const lines = [];
  for (const line of tail.slice(scriptStart + '          script: |\n'.length).split('\n')) {
    if (line.startsWith('            ')) lines.push(line.slice(12));
    else if (!line.trim()) lines.push('');
    else break;
  }
  const { createRequire } = await import('node:module');
  const box = {
    require: createRequire(import.meta.url),
    process: { env: { CANDIDATE_SHA: 'a'.repeat(40), GITHUB_WORKSPACE: '/tmp', RUNNER_TEMP: '/tmp' } },
    Buffer,
    context: { repo: { owner: 'fixture', repo: 'repo' } },
    github: { rest: { repos: {
      getContent: async ({ path }) => ({ data: {
        type: 'file', path, encoding: 'base64',
        content: Buffer.from('tampered').toString('base64'),
        size: 8, sha: '0'.repeat(40),
      } }),
    } } },
    core: { info: () => {} },
  };
  const script = new Script('(async () => {\n' + lines.join('\n') + '\n})()');
  await assert.rejects(script.runInNewContext(box), /Git blob identity mismatch/);
});
