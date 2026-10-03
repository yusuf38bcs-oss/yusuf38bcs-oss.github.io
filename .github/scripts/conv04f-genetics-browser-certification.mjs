#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i>=0&&process.argv[i+1]?process.argv[i+1]:fallback};
const base=arg("--base-url","http://127.0.0.1:4173").replace(/\/$/,"");
const out=path.resolve(arg("--output-dir","conv04f-genetics-browser-report"));
const targets=[
  {id:"gateway",route:"/biology/higher-zoology-tree/genetics/",lang:"en",required:["Genetics Matrix","Responsible Genetics Boundary","Completed Course Gateway"]},
  {id:"course",route:"/biology/higher-zoology-tree/genetics/course-index/",lang:"en",required:["Genetics Course Index","Complete Lecture Route Map","Recommended Learning Path"]}
];
const expectedRoutes=[
  "/biology/higher-zoology-tree/genetics/foundations-of-genetics/",
  "/biology/higher-zoology-tree/genetics/genetic-terminology/",
  "/biology/higher-zoology-tree/genetics/mendel-and-pea-plant/",
  "/biology/higher-zoology-tree/genetics/monohybrid-cross/",
  "/biology/higher-zoology-tree/genetics/dihybrid-cross/",
  "/biology/higher-zoology-tree/genetics/gene-interaction/",
  "/biology/higher-zoology-tree/genetics/epistasis-gene-ratios/",
  "/biology/higher-zoology-tree/genetics/linkage/",
  "/biology/higher-zoology-tree/genetics/gene-mapping/",
  "/biology/higher-zoology-tree/genetics/chromosome-patterns/",
  "/biology/higher-zoology-tree/genetics/lecture-11/",
  "/biology/higher-zoology-tree/genetics/lecture-12/",
  "/biology/higher-zoology-tree/genetics/lecture-13/",
  "/biology/higher-zoology-tree/genetics/lecture-14/",
  "/biology/higher-zoology-tree/genetics/lecture-15/",
  "/biology/higher-zoology-tree/genetics/lecture-16/",
  "/biology/higher-zoology-tree/genetics/lecture-17/"
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
    if(["127.0.0.1","localhost"].includes(u.hostname)&&r.status()>=400){
      localHttpErrors.push({status:r.status(),url:r.url()});
    }
  });
  let status=0,metrics={},axeBad=[],keyboardTarget=false,focusVisible=false;
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
          return {target:!!el?.closest?.(".lbfl-learning-guide-cta,.lbfl-language-switcher"),visible:!!el?.matches?.(":focus-visible")};
        });
        if(f.target){keyboardTarget=true;focusVisible=f.visible;break}
      }
    }
    const baseMetrics=await page.evaluate(({id,required,expectedRoutes})=>{
      const article=document.querySelector("[data-lbfl-academic-surface='v1']");
      const hrefs=[...document.querySelectorAll("a[href]")].map(a=>new URL(a.href,location.href).pathname);
      const body=document.body.innerText||"";
      return {
        htmlLang:document.documentElement.lang,
        htmlAcademic:document.documentElement.classList.contains("lbfl-academic-v1"),
        bodyAcademic:document.body.classList.contains("lbfl-academic-v1-active"),
        articleAcademic:!!article,
        role:article?.getAttribute("data-lbfl-academic-role")||"",
        guide:article?.getAttribute("data-lbfl-learning-guide")||"",
        ctaCount:document.querySelectorAll(".lbfl-learning-guide-cta").length,
        guideLink:hrefs.includes("/learn/"),
        boundaryCount:document.querySelectorAll(".educational-boundary").length,
        h1Count:document.querySelectorAll("h1").length,
        required:required.map(t=>({text:t,passed:body.includes(t)})),
        responsible:id==="gateway" ? body.includes("do not provide medical diagnosis, family-risk prediction, genetic counselling, treatment guidance, or institutional certification") : true,
        courseRoutes:id==="course" ? expectedRoutes.map(route=>({route,passed:hrefs.includes(route)})) : [],
        tableWrap:id==="course" ? document.querySelectorAll(".lbfl-academic-table-wrap").length : 0,
        overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
        rawTemplate:/\{\{|\{%/.test(body)
      };
    },{id:target.id,required:target.required,expectedRoutes});
    metrics={...metrics,...baseMetrics};

    if(opts.textSpacing){
      metrics.textClip=await page.evaluate(()=>[...document.querySelectorAll("p,li,h1,h2,h3,a,button,td,th")].filter(el=>{
        const cs=getComputedStyle(el);
        return (["hidden","clip"].includes(cs.overflowY)&&el.scrollHeight>el.clientHeight+2)||
               (["hidden","clip"].includes(cs.overflowX)&&el.scrollWidth>el.clientWidth+2);
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
    const common=status===200 &&
      metrics.htmlLang===target.lang &&
      metrics.h1Count===1 &&
      metrics.htmlAcademic &&
      metrics.bodyAcademic &&
      metrics.articleAcademic &&
      metrics.role==="academic_gateway" &&
      metrics.guide==="canonical" &&
      metrics.ctaCount===1 &&
      metrics.guideLink &&
      metrics.boundaryCount===1 &&
      metrics.required.every(x=>x.passed) &&
      metrics.responsible &&
      (target.id!=="course" || (metrics.courseRoutes.length===17 && metrics.courseRoutes.every(x=>x.passed) && metrics.tableWrap===1)) &&
      metrics.overflow<=2 &&
      !metrics.rawTemplate &&
      consoleErrors.length===0 &&
      pageErrors.length===0 &&
      localHttpErrors.length===0 &&
      (opts.javaScriptEnabled===false || (axeBad.length===0 && keyboardTarget && focusVisible)) &&
      (!opts.textSpacing || metrics.textClip===0) &&
      (!opts.reducedMotion || (metrics.reduceMatches===true && metrics.motionViolations===0));
    checks.push({id:target.id,route:target.route,viewport:view.name,opts,status,metrics,keyboardTarget,focusVisible,axeBad,consoleErrors,pageErrors,localHttpErrors,pass:common});
  }catch(error){
    checks.push({id:target.id,route:target.route,viewport:view.name,opts,status,error:String(error),pass:false});
  }
  await context.close();
}

for(const target of targets){
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
await fs.writeFile(path.join(out,"summary.md"),"# CONV-04F-05 Genetics Browser Certification\n\n- Checks: "+checks.length+"\n- Failed: "+failed.length+"\n- Result: "+(failed.length?"FAIL":"PASS")+"\n");
if(failed.length){console.error(JSON.stringify(failed,null,2));process.exit(1)}
console.log("CONV-04F-05 Genetics browser certification: PASS");
