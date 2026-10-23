#!/usr/bin/env node
// YESAF E4 read-only bridge. This is NOT a trusted status writer, promotion
// authority, guard exception, approval, or production deployment workflow.
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

export const POLICY = Object.freeze({
  schema: 'yesaf-e4-interim-bridge/v1',
  repository: 'yusuf38bcs-oss/yusuf38bcs-oss.github.io',
  mainSha: '3164d2537b4f19381c52bbfb5c9e1b7ee7d15846',
  pr496: '18c8527fdc17b92cb2a2da43f4ccf66c8dc09191',
  pr497: '1040b87c747d37b09c6602e3c72b9c3c40c23927',
  workflows: [
    ['appendages', 'a28bf51cac8e4ec07a9228d16d636b1a5af73972'],
    ['dissection', '68e11e232a437823258f5f74530db51017ce5de4'],
    ['museum', 'bf91156ff62791c21f90c880e72838f2843c3926'],
    ['permanent-slides', 'a17d3221cc69dcb4b4760693814eec40d26d719e'],
    ['temporary-mounts', '07b28127f234d5819e568497d206851230e13810'],
    ['whole-mounts', '1f8f8ab0b9347a7c1c3e2e66e729ea1427c31a0a'],
  ].map(([name, candidateBlob]) => ({
    path: `.github/workflows/conv04f-zoology-practical-${name}-production-parity.yml`,
    candidateBlob,
  })),
  guarded: [
    {
      path: '.github/workflows/conv04f-zoology-practical-zooplankton-production-parity.yml',
      mainBlob: '5b113398e59bc0dde9dfba6827aa4b88ccd6bed4',
      guardPath: '.github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml',
      guardBlob: '1142d9c341f34d5926a5855cfc06c54a46a82d13',
    },
    {
      path: '.github/workflows/conv04f-zoology-practical-field-report-production-parity.yml',
      mainBlob: '3919de0d39b2e316cd8511e283b6d15fcf5197dd',
      guardPath: '.github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml',
      guardBlob: 'e92f4f9bec9d4e2db51bcbeb65da958cfa3a1114',
    },
  ],
  pages: {
    path: '.github/workflows/jekyll-gh-pages.yml',
    mainBlob: '2a2871af738167cd9c2a196c5ffc599fc41a5ad2',
  },
  staleRunIds: [26596572982, 37655524953],
});

const publisherPaths = () => [
  ...POLICY.workflows.map(w => w.path),
  ...POLICY.guarded.map(w => w.path),
  POLICY.pages.path,
];
const uniqueSorted = xs => [...new Set(xs)].sort();
function requireCondition(ok, message) {
  if (!ok) throw new Error(`YESAF E4 FAIL-CLOSED: ${message}`);
}
function sameSet(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length &&
    uniqueSorted(actual).length === actual.length &&
    JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
}
function checkDraft(pr, number, head, fileList) {
  requireCondition(pr?.number === number && pr?.state === 'open' &&
    pr.draft === true && pr.merged === false, `PR #${number} is not the pinned open Draft`);
  requireCondition(pr.head_sha === head && pr.base_sha === POLICY.mainSha,
    `PR #${number} HEAD or base SHA drift`);
  requireCondition(sameSet(pr.changed_files, fileList),
    `PR #${number} changed-file allowlist drift`);
}

// Untrusted YAML content remains DATA. Never execute any candidate code.
function retiredSourceLooksInert(body, path) {
  requireCondition(typeof body === 'string' && body.length > 100 && body.length < 4000,
    `${path} retirement source absent or abnormally sized`);
  requireCondition(/^on:\s*\n\s+workflow_dispatch:\s*$/m.test(body),
    `${path} must be dispatch-only`);
  requireCondition(/^permissions:\s*\n\s+contents:\s*read\s*$/m.test(body),
    `${path} must retain read-only permissions`);
  requireCondition(/^\s+retired_notice:\s*$/m.test(body) &&
    /^\s+run:\s*\|\s*$/m.test(body), `${path} must be a retirement notice`);
  requireCondition(!/^\s*(?:push|pull_request|pull_request_target|workflow_run|schedule|repository_dispatch):/m.test(body),
    `${path} contains an automatic or privileged trigger`);
  requireCondition(!/CLOUDFLARE_API_TOKEN|CLOUDFLARE_.*TOKEN|wrangler|deploy-pages|pages-action|id-token:\s*write|pages:\s*write|environment:\s*(?:production|github-pages)|(?:curl|wget)\s+.*(?:https?:\/\/|api\/)/i.test(body),
    `${path} contains a potential writer or credential path`);
}

