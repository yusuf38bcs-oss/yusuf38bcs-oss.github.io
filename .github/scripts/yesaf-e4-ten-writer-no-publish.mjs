// YESAF E4: source-custody guard only. No production/credential authorization.
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

export const FROZEN_BASE = 'e14359550bb9ddd605153a03f7024975c6146090';
export const HISTORICAL_MAIN = '3164d2537b4f19381c52bbfb5c9e1b7ee7d15846';
export const RETIRED_PARITY = Object.freeze({
  'appendages':'a28bf51cac8e4ec07a9228d16d636b1a5af73972',
  'dissection':'68e11e232a437823258f5f74530db51017ce5',
  'field-report':'9c5facafde56309951db4e768f7040582c0aa96c',
  'museum':'bf91156ff62791c21f90c880e72838f2843c3926',
  'permanent-slides':'a17d3221cc69dcb4b4760693814eec40d26d719e',
  'temporary-mounts':'07b28127f234d5819e568497d206851230e13810',
  'whole-mounts':'1f8f8ab0b9347a7c1c3e2e66e729ea1427c31a0a',
  'zooplankton':'305b555b153c30719fedcc88164947a2c85fe5f9'
});
export const TEN = Object.freeze([
  ...Object.keys(RETIRED_PARITY).map(n => `.github/workflows/conv04f-zoology-practical-${n}-production-parity.yml`),
  '.github/workflows/conv04f-zoology-practical-museum-certification.yml',
  '.github/workflows/jekyll-gh-pages.yml'
]);
export function blobSHA(src){
  const b=Buffer.from(src,'utf8');
  return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex');
}
export function scan(source,file){
  const problems=[];
  if(typeof source!=='string'||!source.trim()) return ['missing or unreadable workflow: '+file];
  const lines=source.split(/\r?\n/).filter(l=>!/^\s*#/.test(l));
  const active=lines.join('\n');
  const forbidden=[
    [/\b(?:wrangler(?:@[^\s]+)?\s+)?pages\s+deploy\b/i,'Pages deploy primitive'],
    [/\bwrangler(?:@[^\s]+)?\s+(?:deploy|publish)\b/i,'Worker publishing primitive'],
    [/\buses:\s*(?:actions\/deploy-pages|cloudflare\/wrangler-action)@/i,'deployment action'],
    [/\buses:\s*actions\/upload-pages-artifact@/i,'publisher-consumable Pages artifact'],
    [/\b(?:CLOUDFLARE_API_TOKEN|CLOUDFLARE_PAGES_DEPLOY_TOKEN|CLOUDFLARE_WORKER_DEPLOY_TOKEN|CF_API_TOKEN|CLOUDFLARE_TOKEN)\b/i,'Cloudflare deployment token reference'],
    [/\b(?:pages|id-token|deployments|contents):\s*write\b/i,'writer privilege'],
    [/^\s+environment:\s*$[\s\S]*?\bname:\s*github-pages/m,'GitHub Pages deploy environment']
  ];
  for(const [re,why] of forbidden) if(re.test(active))problems.push(file+': '+why);
  if(file.endsWith('jekyll-gh-pages.yml') && /^\s+push:\s*(?:#.*)?$/m.test(active))
    problems.push(file+': automatic push trigger remains');
  if(file.includes('museum-certification')){
    for(const m of ['validate-conv04f-zoology-practical-museum.rb','conv04f-zoology-practical-museum-browser-certification.mjs','bundle exec jekyll build']){
      if(!active.includes(m)) problems.push(file+': academic/browser custody missing: '+m);
    }
    if(/needs:\s*\[preview\]/.test(active))problems.push(file+': obsolete deployment dependency remains');
  }
  if(file.endsWith('jekyll-gh-pages.yml')){
    if(!active.includes('bundle exec jekyll build'))problems.push(file+': Jekyll build custody missing');
    if(!active.includes('actions/upload-artifact@v4'))problems.push(file+': regular build artifact missing');
  }
  return problems;
}
export function audit(read){
  const errors=[];
  const blobs={};
  for(const file of TEN){
    const c=read(file);
    errors.push(...scan(c,file));
    const m=file.match(/practical-(.+)-production-parity\.yml$/);
    if(m&&typeof c==='string'){
      const got=blobSHA(c);
      blobs[file]=got;
      if(got!==RETIRED_PARITY[m[1]])errors.push(file+': eight verified predecessor-retirement blobs changed; recertification required');
    }
  }
  return {scope:'SOURCE_ONLY_NON_AUTHORIZING',ten_count:TEN.length,immutable_science_and_retirement_blobs:blobs,errors,
    source_no_publish:errors.length===0,production_go:false,write_authority:false};
}
if(process.argv[1] && import.meta.url===new URL('file://'+path.resolve(process.argv[1])).href){
  const result=audit(file=>{try{return fs.readFileSync(file,'utf8')}catch{return undefined}});
  console.log(JSON.stringify(result,null,2));
  if(!result.source_no_publish)process.exitCode=1;
}
