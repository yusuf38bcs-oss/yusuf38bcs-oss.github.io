import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluate,MAIN,NAMES,HISTORY,historySafe} from './yesaf-e7-five-gate-shadow.mjs';
const initial=()=>({repository:'yusuf38bcs-oss/yusuf38bcs-oss.github.io',main:MAIN,head:'34bd9decb9ba874d2edfd5561baee1668bdd7283',grants:{http_status:403},write_time:{},attestor:{},rollback:{},release:{draft:true}});
test('live 403 and unknown gates HOLD',()=>{const r=evaluate(initial());assert(NAMES.every(k=>r.checks[k].state==='HOLD'));assert.equal(r.merge_authority,false)});
test('historical PASS register is immutable',()=>{const h=HISTORY.map(([sha,runs])=>({sha,runs:[...runs],promotion:false}));assert(historySafe(h));h[0].promotion=true;assert.equal(historySafe(h),false);h[0].promotion=false;h.pop();assert.equal(historySafe(h),false)});
test('missing one positive is HOLD',()=>{const x=initial();x.release={draft:false};assert.equal(evaluate(x).checks.release.state,'HOLD')});
test('changed protected main fails all',()=>{const x=initial();x.main='f'.repeat(40);assert(NAMES.every(k=>evaluate(x).checks[k].state==='HOLD'))});
test('forged all-true JSON STILL cannot grant release',()=>{
 const x=initial();x.grants={http_status:200,authenticated_policy:true,all_readers_no_write:true,pages_token_id:'ac3b45c8b72271d40dc9879ce402f598',worker_token_id:'944240159f95440f1e50093cd82bdf4d'};
 x.write_time={sha:x.head,independent_environment_gate:true,write_step_credential_fence:true,single_writer:true,legacy_write_fallback_removed:true,effective_control_plane_proven:true};
 x.attestor={sha:x.head,distinct_principal:true,installation_permissions_verified:true,key_control_separate:true,non_self_approval:true,revocation_checked:true};
 x.rollback={performed:true,isolated_target:true,restored_id_verified:true,health_verified:true,traffic_verified:true,measured_rto_rpo:true};
 x.release={sha:x.head,base:MAIN,draft:false,zero_unresolved:true,trusted_current_head:true,fresh_writer_census:true,independent_authorization:true};
 const r=evaluate(x);assert.equal(r.release,'HOLD');assert.equal(r.merge_authority,false);assert.equal(r.production_authority,false);assert(NAMES.every(k=>r.checks[k].state==='EXTERNAL_REVIEW_REQUIRED'));
});
