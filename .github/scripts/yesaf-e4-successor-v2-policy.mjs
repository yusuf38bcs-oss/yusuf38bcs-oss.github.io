#!/usr/bin/env node
// Trusted-base YESAF E4 successor guard v2. READ-ONLY. Not an approval or
// trusted release status writer; caller must use protected-main script bytes.
export const SOLO = 'yusuf38bcs-oss';
export const PINNED = Object.freeze({
  R91: {
    workflow: '.github/workflows/conv04f-zoology-practical-zooplankton-production-parity.yml',
    approvedRetirementBlob: '305b555b153c30719fedcc88164947a2c85fe5f9',
    guard: '.github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml',
    immutable: [
      '_data/academic/conv04f_zoology_practical_zooplankton_v1.json',
      'docs/academic/conv04/ZOOLOGY_PRACTICAL_ZOOPLANKTON_F09_R90_AUTHORIZATION.md',
      'docs/academic/conv04/ZOOLOGY_PRACTICAL_ZOOPLANKTON_F09_R91_IMPLEMENTATION.md',
      '.github/scripts/validate-conv04f-zoology-practical-zooplankton.rb',
      '.github/scripts/conv04f-zoology-practical-zooplankton-browser-certification.mjs',
      '.github/scripts/resolve-cloudflare-targets.py',
      '.github/locks/wrangler-4.147.0-package-lock.json',
      '.github/workflows/conv04f-zoology-practical-zooplankton-certification.yml',
      '.github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml',
      '.github/scripts/yesaf-e4-successor-v2-policy.mjs'
    ]
  },
  R101: {
    workflow: '.github/workflows/conv04f-zoology-practical-field-report-production-parity.yml',
    approvedRetirementBlob: '9c5facafde56309951db4e768f7040582c0aa96c',
    guard: '.github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml',
    immutable: [
      '_data/academic/conv04f_zoology_practical_field_report_v1.json',
      'docs/academic/conv04/ZOOLOGY_PRACTICAL_FIELD_REPORT_F09_R100_AUTHORIZATION.md',
      'docs/academic/conv04/ZOOLOGY_PRACTICAL_FIELD_REPORT_F09_R101_IMPLEMENTATION.md',
      '.github/scripts/validate-conv04f-zoology-practical-field-report.rb',
      '.github/scripts/conv04f-zoology-practical-field-report-browser-certification.mjs',
      '.github/scripts/resolve-cloudflare-targets.py',
      '.github/locks/wrangler-4.147.0-package-lock.json',
      '.github/workflows/zoology-practical-213106-certification.yml',
      '.github/workflows/conv04f-zoology-practical-field-report-certification.yml',
      '.github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml',
      '.github/scripts/yesaf-e4-successor-v2-policy.mjs'
    ]
  }
});
export const NINE_WORKFLOWS = Object.freeze([
  'appendages','dissection','museum','permanent-slides',
  'temporary-mounts','whole-mounts','zooplankton','field-report'
].map(n=>`.github/workflows/conv04f-zoology-practical-${n}-production-parity.yml`)
 .concat(['.github/workflows/jekyll-gh-pages.yml']));
