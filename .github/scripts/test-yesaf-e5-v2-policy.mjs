import test from 'node:test';
import assert from 'node:assert/strict';
import {PIN} from './yesaf-e5-v2-source-continuity.mjs';
import {evaluateV2ProspectiveAcceptance,V2_POLICY_VERSION,CONTEXT_APPS} from './yesaf-e5-v2-policy.mjs';
import {readFileSync} from 'node:fs';
const policyTemplate=JSON.parse(readFileSync(new URL('../../docs/yesaf/E5_VERSIONED_PROSPECTIVE_POLICY_V2.json',import.meta.url)));
const S=n=>n.toString(16).padStart(40,'0');
function fixture(){
  const source=Object.fromEntries([
    ...Object.keys(PIN.retirement).map((p,i)=>[p,S(100+i)]),
    ...Array.from({length:33},(_,i)=>['.github/trusted/immutable-'+i,S(500+i)])
  ]);
  const acad=Object.fromEntries(Array.from({length:8},(_,i)=>['_science/tree-'+i,S(800+i)]));
  const added=Array.from({length:17},(_,i)=>'.github/review/additive-'+i);
  const changed=[...Object.keys(PIN.retirement),...added];
  const jobs=Array.from({length:9},(_,i)=>'original-science-job-'+i);
  const manifest={BASE:PIN.historicalBase,HEAD:PIN.historicalHead,RUN:PIN.historicalRun,
    REPO:PIN.repository,ORIGINAL:source,ACADEMIC:acad,CHANGED:changed,JOBS:jobs};
  const sha=S(1100), base=PIN.historicalBase;
  const x={manifest_blob_sha:PIN.manifestBlob,main:{commit:{sha:base},protected:true},
    pr:{number:520,state:'open',changed_files:25,head:{sha,repo:{full_name:PIN.repository}},base:{sha:base,ref:'main'}},
    comparison:{merge_base_commit:{sha:base},ahead_by:2,behind_by:0},
    files:changed.map(f=>({filename:f,status:PIN.retirement[f]?'modified':'added',sha:PIN.retirement[f]||S(1000)})),
    tree:{truncated:false,tree:[...Object.entries(source).map(([path,id])=>({path,sha:PIN.retirement[path]||id,type:'blob',mode:'100644'})),...Object.entries(acad).map(([path,id])=>({path,sha:id,type:'tree',mode:'040000'}))]},
    run:{id:PIN.historicalRun,head_sha:PIN.historicalHead,workflow_id:PIN.historicalWorkflow,
      run_attempt:1,status:'completed',conclusion:'success',event:'pull_request',path:'.github/workflows/yesaf-e4e5-migration-science.yml',repository:{full_name:PIN.repository}},
    jobs:{total_count:9,jobs:jobs.map((name,i)=>({name,id:i+1,run_id:PIN.historicalRun,status:'completed',conclusion:'success'}))}}
  return {x,manifest};
}

function setup(){
 const {x,manifest}=fixture(); const policy=structuredClone(policyTemplate);
 const policyBlob=S(57001), head=x.pr.head.sha;
 const currentChecks={total_count:5,check_runs:Object.entries(CONTEXT_APPS).map(([name,appId],i)=>({name,app:{id:appId},head_sha:head,started_at:new Date(Date.UTC(2026,9,29,10,i)).toISOString(),status:'completed',conclusion:'success'}))};
 const ownerApproval={issuer:'yusuf38bcs-oss',scope:'E5_V2_SOURCE_ONLY',approved:true,repository:PIN.repository,pr:520,
 head,base:x.main.commit.sha,policy_blob:policyBlob,production_write_allowed:false,
 production_release_authorized:false,authenticated:true,replay_checked:true};
 return {sourcePacket:x,originalManifest:manifest,policy,policyBlob,
 trustedMain:{sha:x.main.commit.sha,protected:true,policy_blob:policyBlob},ownerApproval,
 currentChecks,currentCommitStatuses:{sha:head,statuses:[]},oldGuardFindings:{R91:'failure',R101:'failure',historical_results_preserved:true,prospective_supersession_only:true}};
}
test('prospective contract is evidence-only and never issues authorization',()=>{
 const x=setup();const out=evaluateV2ProspectiveAcceptance(x);
 assert.equal(out.certificateIssued,false);assert.equal(out.productionWriteAllowed,false);
 assert.equal(out.policyActivatedInThisEvaluation,false);assert.equal(out.originalGuardFailuresPreserved,true);
});
const negatives=[
 ['missing trusted installed policy',(x)=>{x.trustedMain.policy_blob=S(123)}],
 ['wrong policy scope',(x)=>{x.policy.scope='PRODUCTION'}],
 ['owner not authenticated',(x)=>{x.ownerApproval.authenticated=false}],
 ['owner approval stale head',(x)=>{x.ownerApproval.head=S(12)}],
 ['owner approval replay',(x)=>{x.ownerApproval.replay_checked=false}],
 ['owner approval for write',(x)=>{x.ownerApproval.production_write_allowed=true}],
 ['different retired scope',(x)=>{x.policy.retirement_paths.pop()}],
 ['guard failure forged green',(x)=>{x.oldGuardFindings.R91='success'}],
 ['old guard results changed',(x)=>{x.oldGuardFindings.historical_results_preserved=false}],
 ['incomplete check results',(x)=>{x.currentChecks.total_count=40}],
 ['wrong issuer',(x)=>{x.currentChecks.check_runs[0].app.id=9999}],
 ['required check failed',(x)=>{x.currentChecks.check_runs[3].conclusion='failure'}],
 ['required check neutral',(x)=>{x.currentChecks.check_runs[3].conclusion='neutral'}],
 ['missing required check',(x)=>{x.currentChecks.check_runs.pop();x.currentChecks.total_count--}],
 ['duplicate check and status',(x)=>{x.currentCommitStatuses.statuses.push({context:'Cloudflare Pages',state:'success'})}],
 ['ambiguous duplicate timestamp',(x)=>{x.currentChecks.check_runs.push({...x.currentChecks.check_runs[0]});x.currentChecks.total_count++}],
 ['candidate wrong base',(x)=>{x.sourcePacket.pr.base.sha=S(6)}],
 ['changed academic tree',(x)=>{x.sourcePacket.tree.tree.find(t=>t.path.startsWith('_science')).sha=S(35)}],
 ['unauthorized retirement blob',(x)=>{x.sourcePacket.files[0].sha=S(47)}],
 ['science evidence failure',(x)=>{x.sourcePacket.jobs.jobs[0].conclusion='failure'}]
];
for(const [name,mutate] of negatives) test('fail closed: '+name,()=>{const f=setup();mutate(f);assert.throws(()=>evaluateV2ProspectiveAcceptance(f),/V2_POLICY_HOLD|YESAF_V2_HOLD/)});
