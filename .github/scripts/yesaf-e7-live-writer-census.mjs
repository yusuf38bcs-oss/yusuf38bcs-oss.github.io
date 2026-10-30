// YESAF E7: GET-only complete per-workflow active-run census.
// It is not an authority to merge or deploy. A privileged writer must call an
// independently authorized fence at write time, not reuse a historical PASS.
export const ACTIVE = Object.freeze(['requested','queued','in_progress','waiting','pending']);
export const PUBLISHERS = Object.freeze([
  {id:375019175,path:'conv04f-zoology-practical-appendages-production-parity.yml'},
  {id:374812867,path:'conv04f-zoology-practical-dissection-production-parity.yml'},
  {id:375936276,path:'conv04f-zoology-practical-field-report-production-parity.yml'},
  {id:374302078,path:'conv04f-zoology-practical-museum-production-parity.yml'},
  {id:374762454,path:'conv04f-zoology-practical-permanent-slides-production-parity.yml'},
  {id:374834932,path:'conv04f-zoology-practical-temporary-mounts-production-parity.yml'},
  {id:374785099,path:'conv04f-zoology-practical-whole-mounts-production-parity.yml'},
  {id:375236520,path:'conv04f-zoology-practical-zooplankton-production-parity.yml'},
  {id:374252032,path:'conv04f-zoology-practical-museum-certification.yml'},
  {id:285412395,path:'jekyll-gh-pages.yml'}
]);
function guard(ok,why){if(!ok)throw new Error('YESAF E7 LIVE WRITER CENSUS HOLD: '+why);}
const clean = x=>Number.isSafeInteger(x)&&x>=0;
export async function onePass(apiGet,repository='yusuf38bcs-oss/yusuf38bcs-oss.github.io'){
 guard(repository==='yusuf38bcs-oss/yusuf38bcs-oss.github.io','untrusted repository');
 const snapshot=[];
 const workflowIDs=new Set();
 for(const expected of PUBLISHERS){
   guard(!workflowIDs.has(expected.id),'duplicate publisher ID');
   workflowIDs.add(expected.id);
   const workflow=await apiGet(`/repos/${repository}/actions/workflows/${expected.id}`);
   guard(workflow?.id===expected.id,'wrong workflow registry ID '+expected.id);
   guard(workflow?.path?.endsWith('/'+expected.path),'publisher path mismatch '+expected.id);
   guard(workflow?.state==='disabled_manually','legacy writer enabled '+expected.id);
   const byStatus={};
   for(const status of ACTIVE){
     const base=`/repos/${repository}/actions/workflows/${expected.id}/runs?status=${status}&per_page=100`;
     const first=await apiGet(base+'&page=1');
     const total=first?.total_count;
     guard(clean(total),'missing '+status+' run count '+expected.id);
     guard(total<1000,'GitHub filtered-run 1000-result cap reached '+expected.id+':'+status);
     const entries=[];
     const pages=Math.ceil(total/100);
     for(let page=1;page<=pages;page++){
       const data=page===1?first:await apiGet(base+'&page='+page);
       guard(Array.isArray(data?.workflow_runs),'missing run page '+expected.id);
       entries.push(...data.workflow_runs);
     }
     guard(entries.length===total,'truncated run list '+expected.id+':'+status);
     const seen=new Set();
     for(const run of entries){
       guard(clean(run?.id)&&run.id>0&&!seen.has(run.id),'invalid/duplicate run id');
       guard(run.workflow_id===expected.id,'API returned other workflow run');
       seen.add(run.id);
     }
     guard(entries.length===0,'legacy publisher has active '+status+' run '+expected.id);
     byStatus[status]=0;
   }
   snapshot.push({id:expected.id,path:expected.path,state:workflow.state,active:byStatus});
 }
 return snapshot;
}
export async function stableObservation(apiGet,repo){
 const before=await onePass(apiGet,repo);
 const after=await onePass(apiGet,repo);
 guard(JSON.stringify(before)===JSON.stringify(after),'publisher inventory drift during observation');
 return {decision:'READ_ONLY_CENSUS_PASS',all_known_legacy_publishers_disabled:true,
  production_authority:false,merge_authority:false,release:'HOLD',observed:after};
}
