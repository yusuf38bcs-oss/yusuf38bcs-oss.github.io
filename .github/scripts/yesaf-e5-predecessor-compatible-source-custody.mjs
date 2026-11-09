#!/usr/bin/env node
// Additive E5 custody witness. Non-authorizing by construction.
// All protected scientific/control-plane/legacy publishers remain EXACTLY from main.
// This route avoids changing predecessor guard bytes or self-approving policy.
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
export const BASE='3164d2537b4f19381c52bbfb5c9e1b7ee7d15846';
export const PINNED_FILES=Object.freeze({
  ".github/workflows/yesaf-production-authority-audit.yml": "3e01fdcf988e3adac4105aec124c6a20ed8eaa81",
  ".github/scripts/yesaf-production-authority-audit.mjs": "a60732decba36719c90be0c42c9ae258601dd206",
  ".github/scripts/test-yesaf-production-authority-audit.mjs": "a3c9c62a7aa32df12a71f0e5176eadc2b1dd7d8d",
  ".github/scripts/test-yesaf-trusted-boundary.mjs": "5de548232db463d25942dd7d5d9f9d81d821e171",
  ".github/workflows/release-governance-gate.yml": "cbef9364fd4f77f446c05bfa4112d4c43bf4de87",
  ".github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml": "1142d9c341f34d5926a5855cfc06c54a46a82d13",
  ".github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml": "e92f4f9bec9d4e2db51bcbeb65da958cfa3a1114",
  ".github/workflows/conv04f-zoology-practical-museum-certification.yml": "3d13e59f5401aaf42a3459e997399014924a9b5a",
  ".github/workflows/jekyll-gh-pages.yml": "2a2871af738167cd9c2a196c5ffc599fc41a5ad2",
  ".github/workflows/worker-production-deployment.yml": "6cd54e6ae5397d1e33b3493d3c9c883933a52cc0",
  ".github/workflows/conv04f-zoology-practical-appendages-production-parity.yml": "8e1f5977e330c57e2ebd4b161980797e2816dede",
  ".github/workflows/conv04f-zoology-practical-dissection-production-parity.yml": "20b70501cc4b39ce96cdf659f06853cdfd2eeb4c",
  ".github/workflows/conv04f-zoology-practical-museum-production-parity.yml": "a0c9341106450910617b0e33e2e3c43654a57b9e",
  ".github/workflows/conv04f-zoology-practical-permanent-slides-production-parity.yml": "6c33b5d038e2e61f5590a79a0e8a6e391506c62c",
  ".github/workflows/conv04f-zoology-practical-temporary-mounts-production-parity.yml": "b91b4010b0b9ff2a22a1399986d032278180a151",
  ".github/workflows/conv04f-zoology-practical-whole-mounts-production-parity.yml": "a91e6cef9a98e9da34cb4c84bdbe712b5935c408",
  ".github/workflows/conv04f-zoology-practical-zooplankton-production-parity.yml": "5b113398e59bc0dde9dfba6827aa4b88ccd6bed4",
  ".github/workflows/conv04f-zoology-practical-field-report-production-parity.yml": "3919de0d39b2e316cd8511e283b6d15fcf5197dd",
  ".github/scripts/validate-conv04f-zoology-practical-appendages.rb": "e0b25189300804447108bcc201e97653330e0e87",
  ".github/scripts/validate-conv04f-zoology-practical-dissection.rb": "7318e8c3215838093b68978760746e9c4240fb72",
  ".github/scripts/validate-conv04f-zoology-practical-museum.rb": "43aa1d96c71e524f0af4eca954766e51e9c423f5",
  ".github/scripts/validate-conv04f-zoology-practical-permanent-slides.rb": "7efc49f9a063385e18dda50221f30bfb865f2cdb",
  ".github/scripts/validate-conv04f-zoology-practical-temporary-mounts.rb": "4e588a411174b23225a8bb5d796e77f48af573ac",
  ".github/scripts/validate-conv04f-zoology-practical-whole-mounts.rb": "fc9b9f07164676798b4f98fe7802053dddd0f929",
  ".github/scripts/validate-conv04f-zoology-practical-zooplankton.rb": "a74579452d68d9684b270b2a3b1f4ee4e0d3815c",
  ".github/scripts/validate-conv04f-zoology-practical-field-report.rb": "cef2b7aca4f5a388421d89e39213947016341e43",
  ".github/scripts/conv04f-zoology-practical-appendages-browser-certification.mjs": "e54ef0b8aa2bd8669cd56c607e4920cbddcd0c6e",
  ".github/scripts/conv04f-zoology-practical-dissection-browser-certification.mjs": "3db9c53ed15106276ac73bc4d5e99bf1727b8cf5",
  ".github/scripts/conv04f-zoology-practical-museum-browser-certification.mjs": "88dc2e46eec830955ecdad3f1d7175572f788afc",
  ".github/scripts/conv04f-zoology-practical-permanent-slides-browser-certification.mjs": "d2da3d58a08bef6c70e27ef17b0d191ed07b07c0",
  ".github/scripts/conv04f-zoology-practical-temporary-mounts-browser-certification.mjs": "c0922971ae0ef6897d7274d0955ab17c8959a7fa",
  ".github/scripts/conv04f-zoology-practical-whole-mounts-browser-certification.mjs": "71055f8823024d3f32b4cd729608cf197ed9d5bd",
  ".github/scripts/conv04f-zoology-practical-zooplankton-browser-certification.mjs": "b4130725c34f6def1d256b9a3aac6e7012d24b74",
  ".github/scripts/conv04f-zoology-practical-field-report-browser-certification.mjs": "015352639c8979192b4dd085861aa94695ccfafb",
  ".github/workflows/conv04f-zoology-practical-appendages-certification.yml": "f4ea9143420ed418ed282affe91e7b2ab6ce4d23",
  ".github/workflows/conv04f-zoology-practical-dissection-certification.yml": "a0f2fc6a67fd0242841cec4131ecc324de946910",
  ".github/workflows/conv04f-zoology-practical-permanent-slides-certification.yml": "2506492809d7cbbcf728d9d0198ac4d39b20ede6",
  ".github/workflows/conv04f-zoology-practical-temporary-mounts-certification.yml": "dd6420b8c4527eb6e744d8874225220e8ffc49ff",
  ".github/workflows/conv04f-zoology-practical-whole-mounts-certification.yml": "bd7d8373c9b3c7879b780f4500df720485df40a3",
  ".github/workflows/conv04f-zoology-practical-zooplankton-certification.yml": "b57a6ff85767c94b06ed530b526ab0bf7d032598",
  ".github/workflows/conv04f-zoology-practical-field-report-certification.yml": "a4690f4e3c563baefa19315d2bc6f837509618db"
});
export const PINNED_TREES=Object.freeze({
  "_biology": "8dc590321c551f64ae489c79e1a27ed422e864d1",
  "_data": "2ff267104a3a2f41eed7a5d031b9bacf93f9b875",
  "_includes": "d813884a799d5300701df5a2d4d0b495cd822a9d",
  "_layouts": "7bf819937f3c3a1b9c23d38514f6ee277da1bb22",
  "docs/academic/conv04": "82a4c306576c6a78aebefa14be19ef6b802a8239",
  "assets/css": "7a1458425ee4c1ff8da62652305d3ec4c2dcae09",
  "assets/js": "be4cc24adb31a66e3e103d550d0a9c5c2ac9e04e",
  "scripts/zoology": "b88d0e3f53feea65668586b57d0746dd9b05b639"
});
const isSha=x=>/^[0-9a-f]{40}$/.test(String(x||''));
export function verifyCustody({base,head,files,trees,baseLive,ancestor}){
  const errors=[];
  if(base!==BASE||baseLive!==BASE||!isSha(head)||head===BASE||ancestor!==true)errors.push('BASE_OR_HEAD_IDENTITY');
  for(const [path,blob] of Object.entries(PINNED_FILES)){
    if(files?.[path]!==blob)errors.push('PROTECTED_SOURCE_DRIFT:'+path);
  }
  for(const [path,blob] of Object.entries(PINNED_TREES)){
    if(trees?.[path]!==blob)errors.push('ACADEMIC_TREE_DRIFT:'+path);
  }
  return Object.freeze({decision:errors.length?'CUSTODY_HOLD':'SOURCE_CUSTODY_PASS',
    protected_files:Object.keys(PINNED_FILES).length,
    protected_science_trees:Object.keys(PINNED_TREES).length,
    main_base:BASE,head_sha:head,
    independent_attestation:false,merge_authority:false,deploy_authority:false,
    production_release:'HOLD',errors});
}
function git(...args){return execFileSync('git',args,{encoding:'utf8'}).trim();}
export function inspectLive(){
 const base=BASE,head=git('rev-parse','HEAD');
 const baseLive=git('ls-remote','origin','refs/heads/main').split(/\s+/)[0];
 let ancestor=false;try{execFileSync('git',['merge-base','--is-ancestor',base,head]);ancestor=true}catch{}
 const files={},trees={};
 for(const p of Object.keys(PINNED_FILES)){
  try{files[p]=git('rev-parse',head+':'+p)}catch{files[p]='MISSING'}
 }
 for(const p of Object.keys(PINNED_TREES)){
  try{trees[p]=git('rev-parse',head+':'+p)}catch{trees[p]='MISSING'}
 }
 return {base,head,baseLive,ancestor,files,trees};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const r=verifyCustody(inspectLive());
 console.log(JSON.stringify(r,null,2));
 if(r.decision!=='SOURCE_CUSTODY_PASS')process.exitCode=1;
}

