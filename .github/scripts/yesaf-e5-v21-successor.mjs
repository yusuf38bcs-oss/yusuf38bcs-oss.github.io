#!/usr/bin/env node
// Protected-main-sourced V2.1 source-only successor. A candidate copy has no
// release authority. Historical V1 failures remain untouched and visible.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
export const VERSION='YESAF_E5_V2_1_PREDICATE_TRANSITION_2026_10_30';
export const SITE='yusuf38bcs-oss/yusuf38bcs-oss.github.io';
const SHA=/^[0-9a-f]{40}$/;
const fail=m=>{throw Error('V21_SOURCE_HOLD: '+m)};
const need=(b,m)=>{if(!b)fail(m)};
const names=['appendages','dissection','field-report','museum','permanent-slides',
  'temporary-mounts','whole-mounts','zooplankton'];
const approved=['a28bf51cac8e4ec07a9228d16d636b1a5af73972',
  '68e11e232a437823258f5f74530db51017ce5de4',
  '9c5facafde56309951db4e768f7040582c0aa96c',
  'bf91156ff62791c21f90c880e72838f2843c3926',
  'a17d3221cc69dcb4b4760693814eec40d26d719e',
  '07b28127f234d5819e568497d206851230e13810',
  '1f8f8ab0b9347a7c1c3e2e66e729ea1427c31a0a',
  '305b555b153c30719fedcc88164947a2c85fe5f9'];
export const RETIREMENT=Object.freeze(Object.fromEntries(names.map((n,i)=>
  ['.github/workflows/conv04f-zoology-practical-'+n+'-production-parity.yml',approved[i]])));
const exact=(a,b)=>Object.keys(a||{}).length===Object.keys(b).length &&
  Object.entries(b).every(([k,v])=>a[k]===v);

export function evaluateV21Source({policy,policyBlob,installedMain,pr,comparison,
  tree,baselineTree,changedFiles,science,activation}){
 need(policy?.version===VERSION && policy.state==='INERT_UNTIL_INDEPENDENT_APP_ACTIVATION' &&
   policy.scope==='SOURCE_ONLY' && policy.production_write_allowed===false &&
   policy.production_release_authorized===false && policy.original_V1_results_preserved===true &&
   policy.original_five_status_contexts_preserved===true,'invalid protected V2.1 policy');
 need(exact(policy.retirement_blobs,RETIREMENT) &&
   Object.keys(policy.other_protected_blobs||{}).length===33 &&
   Object.keys(policy.original_publisher_blobs||{}).length===8 &&
   Object.keys(policy.academic_trees||{}).length===8,'scope/pin drift');
 need(SHA.test(policyBlob) && installedMain?.protected===true &&
   SHA.test(installedMain?.commit?.sha) &&
   installedMain.policy_blob===policyBlob,'policy not loaded from protected main');
 const base=installedMain.commit.sha,head=pr?.head?.sha;
 need(pr?.number===520 && pr.state==='open' && !pr.draft &&
   pr.head?.repo?.full_name===SITE && SHA.test(head) &&
   pr.base?.ref==='main' && pr.base?.sha===base &&
   comparison?.merge_base_commit?.sha===base && comparison.behind_by===0,
   'stale/draft PR #520');
 need(activation?.app?.id===5266418 && activation?.head_sha===base &&
   activation?.status==='completed' && activation?.conclusion==='success' &&
   activation?.scope==='PROTECTED_MAIN_V2_1_ACTIVATION_ONLY' &&
   activation?.policy_blob===policyBlob && activation?.expires_at>Date.now(),
   'no current independent protected-main activation');
 need(tree?.truncated===false && baselineTree?.truncated===false &&
   Array.isArray(tree.tree) && Array.isArray(baselineTree.tree),
   'truncated Git tree');
 const index=t=>{
   const m=new Map();
   for(const f of t.tree){need(typeof f.path==='string'&&!m.has(f.path),
     'duplicate/malformed tree path');m.set(f.path,f)}
   return m;
 };
 const current=index(tree),original=index(baselineTree);
 for(const [p,h] of Object.entries(policy.other_protected_blobs)){
   need(current.get(p)?.type==='blob' && current.get(p)?.sha===h &&
     original.get(p)?.sha===h,'protected nonpublisher source drift '+p);
 }
 for(const [p,h] of Object.entries(policy.academic_trees))
   need(current.get(p)?.type==='tree' && current.get(p)?.sha===h &&
     original.get(p)?.sha===h,'academic tree drift '+p);
 for(const [p,h] of Object.entries(RETIREMENT)){
   need(current.get(p)?.type==='blob' && current.get(p)?.mode==='100644' &&
     current.get(p)?.sha===h && original.get(p)?.sha===policy.original_publisher_blobs[p],
     'retired publisher/blob mismatch '+p);
 }
 need(Array.isArray(changedFiles) && changedFiles.length===pr.changed_files &&
   changedFiles.length<=3000 && changedFiles.every(f=>
     typeof f.filename==='string'&&!f.previous_filename),
   'incomplete/renamed PR file scope');
 const touched=changedFiles.filter(f=>Object.hasOwn(RETIREMENT,f.filename));
 need(touched.length===8 && touched.every(f=>f.status==='modified' &&
   f.sha===RETIREMENT[f.filename]),'publisher diff not exact eight');
 need(science?.head===head && science?.base===base &&
   science?.sourceRunEvent==='pull_request' && science?.jobs?.length===9 &&
   science.jobs.every(j=>j.status==='completed'&&j.conclusion==='success'&&
     j.head_sha===head) && science.browserRoutesVerified===true &&
   science.accessibilityVerified===true && science.buildVerified===true &&
   science.practicalGatewayVerified===true && science.museumVerified===true,
   'actual current science/browser evidence incomplete');
 return Object.freeze({decision:'V21_SOURCE_SUCCESSOR_ELIGIBLE_ONLY',
   head,base,policyBlob,retiredBlobs:8,retainedProtectedSources:33,
   retainedAcademicTrees:8,originalV1FailuresPreserved:true,
   existingFiveRequiredChecksUnchanged:true,certificateIssued:false,
   productionWriteAllowed:false,mergeAuthorized:false});
}

// This source cannot authenticate itself. The protected-main workflow is the
// sole runner and supplies independently fetched data. No status writes here.
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const p=JSON.parse(readFileSync(process.argv[2]||'docs/yesaf/E5_VERSIONED_PROSPECTIVE_POLICY_V2_1.json'));
  console.log(JSON.stringify({version:p.version,state:p.state,
    candidateOnly:true,certificateIssued:false,productionWriteAllowed:false}));
}
