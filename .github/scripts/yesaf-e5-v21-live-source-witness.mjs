#!/usr/bin/env node
// Unprivileged PR-only source witness. It does not issue status or certificate.
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {BASE,PINNED_FILES,PINNED_TREES,verifyV21Custody,
  V21_RETIRED_BLOBS} from './yesaf-e5-predecessor-compatible-source-custody.mjs';
import {inspectMigration,inspectGit} from './yesaf-e4e5-source-migration-witness.mjs';
const SITE='yusuf38bcs-oss/yusuf38bcs-oss.github.io';
const sha=x=>/^[a-f0-9]{40}$/.test(String(x||''));
const fail=x=>{throw Error('V21_LIVE_SOURCE_HOLD: '+x)};
const must=(x,m)=>{if(!x)fail(m)};
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const object=(ref,path)=>{try{return git('rev-parse',ref+':'+path)}catch{return 'MISSING'}};
async function api(path,token){
 must(/^\/repos\/yusuf38bcs-oss\/yusuf38bcs-oss\.github\.io\/(?:commits\/[a-f0-9]{40}\/check-runs\?per_page=100|issues\/495\/comments\?per_page=100)$/.test(path),
   'unexpected GitHub route');
 const r=await fetch('https://api.github.com'+path,{method:'GET',redirect:'error',
   signal:AbortSignal.timeout(20000),headers:{Authorization:'Bearer '+token,
     Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}});
 must(r.status===200,'read-only GitHub evidence unavailable');
 const next=String(r.headers.get('link')||'');
 must(!/rel="next"/.test(next),'unread pagination');
 return r.json();
}
export function verifyChangedScope({changed,policy,head,base,objectAt=object}){
 const expected={...policy.retirement_blobs,...policy.additive_witness_blobs};
 must(Object.keys(expected).length===29 && changed.length===29 &&
   new Set(changed).size===29 && changed.every(p=>Object.hasOwn(expected,p)),
   'migration diff contains unreviewed paths');
 for(const [p,h] of Object.entries(expected)){
   must(objectAt(head,p)===h,'candidate blob drift '+p);
   if(Object.hasOwn(policy.additive_witness_blobs,p))
     must(objectAt(base,p)==='MISSING','additive path existed on protected base '+p);
 }
}
export async function inspectLiveV21(env=process.env){
 const head=git('rev-parse','HEAD'),base=String(env.BASE_SHA||'');
 must(sha(head)&&sha(base)&&head===env.HEAD_SHA &&
   git('ls-remote','origin','refs/heads/main').split(/\s+/)[0]===base,
   'stale exact head/main identity');
 execFileSync('git',['merge-base','--is-ancestor',base,head]);
 if(base===BASE)return inspectMigration(inspectGit());
 must(typeof env.GITHUB_TOKEN==='string'&&env.GITHUB_TOKEN.length>20,
   'read-only App check token missing');
 const policyPath='docs/yesaf/E5_VERSIONED_PROSPECTIVE_POLICY_V2_1.json';
 const blob=object(base,policyPath);
 must(sha(blob),'V2.1 not installed on protected main');
 const policy=JSON.parse(git('show',base+':'+policyPath));
 const checks=await api('/repos/'+SITE+'/commits/'+base+'/check-runs?per_page=100',env.GITHUB_TOKEN);
 must(checks?.total_count===checks?.check_runs?.length,'activation check inventory incomplete');
 const matches=checks.check_runs.filter(c=>c.app?.id===5266418 &&
   c.name==='LBFL Independent E5 V2.1 Source Attestation' &&
   c.status==='completed'&&c.conclusion==='success');
 must(matches.length===1,'missing or ambiguous independent activation');
 let record;try{record=JSON.parse(matches[0].output.summary)}catch{fail('invalid App check record')}
 const comments=await api('/repos/'+SITE+'/issues/495/comments?per_page=100',env.GITHUB_TOKEN);
 must(Array.isArray(comments)&&!comments.some(c=>c.user?.login==='yusuf38bcs-oss' &&
   c.body?.trim()===`YESAF-E5-V2.1-REVOKE: ${record.nonce}`),
   'activation revoked or comments unavailable');
 const activation={app:matches[0].app,head_sha:matches[0].head_sha,
   policy_blob:record.policyBlob,scope:record.scope,conclusion:matches[0].conclusion,
   expires_at:Date.parse(record.expires)};
 const files=ref=>Object.fromEntries(Object.keys(PINNED_FILES).map(p=>[p,object(ref,p)]));
 const trees=ref=>Object.fromEntries(Object.keys(PINNED_TREES).map(p=>[p,object(ref,p)]));
 const result=verifyV21Custody({policy,policyBlob:blob,
   main:{protected:true,commit:{sha:base},policy_blob:blob},head,base,
   candidateFiles:files(head),baselineFiles:files(BASE),
   candidateTrees:trees(head),baselineTrees:trees(BASE),activation});
 must(result.decision==='V21_CUSTODY_ELIGIBLE_ONLY',result.errors.join('; '));
 const changed=git('diff','--name-only',base+'...'+head).split('\n').filter(Boolean);
 verifyChangedScope({changed,policy,head,base});
 return {...result,actualCurrentSciencePending:true,originalV1FailuresRetained:true};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  try{console.log(JSON.stringify(await inspectLiveV21(),null,2))}
  catch(e){console.error(String(e.message||e));process.exitCode=1}
}
