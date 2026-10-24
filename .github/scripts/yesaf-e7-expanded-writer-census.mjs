#!/usr/bin/env node
// YESAF E7 expanded source-to-runtime inventory. READ-ONLY / ADVISORY ONLY.
import {execFileSync} from 'node:child_process';
import {MAIN,REPO,STATES} from './yesaf-e7-containment-policy.mjs';
const PATHS=[
  ".github/workflows/adsense-browser-certification.yml",
  ".github/workflows/ai-pr-safety-gate.yml",
  ".github/workflows/codeql-exact-head.yml",
  ".github/workflows/conv04f-zoology-practical-appendages-production-parity.yml",
  ".github/workflows/conv04f-zoology-practical-dissection-production-parity.yml",
  ".github/workflows/conv04f-zoology-practical-field-report-production-parity.yml",
  ".github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml",
  ".github/workflows/conv04f-zoology-practical-museum-certification.yml",
  ".github/workflows/conv04f-zoology-practical-museum-production-parity.yml",
  ".github/workflows/conv04f-zoology-practical-permanent-slides-production-parity.yml",
  ".github/workflows/conv04f-zoology-practical-temporary-mounts-production-parity.yml",
  ".github/workflows/conv04f-zoology-practical-whole-mounts-production-parity.yml",
  ".github/workflows/conv04f-zoology-practical-zooplankton-certification.yml",
  ".github/workflows/conv04f-zoology-practical-zooplankton-production-parity.yml",
  ".github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml",
  ".github/workflows/ecology-production-live-certification.yml",
  ".github/workflows/ielts-reading-browser-certification.yml",
  ".github/workflows/ielts-speaking-browser-certification.yml",
  ".github/workflows/ielts-typography-browser-certification.yml",
  ".github/workflows/ielts-writing-browser-certification.yml",
  ".github/workflows/jekyll-gh-pages.yml",
  ".github/workflows/lbfl-ci.yml",
  ".github/workflows/ops-verify-pages-artifact.yml",
  ".github/workflows/production-certification.yml",
  ".github/workflows/worker-production-deployment.yml",
  ".github/workflows/zoology-practical-browser-certification.yml"
];
const fail=m=>{throw Error('E7 EXPANDED HOLD: '+m)};
function get(route){
 if(!/^repos\/yusuf38bcs-oss\/yusuf38bcs-oss\.github\.io\/(branches\/main|actions\/workflows\?per_page=100&page=[0-9]+|actions\/workflows\/[0-9]+\/runs\?status=(requested|queued|in_progress|waiting|pending)&per_page=1)$/.test(route))fail('non-allowlisted GET');
 try{return JSON.parse(execFileSync('gh',['api','--method','GET',route],{encoding:'utf8',timeout:30000,maxBuffer:4500000,windowsHide:true,stdio:['ignore','pipe','pipe']}))}
 catch{fail('authenticated GitHub GET failed: '+route.replace(/\?.*/,''))}
}
const root='repos/'+REPO;
function registry(){
 const all=[];let count=null;
 for(let page=1;page<=10;page++){
  const r=get(root+'/actions/workflows?per_page=100&page='+page);
  if(!Number.isSafeInteger(r.total_count)||!Array.isArray(r.workflows))fail('registry result malformed');
  if(count!==null&&count!==r.total_count)fail('registry total changed');
  count=r.total_count;
  all.push(...r.workflows);
  if(all.length===count)break;
  if(all.length>count||page===10)fail('registry incomplete or capped');
 }
 return all;
}
function stateInventory(all){
 return PATHS.map(path=>{
  const rows=all.filter(w=>w.path===path);
  if(rows.length>1)fail('duplicate registered workflow: '+path);
  const w=rows[0];
  if(!w)return {path,id:null,state:'NOT_REGISTERED',updated_at:null,active_runs:'UNVERIFIED'};
  if(!Number.isSafeInteger(w.id)||w.id<=0||typeof w.state!=='string'||typeof w.updated_at!=='string')fail('workflow metadata incomplete');
  const counts={};
  for(const st of STATES){
   const a=get(root+'/actions/workflows/'+w.id+'/runs?status='+st+'&per_page=1');
   if(!Number.isSafeInteger(a.total_count)||!Array.isArray(a.workflow_runs))fail('run query malformed: '+path+'/'+st);
   counts[st]=a.total_count;
  }
  return {path,id:w.id,state:w.state,updated_at:w.updated_at,active_runs:counts};
 });
}
function evaluateRows(rows){
 const enabled=rows.filter(x=>x.state==='active');
 const missing=rows.filter(x=>x.state==='NOT_REGISTERED');
 const running=rows.filter(x=>typeof x.active_runs==='object'&&Object.values(x.active_runs).some(n=>n>0));
 return {schema:'yesaf-e7-expanded-writer-inventory/v1',main:MAIN,scanned_source_flags:PATHS.length,registered:rows.length-missing.length,enabled_candidates:enabled.map(x=>x.path),unregistered_candidates:missing.map(x=>x.path),candidates_with_live_runs:running.map(x=>x.path),verification:'ADVISORY_NOT_EFFECTIVE_WRITER_PROOF',production_release:'HOLD',merge_authority:false,rows};
}
function selftest(){
 if(PATHS.length!==26||new Set(PATHS).size!==26||PATHS.some(p=>!/^\.github\/workflows\/[a-z0-9-]+\.yml$/.test(p)))fail('flagged source inventory invalid');
 const test=evaluateRows([{path:PATHS[0],state:'active',active_runs:{queued:1}},{path:PATHS[1],state:'disabled_manually',active_runs:{queued:0}}]);
 if(test.merge_authority!==false||test.production_release!=='HOLD'||test.candidates_with_live_runs.length!==1)fail('non-authorizing contract broken');
 console.log('E7_EXPANDED_STATIC_TEST=PASS');
}
try {
 if(process.argv.length!==3||!['--live','--self-test'].includes(process.argv[2]))fail('only --live or --self-test');
 selftest();
 if(process.argv[2]==='--live'){
  if(get(root+'/branches/main').commit?.sha!==MAIN)fail('protected main moved');
  const a=registry();
  const rows=stateInventory(a);
  const b=registry();
  const compact=x=>x.filter(y=>PATHS.includes(y.path)).map(y=>y.path+':'+y.id+':'+y.state+':'+y.updated_at).sort();
  if(JSON.stringify(compact(a))!==JSON.stringify(compact(b)))fail('registry changed during collection');
  if(get(root+'/branches/main').commit?.sha!==MAIN)fail('protected main moved during collection');
  console.log(JSON.stringify(evaluateRows(rows),null,2));
 }
} catch(e){console.error(String(e.message||e));process.exitCode=1}
