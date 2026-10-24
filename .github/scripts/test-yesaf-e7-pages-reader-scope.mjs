import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const names=['adsense-browser-certification','ielts-reading-browser-certification','ielts-speaking-browser-certification','ielts-typography-browser-certification','ielts-writing-browser-certification','zoology-practical-browser-certification'];
const pin='CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_PAGES_READ_TOKEN }}';
for(const n of names){
 test('Pages reader only: '+n,()=>{
  const s=readFileSync(new URL('../workflows/'+n+'.yml',import.meta.url),'utf8');
  assert.equal(s.split(pin).length-1,1);
  assert.doesNotMatch(s,/secrets\.(?:CLOUDFLARE_API_TOKEN|CLOUDFLARE_PAGES_DEPLOY_TOKEN|CLOUDFLARE_WORKER_DEPLOY_TOKEN)/);
  assert.match(s,/resolve-cloudflare-targets\.py/);
  assert.doesNotMatch(s,/^\s*(?:pages|id-token):\s*write\s*$/m);
  assert.doesNotMatch(s,/\bwrangler[^\n]*pages\s+deploy\b/);
  assert.equal((s.match(/secrets\./g)||[]).length,1);
 });
}
test('exact six independent metadata consumers',()=>{assert.equal(names.length,6);assert.equal(new Set(names).size,6)});
