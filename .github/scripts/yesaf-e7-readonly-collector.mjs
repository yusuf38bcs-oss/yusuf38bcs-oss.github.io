#!/usr/bin/env node
// Owner-side authenticated GET-only two-pass census. Never a trusted review or merge gate.
import {execFileSync} from 'node:child_process';
import {MAIN,REPO,STATES,PATHS,evaluate} from './yesaf-e7-containment-policy.mjs';
function halt(x){throw new Error('E7 COLLECTOR HOLD: '+x)}
function get(route){
 if(!/^repos\/yusuf38bcs-oss\/yusuf38bcs-oss\.github\.io\/(branches\/main|actions\/workflows\?per_page=100&page=[0-9]+|actions\/workflows\/[0-9]+\/runs\?status=(requested|queued|in_progress|waiting|pending)&per_page=1)$/.test(route))halt('route not allowlisted');
 try{return JSON.parse(execFileSync('gh',['api','--method','GET',route],{encoding:'utf8',timeout:30000,maxBuffer:4000000,windowsHide:true,stdio:['ignore','pipe','pipe']}))}
 catch{halt('authenticated GitHub API GET failed')}
}
const root='repos/'+REPO;
function capture(){
 if(get(root+'/branches/main').commit?.sha!==MAIN)halt('main drift before census');
 const all=[];
 for(let page=1;page<=10;page++){
  const v=get(root+'/actions/workflows?per_page=100&page='+page);
  if(!Number.isSafeInteger(v.total_count)||!Array.isArray(v.workflows))halt('invalid workflow registry');
  all.push(...v.workflows);
  if(all.length>=v.total_count){if(all.length!==v.total_count)halt('registry paging changed');break}
  if(page===10)halt('workflow registry >1000');
 }
 const workflows=PATHS.map(path=>{
  const matches=all.filter(w=>w.path===path);
  if(matches.length!==1)halt('missing/duplicate workflow: '+path);
  const w=matches[0];
  if(!Number.isSafeInteger(w.id)||!w.updated_at)halt('invalid workflow metadata');
  return {id:w.id,path,state:w.state,updated_at:w.updated_at};
 });
 const enabled=workflows.filter(w=>w.state!=='disabled_manually').map(w=>`${w.path} [id=${w.id}; state=${w.state}]`);
 if(enabled.length)halt('production-capable workflow enabled: '+enabled.join(', '));
 const runs=Object.fromEntries(STATES.map(s=>[s,{}]));
 for(const w of workflows)for(const status of STATES){
  const v=get(root+'/actions/workflows/'+w.id+'/runs?status='+status+'&per_page=1');
  if(!Number.isSafeInteger(v.total_count)||v.total_count!==0||!Array.isArray(v.workflow_runs)||v.workflow_runs.length)halt('active or truncated publisher run '+w.id+'/'+status);
  runs[status][String(w.id)]=[];
 }
 if(get(root+'/branches/main').commit?.sha!==MAIN)halt('main drift after census');
 return {main:MAIN,at:new Date().toISOString(),workflows,runs};
}
try{
 if(process.argv.length!==3||process.argv[2]!=='--live')halt('use --live only');
 const snapshot={schema:'yesaf-e7/v1',repository:REPO,main:MAIN,observations:[capture(),capture()]};
 process.stdout.write(JSON.stringify({assessment:evaluate(snapshot,new Date().toISOString()),snapshot},null,2)+'\n');
}catch(e){console.error(String(e.message||e));process.exitCode=1}
