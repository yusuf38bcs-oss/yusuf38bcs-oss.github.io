import test from 'node:test';
import assert from 'node:assert/strict';
import {MAIN,REPO,STATES,PATHS,evaluate,independentGate} from './yesaf-e7-containment-policy.mjs';
const now='2026-10-24T10:00:00Z';
function sample(){
 const make=at=>{const workflows=PATHS.map((path,i)=>({path,id:750000+i,state:'disabled_manually',updated_at:'2026-10-24T09:59:00Z'}));
 return {main:MAIN,at,workflows,runs:Object.fromEntries(STATES.map(s=>[s,Object.fromEntries(workflows.map(w=>[String(w.id),[]]))]))}};
 return {schema:'yesaf-e7/v1',repository:REPO,main:MAIN,observations:[make('2026-10-24T09:59:20Z'),make('2026-10-24T09:59:40Z')]};
}
test('positive census evidence never grants merge',()=>{const r=evaluate(sample(),now);assert.equal(r.known_workflows,10);assert.equal(r.merge_authority,false);assert.equal(r.production_release,'HOLD')});
function neg(label,fn){test('negative '+label,()=>{const x=sample();fn(x);assert.throws(()=>evaluate(x,now),/E7 FAIL-CLOSED/)})}
neg('schema',x=>x.schema='bad');
neg('main drift',x=>x.main='a'.repeat(40));
neg('repo',x=>x.repository='bad/repo');
neg('one snapshot',x=>x.observations.pop());
neg('main changes mid capture',x=>x.observations[1].main='f'.repeat(40));
neg('snapshot stale',x=>x.observations[0].at='2026-10-24T09:55:00Z');
neg('capture reversed',x=>x.observations.reverse());
neg('writer missing',x=>x.observations[0].workflows.pop());
neg('duplicate path',x=>x.observations[0].workflows[1].path=PATHS[0]);
neg('enabled writer',x=>x.observations[0].workflows[0].state='active');
neg('duplicate id',x=>x.observations[0].workflows[1].id=750000);
neg('missing status',x=>delete x.observations[1].runs.requested);
neg('missing workflow run inventory',x=>delete x.observations[1].runs.waiting['750000']);
neg('mutable registry race',x=>x.observations[1].workflows[0].updated_at='2026-10-24T09:59:40Z');
for(const s of STATES)neg('live writer status '+s,x=>x.observations[1].runs[s]['750000'].push({id:99}));
test('independent authorization cannot be self-asserted',()=>{const z=independentGate({repository:REPO,head:'a'.repeat(40),reviewer:'owner',approved:true});assert.equal(z.merge_authority,false);assert.equal(z.production_release,'HOLD')});
