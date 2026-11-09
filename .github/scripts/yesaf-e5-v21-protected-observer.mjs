#!/usr/bin/env node
// Read-only observer. The workflow loads these bytes from protected main.
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {evaluateV21Source, SITE} from './yesaf-e5-v21-successor.mjs';

const SHA=/^[0-9a-f]{40}$/;
const ROOT='/repos/'+SITE;
const POLICY='docs/yesaf/E5_VERSIONED_PROSPECTIVE_POLICY_V2_1.json';
const NAME='LBFL Independent E5 V2.1 Source Attestation';
const SUBJECTS=['appendages','dissection','museum','permanent-slides',
  'temporary-mounts','whole-mounts','zooplankton','field-report'];
const fail=m=>{throw Error('V21_PROTECTED_OBSERVER_HOLD: '+m)};
const need=(v,m)=>{if(!v)fail(m)};
const hash=b=>createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');

export function verifyInvocation(e){
 need(e.GITHUB_REPOSITORY===SITE &&
   e.GITHUB_WORKFLOW_REF===SITE+'/.github/workflows/yesaf-e5-v21-protected-observer.yml@refs/heads/main' &&
   e.GITHUB_EVENT_NAME==='pull_request_target' &&
   e.GITHUB_REF==='refs/heads/main' &&
   Number(e.PR_NUMBER)===520 && SHA.test(e.GITHUB_SHA) &&
   SHA.test(e.TARGET_HEAD) && e.TARGET_HEAD!==e.GITHUB_SHA &&
   e.GITHUB_TOKEN?.length>20,'untrusted protected-main invocation');
 return {base:e.GITHUB_SHA,head:e.TARGET_HEAD,token:e.GITHUB_TOKEN};
}

export function verifyScienceRun(run,jobs,artifacts,head,base){
 need(run?.workflow_id===400121489 &&
   run.path==='.github/workflows/yesaf-e4e5-migration-science.yml' &&
   run.event==='pull_request' && run.head_sha===head &&
   run.run_attempt===1 && run.status==='completed' &&
   run.conclusion==='success' &&
   run.pull_requests?.some(p=>p.number===520 && p.base?.sha===base &&
     p.head?.sha===head),'wrong science issuer/head/base');
 need(jobs?.total_count===9 && jobs.jobs?.length===9 &&
   jobs.jobs.every(j=>j.run_id===run.id && j.head_sha===head &&
     j.status==='completed' && j.conclusion==='success') &&
   new Set(jobs.jobs.map(j=>j.name)).size===9,
   'incomplete current science jobs');
 const source=jobs.jobs.find(j=>j.name==='All eight retirement source blobs and original scientific custody');
 need(source?.steps?.some(s=>s.name==='Run genuine source custody and adversarial migration tests' &&
   s.conclusion==='success'),'missing current custody/gateway witness');
 for(const subject of SUBJECTS){
   const job=jobs.jobs.find(j=>j.name===subject+' original Ruby and exact-head browser (no writer)');
   need(job?.steps?.some(s=>s.name==='Validate current academic content and build exact candidate' &&
     s.conclusion==='success') &&
     job.steps.some(s=>s.name==='Run unchanged subject-specific browser and accessibility assertions' &&
       s.conclusion==='success'),'missing current academic/build/browser/Axe '+subject);
 }
 need(artifacts?.total_count===8 && artifacts.artifacts?.length===8 &&
   new Set(artifacts.artifacts.map(a=>a.name)).size===8 &&
   SUBJECTS.every(s=>artifacts.artifacts.some(a=>
     a.name==='yesaf-e4e5-'+s+'-'+head && a.expired===false)),
   'browser evidence artifacts absent/expired');
 return {head,base,sourceRunEvent:'pull_request',jobs:jobs.jobs,
   browserRoutesVerified:true,accessibilityVerified:true,buildVerified:true,
   practicalGatewayVerified:true,museumVerified:true,runId:run.id};
}


/* Read-only bounded re-observation on the existing pull_request_target event.
 * No workflow_run privilege addition, candidate checkout or status write.
 */
export async function awaitCurrentScienceRun(listRuns,readRun,head,{
 attempts=70,pause=ms=>new Promise(resolve=>setTimeout(resolve,ms))
}={}){
 need(SHA.test(head) && Number.isInteger(attempts) && attempts>0 && attempts<=80,
   'invalid bounded science observation');
 for(let i=0;i<attempts;i++){
   const page=await listRuns();
   need(Array.isArray(page?.workflow_runs) &&
     page.total_count===page.workflow_runs.length,'incomplete science run census');
   const candidates=page.workflow_runs.filter(r=>r.workflow_id===400121489 &&
     r.head_sha===head && r.run_attempt===1);
   need(candidates.length<=1,'ambiguous current science run');
   if(candidates.length===1){
     const r=await readRun(candidates[0].id);
     need(r?.id===candidates[0].id && r.workflow_id===400121489 &&
       r.path==='.github/workflows/yesaf-e4e5-migration-science.yml' &&
       r.event==='pull_request' && r.head_sha===head && r.run_attempt===1,
       'current science run identity drift');
     if(r.status==='completed'){
       need(r.conclusion==='success','current science run terminal non-success');
       return r;
     }
     need(['queued','in_progress','waiting','pending','requested'].includes(r.status),
       'unexpected current science run state');
   }
   if(i+1<attempts)await pause(10000);
 }
 fail('current science incomplete after bounded observation');
}