// V2.1 is a separate prospective successor. The original verifyCustody above
// remains byte-for-byte in behavior and continues to report the V1 drift.
// This function has no App key, status publisher, merge or deployment authority.
export const V21_RETIRED_BLOBS=Object.freeze({
  '.github/workflows/conv04f-zoology-practical-appendages-production-parity.yml':'a28bf51cac8e4ec07a9228d16d636b1a5af73972',
  '.github/workflows/conv04f-zoology-practical-dissection-production-parity.yml':'68e11e232a437823258f5f74530db51017ce5de4',
  '.github/workflows/conv04f-zoology-practical-field-report-production-parity.yml':'9c5facafde56309951db4e768f7040582c0aa96c',
  '.github/workflows/conv04f-zoology-practical-museum-production-parity.yml':'bf91156ff62791c21f90c880e72838f2843c3926',
  '.github/workflows/conv04f-zoology-practical-permanent-slides-production-parity.yml':'a17d3221cc69dcb4b4760693814eec40d26d719e',
  '.github/workflows/conv04f-zoology-practical-temporary-mounts-production-parity.yml':'07b28127f234d5819e568497d206851230e13810',
  '.github/workflows/conv04f-zoology-practical-whole-mounts-production-parity.yml':'1f8f8ab0b9347a7c1c3e2e66e729ea1427c31a0a',
  '.github/workflows/conv04f-zoology-practical-zooplankton-production-parity.yml':'305b555b153c30719fedcc88164947a2c85fe5f9'
});
export function verifyV21Custody({policy,policyBlob,main,head,base,
  candidateFiles,baselineFiles,candidateTrees,baselineTrees,activation}){
 const errors=[];
 const put=(ok,msg)=>{if(!ok)errors.push(msg)};
 const retired=Object.keys(V21_RETIRED_BLOBS);
 put(policy?.version==='YESAF_E5_V2_1_PREDICATE_TRANSITION_2026_10_30' &&
   policy?.scope==='SOURCE_ONLY' && policy?.production_write_allowed===false &&
   policy?.production_release_authorized===false &&
   policy?.original_V1_results_preserved===true &&
   policy?.original_five_status_contexts_preserved===true,'V21_POLICY_SCOPE');
 put(isSha(policyBlob) && main?.protected===true && main?.commit?.sha===base &&
   main?.policy_blob===policyBlob && isSha(head) && head!==base,'V21_MAIN_OR_POLICY_IDENTITY');
 put(activation?.app?.id===5266418 && activation?.head_sha===base &&
   activation?.policy_blob===policyBlob && activation?.scope==='PROTECTED_MAIN_V2_1_ACTIVATION_ONLY' &&
   activation?.conclusion==='success' && activation?.expires_at>Date.now(),
   'V21_APP_ACTIVATION_MISSING');
 put(retired.length===8 && Object.keys(PINNED_FILES).length===41 &&
   Object.keys(PINNED_TREES).length===8,'V21_ORIGINAL_MANIFEST_DRIFT');
 for(const p of retired){
   put(policy?.retirement_blobs?.[p]===V21_RETIRED_BLOBS[p] &&
     policy?.original_publisher_blobs?.[p]===PINNED_FILES[p] &&
     baselineFiles?.[p]===PINNED_FILES[p] && candidateFiles?.[p]===V21_RETIRED_BLOBS[p],
     'V21_PUBLISHER_BLOB:'+p);
 }
 for(const [p,sha] of Object.entries(PINNED_FILES).filter(([p])=>!retired.includes(p)))
   put(policy?.other_protected_blobs?.[p]===sha &&
     baselineFiles?.[p]===sha && candidateFiles?.[p]===sha,'V21_OTHER_SOURCE:'+p);
 for(const [p,sha] of Object.entries(PINNED_TREES))
   put(policy?.academic_trees?.[p]===sha && baselineTrees?.[p]===sha &&
     candidateTrees?.[p]===sha,'V21_ACADEMIC_TREE:'+p);
 return Object.freeze({decision:errors.length?'V21_CUSTODY_HOLD':'V21_CUSTODY_ELIGIBLE_ONLY',
   errors,head,base,policyBlob,originalV1VerdictUnchanged:true,
   candidateScienceCurrentHeadVerified:false,certificateIssued:false,
   mergeAuthority:false,productionWriteAllowed:false});
}
