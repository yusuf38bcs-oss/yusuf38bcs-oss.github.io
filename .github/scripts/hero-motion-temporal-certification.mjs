#!/usr/bin/env node
// Exact-head temporal SVG proof; viewport, opt-out and keyframe-property gates.
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
const arg = (name, fallback = "") => { const i=process.argv.indexOf(name); return i<0?fallback:process.argv[i+1]; };
const url=arg("--url"), sha=arg("--expected-sha"), dir=path.resolve(arg("--output-dir","browser-certification"));
if(!url||!sha)throw new Error("Expected --url and --expected-sha");
await fs.mkdir(dir,{recursive:true});
const selectors={rings:".lbfl-v3-synaptic-orbit--breathing",nodes:".lbfl-v3-synaptic-node--pulse",signals:".lbfl-v3-synaptic-signal"};
const expected={rings:2,nodes:8,signals:2};
const allowed=new Set(["offset","computedOffset","easing","composite","opacity","strokeDashoffset","stroke-dashoffset"]);
const browser=await chromium.launch({headless:true});
const results=[];
async function openCase({width=1440,height=900,reduce=false,save=false,noRuntime=false}={}) {
  const context=await browser.newContext({viewport:{width,height},reducedMotion:reduce?"reduce":"no-preference"});
  if(save)await context.addInitScript(()=>Object.defineProperty(navigator,"connection",{configurable:true,value:{saveData:true}}));
  if(noRuntime)await context.route("**/assets/js/home/homepage-v3.js*",r=>r.fulfill({status:200,contentType:"application/javascript",body:"/* intentionally withheld */"}));
  const page=await context.newPage();
  const response=await page.goto(url,{waitUntil:"domcontentloaded",timeout:60000});
  if(response?.status()!==200)throw new Error("Unexpected preview HTTP "+response?.status());
  await page.waitForTimeout(2300);
  return {page,context};
}
async function read(page) {
  return page.evaluate((selectors)=>{
    const groups={};
    for(const [key,query] of Object.entries(selectors))groups[key]=Array.from(document.querySelectorAll(query)).map(el=>{
      const s=getComputedStyle(el);
      const animations=el.getAnimations().map(a=>({state:a.playState,properties:(a.effect?.getKeyframes()||[]).flatMap(f=>Object.keys(f))}));
      return {name:s.animationName,opacity:parseFloat(s.opacity)||0,dash:parseFloat(s.strokeDashoffset)||0,animations};
    });
    const field=document.querySelector(".lbfl-v3-synaptic-field");
    return {saveData:document.documentElement.dataset.saveData??null,reduce:matchMedia("(prefers-reduced-motion: reduce)").matches,fieldVisible:!!field&&getComputedStyle(field).display!=="none",groups,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1};
  },selectors);
}
const counts=s=>Object.entries(expected).every(([k,n])=>s.groups[k].length===n);
const running=g=>g.every(x=>x.name!=="none"&&x.animations.some(a=>a.state==="running"));
const frozen=g=>g.every(x=>x.name==="none"&&!x.animations.some(a=>a.state==="running"));
const delta=(a,b,k,prop)=>Math.max(0,...a.groups[k].map((x,i)=>Math.abs(x[prop]-b.groups[k][i][prop])));
async function temporal(label,width,height) {
  const {page,context}=await openCase({width,height});try {
    const a=await read(page);
    await page.screenshot({path:path.join(dir,`hero-${label}-t0.png`)});
    await page.waitForTimeout(4100);
    const b=await read(page);
    await page.screenshot({path:path.join(dir,`hero-${label}-t4.png`)});
    const violations=Object.values(a.groups).flat().flatMap(x=>x.animations.flatMap(v=>v.properties.filter(p=>!allowed.has(p))));
    const diffs={ring:delta(a,b,"rings","opacity"),node:delta(a,b,"nodes","opacity"),signal:delta(a,b,"signals","dash")};
    const mobile=width<=700;
    const passed=counts(a)&&counts(b)&&a.saveData==="false"&&!a.reduce&&a.fieldVisible&&!a.overflow&&
      running(a.groups.rings)&&running(a.groups.nodes)&&
      (mobile?frozen(a.groups.signals):running(a.groups.signals))&&violations.length===0&&
      diffs.ring>.01&&diffs.node>.01&&(mobile?diffs.signal<.01:diffs.signal>1.5);
    return {case:label,passed,diffs,violations,initial:a,later:b};
  }finally{await context.close();}
}
async function off(label,options) {
  const {page,context}=await openCase(options);try {
    const s=await read(page);
    const passed=counts(s)&&Object.values(s.groups).every(frozen)&&
      s.saveData===(options.noRuntime?null:options.save?"true":"false")&&
      (options.reduce?s.reduce:!s.reduce)&&
      (options.save?!s.fieldVisible:s.fieldVisible);
    return {case:label,passed,state:s};
  }finally{await context.close();}
}
try{
  results.push(await temporal("desktop-1440",1440,900));
  results.push(await temporal("mobile-375",375,812));
  results.push(await off("reduced-desktop-1440",{width:1440,height:900,reduce:true}));
  results.push(await off("save-data-desktop-1440",{width:1440,height:900,save:true}));
  results.push(await off("no-runtime-desktop-1440",{width:1440,height:900,noRuntime:true}));
}catch(e){results.push({case:"exception",passed:false,error:String(e.stack||e)});}
finally{await browser.close();}
const passed=results.length===5&&results.every(r=>r.passed);
const summary=["# Hero Motion Temporal Certification",`- HEAD: \`${sha}\``,`- Overall: **${passed?"PASS":"FAIL"}**`,...results.map(r=>`- ${r.case}: **${r.passed?"PASS":"FAIL"}**${r.diffs?` · ring Δ=${r.diffs.ring.toFixed(3)} / node Δ=${r.diffs.node.toFixed(3)} / path Δ=${r.diffs.signal.toFixed(2)}`:""}`),""].join("\n");
await fs.writeFile(path.join(dir,"hero-motion-certification.json"),JSON.stringify({expectedSha:sha,url,passed,results},null,2));
await fs.writeFile(path.join(dir,"hero-motion-certification.md"),summary);
console.log(summary);
process.exit(passed?0:1);
