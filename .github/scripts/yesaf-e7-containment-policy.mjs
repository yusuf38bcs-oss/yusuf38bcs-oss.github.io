// YESAF E7 shadow policy. No result can grant release, deployment or merge authority.
export const MAIN='3164d2537b4f19381c52bbfb5c9e1b7ee7d15846';
export const REPO='yusuf38bcs-oss/yusuf38bcs-oss.github.io';
export const STATES=['requested','queued','in_progress','waiting','pending'];
export const PATHS=[...['appendages','dissection','museum','permanent-slides','temporary-mounts','whole-mounts','zooplankton','field-report'].map(x=>'.github/workflows/conv04f-zoology-practical-'+x+'-production-parity.yml'),'.github/workflows/jekyll-gh-pages.yml','.github/workflows/conv04f-zoology-practical-museum-certification.yml'];
function fail(x){throw new Error('E7 FAIL-CLOSED: '+x)}
function same(a,b){return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&new Set(a).size===a.length&&new Set(b).size===b.length&&JSON.stringify([...a].sort())===JSON.stringify([...b].sort())}
function stamp(x){const v=Date.parse(x);if(!Number.isFinite(v))fail('missing timestamp');return v}
export function evaluate(x,now){
 if(!x||x.schema!=='yesaf-e7/v1'||x.repository!==REPO||x.main!==MAIN)fail('schema, repository or main SHA');
 if(!Array.isArray(x.observations)||x.observations.length!==2)fail('two observations required');
 const t=stamp(now),[a,b]=x.observations;
 for(const s of [a,b]){
  if(!s||s.main!==MAIN||stamp(s.at)>t+5000||t-stamp(s.at)>120000)fail('stale snapshot or moved main');
  if(!same(s.workflows?.map(w=>w.path),PATHS))fail('publisher inventory incomplete');
  const ids=[];
  for(const w of s.workflows){
   if(!Number.isSafeInteger(w.id)||w.id<=0||ids.includes(w.id))fail('invalid workflow ID');
   ids.push(w.id);
   if(w.state!=='disabled_manually'||!Number.isFinite(Date.parse(w.updated_at)))fail('workflow enabled or unverified');
  }
  if(!same(Object.keys(s.runs||{}),STATES))fail('run status inventory incomplete');
  for(const status of STATES){
   if(!same(Object.keys(s.runs[status]||{}),ids.map(String)))fail('per-ID run inventory incomplete');
   for(const runs of Object.values(s.runs[status]))if(!Array.isArray(runs)||runs.length)fail('active or unverifiable writer run');
  }
 }
 if(stamp(a.at)>stamp(b.at))fail('observation order');
 if(!same(a.workflows.map(w=>w.path+':'+w.id+':'+w.state+':'+w.updated_at),b.workflows.map(w=>w.path+':'+w.id+':'+w.state+':'+w.updated_at)))fail('mutable workflow registry changed');
 return Object.freeze({verdict:'PROTOTYPE_CENSUS_EVIDENCE_PASS',known_workflows:10,merge_authority:false,production_release:'HOLD',independent_approval:'NOT_ESTABLISHED',write_time_enforcement:'NOT_ESTABLISHED'});
}
export function independentGate(x){
 if(!x||x.repository!==REPO||!/^[0-9a-f]{40}$/.test(x.head||''))fail('exact-head proof missing');
 return Object.freeze({verdict:'EXTERNAL_APPROVAL_REQUIRED',merge_authority:false,production_release:'HOLD',reason:'Self-issued/snapshot approval is never independent or enforced at write time'});
}