/** Pure evaluation of a fetched snapshot. Does not authorize any merge. */
export function evaluateBridge(s) {
  requireCondition(s?.schema === POLICY.schema && s.repository === POLICY.repository,
    'snapshot schema/repository mismatch');
  requireCondition(s.main_sha === POLICY.mainSha, 'protected main changed; recertify from fresh baseline');
  checkDraft(s.pr496, 496, POLICY.pr496, POLICY.workflows.map(w => w.path));
  checkDraft(s.pr497, 497, POLICY.pr497, POLICY.guarded.map(w => w.path));

  const expectedPaths = publisherPaths();
  requireCondition(sameSet(s.workflow_registry?.map(w => w.path), expectedPaths),
    'missing, duplicate, or unexpected publisher state entries');
  const ids = new Set();
  for (const path of expectedPaths) {
    const w = s.workflow_registry.find(x => x.path === path);
    requireCondition(Number.isSafeInteger(w.id) && w.id > 0 && !ids.has(w.id),
      `missing/duplicate GitHub workflow ID for ${path}`);
    ids.add(w.id);
    requireCondition(w.state === 'disabled_manually',
      `registered publisher must be disabled_manually: ${path} (${w.state})`);
  }

  const expectedFiles = [
    ...POLICY.workflows.map(w => ({ref: POLICY.pr496, path: w.path, sha: w.candidateBlob})),
    ...POLICY.guarded.map(w => ({ref: POLICY.mainSha, path: w.path, sha: w.mainBlob})),
    ...POLICY.guarded.map(w => ({ref: POLICY.mainSha, path: w.guardPath, sha: w.guardBlob})),
    {ref: POLICY.mainSha, path: POLICY.pages.path, sha: POLICY.pages.mainBlob},
  ];
  requireCondition(sameSet(s.blobs?.map(x => `${x.ref}:${x.path}`), expectedFiles.map(x => `${x.ref}:${x.path}`)),
    'unverified, duplicate, or missing source/guard blobs');
  for (const expected of expectedFiles) {
    const blob = s.blobs.find(x => x.ref === expected.ref && x.path === expected.path);
    requireCondition(blob.sha === expected.sha, `untrusted source/guard blob drift: ${expected.path}`);
    if (expected.ref === POLICY.pr496) retiredSourceLooksInert(blob.content, blob.path);
  }

  // Both old successor guards deliberately protect the guarded writer paths.
  // This state is a security barrier, not a condition to evade.
  requireCondition(s.guarded_transition === 'BLOCKED_BY_IMMUTABILITY_GUARDS',
    'R91/R101 governance conflict must remain explicitly blocked');
  for (const status of ['queued', 'in_progress', 'waiting', 'pending']) {
    requireCondition(Array.isArray(s.active_runs?.[status]), `missing ${status} run inventory`);
    for (const run of s.active_runs[status]) {
      requireCondition(Number.isSafeInteger(run.id) && Number.isSafeInteger(run.workflow_id),
        `unverifiable ${status} run`);
      requireCondition(!ids.has(run.workflow_id),
        `disabled publisher has ${status} run ${run.id} (workflow ${run.workflow_id})`);
    }
  }

  return {
    verdict: 'INTERIM_QUARANTINE_EVIDENCE_PASS',
    production_release: 'HOLD',
    eligible_for_merge: false,
    known_publishers_disabled: expectedPaths.length,
    six_writer_retirement_candidate: `PR #496 @ ${POLICY.pr496}`,
    r91_r101_source_retirement: 'BLOCKED: predecessor immutable successor guards remain active',
    pr497: 'DRAFT / DO NOT MERGE',
    proof_limits: [
      'Only the nine specified repository publishing workflows; not an exhaustive account/repository writer inventory',
      'Current administrative state is point-in-time and must be rechecked immediately before and after every main change',
      'No trusted 5-context certification, credentials, rollback, DNS/TLS or cross-surface release authority is granted',
      'Two unrelated historical queued runs do not establish a current publisher',
    ],
  };
}

