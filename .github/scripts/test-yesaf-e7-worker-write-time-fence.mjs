import test from 'node:test';
import assert from 'node:assert/strict';
import {assessReleasePacket,preWriteCheck} from './yesaf-e7-worker-write-time-fence.mjs';
import {PUBLISHERS} from './yesaf-e7-live-writer-census.mjs';
const sha='a'.repeat(40), now=Date.parse('2026-10-25T15:50:00Z');
const worker='yusuf38bcs-oss/yusuf38bcs-oss.github.io/.github/workflows/worker-production-deployment.yml@refs/heads/main';
const uuid1='f611cf1d-9a84-4b27-8317-d23446c99fcd';
const uuid2='dc2d049b-4334-4e06-9bcf-b9ac3dd031f2';
const REQUIRED=['validate','Cloudflare Pages','LBFL Trusted Release Governance',
  'LBFL Worker Static Preflight','YESAF M1 Trusted Static Authority'];
function fixture() {
 const input={repository:'yusuf38bcs-oss/yusuf38bcs-oss.github.io',
   ref:'refs/heads/main',event:'workflow_dispatch',actor:'yusuf38bcs-oss',
   triggeringActor:'yusuf38bcs-oss',workflowRef:worker,sha,eventSha:sha,runId:777,
   attempt:1,appId:1234,ownerGoSha:sha,rollbackPagesId:uuid1,rollbackWorkerVersion:uuid2};
 const summary=[
   'release_sha: '+sha,'release_run_id: 777','release_run_attempt: 1',
   'owner_go_sha: '+sha,'rollback_pages_uuid: '+uuid1,
   'rollback_worker_version: '+uuid2,
   'cloudflare_worker_token_scope: independently_verified',
   'cloudflare_pages_token_scope: independently_verified',
   'production_environment_protection: independently_verified',
   'single_writer_credential_exclusivity: independently_verified'
 ].join('\n');
 const branch={commit:{sha}};
 const run={id:777,head_sha:sha,head_branch:'main',event:'workflow_dispatch',
   run_attempt:1,run_started_at:'2026-10-25T15:49:00Z'};
 const statuses={statuses:REQUIRED.map(context=>({context,state:'success'}))};
 const checks={total_count:1,check_runs:[{name:'LBFL Independent Release Attestation',
   app:{id:1234,slug:'lbfl-release-attestor'},head_sha:sha,status:'completed',
   conclusion:'success',completed_at:'2026-10-25T15:49:30Z',output:{summary}}]};
 return {input,branch,run,statuses,checks,now};
}
function fromInput(input){
 return {GITHUB_REPOSITORY:input.repository,GITHUB_REF:input.ref,
 GITHUB_EVENT_NAME:input.event,GITHUB_ACTOR:input.actor,
 GITHUB_TRIGGERING_ACTOR:input.triggeringActor,GITHUB_WORKFLOW_REF:input.workflowRef,
 TARGET_SHA:input.sha,GITHUB_SHA:input.eventSha,GITHUB_RUN_ID:String(input.runId),
 GITHUB_RUN_ATTEMPT:String(input.attempt),YESAF_ATTESTOR_APP_ID:String(input.appId),
 YESAF_OWNER_GO_SHA:input.ownerGoSha,YESAF_ROLLBACK_PAGES_UUID:input.rollbackPagesId,
 YESAF_ROLLBACK_WORKER_VERSION_UUID:input.rollbackWorkerVersion};
}
function simulate(input,{flipAt=null,enabledId=null,queuedId=null}={}){
 let calls=0;
 const base='/repos/yusuf38bcs-oss/yusuf38bcs-oss.github.io';
 return async path=>{
  ++calls;
  const x=input;
  if(path===base+'/branches/main'){
    if(flipAt&&calls>=flipAt)return {commit:{sha:'b'.repeat(40)}};
    return x.branch;
  }
  if(path===base+'/actions/runs/777')return x.run;
  if(path===base+'/commits/'+sha+'/status')return x.statuses;
  if(path===base+'/commits/'+sha+'/check-runs?per_page=100')return x.checks;
  const wf=path.match(/\/actions\/workflows\/(\d+)(\/runs)?/);
  if(wf){
    const id=Number(wf[1]),p=PUBLISHERS.find(w=>w.id===id);
    assert.ok(p);
    if(!wf[2])return {id,path:'.github/workflows/'+p.path,
      state:enabledId===id?'active':'disabled_manually'};
    const query=new URL('https://test.invalid'+path).searchParams;
    const isQueued=queuedId===id&&query.get('status')==='queued';
    return {total_count:isQueued?1:0,workflow_runs:isQueued?[{id:123,workflow_id:id}]:[]};
  }
  throw new Error('Unexpected path '+path);
 };
}
test('only a full independent app-attested exact-worker packet can pass',()=>{
 const x=fixture(),p=assessReleasePacket(x);
 assert.equal(p.release_go,true);
 assert.equal(p.merge_authority,false);
 assert.equal(p.verified_credential_scope,true);
});
for(const [name,mutate] of [
 ['wrong main branch',x=>x.input.ref='refs/heads/preview'],
 ['PR event',x=>x.input.event='pull_request'],
 ['unknown writer workflow',x=>x.input.workflowRef='other'],
 ['wrong actor',x=>x.input.triggeringActor='attacker'],
 ['wrong run SHA',x=>x.run.head_sha='b'.repeat(40)],
 ['owner GO missing',x=>x.input.ownerGoSha=''],
 ['owner GO stale',x=>x.input.ownerGoSha='b'.repeat(40)],
 ['missing rollback',x=>x.input.rollbackWorkerVersion=''],
 ['unprovisioned attestor app',x=>x.input.appId=0],
 ['check forged GitHub Actions',x=>x.checks.check_runs[0].app.slug='github-actions'],
 ['wrong attestor app id',x=>x.checks.check_runs[0].app.id=55],
 ['attestor head mismatch',x=>x.checks.check_runs[0].head_sha='b'.repeat(40)],
 ['attestor fail',x=>x.checks.check_runs[0].conclusion='failure'],
 ['unbound run marker',x=>x.checks.check_runs[0].output.summary=x.checks.check_runs[0].output.summary.replace('release_run_id: 777','release_run_id: 0')],
 ['credential provenance absent',x=>x.checks.check_runs[0].output.summary=x.checks.check_runs[0].output.summary.replace('cloudflare_worker_token_scope: independently_verified','scope unknown')],
 ['environment review unverified',x=>x.checks.check_runs[0].output.summary=x.checks.check_runs[0].output.summary.replace('production_environment_protection: independently_verified','unverified')],
 ['no exclusive writer',x=>x.checks.check_runs[0].output.summary=x.checks.check_runs[0].output.summary.replace('single_writer_credential_exclusivity: independently_verified','unverified')],
 ['stale app check',x=>x.checks.check_runs[0].completed_at='2026-10-25T12:00:00Z'],
 ['missing trusted status',x=>x.statuses.statuses=x.statuses.statuses.filter(s=>s.context!=='YESAF M1 Trusted Static Authority')],
 ['red trusted status',x=>x.statuses.statuses.find(s=>s.context==='LBFL Trusted Release Governance').state='failure'],
 ['incomplete attestor run count',x=>x.checks.total_count=2],
 ['re-run attempt',x=>x.input.attempt=2]
]){
 test('negative '+name+' fail-closed',()=>{
   const x=fixture();mutate(x);
   assert.throws(()=>assessReleasePacket(x),/YESAF E7 WRITE-TIME HOLD/);
 });
}
test('live-check fixture requires ten complete disabled workflow observations',async()=>{
 const x=fixture(),get=simulate(x);
 const r=await preWriteCheck({get,env:fromInput(x.input),now:()=>now});
 assert.equal(r.release_go,true);
 assert.match(r.census,/10\/10 disabled/);
});
test('live-check fixture denies re-enabled legacy publisher even with attestation',async()=>{
 const x=fixture();
 await assert.rejects(()=>preWriteCheck({get:simulate(x,{enabledId:PUBLISHERS[0].id}),
   env:fromInput(x.input),now:()=>now}),/HOLD/);
});
test('live-check fixture denies queued old production deployment',async()=>{
 const x=fixture();
 await assert.rejects(()=>preWriteCheck({get:simulate(x,{queuedId:PUBLISHERS[1].id}),
   env:fromInput(x.input),now:()=>now}),/HOLD/);
});
test('live-check fixture denies main SHA change during prewrite census',async()=>{
 const x=fixture();
 await assert.rejects(()=>preWriteCheck({get:simulate(x,{flipAt:10}),
   env:fromInput(x.input),now:()=>now}),/HOLD/);
});