export const ACTIVE = Object.freeze(['requested','queued','in_progress','waiting','pending']);
function guard(test, message) { if (!test) throw new Error(`E4 SUCCESSOR V2 FAIL-CLOSED: ${message}`); }
const canonical = xs => JSON.stringify([...xs].sort());
const is40 = s => /^[0-9a-f]{40}$/.test(String(s||''));
function sameUnique(a,b) {
  return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&
    new Set(a).size===a.length&&canonical(a)===canonical(b);
}
export function evaluateSuccessorV2({guardName,pr,changedFiles,mainSha,registry,runs}) {
  const policy=PINNED[guardName];
  guard(Boolean(policy),'guard identifier unknown');
  guard(pr?.changed_files===changedFiles?.length&&pr.changed_files<=3000&&pr.changed_files>=0,
    'incomplete or oversized changed-file inventory');
  guard(is40(pr.head_sha)&&is40(pr.base_sha)&&pr.base_sha===mainSha&&pr.base_ref==='main',
    'stale or malformed protected-main identity');
  guard(pr.state==='open','PR is not open');
  const touched=[];
  for(const f of changedFiles){
    guard(typeof f.filename==='string'&&!touched.includes(f.filename), 'duplicate/invalid PR file');
    touched.push(f.filename);
    if(f.previous_filename) touched.push(f.previous_filename);
  }
  guard(new Set(touched).size===touched.length,'duplicate/renamed protected inventory');
  const protectedTouches=touched.filter(x=>policy.immutable.includes(x));
  guard(protectedTouches.length===0,`protected successor/science artifact changed: ${protectedTouches.join(', ')}`);
  const targetFile=changedFiles.find(f=>f.filename===policy.workflow);
  const targetRenamed=changedFiles.some(f=>f.previous_filename===policy.workflow);
  guard(!targetRenamed,'renaming/removing predecessor publisher is forbidden');
  if(!targetFile) return {decision:'PASS_UNRELATED_PR',production_release:'HOLD',promotion_authority:false};

  // Only the exact, previously peer-reviewed retirement blob is eligible.
  guard(targetFile.status==='modified' && targetFile.sha===policy.approvedRetirementBlob,
    'retirement source is not pinned exact reviewed Git blob');
  guard(pr.draft===false, 'Draft PR has no successor migration authority');
  guard(pr.author===SOLO && pr.head_owner===SOLO && pr.repo_owner===SOLO,
    'retirement is not owned by the permanent solo maintainer');
  const lines=String(pr.body||'').split(/\r?\n/).map(x=>x.trim());
  guard(lines.filter(x=>x.startsWith('SOLO-MAINTAINER-EXCEPTION:')).length===1 &&
    lines.includes('SOLO-MAINTAINER-EXCEPTION: LBFL-PERMANENT-SOLO-MAINTAINER'),
    'owner exception missing, malformed or duplicated');
  guard(lines.filter(x=>x.startsWith('SOLO-MAINTAINER-APPROVAL:')).length===1 &&
    lines.includes(`SOLO-MAINTAINER-APPROVAL: ${pr.head_sha}`),
    'no exact-HEAD solo approval marker');
  guard(sameUnique(registry?.map(x=>x.path),NINE_WORKFLOWS),
    'incomplete, duplicate or unrecognized nine-writer registry');
  const ids=new Set();
  for(const w of registry){
    guard(Number.isSafeInteger(w.id)&&w.id>0&&!ids.has(w.id),'missing/duplicate workflow ID');
    ids.add(w.id);
    guard(w.state==='disabled_manually',`legacy publisher enabled: ${w.path}`);
  }
  for(const status of ACTIVE){
    guard(Array.isArray(runs?.[status]),`incomplete ${status} run list`);
    for(const item of runs[status]){
      guard(Number.isSafeInteger(item.id)&&Number.isSafeInteger(item.workflow_id),
        `unverifiable ${status} run`);
      guard(!ids.has(item.workflow_id),`legacy publisher ${status} run ${item.id}`);
    }
  }
  return {
    decision:'EXACT_RETIRED_BLOB_CANDIDATE_ONLY',
    case:guardName,
    original_protected_science:'ENFORCED',
    previous_guard_policy_migration:'SEPARATE OWNER BOOTSTRAP REQUIRED',
    production_release:'HOLD',
    promotion_authority:false
  };
}

export function requireStableObservation(before,after) {
  guard(before?.mainSha===after?.mainSha,'protected main moved during snapshot');
  const p=before.pr,q=after.pr;
  for(const key of ['head_sha','base_sha','state','draft','updated_at','changed_files'])
    guard(p?.[key]===q?.[key],`PR ${key} changed during snapshot`);
  const canonicalRegistry = x=>x?.registry?.map(v=>`${v.path}:${v.id}:${v.state}:${v.updated_at}`);
  guard(sameUnique(canonicalRegistry(before),canonicalRegistry(after)),'registry changed during snapshot');
  for(const status of ACTIVE){
    const capture = x => x?.runs?.[status]?.map(v=>`${v.id}:${v.workflow_id}`);
    guard(sameUnique(capture(before),capture(after)),`${status} workflow runs changed during snapshot`);
  }
}