export async function collectLiveBridge() {
  // The separate function below completes the API snapshot without depending
  // on local git, gh CLI, a browser, any write token, or an Actions dispatch.
  const root = `https://api.github.com/repos/${POLICY.repository}`;
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  const headers = {
    Accept:'application/vnd.github+json',
    'X-GitHub-Api-Version':'2022-11-28',
    'User-Agent':'yesaf-e4-readonly',
    ...(token ? {Authorization:`Bearer ${token}`} : {}),
  };
  async function get(path) {
    const r = await fetch(root + path, {method:'GET', headers, redirect:'error'});
    requireCondition(r.ok, `GET ${path.split('?')[0]} returned ${r.status}`);
    return r.json();
  }
  async function pages(path) {
    let all = [];
    for (let i=1;i<=20;i++) {
      const glue=path.includes('?')?'&':'?';
      const d=await get(`${path}${glue}per_page=100&page=${i}`);
      requireCondition(Array.isArray(d), 'GitHub PR file list malformed');
      all.push(...d);
      if(d.length<100)return all;
    }
    throw new Error('YESAF E4 FAIL-CLOSED: PR file pagination cap');
  }
  async function countCollection(path,key,maxPages=10){
    let all=[],total;
    for(let p=1;p<=maxPages;p++){
      const sep=path.includes('?')?'&':'?';
      const obj=await get(`${path}${sep}per_page=100&page=${p}`);
      requireCondition(Number.isSafeInteger(obj.total_count) && Array.isArray(obj[key]),`incomplete ${key} response`);
      if(total===undefined)total=obj.total_count;
      requireCondition(total===obj.total_count,'GitHub inventory changed during pagination');
      all.push(...obj[key]);
      if(all.length===total)return all;
      requireCondition(all.length<total && obj[key].length===100,`unread ${key} page`);
    }
    throw new Error(`YESAF E4 FAIL-CLOSED: ${key} pagination cap`);
  }
  const main=await get('/branches/main');
  const s={schema:POLICY.schema,repository:POLICY.repository,main_sha:main.commit?.sha,
    pr496:null,pr497:null,workflow_registry:[],blobs:[],active_runs:{},
    guarded_transition:'BLOCKED_BY_IMMUTABILITY_GUARDS'};
  for (const number of [496,497]){
    const p=await get(`/pulls/${number}`);
    const files=await pages(`/pulls/${number}/files`);
    const item={number:p.number,state:p.state,draft:p.draft,merged:p.merged,
      head_sha:p.head?.sha,base_sha:p.base?.sha,changed_files:files.map(x=>x.filename)};
    requireCondition(files.length===p.changed_files,`PR #${number} incomplete changed-file metadata`);
    s[`pr${number}`]=item;
  }
  const reg=await countCollection('/actions/workflows','workflows');
  for (const path of publisherPaths()){
    const w=reg.filter(x=>x.path===path);
    requireCondition(w.length===1,`workflow registry missing/ambiguous: ${path}`);
    s.workflow_registry.push({path,id:w[0].id,state:w[0].state});
  }
  const contentSpecs=[
    ...POLICY.workflows.map(w=>({ref:POLICY.pr496,path:w.path})),
    ...POLICY.guarded.flatMap(w=>[{ref:POLICY.mainSha,path:w.path},{ref:POLICY.mainSha,path:w.guardPath}]),
    {ref:POLICY.mainSha,path:POLICY.pages.path},
  ];
  for(const item of contentSpecs){
    const enc=item.path.split('/').map(encodeURIComponent).join('/');
    const d=await get(`/contents/${enc}?ref=${item.ref}`);
    requireCondition(d.type==='file' && /^[a-f0-9]{40}$/.test(d.sha),`bad source blob ${item.path}`);
    s.blobs.push({ref:item.ref,path:item.path,sha:d.sha,
      ...(item.ref===POLICY.pr496?{content:Buffer.from((d.content||'').replace(/\s/g,''),'base64').toString('utf8')}:{})});
  }
  for(const status of ['queued','in_progress','waiting','pending']){
    const runs=await countCollection(`/actions/runs?status=${status}`,'workflow_runs');
    s.active_runs[status]=runs.map(x=>({id:x.id,workflow_id:x.workflow_id}));
  }
  return s;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args=process.argv.slice(2);
    requireCondition(args.length===1 && (args[0]==='--live'||args[0].startsWith('--snapshot=')),
      'usage: node yesaf-e4-bridge.mjs --live | --snapshot=path.json');
    const snapshot=args[0]==='--live' ? await collectLiveBridge()
      : JSON.parse(await readFile(args[0].slice('--snapshot='.length),'utf8'));
    const result=evaluateBridge(snapshot);
    console.log(JSON.stringify(result,null,2));
  } catch(e){
    console.error(String(e.message||e));
    process.exitCode=1;
  }
}
