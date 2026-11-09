#!/usr/bin/env node
// YESAF E4/E5: immutable, source-preserving eight-publisher retirement witness.
// This is NOT a trusted status publisher or a release/merge/deployment certificate.
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {BASE,PINNED_FILES,PINNED_TREES} from './yesaf-e5-predecessor-compatible-source-custody.mjs';

export const APPROVED_RETIRED=Object.freeze({
  ".github/workflows/conv04f-zoology-practical-appendages-production-parity.yml": "a28bf51cac8e4ec07a9228d16d636b1a5af73972",
  ".github/workflows/conv04f-zoology-practical-dissection-production-parity.yml": "68e11e232a437823258f5f74530db51017ce5de4",
  ".github/workflows/conv04f-zoology-practical-museum-production-parity.yml": "bf91156ff62791c21f90c880e72838f2843c3926",
  ".github/workflows/conv04f-zoology-practical-permanent-slides-production-parity.yml": "a17d3221cc69dcb4b4760693814eec40d26d719e",
  ".github/workflows/conv04f-zoology-practical-temporary-mounts-production-parity.yml": "07b28127f234d5819e568497d206851230e13810",
  ".github/workflows/conv04f-zoology-practical-whole-mounts-production-parity.yml": "1f8f8ab0b9347a7c1c3e2e66e729ea1427c31a0a",
  ".github/workflows/conv04f-zoology-practical-zooplankton-production-parity.yml": "305b555b153c30719fedcc88164947a2c85fe5f9",
  ".github/workflows/conv04f-zoology-practical-field-report-production-parity.yml": "9c5facafde56309951db4e768f7040582c0aa96c"
});
export const EIGHT=Object.freeze(Object.keys(APPROVED_RETIRED));
const same40=s=>typeof s==='string'&&/^[0-9a-f]{40}$/.test(s);
const fail=m=>{throw Error('E4E5_MIGRATION_HOLD: '+m)};
const must=(b,m)=>{if(!b)fail(m)};
const matching=(a,b)=>Object.keys(a).length===Object.keys(b).length &&
  Object.entries(a).every(([p,id])=>b[p]===id);
export function inspectMigration(x) {
 must(x?.main===BASE&&x?.baseline===BASE&&same40(x?.head)&&x.head!==BASE &&
   x?.ancestor===true,'stale or invalid immutable repository identity');
 must(EIGHT.length===8&&new Set(EIGHT).size===8,'invalid writer retirement inventory');
 must(Object.keys(PINNED_FILES).length===41&&Object.keys(PINNED_TREES).length===8,
   'protected scientific witness contract was modified');
 for(const [p,sha] of Object.entries(PINNED_TREES))
   must(x?.trees?.[p]===sha,'academic tree changed: '+p);
 const restored=Object.fromEntries(Object.entries(PINNED_FILES)
   .filter(([p])=>!EIGHT.includes(p)));
 for(const [p,sha] of Object.entries(restored))
   must(x?.blobs?.[p]===sha,'protected scientific/control source changed: '+p);
 let old=0,newCount=0;
 for(const p of EIGHT) {
   must(same40(PINNED_FILES[p])&&same40(APPROVED_RETIRED[p]),'unreviewed identity');
   const actual=x?.blobs?.[p];
   if(actual===PINNED_FILES[p])old++;
   else if(actual===APPROVED_RETIRED[p])newCount++;
   else fail('unapproved publisher bytes: '+p);
 }
 must(newCount===8&&old===0,'partial migration forbidden: '+newCount+'/8 retired');
 for(const p of EIGHT) {
   const s=x?.contents?.[p];
   must(typeof s==='string'&&s.length>0,'missing retirement source: '+p);
   must(/^on:\n  workflow_dispatch:\n/m.test(s) &&
     /^permissions:\n  contents: read\n/m.test(s) &&
     /^jobs:\n  retired_notice:\n/m.test(s),
     'retired workflow not manual-only and unprivileged: '+p);
   must(!/\n  (?:push|pull_request|pull_request_target|workflow_run|schedule):/i.test(s) &&
     !/\b(?:secrets\.|CLOUDFLARE_API_TOKEN|CLOUDFLARE_PAGES_DEPLOY_TOKEN|CF_API_TOKEN)\b/i.test(s) &&
     !/\b(?:wrangler\s+(?:pages\s+)?deploy|actions\/deploy-pages@|cloudflare\/wrangler-action|pages:\s*write|id-token:\s*write)\b/i.test(s),
     'retired workflow contains publisher capability: '+p);
 }
 return Object.freeze({decision:'EIGHT_SOURCE_RETIREMENTS_VERIFIED_NON_AUTHORIZING',
   inherited_files_checked:41,untouched_protected_files:33,academic_trees_checked:8,
   proposed_retirements:8,academic_browser_scripts:'IMMUTABLE',
   trusted_predecessor_policy:'UNCHANGED_AND_STILL_AUTHORITATIVE',
   bypass_authorized:false,existing_guard_failures:'MUST_REMAIN_VISIBLE',
   runtime_quarantine_proven:false,release_certificate:false,
   protected_main_merge_authorized:false,production_write_authorized:false,
   production_decision:'HOLD_NO_GO',head:x.head,baseline:BASE});
}
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
export function inspectGit() {
 const head=git('rev-parse','HEAD');
 const main=git('ls-remote','origin','refs/heads/main').split(/\s+/)[0];
 let ancestor=false;
 try{execFileSync('git',['merge-base','--is-ancestor',BASE,head]);ancestor=true}catch{}
 const blobs={},trees={},contents={};
 for(const p of Object.keys(PINNED_FILES)) {
   try{blobs[p]=git('rev-parse',head+':'+p)}catch{blobs[p]='MISSING'}
 }
 for(const p of Object.keys(PINNED_TREES)) {
   try{trees[p]=git('rev-parse',head+':'+p)}catch{trees[p]='MISSING'}
 }
 for(const p of EIGHT) {
   try{contents[p]=git('show',head+':'+p)}catch{contents[p]=''}
 }
 return {baseline:BASE,head,main,ancestor,blobs,trees,contents};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 try{console.log(JSON.stringify(inspectMigration(inspectGit()),null,2))}
 catch(e){console.error(e.message);process.exitCode=1}
}
