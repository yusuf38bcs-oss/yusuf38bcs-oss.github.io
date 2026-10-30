import test from 'node:test';
import assert from 'node:assert/strict';
import {PINNED_FILES,PINNED_TREES,verifyCustody,verifyV21Custody,
  V21_RETIRED_BLOBS,BASE} from './yesaf-e5-predecessor-compatible-source-custody.mjs';
import {verifyChangedScope} from './yesaf-e5-v21-live-source-witness.mjs';
const A='a'.repeat(40),B='b'.repeat(40);
function sample(){
 const others=Object.fromEntries(Object.entries(PINNED_FILES).filter(([p])=>
   !Object.hasOwn(V21_RETIRED_BLOBS,p)));
 const old=Object.fromEntries(Object.entries(PINNED_FILES).filter(([p])=>
   Object.hasOwn(V21_RETIRED_BLOBS,p)));
 return {policy:{version:'YESAF_E5_V2_1_PREDICATE_TRANSITION_2026_10_30',
   scope:'SOURCE_ONLY',production_write_allowed:false,production_release_authorized:false,
   original_V1_results_preserved:true,original_five_status_contexts_preserved:true,
   retirement_blobs:{...V21_RETIRED_BLOBS},original_publisher_blobs:old,
   other_protected_blobs:others,academic_trees:{...PINNED_TREES}},
   policyBlob:A,main:{protected:true,commit:{sha:B},policy_blob:A},head:A,base:B,
   candidateFiles:{...others,...V21_RETIRED_BLOBS},baselineFiles:{...PINNED_FILES},
   candidateTrees:{...PINNED_TREES},baselineTrees:{...PINNED_TREES},
   activation:{app:{id:5266418},head_sha:B,policy_blob:A,
     scope:'PROTECTED_MAIN_V2_1_ACTIVATION_ONLY',conclusion:'success',
     expires_at:Date.now()+60000}};
}
test('V1 drift remains a real failure while V2.1 evaluates separately',()=>{
 const x=sample();const old=verifyCustody({base:BASE,baseLive:BASE,head:A,
   ancestor:true,files:x.candidateFiles,trees:x.candidateTrees});
 assert.equal(old.decision,'CUSTODY_HOLD');
 assert.equal(old.errors.filter(e=>e.startsWith('PROTECTED_SOURCE_DRIFT:')).length,8);
 const next=verifyV21Custody(x);assert.equal(next.decision,'V21_CUSTODY_ELIGIBLE_ONLY');
 assert.equal(next.certificateIssued,false);assert.equal(next.candidateScienceCurrentHeadVerified,false);
});
for(const [name,change] of [
 ['wrong approved publisher',x=>x.candidateFiles[Object.keys(V21_RETIRED_BLOBS)[0]]=A],
 ['partial retirement',x=>x.candidateFiles[Object.keys(V21_RETIRED_BLOBS)[1]]=PINNED_FILES[Object.keys(V21_RETIRED_BLOBS)[1]]],
 ['changed other source',x=>x.candidateFiles[Object.keys(x.policy.other_protected_blobs)[0]]=A],
 ['academic tree drift',x=>x.candidateTrees[Object.keys(PINNED_TREES)[0]]=A],
 ['baseline drift',x=>x.baselineFiles[Object.keys(V21_RETIRED_BLOBS)[0]]=A],
 ['wrong App',x=>x.activation.app.id=15368],
 ['expired activation',x=>x.activation.expires_at=0],
 ['uninstalled policy',x=>x.main.policy_blob=B],
 ['production enabled',x=>x.policy.production_write_allowed=true]
])test('V2.1 custody fails closed: '+name,()=>{
 const x=sample();change(x);assert.equal(verifyV21Custody(x).decision,'V21_CUSTODY_HOLD');
});
test('live witness accepts only exact current reviewed paths and bytes',()=>{
 const x=sample(),added=Object.fromEntries(Array.from({length:21},(_,i)=>['new'+i,A]));
 const policy={retirement_blobs:x.policy.retirement_blobs,additive_witness_blobs:added};
 const blobs={...policy.retirement_blobs,...added},changed=Object.keys(blobs);
 const objectAt=(ref,p)=>ref===A?blobs[p]:p in added?'MISSING':PINNED_FILES[p];
 verifyChangedScope({changed,policy,head:A,base:B,objectAt});
 assert.throws(()=>verifyChangedScope({changed:[...changed.slice(1),'evil'],policy,
   head:A,base:B,objectAt}),/V21_LIVE_SOURCE_HOLD/);
 assert.throws(()=>verifyChangedScope({changed,policy,head:A,base:B,
   objectAt:(ref,p)=>p===changed[0]?'bad':objectAt(ref,p)}),/V21_LIVE_SOURCE_HOLD/);
});