// Called only from an authenticated trusted-main pull_request_target workflow.
// Never fetch or execute untrusted branch scripts or read deployment secrets.
export async function auditTrustedSuccessor({github,context,core,guardName}) {
  const owner=context.repo.owner,repo=context.repo.repo;
  guard(owner===SOLO&&repo==='yusuf38bcs-oss.github.io','wrong trusted repository');
  const pull_number=context.payload.pull_request?.number;
  guard(Number.isSafeInteger(pull_number)&&pull_number>0,'no trusted PR number');
  async function readOnce(){
    const [prr,mb,registryAll]=await Promise.all([
      github.rest.pulls.get({owner,repo,pull_number}),
      github.rest.repos.getBranch({owner,repo,branch:'main'}),
      github.paginate(github.rest.actions.listRepoWorkflows,{owner,repo,per_page:100})
    ]);
    const pr=prr.data,mainSha=String(mb.data.commit?.sha||'').toLowerCase();
    const registry=registryAll.filter(w=>NINE_WORKFLOWS.includes(w.path)).map(w=>
      ({id:w.id,path:w.path,state:w.state,updated_at:w.updated_at}));
    const runs={};
    for(const status of ACTIVE){
      // A filtered workflow-runs query is capped by GitHub at 1,000 results.
      // Pagination alone can return a plausible but incomplete inventory;
      // require a trustworthy total_count before any candidate is accepted.
      const first=await github.rest.actions.listWorkflowRunsForRepo({
        owner,repo,status,per_page:100,page:1
      });
      const total=first.data?.total_count;
      guard(Number.isSafeInteger(total)&&total>=0,
        `unverifiable ${status} run total_count`);
      guard(total<=1000,
        `${status} run inventory exceeds GitHub 1000-result cap (${total}); HOLD`);
      const entries=await github.paginate(github.rest.actions.listWorkflowRunsForRepo,
        {owner,repo,status,per_page:100});
      guard(entries.length===total,
        `incomplete ${status} run inventory: expected ${total}, observed ${entries.length}`);
      const observed=new Set();
      for(const item of entries){
        guard(Number.isSafeInteger(item.id)&&item.id>0&&!observed.has(item.id),
          `missing/duplicate ${status} run identifier`);
        observed.add(item.id);
      }
      runs[status]=entries.map(r=>({id:r.id,workflow_id:r.workflow_id}));
    }
    return {mainSha,pr:{
      head_sha:String(pr.head?.sha||'').toLowerCase(),
      base_sha:String(pr.base?.sha||'').toLowerCase(),
      base_ref:pr.base?.ref,
      state:pr.state,draft:pr.draft,updated_at:pr.updated_at,
      changed_files:pr.changed_files,author:pr.user?.login,
      repo_owner:owner,head_owner:pr.head?.repo?.owner?.login,
      body:pr.body||''
    },registry,runs};
  }
  const before=await readOnce();
  guard(String(context.sha||'').toLowerCase()===before.mainSha,
    'trusted workflow revision is not current protected main');
  const files=await github.paginate(github.rest.pulls.listFiles,
    {owner,repo,pull_number,per_page:100});
  const modified=files.map(f=>({filename:f.filename,previous_filename:f.previous_filename,
    status:f.status,sha:f.sha}));
  const after=await readOnce();
  guard(String(context.sha||'').toLowerCase()===after.mainSha,
    'protected main changed since trusted workflow checkout');
  requireStableObservation(before,after);
  const result=evaluateSuccessorV2({guardName,pr:after.pr,mainSha:after.mainSha,
    changedFiles:modified,registry:after.registry,runs:after.runs});
  core.info(`YESAF E4 ${guardName} successor v2: ${JSON.stringify(result)}`);
  return result;
}
