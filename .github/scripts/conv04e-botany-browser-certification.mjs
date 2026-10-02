#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i>=0&&process.argv[i+1]?process.argv[i+1]:fallback};
const base=arg("--base-url","http://127.0.0.1:4173").replace(/\/$/,"");
const out=path.resolve(arg("--output-dir","conv04e-botany-browser-report"));

const routes=[
  {route:"/biology/hsc-corner/botany/",role:"academic_gateway",required:["অধ্যায় সূচি","সক্রিয় Chapter 01 লেকচার"]},
  {route:"/biology/hsc-corner/botany/chapter-01-cell-and-its-structure/",role:"chapter_index",required:["সক্রিয় লেকচার","Remaining official NCTB coverage gaps","not-certified"]}
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

async function run(target,view,options={}){
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
  const consoleErrors=[];
  const pageErrors=[];
  const localHttpErrors=[];
  page.on("console",m=>{if(m.type()==="error")consoleErrors.push(m.text())});
  page.on("pageerror",e=>pageErrors.push(String(e)));
  page.on("response",r=>{
    const u=new URL(r.url());
    if(["127.0.0.1","localhost"].includes(u.hostname)&&r.status()>=400)localHttpErrors.push({status:r.status(),url:r.url()});
  });

  let status=0,metrics={},axeBad=[];
  try{
    const response=await page.goto(base+target.route,{waitUntil:"domcontentloaded",timeout:20000});
    status=response?.status()??0;

    if(options.textSpacing){
      await page.addStyleTag({content:"*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}"});
    }

    let ctaKeyboardFocus=false;
    let ctaFocusVisible=false;
    if(options.javaScriptEnabled!==false){
      for(let i=0;i<180;i++){
        await page.keyboard.press("Tab");
        const f=await page.evaluate(()=>{
          const el=document.activeElement;
          return {
            inCta:!!el?.closest?.(".lbfl-learning-guide-cta"),
            visible:!!el?.matches?.(":focus-visible")
          };
        });
        if(f.inCta){ctaKeyboardFocus=true;ctaFocusVisible=f.visible;break}
      }
    }

    metrics=await page.evaluate(({role,required})=>{
      const article=document.querySelector("[data-lbfl-academic-surface='v1']");
      const body=document.body.innerText||"";
      const ctas=[...document.querySelectorAll(".lbfl-learning-guide-cta")];
      const ctaLinks=ctas.flatMap(x=>[...x.querySelectorAll("a[href]")]).map(a=>new URL(a.href,location.href).pathname);
      return {
        htmlLang:document.documentElement.lang,
        htmlAcademic:document.documentElement.classList.contains("lbfl-academic-v1"),
        bodyAcademic:document.body.classList.contains("lbfl-academic-v1-active"),
        articleAcademic:!!article,
        role:article?.getAttribute("data-lbfl-academic-role")||"",
        canonicalGuide:article?.getAttribute("data-lbfl-learning-guide")==="canonical",
        ctaCount:ctas.length,
        ctaToLearn:ctaLinks.includes("/learn/"),
        h1Count:document.querySelectorAll("h1").length,
        boundaryCount:document.querySelectorAll(".educational-boundary").length,
        requiredText:required.map(text=>({text,passed:body.includes(text)})),
        overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
        rawLiquid:/\{\{|\{%/.test(body),
        expectedRole:role
      };
    },target);

    if(options.javaScriptEnabled!==false){
      await page.addScriptTag({content:axe.source});
      axeBad=await page.evaluate(async()=>{
        const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa"]}});
        return r.violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>({
          id:v.id,
          impact:v.impact,
          nodes:v.nodes.length,
          details:v.nodes.map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary}))
        }));
      });
    }

    const pass=
      status===200 &&
      metrics.htmlLang==="bn" &&
      metrics.htmlAcademic &&
      metrics.bodyAcademic &&
      metrics.articleAcademic &&
      metrics.role===target.role &&
      metrics.canonicalGuide &&
      metrics.ctaCount===1 &&
      metrics.ctaToLearn &&
      metrics.h1Count===1 &&
      metrics.boundaryCount===1 &&
      metrics.requiredText.every(x=>x.passed) &&
      metrics.overflow<=2 &&
      !metrics.rawLiquid &&
      consoleErrors.length===0 &&
      pageErrors.length===0 &&
      localHttpErrors.length===0 &&
      (options.javaScriptEnabled===false || (ctaKeyboardFocus && ctaFocusVisible && axeBad.length===0));

    checks.push({route:target.route,viewport:view.name,options,status,metrics,ctaKeyboardFocus,ctaFocusVisible,axeBad,consoleErrors,pageErrors,localHttpErrors,pass});
  }catch(error){
    checks.push({route:target.route,viewport:view.name,options,status,error:String(error),pass:false});
  }
  await context.close();
}

for(const target of routes){
  for(const view of viewports) await run(target,view);
  for(const view of viewports.filter(v=>["mobile-320","desktop-1280"].includes(v.name))){
    await run(target,view,{textSpacing:true});
    await run(target,view,{javaScriptEnabled:false});
    await run(target,view,{reducedMotion:true});
  }
}

await browser.close();
const failed=checks.filter(c=>!c.pass);
await fs.writeFile(path.join(out,"results.json"),JSON.stringify({checks,failed:failed.length,result:failed.length?"FAIL":"PASS"},null,2)+"\n");
await fs.writeFile(path.join(out,"summary.md"),
  "# CONV-04E-01 Botany Browser Certification\n\n"+
  `- Checks: ${checks.length}\n- Failed: ${failed.length}\n- Result: ${failed.length?"FAIL":"PASS"}\n`
);
if(failed.length){console.error(JSON.stringify(failed,null,2));process.exit(1)}
console.log("CONV-04E-01 Botany browser certification: PASS");
