import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TEN,RETIRED_PARITY,blobSHA,scan,audit} from './yesaf-e4-ten-writer-no-publish.mjs';

const load=p=>fs.readFileSync(p,'utf8');
const live=()=>audit(load);
const clone=file=>load(file);
const museum=TEN[8],pages=TEN[9],parity=TEN[0];
test('01 registry covers exactly eight parity + Museum + Pages',()=>{
 assert.equal(TEN.length,10);assert.equal(new Set(TEN).size,10);
 assert.ok(museum.endsWith('museum-certification.yml'));assert.ok(pages.endsWith('jekyll-gh-pages.yml'));
});
test('02 exact candidate sources all nonpublishing',()=>assert.deepEqual(live().errors,[]));
test('03 output is explicitly source-only and never grants GO',()=>{
 const x=live();assert.equal(x.source_no_publish,true);
 assert.equal(x.production_go,false);assert.equal(x.write_authority,false);
 assert.equal(x.scope,'SOURCE_ONLY_NON_AUTHORIZING');
});
test('04 all eight verified legacy retirement blobs stay byte-for-byte identical',()=>{
 const vals=Object.values(live().immutable_science_and_retirement_blobs);
 assert.equal(vals.length,8);
 assert.deepEqual(new Set(vals),new Set(Object.values(RETIRED_PARITY)));
});
test('05 missing workflow fails closed',()=>{
 const x=audit(f=>f===pages?undefined:load(f));
 assert.equal(x.source_no_publish,false);assert.match(x.errors.join(' '),/missing or unreadable workflow/);
});
test('06 changed old retirement science custody requires new proof',()=>{
 const x=audit(f=>f===parity?load(f)+'\n# drift\n':load(f));
 assert.match(x.errors.join(' '),/retirement blobs changed/);
});
test('07 direct Wrangler Pages deploy is denied',()=>{
 const x=scan(clone(museum)+'\n  - run: npx --yes wrangler@latest pages deploy _site\n',museum);
 assert.match(x.join(' '),/Pages deploy primitive/);
});
test('08 Cloudflare API token reference denied even without deploy call',()=>{
 const x=scan(clone(museum)+'\n    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_PAGES_DEPLOY_TOKEN }}\n',museum);
 assert.match(x.join(' '),/Cloudflare deployment token/);
});
test('09 GitHub Pages write permission denied',()=>{
 assert.match(scan(clone(pages)+'\n  pages: write\n',pages).join(' '),/writer privilege/);
});
test('10 OIDC token write permission denied',()=>{
 assert.match(scan(clone(pages)+'\n  id-token: write\n',pages).join(' '),/writer privilege/);
});
test('11 GitHub Pages deploy action denied',()=>{
 assert.match(scan(clone(pages)+'\n      - uses: actions/deploy-pages@v5\n',pages).join(' '),/deployment action/);
});
test('12 GitHub Pages push on protected main denied',()=>{
 assert.match(scan(clone(pages).replace('on:\n','on:\n  push:\n    branches: [main]\n'),pages).join(' '),/automatic push/);
});
test('13 deployment-consumable Pages artifact denied',()=>{
 assert.match(scan(clone(pages)+'\n      - uses: actions/upload-pages-artifact@v4\n',pages).join(' '),/publisher-consumable/);
});
test('14 Museum scientific validator must remain',()=>{
 assert.match(scan(clone(museum).replaceAll('validate-conv04f-zoology-practical-museum.rb','missing-science.rb'),museum).join(' '),/academic\/browser custody missing/);
});
test('15 Museum browser test must remain',()=>{
 assert.match(scan(clone(museum).replaceAll('conv04f-zoology-practical-museum-browser-certification.mjs','removed-browser.mjs'),museum).join(' '),/browser custody missing/);
});
test('16 Museum Jekyll build must remain',()=>{
 assert.match(scan(clone(museum).replace('bundle exec jekyll build','echo no-build'),museum).join(' '),/academic\/browser custody missing/);
});
test('17 Jekyll baseline build must remain',()=>{
 assert.match(scan(clone(pages).replace('bundle exec jekyll build','echo no-build'),pages).join(' '),/Jekyll build custody missing/);
});
test('18 normal Pages evidence artifact retained',()=>{
 assert.match(scan(clone(pages).replace('actions/upload-artifact@v4','actions/not-an-artifact@v4'),pages).join(' '),/regular build artifact missing/);
});
test('19 masked source comments do not create false publishing positives',()=>{
 assert.deepEqual(scan(clone(pages)+'\n# npx wrangler pages deploy forbidden\n',pages),[]);
});
test('20 separate Worker write is also denied in old writers',()=>{
 assert.match(scan(clone(parity)+'\n      - run: npx wrangler deploy\n',parity).join(' '),/Worker publishing primitive/);
});
test('21 no read-only audit can grant production authority',()=>{
 const x=audit(load);assert.equal(x.production_go,false);assert.equal(x.write_authority,false);
});
