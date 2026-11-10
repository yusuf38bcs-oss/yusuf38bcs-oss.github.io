import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const config=readFileSync(new URL('../wrangler.toml',import.meta.url),'utf8');
test('shadow uses only specified Secrets Store ID',()=>{
 assert.match(config,/store_id = "cf398e43d6224506a286e0719d19401b"/);
 assert.match(config,/binding = "LBFL_RELEASE_ATTESTOR_PRIVATE_KEY"/);
});
test('no public worker URL, preview, route or cron',()=>{
 assert.match(config,/workers_dev = false/);
 assert.match(config,/preview_urls = false/);
 assert.doesNotMatch(config,/^\s*(routes?|crons?)\s*=/m);
});
