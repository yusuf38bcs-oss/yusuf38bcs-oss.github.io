import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyActivation,verifyInvocation,verifyScienceRun,awaitCurrentScienceRun}
  from './yesaf-e5-v21-protected-observer.mjs';

const head='a'.repeat(40),base='b'.repeat(40),blob='c'.repeat(40);
const subjects=['appendages','dissection','museum','permanent-slides',
  'temporary-mounts','whole-mounts','zooplankton','field-report'];
const env={GITHUB_REPOSITORY:'yusuf38bcs-oss/yusuf38bcs-oss.github.io',
  GITHUB_WORKFLOW_REF:'yusuf38bcs-oss/yusuf38bcs-oss.github.io/.github/workflows/yesaf-e5-v21-protected-observer.yml@refs/heads/main',
  GITHUB_EVENT_NAME:'pull_request_target',GITHUB_REF:'refs/heads/main',
  GITHUB_SHA:base,TARGET_HEAD:head,PR_NUMBER:'520',GITHUB_TOKEN:'x'.repeat(30)};
const record={schema:'yesaf.e5.v2.1.source-attestation.v1',
  scope:'PROTECTED_MAIN_V2_1_ACTIVATION_ONLY',head:base,policyBlob:blob,
  productionWriteAllowed:false,productionReleaseAuthorized:false,
  nonce:'unique',expires:new Date(Date.now()+3600000).toISOString()};
const check={app:{id:5266418},name:'LBFL Independent E5 V2.1 Source Attestation',
  head_sha:base,status:'completed',conclusion:'success',
  output:{summary:JSON.stringify(record)}};
const run={id:123,workflow_id:400121489,
  path:'.github/workflows/yesaf-e4e5-migration-science.yml',
  event:'pull_request',head_sha:head,run_attempt:1,status:'completed',
  conclusion:'success',pull_requests:[{number:520,base:{sha:base},head:{sha:head}}]};
const steps=(names)=>names.map(name=>({name,conclusion:'success'}));
const jobs={total_count:9,jobs:[
  {run_id:123,head_sha:head,status:'completed',conclusion:'success',
    name:'All eight retirement source blobs and original scientific custody',
    steps:steps(['Run genuine source custody and adversarial migration tests'])},
  ...subjects.map(s=>({run_id:123,head_sha:head,status:'completed',
    conclusion:'success',name:s+' original Ruby and exact-head browser (no writer)',
    steps:steps(['Validate current academic content and build exact candidate',
      'Run unchanged subject-specific browser and accessibility assertions'])}))
]};
const artifacts={total_count:8,artifacts:subjects.map(s=>({
  name:'yesaf-e4e5-'+s+'-'+head,expired:false}))};

test('protected-main identity and exact scoped event',()=>{
 assert.equal(verifyInvocation(env).head,head);
 for(const mutation of [{GITHUB_EVENT_NAME:'pull_request'},
   {GITHUB_WORKFLOW_REF:'candidate'}, {PR_NUMBER:'521'},
   {GITHUB_SHA:head}, {GITHUB_TOKEN:''}])
   assert.throws(()=>verifyInvocation({...env,...mutation}));
});
test('independent App activation cannot be absent, stale, expired or revoked',()=>{
 assert.equal(verifyActivation(check,[],base,blob).policy_blob,blob);
 assert.throws(()=>verifyActivation({...check,app:{id:15368}},[],base,blob));
 assert.throws(()=>verifyActivation(check,[],head,blob));
 assert.throws(()=>verifyActivation(check,[],base,head));
 assert.throws(()=>verifyActivation(check,[{user:{login:'yusuf38bcs-oss'},
   body:'YESAF-E5-V2.1-REVOKE: unique'}],base,blob));
 assert.throws(()=>verifyActivation({...check,output:{summary:JSON.stringify({
   ...record,expires:'2000-01-01T00:00:00Z'})}},[],base,blob));
});
test('nine current science jobs and eight browser artifacts are required',()=>{
 assert.equal(verifyScienceRun(run,jobs,artifacts,head,base).jobs.length,9);
 assert.throws(()=>verifyScienceRun({...run,head_sha:base},jobs,artifacts,head,base));
 assert.throws(()=>verifyScienceRun({...run,pull_requests:[]},jobs,artifacts,head,base));
 assert.throws(()=>verifyScienceRun(run,{...jobs,total_count:8},artifacts,head,base));
 assert.throws(()=>verifyScienceRun(run,{...jobs,jobs:jobs.jobs.map((j,i)=>
   i===1?{...j,steps:[]}:j)},artifacts,head,base));
 assert.throws(()=>verifyScienceRun(run,jobs,{...artifacts,artifacts:[
   {...artifacts.artifacts[0],expired:true},...artifacts.artifacts.slice(1)]},head,base));
});

test('bounded observer resamples absent/running science and holds failure or drift',async()=>{
 const waiting={...run,status:'in_progress',conclusion:null};
 const completed={...run,status:'completed',conclusion:'success'};
 let scans=0;
 const v=await awaitCurrentScienceRun(async()=>({total_count:++scans===1?0:1,
   workflow_runs:scans===1?[]:[waiting]}),async()=>completed,head,
   {attempts:2,pause:async()=>{}});
 assert.equal(v.id,run.id);assert.equal(scans,2);
 const list=async()=>({total_count:1,workflow_runs:[waiting]});
 await assert.rejects(()=>awaitCurrentScienceRun(list,async()=>({...completed,conclusion:'failure'}),
   head,{attempts:1}),/terminal non-success/);
 await assert.rejects(()=>awaitCurrentScienceRun(list,async()=>({...completed,head_sha:base}),
   head,{attempts:1}),/identity drift/);
 await assert.rejects(()=>awaitCurrentScienceRun(async()=>({total_count:0,workflow_runs:[]}),
   async()=>completed,head,{attempts:2,pause:async()=>{}}),/incomplete after bounded/);
 await assert.rejects(()=>awaitCurrentScienceRun(async()=>({total_count:2,workflow_runs:[waiting,waiting]}),
   async()=>completed,head,{attempts:1}),/ambiguous current/);
});
