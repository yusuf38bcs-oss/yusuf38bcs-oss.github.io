import test from 'node:test';
import assert from 'node:assert/strict';
import { POLICY, gitBlobSha1 } from './yesaf-e4-bridge.mjs';
import { SUCCESSOR_MIGRATION, evaluateControlledSuccessorMigration, verifyTwoRetirementCandidates } from './yesaf-e4-successor-migration.mjs';

const exactCandidateContent = {
  'zooplankton': `# YESAF E4 guarded retirement candidate: Zooplankton R91.
# DRAFT / CONTROLLED BOOTSTRAP HOLD. Trusted R91/R101 successor checks are
# expected to reject modifications until separately reviewed and authorized.
# No production execution or authority is supplied by this workflow.
# Historical release code/evidence: 3164d2537b4f19381c52bbfb5c9e1b7ee7d15846.
name: CONV-04F-09 Zooplankton R91 Production Parity (Retired Candidate)

on:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  retired_notice:
    name: Non-publishing retirement notice
    runs-on: ubuntu-24.04
    timeout-minutes: 5
    steps:
      - name: Report guarded legacy publisher quarantine
        run: |
          echo "YESAF E4: Zooplankton R91 legacy writer retirement candidate."
          echo "No production deploy or privileged credential is used."
`,
  'field-report': `# YESAF E4 guarded retirement candidate: Field Report R101.
# DRAFT / CONTROLLED BOOTSTRAP HOLD. Trusted R91/R101 successor checks are
# expected to reject modifications until separately reviewed and authorized.
# No production execution or authority is supplied by this workflow.
# Historical release code/evidence: 3164d2537b4f19381c52bbfb5c9e1b7ee7d15846.
name: CONV-04F-09 Field Report R101 Production Parity (Retired Candidate)

on:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  retired_notice:
    name: Non-publishing retirement notice
    runs-on: ubuntu-24.04
    timeout-minutes: 5
    steps:
      - name: Report guarded legacy publisher quarantine
        run: |
          echo "YESAF E4: Field Report R101 legacy writer retirement candidate."
          echo "No production deploy or privileged credential is used."
`,
};
function candidates(){ return SUCCESSOR_MIGRATION.guardedCandidates.map(x=>({
  path:x.path,sha:x.retiringBlob,ref:POLICY.pr497,
  content:exactCandidateContent[x.path.includes('zooplankton')?'zooplankton':'field-report']
})); }
function legacyRetirement(path) {
  const slug=path.match(/practical-(.+)-production-parity\.yml$/)?.[1];
  const title=({appendages:'Appendages',dissection:'Dissection',museum:'Museum',
    'permanent-slides':'Permanent Slides','temporary-mounts':'Temporary Mounts','whole-mounts':'Whole Mounts'})[slug];
  return `# YESAF E4 controlled quarantine — ${title} legacy Cloudflare Pages publisher.
# THIS FILE HAS NO PRODUCTION AUTHORITY. The former workflow and its evidence
# remain recoverable in Git history at main@3164d2537b4f19381c52bbfb5c9e1b7ee7d15846.
# Do not restore publishing here. Use a separately certified single-writer lane.
name: CONV-04F-09 ${title} Production Parity (Retired)

on:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  retired_notice:
    name: Legacy production writer quarantined (no deployment)
    runs-on: ubuntu-24.04
    timeout-minutes: 5
    steps:
      - name: Non-publishing retirement evidence
        run: |
          echo "YESAF E4: ${title} legacy writer retired."
          echo "No Cloudflare credential is consumed, and no deployment occurs."
`;
}
function baseline() {
  const six=POLICY.workflows.map(w=>w.path), two=POLICY.guarded.map(w=>w.path);
  const all=[...six,...two,POLICY.pages.path];
  const snap={schema:POLICY.schema,repository:POLICY.repository,main_sha:POLICY.mainSha,
    pr496:{number:496,state:'open',draft:true,merged:false,base_sha:POLICY.mainSha,head_sha:POLICY.pr496,changed_files:six},
    pr497:{number:497,state:'open',draft:true,merged:false,base_sha:POLICY.mainSha,head_sha:POLICY.pr497,changed_files:two},
    workflow_registry:all.map((path,i)=>({path,id:700+i,state:'disabled_manually'})),
    blobs:[
      ...POLICY.workflows.map(w=>({ref:POLICY.pr496,path:w.path,sha:w.candidateBlob,content:legacyRetirement(w.path)})),
      ...POLICY.guarded.flatMap(w=>[{ref:POLICY.mainSha,path:w.path,sha:w.mainBlob},{ref:POLICY.mainSha,path:w.guardPath,sha:w.guardBlob}]),
      {ref:POLICY.mainSha,path:POLICY.pages.path,sha:POLICY.pages.mainBlob}
    ],active_runs:{requested:[],queued:[],in_progress:[],waiting:[],pending:[]},
    guarded_transition:'BLOCKED_BY_IMMUTABILITY_GUARDS'};
  return {schema:SUCCESSOR_MIGRATION.schema,bridge_snapshot:snap,
    retirement_candidates:candidates(),predecessor_guards:'IMMUTABLE_AND_ENFORCED',
    existing_guard_disposition:'FAIL_FOR_PROTECTED_RETIREMENT',
    control_plane_mutation:false,ruleset_bypass:false,source_merge:false,production_deployed:false};
}
const copy=x=>structuredClone(x);
test('positive: both R91/R101 candidates match pinned PR #497 Git blob identities',()=>{
  for(const b of candidates()) assert.equal(gitBlobSha1(b.content),b.sha);
  assert.equal(verifyTwoRetirementCandidates(candidates()).verified,2);
});
test('positive: controlled successor candidate is certified WITHOUT merge or bypass',()=>{
  const r=evaluateControlledSuccessorMigration(baseline());
  assert.equal(r.verdict,'CONTROLLED_SUCCESSOR_MIGRATION_CANDIDATE_VERIFIED');
  assert.equal(r.eligible_for_merge,false);
  assert.equal(r.production_release,'HOLD');
  assert.equal(r.authorized_guard_exception,false);
});
function negative(label,modify){test('negative: '+label,()=>{
  const s=baseline();modify(s);assert.throws(()=>evaluateControlledSuccessorMigration(s),/FAIL-CLOSED/);
});}
negative('untrusted schema',x=>x.schema='fake');
negative('guard exception incorrectly claimed',x=>x.existing_guard_disposition='PASS');
negative('predecessor immutability hidden',x=>x.predecessor_guards='RETIRED');
negative('ruleset bypass pretended',x=>x.ruleset_bypass=true);
negative('merge pretended complete',x=>x.source_merge=true);
negative('production deployment pretended',x=>x.production_deployed=true);
negative('unauthorized control-plane edit',x=>x.control_plane_mutation=true);
negative('R101 retirement missing',x=>x.retirement_candidates.pop());
negative('retirement source duplicated',x=>x.retirement_candidates[1]=copy(x.retirement_candidates[0]));
negative('R91 source blob SHA substituted',x=>x.retirement_candidates[0].sha='f'.repeat(40));
negative('R101 source changed but SHA retained',x=>x.retirement_candidates[1].content+='\n');
negative('R91 contains writer command',x=>x.retirement_candidates[0].content+='\nwrangler pages deploy _site\n');
negative('R101 protected guard drift',x=>x.bridge_snapshot.blobs.find(y=>y.path===POLICY.guarded[1].guardPath).sha='1'.repeat(40));
negative('R91 becomes enabled',x=>x.bridge_snapshot.workflow_registry.find(y=>y.path===POLICY.guarded[0].path).state='active');
negative('new pending legacy writer',x=>x.bridge_snapshot.active_runs.pending.push({id:12345,workflow_id:x.bridge_snapshot.workflow_registry[0].id}));
negative('PR #496 ready early',x=>x.bridge_snapshot.pr496.draft=false);
negative('PR #497 changes unexpected guard file',x=>x.bridge_snapshot.pr497.changed_files.push(POLICY.guarded[0].guardPath));
negative('baseline main advanced',x=>x.bridge_snapshot.main_sha='4'.repeat(40));
