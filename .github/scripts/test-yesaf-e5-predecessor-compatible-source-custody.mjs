import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BASE,PINNED_FILES,PINNED_TREES,verifyCustody,inspectLive} from './yesaf-e5-predecessor-compatible-source-custody.mjs';
const h='a'.repeat(40);
const make=()=>({base:BASE,baseLive:BASE,head:h,ancestor:true,files:{...PINNED_FILES},trees:{...PINNED_TREES}});
test('frozen inherited 42 artifacts and eight academic trees, never authorization',()=>{
 const r=verifyCustody(make());
 assert.equal(r.decision,'SOURCE_CUSTODY_PASS');
 assert.equal(r.protected_files,42);assert.equal(r.protected_science_trees,8);
 assert.equal(r.merge_authority,false);assert.equal(r.deploy_authority,false);
 assert.equal(r.independent_attestation,false);assert.equal(r.production_release,'HOLD');
});
for(const [label,change] of [
 ['wrong live main',p=>p.baseLive='b'.repeat(40)],
 ['wrong baseline',p=>p.base='c'.repeat(40)],
 ['candidate equals protected main',p=>p.head=BASE],
 ['candidate SHA malformed',p=>p.head='incomplete'],
 ['candidate not descended from base',p=>p.ancestor=false],
 ['mutated M1 evaluator',p=>p.files['.github/scripts/yesaf-production-authority-audit.mjs']='f'.repeat(40)],
 ['mutated M1 runner',p=>p.files['.github/workflows/yesaf-production-authority-audit.yml']='f'.repeat(40)],
 ['mutated R91 guard',p=>p.files['.github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml']='f'.repeat(40)],
 ['mutated R101 guard',p=>p.files['.github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml']='f'.repeat(40)],
 ['changed legacy publisher',p=>p.files['.github/workflows/conv04f-zoology-practical-zooplankton-production-parity.yml']='f'.repeat(40)],
 ['removed original Museum certification',p=>delete p.files['.github/workflows/conv04f-zoology-practical-museum-certification.yml']],
 ['changed Worker deployment',p=>p.files['.github/workflows/worker-production-deployment.yml']='f'.repeat(40)],
 ['changed scientific code tree',p=>p.trees['_biology']='f'.repeat(40)],
 ['changed academic source tree',p=>p.trees['_data']='f'.repeat(40)],
 ['removed visual scientific tree',p=>delete p.trees['assets/js']]
]){test('fail closed: '+label,()=>{const p=make();change(p);const r=verifyCustody(p);assert.equal(r.decision,'CUSTODY_HOLD');assert.ok(r.errors.length);});}
test('all 8 protected science validators, browser programs, certification workflows and publishers are pinned',()=>{
 for(const n of ['appendages','dissection','museum','permanent-slides','temporary-mounts','whole-mounts','zooplankton','field-report']){
  for(const p of [`.github/scripts/validate-conv04f-zoology-practical-${n}.rb`,
   `.github/scripts/conv04f-zoology-practical-${n}-browser-certification.mjs`,
   `.github/workflows/conv04f-zoology-practical-${n}-certification.yml`,
   `.github/workflows/conv04f-zoology-practical-${n}-production-parity.yml`])assert.match(PINNED_FILES[p],/^[a-f0-9]{40}$/);
 }
});
test('three-subject workflow is credential-free and tests preserved original science',()=>{
 const s=readFileSync('.github/workflows/yesaf-e5-three-practical-neutral-science.yml','utf8');
 for(const n of ['museum','zooplankton','field-report'])assert.ok(s.includes(n));
 assert.match(s,/on:\s*\n  pull_request:/);
 assert.match(s,/permissions:\s*\n  contents: read/);
 assert.match(s,/github\.event\.pull_request\.head\.sha/);
 assert.match(s,/--base-url http:\/\/127\.0\.0\.1:4173/);
 assert.match(s,/validate-conv04f-zoology-practical-/);
 assert.match(s,/yesaf-e5-predecessor-compatible-source-custody\.mjs/);
 for(const forbidden of [/pull_request_target:/,/\n  push:/,/secrets\./,/CLOUDFLARE_API_TOKEN/,/wrangler\s+(?:pages\s+)?deploy\b/,/actions\/deploy-pages@/,/\b(?:pages|id-token|deployments):\s*write\b/])assert.doesNotMatch(s,forbidden);
});
test('actual branch source custody is identical to pinned protected main',()=>{
 const r=verifyCustody(inspectLive());
 assert.equal(r.decision,'SOURCE_CUSTODY_PASS',r.errors.join('\n'));
});
