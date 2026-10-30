import test from 'node:test';
import assert from 'node:assert/strict';
import {BASE,HEAD,PR,RUN,REPO,ORIGINAL,ACADEMIC,RETIRED,CHANGED,JOBS,verifyPacket,inspectLive} from './yesaf-e4e5-trusted-policy-bridge.mjs';
function fixture(){
 const tree=[
  ...Object.entries(ORIGINAL).filter(([p])=>!Object.hasOwn(RETIRED,p))
     .map(([path,sha])=>({path,sha,type:'blob',mode:'100644'})),
  ...Object.entries(RETIRED).map(([path,sha])=>({path,sha,type:'blob',mode:'100644'})),
  ...Object.entries(ACADEMIC).map(([path,sha])=>({path,sha,type:'tree',mode:'040000'}))
 ];
 return {main:{commit:{sha:BASE}},
  pr:{number:PR,state:'open',draft:true,changed_files:25,
   head:{sha:HEAD,repo:{full_name:REPO}},base:{ref:'main',sha:BASE}},
  files:CHANGED.map(filename=>({filename,
   sha:RETIRED[filename]||'a'.repeat(40),status:Object.hasOwn(RETIRED,filename)?'modified':'added'})),
  run:{id:RUN,head_sha:HEAD,repository:{full_name:REPO},
   path:'.github/workflows/yesaf-e4e5-migration-science.yml',workflow_id:400121489,
   event:'pull_request',run_attempt:1,status:'completed',conclusion:'success'},
  jobs:{total_count:9,jobs:JOBS.map((name,i)=>({name,id:100+i,run_id:RUN,status:'completed',conclusion:'success'}))},
  tree:{truncated:false,tree}};
}
test('review-only certificate validates eight retirements and nine academic jobs but cannot authorize',()=>{
 const r=verifyPacket(fixture());
 assert.equal(r.exactRetiredPublishers,8);assert.equal(r.untouchedProtectedFiles,33);
 assert.equal(r.academicTrees,8);assert.equal(r.realScienceAndBrowserJobs,9);
 for(const key of ['mergeAllowed','independentAppCertificate','trustedStatusWritten',
  'policyActivated','productionWriteAllowed'])assert.equal(r[key],false);
 assert.equal(r.production,'HOLD_NO_GO');
});
const cases=[
 ['main moved',x=>x.main.commit.sha='b'.repeat(40)],
 ['PR head changed',x=>x.pr.head.sha='b'.repeat(40)],
 ['base changed',x=>x.pr.base.sha='c'.repeat(40)],
 ['wrong repository',x=>x.pr.head.repo.full_name='attacker/other'],
 ['PR closed',x=>x.pr.state='closed'],
 ['PR file list truncated',x=>x.files.pop()],
 ['changed file duplicated',x=>x.files[1].filename=x.files[0].filename],
 ['unexpected file path',x=>x.files[0].filename='unsafe/deploy.yml'],
 ['file renamed',x=>x.files[0].previous_filename='other.yml'],
 ['unapproved retirement blob',x=>x.files.find(f=>Object.hasOwn(RETIRED,f.filename)).sha='f'.repeat(40)],
 ['old publisher restored',x=>x.files.find(f=>Object.hasOwn(RETIRED,f.filename)).sha=ORIGINAL[Object.keys(RETIRED)[0]]],
 ['retirement deleted',x=>x.files.find(f=>Object.hasOwn(RETIRED,f.filename)).status='removed'],
 ['wrong PR changed count',x=>x.pr.changed_files=24],
 ['evidence run wrong SHA',x=>x.run.head_sha='a'.repeat(40)],
 ['evidence run from other repo',x=>x.run.repository.full_name='x/y'],
 ['wrong run workflow',x=>x.run.workflow_id=123],
 ['run still in progress',x=>x.run.status='in_progress'],
 ['run failed',x=>x.run.conclusion='failure'],
 ['rerun nonfirst attempt',x=>x.run.run_attempt=2],
 ['wrong workflow event',x=>x.run.event='workflow_dispatch'],
 ['incomplete jobs',x=>x.jobs.jobs.pop()],
 ['jobs count drift',x=>x.jobs.total_count=8],
 ['duplicate job name',x=>x.jobs.jobs[1].name=x.jobs.jobs[0].name],
 ['subject browser failed',x=>x.jobs.jobs[4].conclusion='failure'],
 ['subject browser skipped',x=>x.jobs.jobs[4].conclusion='skipped'],
 ['foreign workflow run job',x=>x.jobs.jobs[4].run_id=999],
 ['tree response truncated',x=>x.tree.truncated=true],
 ['academic source tree altered',x=>x.tree.tree.find(y=>y.path==='_biology').sha='d'.repeat(40)],
 ['original scientific browser changed',x=>x.tree.tree.find(y=>y.path.includes('zooplankton-browser-certification')).sha='f'.repeat(40)],
 ['original R91 guard changed',x=>x.tree.tree.find(y=>y.path.includes('zooplankton-successor-guard')).sha='e'.repeat(40)],
 ['original R101 guard changed',x=>x.tree.tree.find(y=>y.path.includes('field-report-successor-guard')).sha='e'.repeat(40)],
 ['wrong retired publisher tree blob',x=>x.tree.tree.find(y=>y.path===Object.keys(RETIRED)[0]).sha='d'.repeat(40)],
 ['duplicate tree path',x=>x.tree.tree.push({...x.tree.tree[0]})]
];
for(const [name,change] of cases)test('fail closed: '+name,()=>{
 const x=fixture();change(x);
 assert.throws(()=>verifyPacket(x),/YESAF_E5_POLICY_HOLD/);
});
test('adapter invokes only exact six authenticated GETs, non-authorizing',async()=>{
 const packet=fixture();
 const keys=[
  '/repos/'+REPO+'/branches/main','/repos/'+REPO+'/pulls/'+PR,
  '/repos/'+REPO+'/pulls/'+PR+'/files?per_page=100',
  '/repos/'+REPO+'/actions/runs/'+RUN,
  '/repos/'+REPO+'/actions/runs/'+RUN+'/jobs?per_page=100',
  '/repos/'+REPO+'/git/trees/'+HEAD+'?recursive=1'];
 const data=Object.fromEntries(keys.map((key,i)=>[key,[packet.main,packet.pr,packet.files,packet.run,packet.jobs,packet.tree][i]]));
 const calls=[];
 const request=async(url,options)=>{const key=url.replace('https://api.github.com','');
  calls.push({key,options});
  return {status:200,ok:true,json:async()=>structuredClone(data[key])};
 };
 const result=await inspectLive({token:'test-read-token',request});
 assert.equal(result.productionWriteAllowed,false);assert.equal(calls.length,6);
 assert.ok(calls.every(c=>c.options.method==='GET'&&c.options.headers.Authorization==='Bearer test-read-token'));
});
test('API denial stops; token not echoed',async()=>{
 await assert.rejects(inspectLive({token:'SENSITIVE_TEST',request:async()=>({status:403,ok:false})}),e=>
 e.message.includes('YESAF_E5_POLICY_HOLD')&&!e.message.includes('SENSITIVE_TEST'));
});
