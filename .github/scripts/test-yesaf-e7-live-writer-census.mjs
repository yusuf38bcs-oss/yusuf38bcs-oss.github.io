import test from 'node:test';
import assert from 'node:assert/strict';
import {ACTIVE,PUBLISHERS,onePass,stableObservation} from './yesaf-e7-live-writer-census.mjs';
function makeMock({enabledId=null,activeId=null,overCap=null,truncated=null,wrongId=null,drift=false}={}){
 let rounds=0;
 const mock=async url=>{
  const wf=url.match(/\/actions\/workflows\/(\d+)(?:\/(runs))?/);
  assert.ok(wf,'No API route match');
  const id=Number(wf[1]);const w=PUBLISHERS.find(x=>x.id===id);
  assert.ok(w,'Unrecognized workflow');
  if(!wf[2]){
   if(id===PUBLISHERS[0].id)rounds++;
   return {id:wrongId===id?id+1:id,path:'.github/workflows/'+w.path,
     state:(enabledId===id||(drift&&rounds>1&&id===PUBLISHERS[0].id))?'active':'disabled_manually'};
  }
  const s=new URL('https://test.invalid'+url).searchParams.get('status');
  assert.ok(ACTIVE.includes(s));
  const count=overCap?.id===id&&overCap?.status===s?1000:
    activeId===id&&s==='queued'?1:
    truncated?.id===id&&truncated?.status===s?2:0;
  const runs=activeId===id&&s==='queued'?[{id:42,workflow_id:id}]:[];
  return {total_count:count,workflow_runs:runs};
 };
 return mock;
}
test('ten known IDs include all eight Practical writers plus Museum and fallback publisher',()=>{
 assert.equal(PUBLISHERS.length,10);
 assert.equal(new Set(PUBLISHERS.map(x=>x.id)).size,10);
 assert.equal(PUBLISHERS.filter(x=>x.path.includes('production-parity')).length,8);
 assert.equal(ACTIVE.length,5);
});
test('complete per-ID reader inventory never authorizes a production write',async()=>{
 const result=await stableObservation(makeMock());
 assert.equal(result.decision,'READ_ONLY_CENSUS_PASS');
 assert.equal(result.observed.length,10);
 assert.equal(result.release,'HOLD');
 assert.equal(result.production_authority,false);
 assert.equal(result.merge_authority,false);
});
for(const [name,opts] of [
 ['re-enabled legacy workflow',{enabledId:PUBLISHERS[0].id}],
 ['active queued legacy run',{activeId:PUBLISHERS[1].id}],
 ['GitHub cap reached',{overCap:{id:PUBLISHERS[2].id,status:'waiting'}}],
 ['truncated result below cap',{truncated:{id:PUBLISHERS[3].id,status:'requested'}}],
 ['workflow registry ID mismatch',{wrongId:PUBLISHERS[4].id}],
 ['mutable state after initial read',{drift:true}]
]){
 test('negative: '+name+' denies readiness',async()=>{
  await assert.rejects(()=>stableObservation(makeMock(opts)),/YESAF E7 LIVE WRITER CENSUS HOLD:/);
 });
}
test('unexpected repository refuses API reads',async()=>{
 await assert.rejects(()=>onePass(makeMock(),'attacker/repo'),/untrusted repository/);
});
