#!/usr/bin/env node
// YESAF E4 science/publisher separation candidate: source custody, NEVER release authority.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {BASE, VALIDATORS, RETIREMENTS, SUCCESSORS, assess as assessCustody, liveSnapshot as custodySnapshot} from './yesaf-e4-academic-custody-witness.mjs';

export const BROWSERS=Object.freeze({
  appendages:'e54ef0b8aa2bd8669cd56c607e4920cbddcd0c6e',
  dissection:'3db9c53ed15106276ac73bc4d5e99bf1727b8cf5',
  museum:'88dc2e46eec830955ecdad3f1d7175572f788afc',
  'permanent-slides':'d2da3d58a08bef6c70e27ef17b0d191ed07b07c0',
  'temporary-mounts':'c0922971ae0ef6897d7274d0955ab17c8959a7fa',
  'whole-mounts':'71055f8823024d3f32b4cd729608cf197ed9d5bd',
  zooplankton:'b4130725c34f6def1d256b9a3aac6e7012d24b74',
  'field-report':'015352639c8979192b4dd085861aa94695ccfafb'
});
export const CERTIFICATIONS=Object.freeze({
  appendages:'f4ea9143420ed418ed282affe91e7b2ab6ce4d23',
  dissection:'a0f2fc6a67fd0242841cec4131ecc324de946910',
  museum:'3d13e59f5401aaf42a3459e997399014924a9b5a',
  'permanent-slides':'2506492809d7cbbcf728d9d0198ac4d39b20ede6',
  'temporary-mounts':'dd6420b8c4527eb6e744d8874225220e8ffc49ff',
  'whole-mounts':'bd7d8373c9b3c7879b780f4500df720485df40a3',
  zooplankton:'b57a6ff85767c94b06ed530b526ab0bf7d032598',
  'field-report':'a4690f4e3c563baefa19315d2bc6f837509618db'
});
// Whole subtree equality protects renamed/deleted files too. This is deliberately
// strict for an architecture-only cutover; educational changes need another PR.
export const SCIENCE_TREES=Object.freeze([
  '_biology','_data','_includes','_layouts','docs/academic/conv04',
  'assets/css','assets/js','scripts/zoology'
]);
const isSha = s=>/^[0-9a-f]{40}$/.test(String(s||''));
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const vpath=n=>'.github/scripts/validate-conv04f-zoology-practical-'+n+'.rb';
const bpath=n=>'.github/scripts/conv04f-zoology-practical-'+n+'-browser-certification.mjs';
const cpath=n=>'.github/workflows/conv04f-zoology-practical-'+n+'-certification.yml';
export function evaluate(s) {
  const errors=[];
  if(s?.base!==BASE || !isSha(s?.head) || s.head===BASE)errors.push('invalid exact SHA or historical baseline');
  if(!s?.custody || s.custody.source_custody!=='PASS' || s.custody.production_authority!==false)
    errors.push('eight-writer custody not independently retained');
  if(!Array.isArray(s?.changed)||new Set(s.changed).size!==s.changed.length)
    errors.push('changed-path inventory incomplete or duplicate');
  for(const dir of SCIENCE_TREES) {
    const pair=s.trees?.[dir];
    if(!pair || !isSha(pair.base) || !isSha(pair.head) || pair.base!==pair.head)
      errors.push('scientific subtree differs: '+dir);
  }
  for(const [name,blob] of Object.entries(VALIDATORS)){
    const path=vpath(name);
    if(s.files?.[path]!==blob)errors.push('original science validator drift: '+path);
    if(s.changed?.includes(path))errors.push('original validator in changed files: '+path);
  }
  for(const [name,blob] of Object.entries(BROWSERS)){
    const path=bpath(name);
    if(s.files?.[path]!==blob)errors.push('subject browser contract drift: '+path);
    if(s.changed?.includes(path))errors.push('subject browser in changed files: '+path);
  }
  for(const [name,blob] of Object.entries(CERTIFICATIONS)){
    const path=cpath(name);
    if(s.files?.[path]!==blob)errors.push('existing academic certification drift: '+path);
    if(s.changed?.includes(path))errors.push('original certification in changed files: '+path);
  }
  // Additional source restrictions are independent from the original scientific
  // validators and do not alter their required statuses.
  for(const name of Object.keys(RETIREMENTS)) {
    const path='.github/workflows/conv04f-zoology-practical-'+name+'-production-parity.yml';
    if(s.files?.[path]!==RETIREMENTS[name]) errors.push('publisher retirement drift: '+path);
    if(!s.changed?.includes(path))errors.push('publisher retirement absent: '+path);
  }
  for(const [path,blob] of Object.entries(SUCCESSORS)) {
    if(s.files?.[path]!==blob || !s.changed?.includes(path))
      errors.push('academic successor custody mismatch: '+path);
  }
  return Object.freeze({
    boundary:errors.length===0?'SOURCE_SEPARATION_PASS':'HOLD',
    scientific_source_custody:errors.length===0?'FROZEN':'UNVERIFIED',
    legacy_publisher_source_custody:errors.length===0?'FROZEN':'UNVERIFIED',
    old_preservation_checks:'STILL_REQUIRED_UNLESS_SEPARATELY_AUTHORIZED',
    independent_attestation:false, merge_authority:false, deploy_authority:false,
    production_release:'HOLD', errors
  });
}
export function snapshot() {
  const base=BASE;
  const head=git('rev-parse','HEAD');
  const changed=git('diff','--name-only',base+'...HEAD').split('\n').filter(Boolean);
  const custody=assessCustody(custodySnapshot());
  const files={};
  for(const n of Object.keys(VALIDATORS)){
    for(const path of [vpath(n),bpath(n),cpath(n),
      '.github/workflows/conv04f-zoology-practical-'+n+'-production-parity.yml'])
      files[path]=git('rev-parse','HEAD:'+path);
  }
  for(const path of Object.keys(SUCCESSORS))files[path]=git('rev-parse','HEAD:'+path);
  const trees={};
  for(const path of SCIENCE_TREES)trees[path]={
    base:git('rev-parse',base+':'+path),
    head:git('rev-parse','HEAD:'+path)
  };
  return {base,head,changed,files,trees,custody};
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const s=snapshot();
  const decision=evaluate(s);
  console.log(JSON.stringify({candidate:s.head,base:BASE,
    science_tree_count:SCIENCE_TREES.length,
    original_science_validators:Object.keys(VALIDATORS).length,
    original_browser_scripts:Object.keys(BROWSERS).length,
    original_academic_workflows:Object.keys(CERTIFICATIONS).length,
    retired_publisher_sources:Object.keys(RETIREMENTS).length,
    ...decision},null,2));
  if(decision.boundary!=='SOURCE_SEPARATION_PASS')process.exitCode=1;
}
