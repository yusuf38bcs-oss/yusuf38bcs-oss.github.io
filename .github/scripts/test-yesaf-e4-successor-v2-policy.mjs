import test from 'node:test';
import assert from 'node:assert/strict';
import {SOLO,PINNED,NINE_WORKFLOWS,ACTIVE,evaluateSuccessorV2,requireStableObservation} from './yesaf-e4-successor-v2-policy.mjs';
const sha='1'.repeat(40),base='2'.repeat(40);
function packet(guardName='R91'){
 const p=PINNED[guardName];
 return {guardName,mainSha:base,
 pr:{head_sha:sha,base_sha:base,base_ref:'main',changed_files:1,
 state:'open',draft:false,author:SOLO,head_owner:SOLO,repo_owner:SOLO,
 body:`SOLO-MAINTAINER-EXCEPTION: LBFL-PERMANENT-SOLO-MAINTAINER\nSOLO-MAINTAINER-APPROVAL: ${sha}`},
 changedFiles:[{filename:p.workflow,status:'modified',sha:p.approvedRetirementBlob}],
 registry:NINE_WORKFLOWS.map((path,i)=>({path,id:i+10,state:'disabled_manually'})),
 runs:Object.fromEntries(ACTIVE.map(s=>[s,[]]))};
}
const mutate=(name,fn,pred=/FAIL-CLOSED/)=>test(`negative ${name}`,()=>{
 const x=packet();fn(x);assert.throws(()=>evaluateSuccessorV2(x),pred)});
for(const n of ['R91','R101'])test(`positive ${n} reviewed blob is eligible for technical successor-only review`,()=>{
 const r=evaluateSuccessorV2(packet(n));
 assert.equal(r.decision,'EXACT_RETIRED_BLOB_CANDIDATE_ONLY');
 assert.equal(r.production_release,'HOLD');assert.equal(r.promotion_authority,false);
});
test('positive unrelated PR unchanged is permitted without owner markers',()=>{
 const x=packet();x.changedFiles[0].filename='docs/lectures/foo.md';
 x.pr.body='';x.pr.draft=true;
 assert.equal(evaluateSuccessorV2(x).decision,'PASS_UNRELATED_PR');
});
mutate('unknown guard name',x=>x.guardName='R9');
mutate('head SHA invalid',x=>x.pr.head_sha='bad');
mutate('main SHA differs',x=>x.mainSha='3'.repeat(40));
mutate('PR draft',x=>x.pr.draft=true);
mutate('PR closed',x=>x.pr.state='closed');
mutate('unexpected changed file',x=>x.pr.changed_files=2);
mutate('retirement blob wrong',x=>x.changedFiles[0].sha='0'.repeat(40));
mutate('publisher deleted',x=>x.changedFiles[0].status='removed');
mutate('publisher renamed',x=>x.changedFiles[0].previous_filename=PINNED.R91.workflow);
mutate('guard itself changed',x=>{x.pr.changed_files=2;x.changedFiles.push({filename:PINNED.R91.guard,status:'modified',sha:'a'.repeat(40)})});
mutate('scientific specimen changed',x=>{x.pr.changed_files=2;x.changedFiles.push({filename:PINNED.R91.immutable[0],status:'modified',sha:'a'.repeat(40)})});
mutate('certification script changed',x=>{x.pr.changed_files=2;x.changedFiles.push({filename:PINNED.R91.immutable[3],status:'modified',sha:'a'.repeat(40)})});
mutate('shared policy script changed',x=>{x.pr.changed_files=2;x.changedFiles.push({filename:'.github/scripts/yesaf-e4-successor-v2-policy.mjs',status:'modified',sha:'a'.repeat(40)})});
mutate('owner mismatch',x=>x.pr.author='outsider');
mutate('head repository mismatch',x=>x.pr.head_owner='attacker');
mutate('owner exception missing',x=>x.pr.body='');
mutate('owner exception duplicate',x=>x.pr.body+='\nSOLO-MAINTAINER-EXCEPTION: LBFL-PERMANENT-SOLO-MAINTAINER');
mutate('solo approval stale HEAD',x=>x.pr.body='SOLO-MAINTAINER-EXCEPTION: LBFL-PERMANENT-SOLO-MAINTAINER\nSOLO-MAINTAINER-APPROVAL: ffffffffffffffffffffffffffffffffffffffff');
mutate('solo approval duplicate',x=>x.pr.body+=`\nSOLO-MAINTAINER-APPROVAL: ${sha}`);
mutate('registry workflow enabled',x=>x.registry[0].state='active');
mutate('registry entry missing',x=>x.registry.pop());
mutate('registry duplicated',x=>x.registry[1]=structuredClone(x.registry[0]));
mutate('workflow ID duplicate',x=>x.registry[1].id=x.registry[0].id);
mutate('requested legacy run',x=>x.runs.requested.push({id:1000,workflow_id:10}));
mutate('queued legacy run',x=>x.runs.queued.push({id:1000,workflow_id:10}));
mutate('in-progress legacy run',x=>x.runs.in_progress.push({id:1000,workflow_id:10}));
mutate('waiting legacy run',x=>x.runs.waiting.push({id:1000,workflow_id:10}));
mutate('pending legacy run',x=>x.runs.pending.push({id:1000,workflow_id:10}));
mutate('missing runs inventory',x=>delete x.runs.requested);
for(const key of ['mainSha','pr','registry','runs']) {
 test(`negative TOCTOU ${key} drift`,()=>{
  const a={mainSha:base,pr:{head_sha:sha,base_sha:base,state:'open',draft:false,updated_at:'a',changed_files:1},
    registry:packet().registry.map(x=>({...x,updated_at:'2026-10-23'})),runs:Object.fromEntries(ACTIVE.map(s=>[s,[]]))};
  const b=structuredClone(a);
  if(key==='mainSha')b.mainSha='9'.repeat(40);
  if(key==='pr')b.pr.updated_at='b';
  if(key==='registry')b.registry[0].state='active';
  if(key==='runs')b.runs.pending.push({id:44,workflow_id:10});
  assert.throws(()=>requireStableObservation(a,b),/FAIL-CLOSED/);
 });
}

