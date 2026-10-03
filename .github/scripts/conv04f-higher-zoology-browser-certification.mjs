#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const arg=(n,d)=>{const i=process.argv.indexOf(n);return i>=0&&process.argv[i+1]?process.argv[i+1]:d};
const base=arg("--base-url","http://127.0.0.1:4173").replace(/\/$/,"");
const out=path.resolve(arg("--output-dir","conv04f-higher-zoology-browser-report"));
const routes=[
 {route:"/biology/higher-zoology-tree/",lang:"en",required:["Higher Zoology Tree","Main Branches","Recommended Learning Sequence"]},
 {route:"/bn/biology/higher-zoology-tree/",lang:"bn",required:["উচ্চতর প্রাণিবিজ্ঞান","প্রধান শাখাসমূহ","প্রস্তাবিত শেখার ক্রম"]}
];
const viewports=[
 {name:"mobile-320",width:320,height:900},
 {name:"mobile-390",width:390,height:900},
 {name:"tablet-768",width:768,height:1024},
 {name:"desktop-1280",width:1280,height:900},
 {name:"wide-1440",width:1440,height:960}
];

await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const checks=[];

async function run(target,view,opts={}){
 const context=await browser.newContext({
   viewport:{width:view.width,height:view.height},
   javaScriptEnabled:opts.javaScriptEnabled!==false,
   reducedMotion:opts.reducedMotion?"reduce":"no-preference"
 });
 await context.route("**/*",async rr=>{
   const u=new URL(rr.request().url());
   if(["127.0.0.1","localhost"].includes(u.hostname)) await rr.continue();
   else await rr.fulfill({status:204,body:""});
 });
 const page=await context.newPage();
 const consoleErrors=[],pageErrors=[],localHttpErrors=[];
 page.on("console",m=>{if(m.type()==="error")consoleErrors.push(m.text())});
 page.on("pageerror",e=>pageErrors.push(String(e)));
 page.on("response",r=>{
   const u=new URL(r.url());
   if(["127.0.0.1","localhost"].includes(u.hostname)&&r.status()>=400)localHttpErrors.push({status:r.status(),url:r.url()});
 });
 let status=0,metrics={},axeBad=[],keyboard=false,focusVisible=false;
 try{
   const response=await page.goto(base+target.route,{waitUntil:"domcontentloaded",timeout:20000});
   status=response?.status()??0;

   if(opts.textSpacing){
     await page.addStyleTag({content:"*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}"});
   }

   if(opts.javaScriptEnabled!==false){
     for(let i=0;i<220;i++){
       await page.keyboard.press("Tab");
       const f=await page.evaluate(()=>{
         const el=document.activeElement;
         return {target:!!el?.closest?.(".lbfl-learning-guide-cta"),visible:!!el?.matches?.(":focus-visible")};
       });
       if(f.target){keyboard=true;focusVisible=f.visible;break}
     }
   }

   const baseMetrics=await page.evaluate(({lang,required})=>{
     const article=document.querySelector("[data-lbfl-academic-surface='v1']");
     const body=document.body.innerText||"";
     const ctas=[...document.querySelectorAll(".lbfl-learning-guide-cta")];
     return {
       htmlLang:document.documentElement.lang,
       htmlAcademic:document.documentElement.classList.contains("lbfl-academic-v1"),
       bodyAcademic:document.body.classList.contains("lbfl-academic-v1-active"),
       articleAcademic:!!article,
       role:article?.getAttribute("data-lbfl-academic-role")||"",
       canonicalGuide:article?.getAttribute("data-lbfl-learning-guide")==="canonical",
       ctaCount:ctas.length,
       ctaToLearn:ctas.some(x=>[...x.querySelectorAll("a[href]")].some(a=>new URL(a.href,location.href).pathname==="/learn/")),
       boundaryCount:document.querySelectorAll(".educational-boundary").length,
       oldCycleCount:document.querySelectorAll("[data-zoology-learning-cycle]").length,
       legacyFrameworkCount:document.querySelectorAll(".lbfl-framework-links").length,
       required:required.map(t=>({text:t,passed:body.includes(t)})),
       overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
       rawLiquid:/\{\{|\{%/.test(body),
       expectedLang:lang
     };
   },target);
   metrics={...metrics,...baseMetrics};

   if(opts.textSpacing){
     metrics.textClip=await page.evaluate(()=>[...document.querySelectorAll("p,li,h1,h2,h3,a,button")].filter(el=>{
       const cs=getComputedStyle(el);
       if(["hidden","clip"].includes(cs.overflowY)&&el.scrollHeight>el.clientHeight+2)return true;
       if(["hidden","clip"].includes(cs.overflowX)&&el.scrollWidth>el.clientWidth+2)return true;
       return false;
     }).length);
   }

   if(opts.reducedMotion){
     metrics.reduceMatches=await page.evaluate(()=>matchMedia("(prefers-reduced-motion: reduce)").matches);
     metrics.motionViolations=await page.evaluate(()=>[...document.querySelectorAll("[data-lbfl-academic-surface='v1'] *")].filter(el=>{
       const cs=getComputedStyle(el);
       const ad=cs.animationDuration.split(",").some(v=>parseFloat(v)*1000>20);
       const td=cs.transitionDuration.split(",").some(v=>parseFloat(v)*1000>20);
       return ad||td||cs.scrollBehavior==="smooth";
     }).length);
   }

   if(opts.javaScriptEnabled!==false){
     await page.addScriptTag({content:axe.source});
     axeBad=await page.evaluate(async()=>{
       const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa"]}});
       return r.violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>({
         id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary}))
       }));
     });
   }

   const pass=
     status===200 &&
     metrics.htmlLang===target.lang &&
     metrics.htmlAcademic &&
     metrics.bodyAcademic &&
     metrics.articleAcademic &&
     metrics.role==="academic_gateway" &&
     metrics.canonicalGuide &&
     metrics.ctaCount===1 &&
     metrics.ctaToLearn &&
     metrics.boundaryCount===1 &&
     metrics.oldCycleCount===0 &&
     metrics.legacyFrameworkCount===0 &&
     metrics.required.every(x=>x.passed) &&
     metrics.overflow<=2 &&
     !metrics.rawLiquid &&
     (!opts.textSpacing||metrics.textClip===0) &&
     (!opts.reducedMotion||(metrics.reduceMatches&&metrics.motionViolations===0)) &&
     consoleErrors.length===0 &&
     pageErrors.length===0 &&
     localHttpErrors.length===0 &&
     (opts.javaScriptEnabled===false||(keyboard&&focusVisible&&axeBad.length===0));

   checks.push({route:target.route,viewport:view.name,opts,status,metrics,keyboard,focusVisible,axeBad,consoleErrors,pageErrors,localHttpErrors,pass});
 }catch(error){
   checks.push({route:target.route,viewport:view.name,opts,status,error:String(error),pass:false});
 }
 await context.close();
}

for(const t of routes){
 for(const v of viewports) await run(t,v);
 for(const v of viewports.filter(x=>["mobile-320","desktop-1280"].includes(x.name))){
   await run(t,v,{textSpacing:true});
   await run(t,v,{reducedMotion:true});
   await run(t,v,{javaScriptEnabled:false});
 }
}

await browser.close();
const failed=checks.filter(c=>!c.pass);
await fs.writeFile(path.join(out,"results.json"),JSON.stringify({checks,failed:failed.length,result:failed.length?"FAIL":"PASS"},null,2)+"\n");
await fs.writeFile(path.join(out,"summary.md"),`# CONV-04F-02 Higher Zoology Browser Certification\n\n- Checks: ${checks.length}\n- Failed: ${failed.length}\n- Result: ${failed.length?"FAIL":"PASS"}\n`);
if(failed.length){console.error(JSON.stringify(failed,null,2));process.exit(1)}
console.log("CONV-04F-02 Higher Zoology browser certification: PASS");
