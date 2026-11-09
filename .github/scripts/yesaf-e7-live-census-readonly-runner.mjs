#!/usr/bin/env node
// Evidence collection only: authenticated GETs, no Cloudflare token and no release authority.
import assert from 'node:assert/strict';
import { stableObservation, PUBLISHERS } from './yesaf-e7-live-writer-census.mjs';

const repo=process.env.GITHUB_REPOSITORY||'';
const token=process.env.GH_TOKEN||'';
const expectedMain=process.env.EXPECTED_MAIN_SHA||'';
const expectedHead=process.env.EXPECTED_HEAD_SHA||'';
assert.equal(repo,'yusuf38bcs-oss/yusuf38bcs-oss.github.io');
assert.match(expectedMain,/^[0-9a-f]{40}$/);
assert.match(expectedHead,/^[0-9a-f]{40}$/);
assert.ok(token,'GitHub Actions read-only job token is required');

async function githubGet(path){
  if(!/^\/repos\/yusuf38bcs-oss\/yusuf38bcs-oss\.github\.io\//.test(path) || /[\r\n]/.test(path)){
    throw new Error('HOLD: Unexpected GET resource');
  }
  const response=await fetch('https://api.github.com'+path,{
    method:'GET',
    headers:{
      Accept:'application/vnd.github+json',
      Authorization:'Bearer '+token,
      'X-GitHub-Api-Version':'2022-11-28',
      'User-Agent':'LBFL-YESAF-E7-ReadOnly-Census'
    },
    redirect:'error',
    signal:AbortSignal.timeout(20000)
  });
  if(response.status!==200){
    throw new Error('HOLD: GitHub GET metadata HTTP '+response.status);
  }
  return response.json();
}

const ref='/repos/'+repo+'/git/ref/heads/main';
async function verifyCurrentMain(){
  const data=await githubGet(ref);
  const observed=data?.object?.sha;
  if(observed!==expectedMain)throw new Error('HOLD: Protected main SHA moved since PR base');
}
await verifyCurrentMain();
const record=await stableObservation(githubGet,repo);
await verifyCurrentMain();
assert.equal(record.observed.length,PUBLISHERS.length);
assert.equal(record.production_authority,false);
assert.equal(record.merge_authority,false);
assert.equal(record.release,'HOLD');
// No token or workflow run payload is serialized.
const output={
  exact_pr_head:expectedHead,
  exact_main_sha:expectedMain,
  observed_workflows:record.observed.map(x=>({id:x.id,path:x.path,state:x.state,active:x.active})),
  all_known_legacy_publishers_disabled:record.all_known_legacy_publishers_disabled,
  case:'READ_ONLY_LIVE_CENSUS_SNAPSHOT_ONLY',
  authority:'NONE',
  decision:'HOLD'
};
process.stdout.write(JSON.stringify(output,null,2)+'\n');
