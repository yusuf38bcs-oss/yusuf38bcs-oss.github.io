import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateBridge, POLICY} from './yesaf-e4-bridge.mjs';

const notice = `# No production authority.
name: Legacy Production Parity (Retired)
on:
  workflow_dispatch:
permissions:
  contents: read
jobs:
  retired_notice:
    name: Non-publishing retirement notice
    runs-on: ubuntu-24.04
    steps:
      - name: Report retirement
        run: |
          echo "This workflow is retired."
          echo "No privileged operation is performed."
`;

function validSnapshot(){
  const six=POLICY.workflows.map(w=>w.path);
  const two=POLICY.guarded.map(w=>w.path);
  const paths=[...six,...two,POLICY.pages.path];
  return {
    schema:POLICY.schema,
    repository:POLICY.repository,
    main_sha:POLICY.mainSha,
    pr496:{number:496,state:'open',draft:true,merged:false,base_sha:POLICY.mainSha,head_sha:POLICY.pr496,changed_files:six},
    pr497:{number:497,state:'open',draft:true,merged:false,base_sha:POLICY.mainSha,head_sha:POLICY.pr497,changed_files:two},
    workflow_registry:paths.map((path,i)=>({path,id:100000+i,state:'disabled_manually'})),
    blobs:[
      ...POLICY.workflows.map(w=>({ref:POLICY.pr496,path:w.path,sha:w.candidateBlob,content:notice})),
      ...POLICY.guarded.flatMap(w=>[
        {ref:POLICY.mainSha,path:w.path,sha:w.mainBlob},
        {ref:POLICY.mainSha,path:w.guardPath,sha:w.guardBlob},
      ]),
      {ref:POLICY.mainSha,path:POLICY.pages.path,sha:POLICY.pages.mainBlob},
    ],
    active_runs:{queued:[{id:37655524953,workflow_id:999999},{id:26596572982,workflow_id:999998}],in_progress:[],waiting:[],pending:[]},
    guarded_transition:'BLOCKED_BY_IMMUTABILITY_GUARDS',
  };
}
const clone = x=>structuredClone(x);
test('positive: exact nine disabled, six inert, guarded successor stays blocked, unrelated orphan queue tolerated',()=>{
  const x=evaluateBridge(validSnapshot());
  assert.equal(x.verdict,'INTERIM_QUARANTINE_EVIDENCE_PASS');
  assert.equal(x.production_release,'HOLD');
  assert.equal(x.eligible_for_merge,false);
  assert.equal(x.known_publishers_disabled,9);
});
function negative(name, mutate, pattern) {
  test(`negative: ${name}`,()=>{
    const s=clone(validSnapshot());mutate(s);
    assert.throws(()=>evaluateBridge(s),pattern||/YESAF E4 FAIL-CLOSED/);
  });
}
negative('main advanced',s=>s.main_sha='f'.repeat(40));
negative('wrong repository',s=>s.repository='attacker/repo');
negative('PR496 goes ready',s=>s.pr496.draft=false);
negative('PR497 merged',s=>s.pr497.merged=true);
negative('PR496 head drift',s=>s.pr496.head_sha='a'.repeat(40));
negative('PR497 base drift',s=>s.pr497.base_sha='b'.repeat(40));
negative('PR496 edits a protected R91 path',s=>s.pr496.changed_files.push(POLICY.guarded[0].path));
negative('PR497 renames/mutates guard',s=>s.pr497.changed_files[0]=POLICY.guarded[0].guardPath);
negative('R91 enabled',s=>s.workflow_registry.find(w=>w.path===POLICY.guarded[0].path).state='active');
negative('GitHub Pages enabled',s=>s.workflow_registry.find(w=>w.path===POLICY.pages.path).state='active');
negative('missing publisher registration',s=>s.workflow_registry.pop());
negative('duplicate workflow ID',s=>s.workflow_registry[1].id=s.workflow_registry[0].id);
negative('running legacy publisher',s=>s.active_runs.in_progress.push({id:321,workflow_id:s.workflow_registry[0].id}));
negative('queued R101',s=>s.active_runs.queued.push({id:322,workflow_id:s.workflow_registry[7].id}));
negative('waiting Jekyll Pages',s=>s.active_runs.waiting.push({id:323,workflow_id:s.workflow_registry[8].id}));
negative('pending museum',s=>s.active_runs.pending.push({id:324,workflow_id:s.workflow_registry[2].id}));
negative('missing run inventory',s=>delete s.active_runs.waiting);
negative('R101 guard blob drift',s=>s.blobs.find(b=>b.path===POLICY.guarded[1].guardPath).sha='c'.repeat(40));
negative('R91 retained writer blob drift',s=>s.blobs.find(b=>b.path===POLICY.guarded[0].path).sha='c'.repeat(40));
negative('retirement blob drift',s=>s.blobs.find(b=>b.ref===POLICY.pr496).sha='c'.repeat(40));
negative('retirement retains push trigger',s=>s.blobs[0].content += '\npush:\n  branches: [main]\n');
negative('retirement retains writer credential',s=>s.blobs[0].content += '\nCLOUDFLARE_API_TOKEN: forbidden\n');
negative('retirement contains wrangler',s=>s.blobs[0].content += '\nwrangler pages deploy _site\n');
negative('retirement asks for pages write',s=>s.blobs[0].content += '\n  pages: write\n');
negative('retirement has privileged PR trigger',s=>s.blobs[0].content += '\n  pull_request_target:\n');
negative('missing candidate source content',s=>delete s.blobs[0].content);
negative('governance conflict hidden',s=>s.guarded_transition='MIGRATION_APPROVED');
negative('incomplete or duplicate blob inventory',s=>s.blobs.push(s.blobs[0]));
