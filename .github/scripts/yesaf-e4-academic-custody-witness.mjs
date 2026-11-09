#!/usr/bin/env node
// YESAF E4 academic custody witness. Read-only/PR-only. NEVER release authority.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const BASE = '3164d2537b4f19381c52bbfb5c9e1b7ee7d15846';
export const VALIDATORS = Object.freeze({
  appendages:'e0b25189300804447108bcc201e97653330e0e87',
  dissection:'7318e8c3215838093b68978760746e9c4240fb72',
  museum:'43aa1d96c71e524f0af4eca954766e51e9c423f5',
  'permanent-slides':'7efc49f9a063385e18dda50221f30bfb865f2cdb',
  'temporary-mounts':'4e588a411174b23225a8bb5d796e77f48af573ac',
  'whole-mounts':'fc9b9f07164676798b4f98fe7802053dddd0f929',
  zooplankton:'a74579452d68d9684b270b2a3b1f4ee4e0d3815c',
  'field-report':'cef2b7aca4f5a388421d89e39213947016341e43'
});
export const RETIREMENTS = Object.freeze({
  appendages:'a28bf51cac8e4ec07a9228d16d636b1a5af73972',
  dissection:'68e11e232a437823258f5f74530db51017ce5de4',
  museum:'bf91156ff62791c21f90c880e72838f2843c3926',
  'permanent-slides':'a17d3221cc69dcb4b4760693814eec40d26d719e',
  'temporary-mounts':'07b28127f234d5819e568497d206851230e13810',
  'whole-mounts':'1f8f8ab0b9347a7c1c3e2e66e729ea1427c31a0a',
  zooplankton:'305b555b153c30719fedcc88164947a2c85fe5f9',
  'field-report':'9c5facafde56309951db4e768f7040582c0aa96c'
});
export const SUCCESSORS = Object.freeze({
 '.github/workflows/yesaf-e4-practical-five-readonly-successors.yml':'f9fc4772a82f67ffe9637d2c7e00fe5a353a2de6',
 '.github/workflows/yesaf-museum-readonly-certification.yml':'2a17be8742e4530d10e8bb2a63942728d1fceb38'
});
const sha40 = x => /^[a-f0-9]{40}$/.test(x);
export function assess({base,head,changed,objects}) {
 const errors=[];
 if(base!==BASE || !sha40(head) || head===base) errors.push('exact SHA/approved immutable baseline mismatch');
 if(!Array.isArray(changed)||new Set(changed).size!==changed.length) errors.push('invalid changed-path inventory');
 if(!objects||typeof objects!=='object') errors.push('missing trusted git object inventory');
 const protectedNames=Object.keys(VALIDATORS).map(n=>`.github/scripts/validate-conv04f-zoology-practical-${n}.rb`);
 for(const path of protectedNames) {
   const name=path.split('validate-conv04f-zoology-practical-')[1].replace('.rb','');
   if(objects?.[path]!==VALIDATORS[name]) errors.push('protected validator drift: '+path);
   if(changed?.includes(path)) errors.push('validator modified by candidate: '+path);
 }
 for(const [name,blob] of Object.entries(RETIREMENTS)){
   const path=`.github/workflows/conv04f-zoology-practical-${name}-production-parity.yml`;
   if(objects?.[path]!==blob)errors.push('retirement source not pinned: '+path);
   if(!changed?.includes(path))errors.push('retirement missing from proposed cutover: '+path);
 }
 for(const [path,blob] of Object.entries(SUCCESSORS)) {
   if(objects?.[path]!==blob)errors.push('academic successor not pinned: '+path);
   if(!changed?.includes(path))errors.push('academic successor missing: '+path);
 }
 return Object.freeze({
   source_custody:errors.length===0?'PASS':'HOLD',
   production_authority:false,
   merge_authority:false,
   release:'HOLD',
   errors
 });
}
function git(...args){return execFileSync('git',args,{encoding:'utf8'}).trim();}
export function liveSnapshot(){
 const head=git('rev-parse','HEAD');
 const base=BASE;
 const changed=git('diff','--name-only',base+'...HEAD').split('\n').filter(Boolean);
 const objects={};
 const paths=[
   ...Object.keys(VALIDATORS).map(n=>`.github/scripts/validate-conv04f-zoology-practical-${n}.rb`),
   ...Object.keys(RETIREMENTS).map(n=>`.github/workflows/conv04f-zoology-practical-${n}-production-parity.yml`),
   ...Object.keys(SUCCESSORS)
 ];
 for(const path of paths){
   objects[path]=git('rev-parse','HEAD:'+path);
 }
 return {head,base,changed,objects};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const s=liveSnapshot();
 const outcome=assess(s);
 console.log(JSON.stringify({head:s.head,base:s.base,changed_count:s.changed.length,...outcome},null,2));
 if(outcome.source_custody!=='PASS')process.exitCode=1;
}
