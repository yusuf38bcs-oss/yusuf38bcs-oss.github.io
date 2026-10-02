#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i>=0&&process.argv[i+1]?process.argv[i+1]:fallback};
const base=arg("--base-url","http://127.0.0.1:4173").replace(/\/$/,"");
const out=path.resolve(arg("--output-dir","conv04e-bot08-browser-report"));
const route="/biology/hsc-corner/botany/lecture-08-plastid-chloroplast/";
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

async function run(view,options={}){
  const context=await browser.newContext({
    viewport:{width:view.width,height:view.height},
    javaScriptEnabled:options.javaScriptEnabled!==false,
    reducedMotion:options.reducedMotion?"reduce":"no-preference"
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
  page.on("response",r=>{const u=new URL(r.url());if(["127.0.0.1","localhost"].includes(u.hostname)&&r.status()>=400)localHttpErrors.push({status:r.status(),url:r.url()})});
  let status=0,metrics={},axeBad=[],keyboardTarget=false,focusVisible=false;
  try{
    const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:20000});
    status=response?.status()??0;
    if(options.textSpacing){
      await page.addStyleTag({content:"*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}"});
    }
    if(options.javaScriptEnabled!==false){
      for(let i=0;i<220;i++){
        await page.keyboard.press("Tab");
        const f=await page.evaluate(()=>{
          const el=document.activeElement;
          return {target:!!el?.closest?.(".lbfl-learning-guide-cta,.lbfl-academic-actions"),visible:!!el?.matches?.(":focus-visible")};
        });
        if(f.target){keyboardTarget=true;focusVisible=f.visible;break}
      }
    }
    metrics=await page.evaluate(()=>{
      const article=document.querySelector("[data-lbfl-academic-surface='v1']");
      const body=document.body.innerText||"";
      const ctas=[...document.querySelectorAll(".lbfl-learning-guide-cta")];
      const hrefs=[...document.querySelectorAll("a[href]")].map(a=>new URL(a.href,location.href).pathname);
      return {
        htmlLang:document.documentElement.lang,
        htmlAcademic:document.documentElement.classList.contains("lbfl-academic-v1"),
        bodyAcademic:document.body.classList.contains("lbfl-academic-v1-active"),
        articleAcademic:!!article,
        role:article?.getAttribute("data-lbfl-academic-role")||"",
        canonicalGuide:article?.getAttribute("data-lbfl-learning-guide")==="canonical",
        ctaCount:ctas.length,
        ctaToLearn:ctas.some(x=>[...x.querySelectorAll("a[href]")].some(a=>new URL(a.href,location.href).pathname==="/learn/")),
        h1Count:document.querySelectorAll("h1").length,
        boundaryCount:document.querySelectorAll(".educational-boundary").length,
        mcqCount:document.querySelectorAll("[data-bot08-mcq]").length,
        cqCount:document.querySelectorAll("[data-bot08-cq]").length,
        previous:hrefs.includes("/biology/hsc-corner/botany/lecture-07-cell-wall-vacuole/"),
        chapter:hrefs.includes("/biology/hsc-corner/botany/chapter-01-cell-and-its-structure/"),
        required:["Plastid and Chloroplast","Thylakoid","Stroma","MCQ Practice","CQ Practice","gap-02-chloroplast"].map(t=>({text:t,passed:body.includes(t)})),
        overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
        rawLiquid:/\{\{|\{%/.test(body)
      };
    });
    if(options.javaScriptEnabled!==false){
      await page.addScriptTag({content:axe.source});
      axeBad=await page.evaluate(async()=>{
        const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa"]}});
        return r.violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>({
          id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary}))
        }));
      });
    }
    const pass=status===200 &&
      metrics.htmlLang==="bn" && metrics.htmlAcademic && metrics.bodyAcademic &&
      metrics.articleAcademic && metrics.role==="lecture" && metrics.canonicalGuide &&
      metrics.ctaCount===1 && metrics.ctaToLearn && metrics.h1Count===1 &&
      metrics.boundaryCount===1 && metrics.mcqCount===4 && metrics.cqCount===2 &&
      metrics.previous && metrics.chapter && metrics.required.every(x=>x.passed) &&
      metrics.overflow<=2 && !metrics.rawLiquid &&
      consoleErrors.length===0 && pageErrors.length===0 && localHttpErrors.length===0 &&
      (options.javaScriptEnabled===false || (keyboardTarget && focusVisible && axeBad.length===0));
    checks.push({viewport:view.name,options,status,metrics,keyboardTarget,focusVisible,axeBad,consoleErrors,pageErrors,localHttpErrors,pass});
  }catch(error){checks.push({viewport:view.name,options,status,error:String(error),pass:false});}
  await context.close();
}
for(const view of viewports) await run(view);
for(const view of viewports.filter(v=>["mobile-320","desktop-1280"].includes(v.name))){
  await run(view,{textSpacing:true});
  await run(view,{javaScriptEnabled:false});
  await run(view,{reducedMotion:true});
}
await browser.close();
const failed=checks.filter(c=>!c.pass);
await fs.writeFile(path.join(out,"results.json"),JSON.stringify({checks,failed:failed.length,result:failed.length?"FAIL":"PASS"},null,2)+"\n");
await fs.writeFile(path.join(out,"summary.md"),`# CONV-04E-02 BOT-08 Browser Certification\n\n- Checks: ${checks.length}\n- Failed: ${failed.length}\n- Result: ${failed.length?"FAIL":"PASS"}\n`);
if(failed.length){console.error(JSON.stringify(failed,null,2));process.exit(1)}
console.log("CONV-04E-02 BOT-08 browser certification: PASS");
