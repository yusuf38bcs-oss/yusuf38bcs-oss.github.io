#!/usr/bin/env node
// YESAF E7: lexical inventory ONLY. No writer, attestation or merge authority.
import {readFileSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
const rules=[
 ['cloudflare-writer-secret',/secrets\.(?:CLOUDFLARE_API_TOKEN|CLOUDFLARE_PAGES_DEPLOY_TOKEN|CLOUDFLARE_WORKER_DEPLOY_TOKEN|CLOUDFLARE_DEPLOY_TOKEN)\b/i],
 ['wrangler-publish',/\bwrangler(?:@[0-9.]+)?\s+(?:pages\s+deploy|deploy\b|versions\s+deploy|publish\b)/i],
 ['cloudflare-deploy-action',/(?:cloudflare\/(?:wrangler-action|pages-action))@/i],
 ['github-pages-writer',/(?:actions\/deploy-pages@|peaceiris\/actions-gh-pages@|JamesIves\/github-pages-deploy-action@)/i],
 ['pages-write-permission',/^\s*pages:\s*write\b/m],
 ['id-token-write-permission',/^\s*id-token:\s*write\b/m],
 ['deployment-cli',/\b(?:gh\s+api|curl\s+(?:-X|--request)\s+(?:POST|PUT|PATCH|DELETE)|wrangler)\b/i],
 ['production-environment',/^\s*environment:\s*(?:production|github-pages)\s*$/m]
];
export function scanText(src){
 const flags=rules.filter(([_,re])=>re.test(src)).map(([name])=>name);
 return {flags,possible_writer:flags.some(x=>x!=='production-environment'&&x!=='id-token-write-permission')};
}
function selfTest(){
 const fixtures=[
 ["wrangler pages deploy _site",true],["CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}",true],
 ["uses: actions/deploy-pages@v4",true],["uses: cloudflare/wrangler-action@v3",true],
 ["permissions:\n  pages: write",true],["permissions:\n  contents: read",false],
 ["echo 'read only'",false],["environment: production",false]
 ];
 for(const [s,expect]of fixtures)if(scanText(s).possible_writer!==expect)throw Error('E7 SCANNER SELF TEST FAILED');
 console.log('E7_SCANNER_SELF_TEST=8/8 PASS');
}
function run(root){
 const dir=join(resolve(root),'.github','workflows');
 const names=readdirSync(dir).filter(x=>/\.ya?ml$/i.test(x)).sort();
 if(names.length<60)throw Error('HOLD: incomplete protected workflow directory');
 const matches=[];
 for(const name of names){
  const flags=scanText(readFileSync(join(dir,name),'utf8'));
  if(flags.flags.length)matches.push({path:'.github/workflows/'+name,...flags});
 }
 const possible=matches.filter(x=>x.possible_writer);
 const result={schema:'yesaf-e7-writer-surface-inventory/v1',mode:'HEURISTIC_NOT_AUTHORIZATION',
  scanned_workflows:names.length,possible_writer_files:possible.length,
  review_required:matches,verified_complete:false,production_release:'HOLD',merge_authority:false};
 console.log(JSON.stringify(result,null,2));
}
if(process.argv[1]&&/yesaf-e7-writer-surface-scanner\.mjs$/.test(process.argv[1])){
 try{
  if(process.argv.length===3&&process.argv[2]==='--self-test')selfTest();
  else if(process.argv.length===4&&process.argv[2]==='--scan')run(process.argv[3]);
  else throw Error('HOLD: expected --self-test or --scan <checked-out-exact-main>');
 }catch(e){console.error(String(e.message||e));process.exitCode=1}
}