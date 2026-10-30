import test from 'node:test';
import assert from 'node:assert/strict';
import {BASE,PINNED_FILES,PINNED_TREES} from './yesaf-e5-predecessor-compatible-source-custody.mjs';
import {APPROVED_RETIRED,EIGHT,inspectMigration,inspectGit} from './yesaf-e4e5-source-migration-witness.mjs';
const h='a'.repeat(40);
const names=Object.keys(APPROVED_RETIRED);
const safe=n=>`name: Legacy ${n} (Retired)\non:\n  workflow_dispatch:\n\npermissions:\n  contents: read\n\njobs:\n  retired_notice:\n    runs-on: ubuntu-24.04\n`;
const fixture=()=>({baseline:BASE,main:BASE,head:h,ancestor:true,
  blobs:{...PINNED_FILES,...APPROVED_RETIRED},trees:{...PINNED_TREES},
  contents:Object.fromEntries(names.map((p,i)=>[p,safe(i)]))});
test('eight reviewed retirements, 33 original protected files, eight academic trees',()=>{
 const r=inspectMigration(fixture());
 assert.equal(EIGHT.length,8);
 assert.equal(r.proposed_retirements,8);
 assert.equal(r.untouched_protected_files,33);
 assert.equal(r.academic_trees_checked,8);
 assert.equal(r.production_write_authorized,false);
 assert.equal(r.protected_main_merge_authorized,false);
 assert.equal(r.release_certificate,false);
 assert.equal(r.bypass_authorized,false);
});
const negatives=[
 ['moved main',v=>v.main='b'.repeat(40)],
 ['wrong base',v=>v.baseline='b'.repeat(40)],
 ['invalid head',v=>v.head='INVALID'],
 ['not descendant',v=>v.ancestor=false],
 ['original publisher left live',v=>v.blobs[EIGHT[0]]=PINNED_FILES[EIGHT[0]]],
 ['seven retired only',v=>v.blobs[EIGHT[7]]=PINNED_FILES[EIGHT[7]]],
 ['changed proposed retirement',v=>v.blobs[EIGHT[4]]='c'.repeat(40)],
 ['missing publisher',v=>delete v.blobs[EIGHT[2]]],
 ['mutated protected museum validator',v=>v.blobs['.github/scripts/validate-conv04f-zoology-practical-museum.rb']='f'.repeat(40)],
 ['changed zooplankton browser test',v=>v.blobs['.github/scripts/conv04f-zoology-practical-zooplankton-browser-certification.mjs']='f'.repeat(40)],
 ['changed original R91 successor guard',v=>v.blobs['.github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml']='f'.repeat(40)],
 ['changed original R101 successor guard',v=>v.blobs['.github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml']='f'.repeat(40)],
 ['changed trusted M1 workflow',v=>v.blobs['.github/workflows/yesaf-production-authority-audit.yml']='f'.repeat(40)],
 ['changed Jekyll fallback writer',v=>v.blobs['.github/workflows/jekyll-gh-pages.yml']='f'.repeat(40)],
 ['changed Zoology academic tree',v=>v.trees['_biology']='f'.repeat(40)],
 ['changed student data tree',v=>v.trees['_data']='f'.repeat(40)],
 ['changed site JavaScript tree',v=>v.trees['assets/js']='f'.repeat(40)],
 ['removed retirement body',v=>delete v.contents[EIGHT[0]]],
 ['restored automatic push',v=>v.contents[EIGHT[0]]+='\n  push:\n    branches: [main]\n'],
 ['restored Cloudflare token',v=>v.contents[EIGHT[1]]+='\nCLOUDFLARE_API_TOKEN\n'],
 ['reintroduced pages deploy',v=>v.contents[EIGHT[2]]+='\nwrangler pages deploy _site\n'],
 ['reintroduced GitHub Pages deploy',v=>v.contents[EIGHT[3]]+='\nactions/deploy-pages@v5\n'],
 ['enabled write permission',v=>v.contents[EIGHT[4]]+='\n  pages: write\n'],
 ['replaced dispatch trigger',v=>v.contents[EIGHT[5]]=v.contents[EIGHT[5]].replace('workflow_dispatch:', 'workflow_run:')],
];
for(const [label,change] of negatives) test('fail closed: '+label,()=>{
 const v=fixture();change(v);assert.throws(()=>inspectMigration(v),/E4E5_MIGRATION_HOLD/);
});
test('live candidate repository has all eight exact retirement blobs and untouched science',()=>{
 const r=inspectMigration(inspectGit());
 assert.equal(r.decision,'EIGHT_SOURCE_RETIREMENTS_VERIFIED_NON_AUTHORIZING');
});
