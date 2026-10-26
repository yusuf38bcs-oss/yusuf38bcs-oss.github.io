#!/usr/bin/env node
// YESAF E7 workflow source freeze. Review-only candidate until trusted migration.
// At write time, changes to ANY registered workflow require a fresh independently
// reviewed exact-source manifest, not only the ten previously identified writers.
// This does not prove Cloudflare credential exclusivity or external publishers.
export const SNAPSHOT_BASE="8c966ea9a90c8f17387c55e16598469777270c3f";
export const EXPECTED=Object.freeze({
  ".github/workflows/academic-course-contract-certification.yml": "9887b753ac4ccfb302c99247c14309fe8690dfd1",
  ".github/workflows/academic-design-system-certification.yml": "505e5ce5d89367016b296dff22d72145e55fb141",
  ".github/workflows/academic-surface-contract-certification.yml": "1ad4655dc51a5c90a16112399c033f6409e27809",
  ".github/workflows/admission-biology-evidence-certification.yml": "e962b8668ecc732a987dcc2f713bd81ff98ea50a",
  ".github/workflows/adsense-browser-certification.yml": "a16de3e95c36a3e8b3b95413d7b5b61c77e7fbea",
  ".github/workflows/ai-pr-safety-gate.yml": "820af8e202b80f94a29cfb6509493cb533a4538e",
  ".github/workflows/animal-diversity-10-certification.yml": "60e79b313df880bf48dd2005c94278edcc70538b",
  ".github/workflows/assessment-gateway-certification.yml": "fbae050567f7ddaab287ff7be69ed6fcda331f32",
  ".github/workflows/assessment-ownership-certification.yml": "aad98116484a8d8d20493f595ca23b241b6014b0",
  ".github/workflows/assessment-runtime-contract-certification.yml": "250a5a0b534e248f198f496679d01d28d0b23b6f",
  ".github/workflows/assessment-runtime-pilot-certification.yml": "dc9868841734f6dd6839cb60e5a44dd1565e55d7",
  ".github/workflows/assessment-runtime-second-bank-certification.yml": "af58c7938c7035af540f3c8278cb8a1f48e29412",
  ".github/workflows/assessment-runtime-third-bank-certification.yml": "5774c2a33089a2a4a51274dafb446358dbb0b08b",
  ".github/workflows/bilingual-audit.yml": "ce91ed764cd021d3e98cb2e21985ab6bb03c0e79",
  ".github/workflows/codeql-exact-head.yml": "92dd0982f95f58531ecb679039e0ea73be5ad545",
  ".github/workflows/conv04-i02-homepage-integration-certification.yml": "07048e028bc78d07caf8df276a344d7fffaf3df6",
  ".github/workflows/conv04e-botany-gateway-certification.yml": "e7bd140de808c2c0111e9b88b07fef02d2891870",
  ".github/workflows/conv04f-animal-diversity-certification.yml": "82b97e39997d433b7750f184799141986dc111c0",
  ".github/workflows/conv04f-blood-circulation-revision-certification.yml": "753aaadee98d3845fb3330ffd3be5ab986ece821",
  ".github/workflows/conv04f-digestive-gateway-certification.yml": "891d48f0ce27340f58846f7263a4bb99f3c46843",
  ".github/workflows/conv04f-ecology-route-certification.yml": "29cdebf4161cecb1a4ac7ebb728aa1e102762a23",
  ".github/workflows/conv04f-genetics-certification.yml": "8144638d417f90fdf4b82ebc0f3013987422fbec",
  ".github/workflows/conv04f-higher-zoology-gateway-certification.yml": "2a59051c7a72db4c487824408b2cfae7076c2802",
  ".github/workflows/conv04f-hsc-zoology-gateway-certification.yml": "78b42efcabd45a5884b49ed2dcbac07a6cf0a66c",
  ".github/workflows/conv04f-narrow-migration-gate.yml": "a1ba4b591c8a31bb75e35e7337b4b440edc77a3c",
  ".github/workflows/conv04f-zoology-practical-appendages-certification.yml": "f4ea9143420ed418ed282affe91e7b2ab6ce4d23",
  ".github/workflows/conv04f-zoology-practical-appendages-production-parity.yml": "a28bf51cac8e4ec07a9228d16d636b1a5af73972",
  ".github/workflows/conv04f-zoology-practical-dissection-certification.yml": "a0f2fc6a67fd0242841cec4131ecc324de946910",
  ".github/workflows/conv04f-zoology-practical-dissection-production-parity.yml": "68e11e232a437823258f5f74530db51017ce5de4",
  ".github/workflows/conv04f-zoology-practical-field-report-certification.yml": "a4690f4e3c563baefa19315d2bc6f837509618db",
  ".github/workflows/conv04f-zoology-practical-field-report-production-parity.yml": "9c5facafde56309951db4e768f7040582c0aa96c",
  ".github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml": "db9acd3be13b6e984e9b07ddb29a853ab0f0f0db",
  ".github/workflows/conv04f-zoology-practical-gateway-certification.yml": "a4cc70dcf18a813d899ff2229730180ab58ef21d",
  ".github/workflows/conv04f-zoology-practical-museum-certification.yml": "3d13e59f5401aaf42a3459e997399014924a9b5a",
  ".github/workflows/conv04f-zoology-practical-museum-production-parity.yml": "bf91156ff62791c21f90c880e72838f2843c3926",
  ".github/workflows/conv04f-zoology-practical-permanent-slides-certification.yml": "2506492809d7cbbcf728d9d0198ac4d39b20ede6",
  ".github/workflows/conv04f-zoology-practical-permanent-slides-production-parity.yml": "a17d3221cc69dcb4b4760693814eec40d26d719e",
  ".github/workflows/conv04f-zoology-practical-temporary-mounts-certification.yml": "dd6420b8c4527eb6e744d8874225220e8ffc49ff",
  ".github/workflows/conv04f-zoology-practical-temporary-mounts-production-parity.yml": "07b28127f234d5819e568497d206851230e13810",
  ".github/workflows/conv04f-zoology-practical-whole-mounts-certification.yml": "bd7d8373c9b3c7879b780f4500df720485df40a3",
  ".github/workflows/conv04f-zoology-practical-whole-mounts-production-parity.yml": "1f8f8ab0b9347a7c1c3e2e66e729ea1427c31a0a",
  ".github/workflows/conv04f-zoology-practical-zooplankton-certification.yml": "b57a6ff85767c94b06ed530b526ab0bf7d032598",
  ".github/workflows/conv04f-zoology-practical-zooplankton-production-parity.yml": "305b555b153c30719fedcc88164947a2c85fe5f9",
  ".github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml": "72184914ba87b5310a4d350ac3db2a6d9ad47304",
  ".github/workflows/ecology-course-certification.yml": "be3d9514713d8f2fbfe8a94a34653240d5bf38f8",
  ".github/workflows/ecology-production-live-certification.yml": "d5b66a06360c30031d7d2d7f55efbc3bcc447045",
  ".github/workflows/gateway-convergence-certification.yml": "3da7d06af96de405a128ba55ed8345bebb5504ec",
  ".github/workflows/homepage-responsive-layout-certification.yml": "b9c6dece63dff7c02438ea0d93fed205dc3952a0",
  ".github/workflows/hsc-botany-bot07-content-certification.yml": "87c0d89575589a59cf554ba07f28c5418b6aa3d7",
  ".github/workflows/hsc-botany-bot08-content-certification.yml": "6cf59b931b4b98a28dda269f7478d6436d70b365",
  ".github/workflows/hsc-botany-chapter01-scope-certification.yml": "e8bef295cfc417c0504f71a188537b087106dd60",
  ".github/workflows/ielts-course-wide-contrast-certification.yml": "768a8d9947e0a85f3cbef9ba21343c4ba2ed9e4c",
  ".github/workflows/ielts-reading-browser-certification.yml": "e462eb81d7c73314eccef6e6412842c48d08052c",
  ".github/workflows/ielts-speaking-browser-certification.yml": "9d07c45931dc591ae781b9fa94795642893822fb",
  ".github/workflows/ielts-typography-browser-certification.yml": "63a4eb1b50bf2f10d9c215f83a2bdd6553677426",
  ".github/workflows/ielts-writing-browser-certification.yml": "e35e3f8c008490808783bcf83201248c810b80ef",
  ".github/workflows/jekyll-gh-pages.yml": "4c8713551844e3e12454a2ec76e4239e693c5618",
  ".github/workflows/lbfl-candidate-preflight.yml": "a0bc999294ccbb3c93d65638a2d486309019ca96",
  ".github/workflows/lbfl-ci.yml": "da1e8c2adb5fced6ab9067d3ed7fe3d1b22d0742",
  ".github/workflows/learning-guide-contract-certification.yml": "6ac28d9b2ec43b54a27b5fda2922df699bcaa322",
  ".github/workflows/learning-guide-implementation-certification.yml": "2b84e768e012873359d5f91c9fbe02e4bdf44e4f",
  ".github/workflows/newsletter-mocked-ajax-certification.yml": "50cf50edf714ba10d257d87a32832cec09a51e13",
  ".github/workflows/ops-verify-pages-artifact.yml": "4e30634efeef1dbdd6dc40be8fe8a8e0e23aae88",
  ".github/workflows/platform-visual-system-certification.yml": "0d14fdee64f433b42c3938840eb5a03bf94fff21",
  ".github/workflows/production-certification.yml": "5d3a44f1fcd4e753614f76ebfdda9d3248093248",
  ".github/workflows/release-governance-gate.yml": "cbef9364fd4f77f446c05bfa4112d4c43bf4de87",
  ".github/workflows/site-audit.yml": "217bd991a8f25c8e581965b842b8d6a11bad6871",
  ".github/workflows/sovereign-site-audit.yml": "402b93e68e1c04a7f01bd78f6c9a043d30ac6a30",
  ".github/workflows/validate-jekyll-pr.yml": "2dab3440efdb15d5d233da09cff5e20da9620418",
  ".github/workflows/worker-production-deployment.yml": "33bc9e38e600b293ee44d619f5efe9835fb3bcfc",
  ".github/workflows/yesaf-e4-academic-custody-witness.yml": "c427d6dad9ca37e565858f40bf9000599df9bf77",
  ".github/workflows/yesaf-e4-academic-publisher-separation.yml": "3071d46c84cc2b520cb86c759cd2f5119332c97c",
  ".github/workflows/yesaf-e4-eight-writer-integration-tests.yml": "38fae32abfb3777ce49dad7c23fac7200efeaf94",
  ".github/workflows/yesaf-e4-practical-five-readonly-successors.yml": "f9fc4772a82f67ffe9637d2c7e00fe5a353a2de6",
  ".github/workflows/yesaf-e4-three-practical-science-browser-successors.yml": "90f4165e273cf5976a81950246c7796d5ff0de1b",
  ".github/workflows/yesaf-e7-live-writer-census-readonly.yml": "7c2a19242ceeec8a435ccf206ddd8e9c3ac8267e",
  ".github/workflows/yesaf-e7-live-writer-census-tests.yml": "681a348020232805aa1964ccbcbce8976119740c",
  ".github/workflows/yesaf-e7-ops-readonly-boundary-tests.yml": "dab8bd2a210850ae61656a3ef97045290a34acab",
  ".github/workflows/yesaf-museum-no-publisher-tests.yml": "73a419e2ce60c7eac22ee1aff2dbe84ee3a4912e",
  ".github/workflows/yesaf-museum-readonly-certification.yml": "2a17be8742e4530d10e8bb2a63942728d1fceb38",
  ".github/workflows/yesaf-production-authority-audit.yml": "3e01fdcf988e3adac4105aec124c6a20ed8eaa81",
  ".github/workflows/yesaf-trusted-boundary-candidate-tests.yml": "fdd67ab1ba543eede40f2a6b12121912988dddb7",
  ".github/workflows/zoology-academic-design-certification.yml": "5a1bba8f7b54b34cbce54cc6efd3f998088f87a3",
  ".github/workflows/zoology-practical-213106-certification.yml": "af93b0771e7c70dab1826bdf85b19c457fd6c8c3",
  ".github/workflows/zoology-practical-browser-certification.yml": "fd846bc00a0ab2d4175844e87a81911196a3c72e"
});
const fail=s=>{throw new Error('YESAF E7 WORKFLOW-SOURCE HOLD: '+s);};
export function verifyWorkflowTree(tree,expectedCommit){
  if(!/^[0-9a-f]{40}$/.test(String(expectedCommit||'')))fail('invalid target commit');
  if(!tree || tree.sha!==expectedCommit || tree.truncated!==false ||
     !Array.isArray(tree.tree))fail('unverifiable or truncated immutable tree');
  const seen=new Map();
  for(const entry of tree.tree){
    const p=entry?.path;
    if(typeof p!=='string' || !p.startsWith('.github/workflows/'))continue;
    if(!/\.ya?ml$/.test(p))continue;
    if(entry.type!=='blob'||!/^[0-9a-f]{40}$/.test(String(entry.sha||''))||seen.has(p))
      fail('invalid, duplicated, or nonblob workflow '+p);
    seen.set(p,entry.sha);
  }
  const expected=Object.entries(EXPECTED);
  if(seen.size!==expected.length)fail('workflow inventory changed: expected '+expected.length+', observed '+seen.size);
  for(const [path,blob] of expected){
    if(seen.get(path)!==blob)fail('new, missing or changed workflow: '+path);
  }
  return {decision:'EXACT_WORKFLOW_SOURCE_MATCH_ONLY',count:expected.length,
    source_snapshot_commit:SNAPSHOT_BASE,production_authority:false,
    independent_writer_exclusivity:false,release:'HOLD'};
}