export function verifyActivation(c,comments,base,blob){
 need(c?.app?.id===5266418 && c.name===NAME && c.head_sha===base &&
   c.status==='completed' && c.conclusion==='success' &&
   typeof c.output?.summary==='string','missing independent App activation');
 let record;try{record=JSON.parse(c.output.summary)}catch{fail('invalid App record')}
 need(record.schema==='yesaf.e5.v2.1.source-attestation.v1' &&
   record.scope==='PROTECTED_MAIN_V2_1_ACTIVATION_ONLY' &&
   record.head===base && record.policyBlob===blob &&
   record.productionWriteAllowed===false &&
   record.productionReleaseAuthorized===false &&
   typeof record.nonce==='string' && Date.parse(record.expires)>Date.now(),
   'App activation record not source-only/current');
 need(Array.isArray(comments) && !comments.some(x=>
   x.user?.login==='yusuf38bcs-oss' &&
   x.body?.trim()===`YESAF-E5-V2.1-REVOKE: ${record.nonce}`),
   'App activation revoked');
 return {app:c.app,head_sha:c.head_sha,status:c.status,
   conclusion:c.conclusion,scope:record.scope,policy_blob:record.policyBlob,
   expires_at:Date.parse(record.expires)};
}

export async function observe(e=process.env,request=fetch){
 const {base,head,token}=verifyInvocation(e);
 const get=async path=>{
   need(path.startsWith(ROOT+'/') && !/[\r\n\\]/.test(path) &&
     !path.includes('..') && !path.includes('://'),'unapproved route');
   const r=await request('https://api.github.com'+path,{method:'GET',redirect:'error',
     signal:AbortSignal.timeout(20000),headers:{Authorization:'Bearer '+token,
       Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}});
   need(r?.status===200 && !/rel="next"/.test(r.headers.get('link')||''),
     'API unavailable or truncated '+path);
   return r.json();
 };
 const [main,pr,content,comparison,tree,baselineTree,files,checks,comments,runs]=await Promise.all([
   get(ROOT+'/branches/main'),get(ROOT+'/pulls/520'),
   get(ROOT+'/contents/'+POLICY+'?ref='+base),
   get(ROOT+'/compare/'+base+'...'+head),
   get(ROOT+'/git/trees/'+head+'?recursive=1'),
   get(ROOT+'/git/trees/3164d2537b4f19381c52bbfb5c9e1b7ee7d15846?recursive=1'),
   get(ROOT+'/pulls/520/files?per_page=100'),
   get(ROOT+'/commits/'+base+'/check-runs?per_page=100'),
   get(ROOT+'/issues/495/comments?per_page=100'),
   get(ROOT+'/actions/runs?head_sha='+head+'&event=pull_request&per_page=100')
 ]);
 need(main?.commit?.sha===base && main?.protected===true &&
   pr?.head?.sha===head && pr.base?.sha===base &&
   content?.encoding==='base64' && SHA.test(content.sha),
   'stale or unprotected main/PR/policy');
 const bytes=Buffer.from(content.content.replace(/\s/g,''),'base64');
 need(hash(bytes)===content.sha,'policy Git blob mismatch');
 need(checks?.total_count===checks.check_runs?.length &&
   Array.isArray(comments) && Array.isArray(files) &&
   runs?.total_count===runs.workflow_runs?.length &&
   tree?.truncated===false && baselineTree?.truncated===false,
   'incomplete protected evidence');
 const matched=checks.check_runs.filter(c=>c.app?.id===5266418 &&
   c.name===NAME && c.conclusion==='success');
 need(matched.length===1,'ambiguous independent activation');
 const activation=verifyActivation(matched[0],comments,base,content.sha);
 let firstScan=true;
 const run=await awaitCurrentScienceRun(async()=>{
   if(firstScan){firstScan=false;return runs}
   return get(ROOT+'/actions/runs?head_sha='+head+'&event=pull_request&per_page=100');
 },id=>get(ROOT+'/actions/runs/'+id),head);
 const [jobs,artifacts]=await Promise.all([
   get(ROOT+'/actions/runs/'+run.id+'/jobs?per_page=100'),
   get(ROOT+'/actions/runs/'+run.id+'/artifacts?per_page=100')
 ]);
 const science=verifyScienceRun(run,jobs,artifacts,head,base);
 const decision=evaluateV21Source({policy:JSON.parse(bytes),policyBlob:content.sha,
   installedMain:{protected:main.protected,commit:main.commit,policy_blob:content.sha},
   pr,comparison,tree,baselineTree,changedFiles:files,science,activation});
 return {...decision,scienceRun:run.id,appActivationCheck:matched[0].id,
   observerMain:base,certificateIssued:false,productionWriteAllowed:false};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 try{console.log(JSON.stringify(await observe(),null,2))}
 catch(e){console.error(String(e.message||e));process.exitCode=1}
}
