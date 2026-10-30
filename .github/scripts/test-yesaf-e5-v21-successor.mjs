import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {evaluateV21Source,RETIREMENT,SITE} from './yesaf-e5-v21-successor.mjs';
const policy=JSON.parse(readFileSync(new URL('../../docs/yesaf/E5_VERSIONED_PROSPECTIVE_POLICY_V2_1.json',import.meta.url)));
const M='a'.repeat(40),H='b'.repeat(40),B='c'.repeat(40);
const item=(p,h,type='blob')=>({path:p,sha:h,type,mode:type==='tree'?'040000':'100644'});
function fixture(){
 const tree=[],old=[];
 for(const [p,h] of Object.entries(policy.other_protected_blobs)){tree.push(item(p,h));old.push(item(p,h))}
 for(const [p,h] of Object.entries(policy.academic_trees)){tree.push(item(p,h,'tree'));old.push(item(p,h,'tree'))}
 for(const [p,h] of Object.entries(RETIREMENT)){
   tree.push(item(p,h));old.push(item(p,policy.original_publisher_blobs[p]))}
 for(const [p,h] of Object.entries(policy.additive_witness_blobs))tree.push(item(p,h));
 return {policy:structuredClone(policy),policyBlob:M,
   installedMain:{protected:true,commit:{sha:B},policy_blob:M},
   pr:{number:520,state:'open',draft:false,head:{sha:H,repo:{full_name:SITE}},
     base:{ref:'main',sha:B},changed_files:28},
   comparison:{merge_base_commit:{sha:B},behind_by:0},
   tree:{truncated:false,tree},baselineTree:{truncated:false,tree:old},
   changedFiles:[...Object.entries(RETIREMENT).map(([filename,sha])=>
     ({filename,sha,status:'modified'})),
     ...Object.entries(policy.additive_witness_blobs).map(([filename,sha])=>
       ({filename,sha,status:'added'}))],
   activation:{app:{id:5266418},head_sha:B,status:'completed',conclusion:'success',
     scope:'PROTECTED_MAIN_V2_1_ACTIVATION_ONLY',policy_blob:M,expires_at:Date.now()+100000},
   science:{head:H,base:B,sourceRunEvent:'pull_request',jobs:Array.from({length:9},()=>
     ({status:'completed',conclusion:'success',head_sha:H})),browserRoutesVerified:true,
     accessibilityVerified:true,buildVerified:true,practicalGatewayVerified:true,
     museumVerified:true}};
}
test('prospective exact source and current science are eligible, never a certificate',()=>{
 const r=evaluateV21Source(fixture());assert.equal(r.certificateIssued,false);
 assert.equal(r.originalV1FailuresPreserved,true);assert.equal(r.retiredBlobs,8);
});
for(const [name,edit] of [
 ['unapproved retirement',x=>x.tree.tree.find(v=>v.path in RETIREMENT).sha=M],
 ['changed protected source',x=>x.tree.tree[0].sha=M],
 ['academic drift',x=>x.tree.tree.find(v=>v.type==='tree').sha=M],
 ['baseline drift',x=>x.baselineTree.tree[0].sha=M],
 ['additive witness drift',x=>x.tree.tree.find(v=>v.path in policy.additive_witness_blobs).sha=M],
 ['unreviewed workflow',x=>{x.changedFiles.push({filename:'.github/workflows/evil.yml',status:'added',sha:M});x.pr.changed_files++}],
 ['stale main',x=>x.pr.base.sha=M],['draft',x=>x.pr.draft=true],
 ['uninstalled policy',x=>x.installedMain.policy_blob=H],
 ['foreign activation',x=>x.activation.app.id=15368],
 ['expired activation',x=>x.activation.expires_at=0],
 ['old-head science',x=>x.science.head=M],
 ['skipped science job',x=>x.science.jobs[0].conclusion='skipped'],
 ['missing browser',x=>x.science.browserRoutesVerified=false],
 ['missing accessibility',x=>x.science.accessibilityVerified=false],
 ['missing practical gateway',x=>x.science.practicalGatewayVerified=false],
 ['renamed publisher',x=>x.changedFiles[0].previous_filename='old'],
 ['partial retirement',x=>{x.changedFiles.shift();x.pr.changed_files=27}]
])test('fail closed: '+name,()=>{
 const x=fixture();edit(x);assert.throws(()=>evaluateV21Source(x),/V21_SOURCE_HOLD/)
});
