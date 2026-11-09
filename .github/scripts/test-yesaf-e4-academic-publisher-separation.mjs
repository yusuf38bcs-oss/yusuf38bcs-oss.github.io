import test from 'node:test';
import assert from 'node:assert/strict';
import {BASE,VALIDATORS,RETIREMENTS,SUCCESSORS} from './yesaf-e4-academic-custody-witness.mjs';
import {BROWSERS,CERTIFICATIONS,SCIENCE_TREES,evaluate,snapshot} from './yesaf-e4-academic-publisher-separation.mjs';
const fake=()=> {
 const files={};
 const names=Object.keys(VALIDATORS);
 for(const n of names){
   files['.github/scripts/validate-conv04f-zoology-practical-'+n+'.rb']=VALIDATORS[n];
   files['.github/scripts/conv04f-zoology-practical-'+n+'-browser-certification.mjs']=BROWSERS[n];
   files['.github/workflows/conv04f-zoology-practical-'+n+'-certification.yml']=CERTIFICATIONS[n];
   files['.github/workflows/conv04f-zoology-practical-'+n+'-production-parity.yml']=RETIREMENTS[n];
 }
 Object.assign(files,SUCCESSORS);
 const changed=[...names.map(n=>'.github/workflows/conv04f-zoology-practical-'+n+'-production-parity.yml'),
   ...Object.keys(SUCCESSORS)];
 return {base:BASE,head:'a'.repeat(40),files,changed,
  trees:Object.fromEntries(SCIENCE_TREES.map(k=>[k,{base:'b'.repeat(40),head:'b'.repeat(40)}])),
  custody:{source_custody:'PASS',production_authority:false}
 };
};
test('eight original subject-science, browser, certification source contracts frozen',()=>{
  assert.equal(Object.keys(VALIDATORS).length,8);
  assert.equal(Object.keys(BROWSERS).length,8);
  assert.equal(Object.keys(CERTIFICATIONS).length,8);
  assert.equal(Object.keys(RETIREMENTS).length,8);
  const result=evaluate(fake());
  assert.equal(result.boundary,'SOURCE_SEPARATION_PASS',result.errors.join('\n'));
  assert.equal(result.scientific_source_custody,'FROZEN');
  assert.equal(result.deploy_authority,false);
  assert.equal(result.merge_authority,false);
  assert.equal(result.independent_attestation,false);
  assert.equal(result.production_release,'HOLD');
});
for(const [title,mutate] of [
  ['stale base',s=>s.base='c'.repeat(40)],
  ['missing changed-file inventory',s=>delete s.changed],
  ['duplicate changed path',s=>s.changed.push(s.changed[0])],
  ['science page edited',s=>s.trees._biology.head='e'.repeat(40)],
  ['science manifest edited',s=>s.trees._data.head='e'.repeat(40)],
  ['shared practical CSS edited',s=>s.trees['assets/css'].head='e'.repeat(40)],
  ['science evidence ledger edited',s=>s.trees['docs/academic/conv04'].head='e'.repeat(40)],
  ['scientific validator tampered',s=>s.files['.github/scripts/validate-conv04f-zoology-practical-museum.rb']='e'.repeat(40)],
  ['browser science script tampered',s=>s.files['.github/scripts/conv04f-zoology-practical-zooplankton-browser-certification.mjs']='e'.repeat(40)],
  ['old academic certification workflow altered',s=>s.files['.github/workflows/conv04f-zoology-practical-field-report-certification.yml']='e'.repeat(40)],
  ['publisher resurrected',s=>s.files['.github/workflows/conv04f-zoology-practical-museum-production-parity.yml']='e'.repeat(40)],
  ['publisher retirement hidden',s=>s.changed=s.changed.filter(x=>!x.includes('field-report-production-parity.yml'))],
  ['Museum successor altered',s=>s.files['.github/workflows/yesaf-museum-readonly-certification.yml']='e'.repeat(40)],
  ['custody audit failed',s=>s.custody.source_custody='HOLD'],
  ['custody claims deployment authority',s=>s.custody.production_authority=true]
]){
  test('negative '+title+' must HOLD',()=>{
    const x=fake(); mutate(x);
    const o=evaluate(x); assert.equal(o.boundary,'HOLD',o.errors.join('\n'));
    assert.equal(o.production_release,'HOLD');
    assert.equal(o.merge_authority,false);assert.equal(o.deploy_authority,false);
  });
}
test('current candidate retains exact eight sciences and eight retired publisher blobs',()=>{
  const decision=evaluate(snapshot());
  assert.equal(decision.boundary,'SOURCE_SEPARATION_PASS',decision.errors.join('\n'));
  assert.equal(decision.production_release,'HOLD');
});
