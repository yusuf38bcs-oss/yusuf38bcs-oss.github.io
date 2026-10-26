#!/usr/bin/env node
// YESAF E7 Worker at-write-time fence. Enforces fail-closed policy, NEVER deploys.
// Deliberately non-authorizing unless an independent App attests this RUN + SHA.
import {stableObservation} from './yesaf-e7-live-writer-census.mjs';
import {verifyWorkflowTree} from './yesaf-e7-workflow-source-freeze.mjs';
import {fileURLToPath} from 'node:url';

const REPO='yusuf38bcs-oss/yusuf38bcs-oss.github.io';
const CHECK='LBFL Independent Release Attestation';
const REQUIRED=Object.freeze([
  'validate','Cloudflare Pages','LBFL Trusted Release Governance',
  'LBFL Worker Static Preflight','YESAF M1 Trusted Static Authority'
]);
const lowerSha=x=>/^[0-9a-f]{40}$/.test(String(x||''));
const fail=x=>{throw new Error('YESAF E7 WRITE-TIME HOLD: '+x);};
const expect=(yes,why)=>{if(!yes)fail(why);};
function lines(s){return String(s||'').split(/\r?\n/).map(x=>x.trim());}
function fresh(t,now){
 const elapsed=now-Date.parse(t||'');
 return Number.isFinite(elapsed)&&elapsed>=0&&elapsed<=15*60*1000;
}
export function assessReleasePacket({input,branch,run,statuses,checks,now=Date.now()}){
 expect(input?.repository===REPO,'repository identity');
 expect(input.ref==='refs/heads/main','non-main release');
 expect(input.event==='workflow_dispatch','only manually authorized dispatch may write');
 expect(input.actor==='yusuf38bcs-oss'&&input.triggeringActor==='yusuf38bcs-oss','actor identity mismatch');
 expect(input.workflowRef===REPO+'/.github/workflows/worker-production-deployment.yml@refs/heads/main','wrong writer workflow revision/ref');
 expect(lowerSha(input.sha)&&input.sha===input.eventSha,'unverified exact main SHA');
 expect(Number.isSafeInteger(input.runId)&&input.runId>0,'missing workflow run ID');
 expect(Number.isSafeInteger(input.attempt)&&input.attempt===1,'unapproved rerun attempt');
 expect(Number.isSafeInteger(input.appId)&&input.appId>0,'independent App ID not provisioned');
 expect(input.ownerGoSha===input.sha,'explicit owner production GO missing or stale');
 expect(/^[0-9a-f-]{36}$/.test(String(input.rollbackPagesId||'')), 'rollback Pages UUID missing');
 expect(/^[0-9a-f-]{36}$/.test(String(input.rollbackWorkerVersion||'')), 'rollback Worker UUID missing');
 expect(branch?.commit?.sha===input.sha,'main moved before write');
 expect(run?.id===input.runId&&run?.head_sha===input.sha&&run?.head_branch==='main',
   'writer run head is not current main');
 expect(run?.event==='workflow_dispatch'&&run?.run_attempt===input.attempt,
   'writer run event or attempt mismatch');
 expect(fresh(run?.run_started_at||run?.created_at,now),'writer run too old or future-dated');
 expect(Array.isArray(statuses?.statuses),'GitHub status list unavailable');
 const seen=new Map();
 for(const s of statuses.statuses){
   if(!seen.has(s.context))seen.set(s.context,s);
 }
 for(const key of REQUIRED){
   const s=seen.get(key);
   expect(s?.state==='success','required exact-main context missing/failing: '+key);
   expect(s?.sha===undefined||s.sha===input.sha,'status SHA inconsistency: '+key);
 }
 expect(Number.isSafeInteger(checks?.total_count)&&checks.total_count===checks.check_runs?.length,
   'incomplete independent attestor check-run inventory');
 const accepted=checks.check_runs.filter(c=>c.name===CHECK&&c.app?.id===input.appId &&
   c.app?.slug!=='github-actions'&&c.head_sha===input.sha&&c.status==='completed'&&
   c.conclusion==='success'&&fresh(c.completed_at,now)&&
   lines(c.output?.summary).includes('release_sha: '+input.sha)&&
   lines(c.output?.summary).includes('release_run_id: '+input.runId)&&
   lines(c.output?.summary).includes('release_run_attempt: '+input.attempt)&&
   lines(c.output?.summary).includes('owner_go_sha: '+input.sha)&&
   lines(c.output?.summary).includes('rollback_pages_uuid: '+input.rollbackPagesId)&&
   lines(c.output?.summary).includes('rollback_worker_version: '+input.rollbackWorkerVersion)&&
   lines(c.output?.summary).includes('cloudflare_worker_token_scope: independently_verified')&&
   lines(c.output?.summary).includes('cloudflare_pages_token_scope: independently_verified')&&
   lines(c.output?.summary).includes('production_environment_protection: independently_verified')&&
   lines(c.output?.summary).includes('single_writer_credential_exclusivity: independently_verified'));
 expect(accepted.length===1,'no unique independent fresh app attestation bound to this run');
 return {decision:'CANDIDATE_WRITE_FENCE_PASS_ONLY',release_sha:input.sha,
   run_id:input.runId,attestor_app_id:input.appId,
   // A source check cannot prove credential exclusivity or environment reviews.
   verified_credential_scope:true,independent_environment_review:true,
   release_go:true,merge_authority:false};
}
function inputFromEnvironment(env){
 return {
   repository:env.GITHUB_REPOSITORY,ref:env.GITHUB_REF,event:env.GITHUB_EVENT_NAME,
   actor:env.GITHUB_ACTOR,triggeringActor:env.GITHUB_TRIGGERING_ACTOR,
   workflowRef:env.GITHUB_WORKFLOW_REF,sha:env.TARGET_SHA,eventSha:env.GITHUB_SHA,
   runId:Number(env.GITHUB_RUN_ID),attempt:Number(env.GITHUB_RUN_ATTEMPT),
   appId:Number(env.YESAF_ATTESTOR_APP_ID),
   ownerGoSha:env.YESAF_OWNER_GO_SHA,
   rollbackPagesId:env.YESAF_ROLLBACK_PAGES_UUID,
   rollbackWorkerVersion:env.YESAF_ROLLBACK_WORKER_VERSION_UUID
 };
}
export async function preWriteCheck({get,env,now=Date.now}){
 const input=inputFromEnvironment(env);
 expect(lowerSha(input.sha),'no exact target SHA');
 expect(input.repository===REPO,'repository mismatch');
 // Before consuming any publishing credential, independently enforce all identity checks.
 const root='/repos/'+REPO;
 const read=()=>Promise.all([
   get(root+'/branches/main'),
   get(root+'/actions/runs/'+input.runId),
   get(root+'/commits/'+input.sha+'/status'),
   get(root+'/commits/'+input.sha+'/check-runs?per_page=100')
 ]);
 const first=await read();
 const result=assessReleasePacket({input,branch:first[0],run:first[1],statuses:first[2],
   checks:first[3],now:now()});
 // Reject any novel, missing or modified GitHub Actions workflow source before
 // consuming a Cloudflare credential; legacy ID census is a separate runtime gate.
 // The immutable tree check is not independent production authority by itself.
 const sourceTree=await get(root+'/git/trees/'+input.sha+'?recursive=1');
 verifyWorkflowTree(sourceTree,input.sha);
 // Inspect all registered legacy publishers by workflow ID twice; reject API caps,
 // active requests and disabled->enabled races.
 const census=await stableObservation(get,REPO);
 expect(census.all_known_legacy_publishers_disabled===true &&
   census.observed.length===10,'incomplete known writer disablement');
 // Re-authenticate ALL identity, required status and attestation immediately after census.
 const second=await read();
 assessReleasePacket({input,branch:second[0],run:second[1],statuses:second[2],
   checks:second[3],now:now()});
 expect(JSON.stringify(first)===JSON.stringify(second),
   'main/attestation/required status changed during fence');
 // Evidence returned remains bound to this step only. Do not cache across jobs.
 return {...result,census:'10/10 disabled and zero active runs in double observation',
   decision:'ATTESTED_WRITE_TIME_FENCE_PASS__WORKER_ONLY',release_go:true};
}
export async function runWithAuthenticatedGet(env=process.env){
 const token=env.GH_TOKEN;
 expect(Boolean(token),'GitHub read token absent');
 const root='/repos/'+REPO+'/';
 const get=async path=>{
   expect(path.startsWith(root)&&!/[^\x20-\x7e]/.test(path),'untrusted GitHub API request');
   const response=await fetch('https://api.github.com'+path,{
     headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json',
       'X-GitHub-Api-Version':'2022-11-28', 'User-Agent':'YESAF-E7-Worker-WriteFence'},
     method:'GET',redirect:'error',signal:AbortSignal.timeout(20000)
   });
   expect(response.status===200,'GitHub authority GET failed HTTP '+response.status);
   return response.json();
 };
 return preWriteCheck({get,env});
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 try{
   const result=await runWithAuthenticatedGet();
   process.stdout.write(JSON.stringify(result)+'\n');
 }catch(e){process.stderr.write(String(e.message)+'\n');process.exitCode=1;}
}