test('dormant Worker production workflow calls fence twice and isolates the write secret',async()=>{
  const {readFileSync}=await import('node:fs');
  const wf=readFileSync('.github/workflows/worker-production-deployment.yml','utf8');
  const deploy=wf.slice(wf.indexOf('\n  deploy:\n'));
  assert.match(deploy,/if: \$\{\{ false \}\}/,'Worker deployment must stay explicitly disabled');
  assert.match(deploy,/permissions:\s*\n\s*contents: read\s*\n\s*actions: read\s*\n\s*checks: read\s*\n\s*statuses: read/);
  assert.match(deploy,/YESAF_OWNER_GO_SHA: \$\{\{ vars\.YESAF_OWNER_GO_SHA \}\}/);
  assert.match(deploy,/YESAF_ATTESTOR_APP_ID: \$\{\{ vars\.YESAF_ATTESTOR_APP_ID \}\}/);
  assert.match(deploy,/node \.github\/scripts\/yesaf-e7-worker-write-time-fence\.mjs/g);
  const hits=deploy.match(/node \.github\/scripts\/yesaf-e7-worker-write-time-fence\.mjs/g)||[];
  assert.equal(hits.length,2);
  const write=deploy.indexOf('- name: Deploy exact main with single designated Cloudflare credential');
  const pre=deploy.indexOf('- name: Independently attest release');
  assert.ok(pre>=0&&write>pre);
  const envPrefix=deploy.slice(0,write);
  assert.doesNotMatch(envPrefix,/CLOUDFLARE_API_TOKEN:\s*\$\{\{\s*secrets\./);
  const writer=deploy.slice(write,deploy.indexOf('- name: Resolve exact-main Worker UUID',write));
  assert.match(writer,/CLOUDFLARE_API_TOKEN:\s*\$\{\{\s*secrets\.CLOUDFLARE_WORKER_DEPLOY_TOKEN\s*\}\}/);
  assert.ok(writer.indexOf('node .github/scripts/yesaf-e7-worker-write-time-fence.mjs') <
    writer.indexOf('wrangler deploy'));
});
