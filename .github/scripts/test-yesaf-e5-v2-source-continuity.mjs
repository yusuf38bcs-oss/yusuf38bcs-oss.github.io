import test from 'node:test';
import assert from 'node:assert/strict';
import {PIN,evaluateSourceContinuity} from './yesaf-e5-v2-source-continuity.mjs';
const S=n=>n.toString(16).padStart(40,'0');
function fixture(){
  const source=Object.fromEntries([
    ...Object.keys(PIN.retirement).map((p,i)=>[p,S(100+i)]),
    ...Array.from({length:33},(_,i)=>['.github/trusted/immutable-'+i,S(500+i)])
  ]);
  const acad=Object.fromEntries(Array.from({length:8},(_,i)=>['_science/tree-'+i,S(800+i)]));
  const added=Array.from({length:17},(_,i)=>'.github/review/additive-'+i);
  const changed=[...Object.keys(PIN.retirement),...added];
  const jobs=Array.from({length:9},(_,i)=>'original-science-job-'+i);
  const manifest={BASE:PIN.historicalBase,HEAD:PIN.historicalHead,RUN:PIN.historicalRun,
    REPO:PIN.repository,ORIGINAL:source,ACADEMIC:acad,CHANGED:changed,JOBS:jobs};
  const sha=S(1100), base=PIN.historicalBase;
  const x={manifest_blob_sha:PIN.manifestBlob,main:{commit:{sha:base},protected:true},
    pr:{number:520,state:'open',changed_files:25,head:{sha,repo:{full_name:PIN.repository}},base:{sha:base,ref:'main'}},
    comparison:{merge_base_commit:{sha:base},ahead_by:2,behind_by:0},
    files:changed.map(f=>({filename:f,status:PIN.retirement[f]?'modified':'added',sha:PIN.retirement[f]||S(1000)})),
    tree:{truncated:false,tree:[...Object.entries(source).map(([path,id])=>({path,sha:PIN.retirement[path]||id,type:'blob',mode:'100644'})),...Object.entries(acad).map(([path,id])=>({path,sha:id,type:'tree',mode:'040000'}))]},
    run:{id:PIN.historicalRun,head_sha:PIN.historicalHead,workflow_id:PIN.historicalWorkflow,
      run_attempt:1,status:'completed',conclusion:'success',event:'pull_request',path:'.github/workflows/yesaf-e4e5-migration-science.yml',repository:{full_name:PIN.repository}},
    jobs:{total_count:9,jobs:jobs.map((name,i)=>({name,id:i+1,run_id:PIN.historicalRun,status:'completed',conclusion:'success'}))}}
  return {x,manifest};
}
test('current original base validates source continuity only, not any authority',()=>{
  const {x,manifest}=fixture();let a=evaluateSourceContinuity(x,manifest);
  assert.equal(a.preservedOriginalScienceJobs,9);
  for(const key of ['actualV2Installed','independentCertificateIssued','mergeAllowed','productionWriteAllowed','productionReleaseAuthorized'])
    assert.equal(a[key],false);
});
test('advanced protected main is valid only after actual candidate rebase and ancestry proof',()=>{
  const {x,manifest}=fixture();const next=S(2048);
  x.main.commit.sha=next;x.pr.base.sha=next;x.comparison.merge_base_commit.sha=next;
  assert.equal(evaluateSourceContinuity(x,manifest).currentMain,next);
});
const mutations=[
 ['wrong manifest sha',({x})=>x.manifest_blob_sha=S(4)],
 ['untrusted historical base',({manifest})=>manifest.BASE=S(4)],
 ['changed historical head',({manifest})=>manifest.HEAD=S(4)],
 ['changed original run',({x})=>x.run.id=0],
 ['unprotected main',({x})=>x.main.protected=false],
 ['broken base sha',({x})=>x.pr.base.sha=S(3)],
 ['stale candidate merge ancestry',({x})=>x.comparison.merge_base_commit.sha=S(3)],
 ['candidate behind main',({x})=>x.comparison.behind_by=1],
 ['foreign PR head repo',({x})=>x.pr.head.repo.full_name='attacker/repo'],
 ['candidate closed',({x})=>x.pr.state='closed'],
 ['incomplete diff',({x})=>x.files.pop()],
 ['changed diff path',({x})=>x.files[10].filename='attacker/deploy.yml'],
 ['renamed source',({x})=>x.files[0].previous_filename='old.yml'],
 ['unreviewed retirement hash',({x})=>x.files[0].sha=S(5)],
 ['publisher deletion',({x})=>x.files[0].status='removed'],
 ['protected control-plane drift',({x})=>x.tree.tree.find(t=>t.path.includes('immutable-1')).sha=S(7)],
 ['academic tree drift',({x})=>x.tree.tree.find(t=>t.path.startsWith('_science')).sha=S(9)],
 ['retirement tree drift',({x})=>x.tree.tree.find(t=>t.path.includes('production-parity')).sha=S(8)],
 ['truncated git tree',({x})=>x.tree.truncated=true],
 ['duplicate git tree path',({x})=>x.tree.tree.push({...x.tree.tree[0]})],
 ['original run rerun attempt',({x})=>x.run.run_attempt=2],
 ['original run changed sha',({x})=>x.run.head_sha=S(13)],
 ['failed historical science job',({x})=>x.jobs.jobs[3].conclusion='failure'],
 ['skipped browser job',({x})=>x.jobs.jobs[2].conclusion='skipped'],
 ['missing original browser job',({x})=>x.jobs.jobs.pop()],
 ['duplicate original job name',({x})=>x.jobs.jobs[2].name=x.jobs.jobs[1].name],
];
for(const [name,change] of mutations)
  test('fail closed: '+name,()=>{const v=fixture();change(v);assert.throws(()=>evaluateSourceContinuity(v.x,v.manifest),/YESAF_V2_HOLD:/)});