import { auditTrustedSuccessor } from './yesaf-e4-successor-v2-policy.mjs';
function fakeTrustedGitHub({flipEnabled=false,shaOverride=base,runTotalsOverride={},truncateStatus=null}={}){
  const fixture=packet();
  const x=fixture.pr;
  const apiPr={number:333,state:x.state,draft:x.draft,updated_at:'now',
    changed_files:x.changed_files,user:{login:x.author},body:x.body,
    head:{sha:x.head_sha,repo:{owner:{login:x.head_owner}}},
    base:{sha:x.base_sha,ref:x.base_ref}};
  const fake={readCycles:0,rest:{
    pulls:{get:async()=>({data:structuredClone(apiPr)}),listFiles:()=>{}},
    repos:{getBranch:async()=>({data:{commit:{sha:shaOverride}}})},
    actions:{listRepoWorkflows:()=>{},listWorkflowRunsForRepo:async options=>({data:{total_count:runTotalsOverride[options.status]??fixture.runs[options.status].length}})}
  }};
  fake.paginate=async (method,options)=>{
    if(method===fake.rest.pulls.listFiles) return fixture.changedFiles.map(y=>({...y}));
    if(method===fake.rest.actions.listRepoWorkflows){
      fake.readCycles++;
      const r=fixture.registry.map(y=>({...y,updated_at:'2026-10-23'}));
      if(flipEnabled&&fake.readCycles===2)r[0].state='active';
      return r;
    }
    if(method===fake.rest.actions.listWorkflowRunsForRepo) return truncateStatus===options.status?[]:fixture.runs[options.status];
    throw new Error('Unexpected method');
  };
  return fake;
}
test('integration trusted-main mock: two bounded authenticated GET rounds succeed',async()=>{
  const github=fakeTrustedGitHub(),logger={info:()=>{}};
  const context={repo:{owner:SOLO,repo:'yusuf38bcs-oss.github.io'},sha:base,
    payload:{pull_request:{number:333}}};
  const r=await auditTrustedSuccessor({github,context,core:logger,guardName:'R91'});
  assert.equal(r.decision,'EXACT_RETIRED_BLOB_CANDIDATE_ONLY');
  assert.equal(github.readCycles,2);
});
test('integration trusted-main mock: mutated registry is denied',async()=>{
  const github=fakeTrustedGitHub({flipEnabled:true}),context={repo:{owner:SOLO,repo:'yusuf38bcs-oss.github.io'},sha:base,
    payload:{pull_request:{number:333}}};
  await assert.rejects(()=>auditTrustedSuccessor({github,context,core:{info:()=>{}},guardName:'R91'}),/FAIL-CLOSED/);
});
test('integration trusted-main mock: stale checkout revision is denied',async()=>{
  const github=fakeTrustedGitHub(),context={repo:{owner:SOLO,repo:'yusuf38bcs-oss.github.io'},sha:'7'.repeat(40),
    payload:{pull_request:{number:333}}};
  await assert.rejects(()=>auditTrustedSuccessor({github,context,core:{info:()=>{}},guardName:'R91'}),/FAIL-CLOSED/);
});
test('integration trusted-main mock: wrong repository denied before API',async()=>{
  const github=fakeTrustedGitHub(),context={repo:{owner:'attacker',repo:'yusuf38bcs-oss.github.io'},sha:base,
    payload:{pull_request:{number:333}}};
  await assert.rejects(()=>auditTrustedSuccessor({github,context,core:{info:()=>{}},guardName:'R91'}),/FAIL-CLOSED/);
});

test('negative integration: status-filtered workflow run query beyond GitHub 1000-result cap fails closed',async()=>{
  const github=fakeTrustedGitHub({runTotalsOverride:{queued:1001}});
  const context={repo:{owner:SOLO,repo:'yusuf38bcs-oss.github.io'},sha:base,
    payload:{pull_request:{number:333}}};
  await assert.rejects(
    ()=>auditTrustedSuccessor({github,context,core:{info:()=>{}},guardName:'R91'}),
    /FAIL-CLOSED: queued run inventory exceeds GitHub 1000-result cap/
  );
});
test('negative integration: incomplete paginated inventory below cap fails closed',async()=>{
  const github=fakeTrustedGitHub({runTotalsOverride:{pending:2}});
  const context={repo:{owner:SOLO,repo:'yusuf38bcs-oss.github.io'},sha:base,
    payload:{pull_request:{number:333}}};
  await assert.rejects(
    ()=>auditTrustedSuccessor({github,context,core:{info:()=>{}},guardName:'R91'}),
    /FAIL-CLOSED: incomplete pending run inventory/
  );
});
test('negative integration: results omitted despite trusted total_count fail closed',async()=>{
  const github=fakeTrustedGitHub({runTotalsOverride:{requested:1},truncateStatus:'requested'});
  const context={repo:{owner:SOLO,repo:'yusuf38bcs-oss.github.io'},sha:base,
    payload:{pull_request:{number:333}}};
  await assert.rejects(
    ()=>auditTrustedSuccessor({github,context,core:{info:()=>{}},guardName:'R91'}),
    /FAIL-CLOSED: incomplete requested run inventory/
  );
});
