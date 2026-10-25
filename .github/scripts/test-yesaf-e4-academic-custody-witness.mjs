import test from 'node:test';
import assert from 'node:assert/strict';
import {BASE,VALIDATORS,RETIREMENTS,SUCCESSORS,assess,liveSnapshot} from './yesaf-e4-academic-custody-witness.mjs';
const validatorPath=n=>`.github/scripts/validate-conv04f-zoology-practical-${n}.rb`;
const retirementPath=n=>`.github/workflows/conv04f-zoology-practical-${n}-production-parity.yml`;
function fixture(){
 const objects=Object.fromEntries([
   ...Object.entries(VALIDATORS).map(([n,v])=>[validatorPath(n),v]),
   ...Object.entries(RETIREMENTS).map(([n,v])=>[retirementPath(n),v]),
   ...Object.entries(SUCCESSORS)
 ]);
 return {base:BASE,head:'a'.repeat(40),objects,
   changed:[...Object.keys(RETIREMENTS).map(retirementPath),...Object.keys(SUCCESSORS)]};
}
test('eight original academic validator blobs and eight source retirements are pinned',()=>{
 const x=fixture();
 assert.equal(Object.keys(VALIDATORS).length,8);
 assert.equal(Object.keys(RETIREMENTS).length,8);
 assert.equal(Object.keys(SUCCESSORS).length,2);
 assert.equal(assess(x).source_custody,'PASS');
 assert.equal(assess(x).release,'HOLD');
 assert.equal(assess(x).merge_authority,false);
});
test('source custody never produces merge/deploy authorization',()=>{
 assert.equal(assess(fixture()).production_authority,false);
});
for(const [name,mutate] of [
 ['stale base',x=>x.base='f'.repeat(40)],
 ['bad HEAD',x=>x.head='wrong'],
 ['duplicate path',x=>x.changed.push(x.changed[0])],
 ['missing academic successor',x=>x.changed.pop()],
 ['missing protected validator',x=>delete x.objects[validatorPath('museum')]],
 ['tampered scientific validator',x=>x.objects[validatorPath('zooplankton')]='b'.repeat(40)],
 ['science validator modified inside candidate',x=>x.changed.push(validatorPath('appendages'))],
 ['publisher retirement missing',x=>x.changed=x.changed.filter(y=>y!==retirementPath('field-report'))],
 ['publisher retirement altered',x=>x.objects[retirementPath('field-report')]='c'.repeat(40)],
 ['museum successor altered',x=>x.objects[Object.keys(SUCCESSORS)[1]]='d'.repeat(40)]
 ]){
 test('negative '+name+' fails closed',()=>{const x=fixture();mutate(x);const decision=assess(x);assert.equal(decision.source_custody,'HOLD');assert.ok(decision.errors.length>0);assert.equal(decision.release,'HOLD');});
}
test('run exact-head real repository source custody witness',()=>{
 const actual=liveSnapshot();const outcome=assess(actual);
 assert.equal(outcome.source_custody,'PASS',outcome.errors.join('\n'));
 assert.equal(outcome.production_authority,false);
});
