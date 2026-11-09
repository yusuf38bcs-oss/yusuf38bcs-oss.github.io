// YESAF E7: advisory, non-authorizing five-gate policy; no GO path.
export const MAIN='3164d2537b4f19381c52bbfb5c9e1b7ee7d15846';
export const HISTORY=Object.freeze([
['65a8215b4924437df66da541f483915fc325029b',[40080292017,40080291925,40080292097]],
['fdedc8d09732fdbed9b4a1959d5844ca2d3bae5e',[40077849106]],
['54ae60857441d7586ab15ea25316a30a5810515b',[40082201205]],
['6233ae517a227b4764a8464fa1cd34a9c27f0872',[40082932647]],
['4ff587721f2e79bd13cc0efa4202e3d5c7610bb3',[40083968969]],
['34bd9decb9ba874d2edfd5561baee1668bdd7283',[40085589607]]
]);
export const NAMES=['grants','write_time','attestor','rollback','release'];
const sha=x=>typeof x==='string'&&/^[0-9a-f]{40}$/.test(x);
export function evaluate(x){
 const out={release:'HOLD',merge_authority:false,production_authority:false,checks:{}};
 const block=(k,msg)=>{out.checks[k]={state:'HOLD',reason:msg}};
 if(!x||x.repository!=='yusuf38bcs-oss/yusuf38bcs-oss.github.io'||x.main!==MAIN||!sha(x.head)){
  NAMES.forEach(k=>block(k,'wrong repository / protected main / head'));return out;
 }
 const c=x.grants||{};
 if(c.http_status!==200||c.authenticated_policy!==true||c.all_readers_no_write!==true||
 c.pages_token_id!=='ac3b45c8b72271d40dc9879ce402f598'||c.worker_token_id!=='944240159f95440f1e50093cd82bdf4d')
 block('grants','Cloudflare no-Write grants unverified; 403 is not success');
 else out.checks.grants={state:'EXTERNAL_REVIEW_REQUIRED'};
 const w=x.write_time||{};
 if(w.sha!==x.head||w.independent_environment_gate!==true||w.write_step_credential_fence!==true||
 w.single_writer!==true||w.legacy_write_fallback_removed!==true||w.effective_control_plane_proven!==true)
 block('write_time','write-time fencing or exact-SHA authority missing');
 else out.checks.write_time={state:'EXTERNAL_REVIEW_REQUIRED'};
 const a=x.attestor||{};
 if(a.sha!==x.head||a.distinct_principal!==true||a.installation_permissions_verified!==true||
 a.key_control_separate!==true||a.non_self_approval!==true||a.revocation_checked!==true)
 block('attestor','independent verified issuer/permission/key proof missing');
 else out.checks.attestor={state:'EXTERNAL_REVIEW_REQUIRED'};
 const r=x.rollback||{};
 if(r.performed!==true||r.isolated_target!==true||r.restored_id_verified!==true||
 r.health_verified!==true||r.traffic_verified!==true||r.measured_rto_rpo!==true)
 block('rollback','metadata references are not a tested restore');
 else out.checks.rollback={state:'EXTERNAL_REVIEW_REQUIRED'};
 const m=x.release||{};
 if(m.sha!==x.head||m.base!==MAIN||m.draft!==false||m.zero_unresolved!==true||
 m.trusted_current_head!==true||m.fresh_writer_census!==true||m.independent_authorization!==true)
 block('release','Draft/stale SHA/unverified checks or release approval');
 else out.checks.release={state:'EXTERNAL_REVIEW_REQUIRED'};
 return out; // This candidate never returns GO, even if caller forges booleans.
}
export function historySafe(entries){
 return Array.isArray(entries)&&entries.length===HISTORY.length&&HISTORY.every((h,i)=>
 entries[i]?.sha===h[0]&&JSON.stringify(entries[i].runs)===JSON.stringify(h[1])&&entries[i].promotion===false);
}
