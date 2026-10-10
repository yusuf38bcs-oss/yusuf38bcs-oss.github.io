import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker, {EXPECTED,runAuthenticationProbe} from '../src/index.mjs';

test('shadow has no public capability',()=>assert.equal(worker.fetch().status,404));
test('hardcoded identity and repo',()=>{
 assert.equal(EXPECTED.appId,5266418);
 assert.equal(EXPECTED.fullName,'yusuf38bcs-oss/yusuf38bcs-oss.github.io');
});
test('missing binding rejects',async()=>{
 await assert.rejects(runAuthenticationProbe({env:{},fetchImpl:()=>{throw new Error('network must not occur');}}),/binding/);
});
