#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i>=0&&process.argv[i+1]?process.argv[i+1]:fallback};
const base=arg("--base-url","http://127.0.0.1:4173").replace(/\/$/,"");
const out=path.resolve(arg("--output-dir","conv04f-zoology-practical-gateway-browser-report"));
const route="/biology/higher-zoology-tree/practical/";
const expected=[
  "/biology/higher-zoology-tree/practical/museum-specimens/",
  "/biology/higher-zoology-tree/practical/permanent-slides/",
  "/biology/higher-zoology-tree/practical/whole-mounts/",
  "/biology/higher-zoology-tree/practical/dissection/",
  "/biology/higher-zoology-tree/practical/temporary-mounts/",
  "/biology/higher-zoology-tree/practical/appendages/",
  "/biology/higher-zoology-tree/practical/zooplankton/",
  "/biology/higher-zoology-tree/practical/field-report/"
];
const views=[
  ["mobile-320",320,900],
  ["mobile-390",390,900],
  ["tablet-768",768,1024],
  ["desktop-1280",1280,900],
  ["wide-1440",1440,960]
];

await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const checks=[];

async function run(name,width,height,opts={}){
  const context=await browser.newContext({
    viewport:{width,height},
    javaScriptEnabled:opts.javaScriptEnabled!==false,
    reducedMotion:opts.reducedMotion?"reduce":"no-preference"
  });
  await context.route("**/*",async r=>{
    const u=new URL(r.request().url());
    if(["127.0.0.1","localhost"].includes(u.hostname)) await r.continue();
    else await r.fulfill({status:204,body:""});
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
    const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:20000});
    status=response?.status()||0;

    if(opts.textSpacing){
      await page.addStyleTag({content:"*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}"});
    }

    if(opts.javaScriptEnabled!==false && !opts.textSpacing && !opts.reducedMotion){
      for(let i=0;i<260;i++){
        await page.keyboard.press("Tab");
        const f=await page.evaluate(()=>({
          target:!!document.activeElement?.closest?.(".lbfl-learning-guide-cta"),
          visible:!!document.activeElement?.matches?.(":focus-visible")
        }));
        if(f.target){keyboardTarget=true;focusVisible=f.visible;break}
      }
    }

    metrics=await page.evaluate(({expected})=>{
      const article=document.querySelector("[data-lbfl-academic-surface='v1']");
      const body=document.body.innerText||"";
      const hrefs=[...document.querySelectorAll("a[href]")].map(a=>new URL(a.href,location.href).pathname);
      const positions=expected.map(r=>hrefs.indexOf(r));
      const tables=[...document.querySelectorAll("[data-lbfl-academic-surface='v1'] table")];
      return {
        htmlLang:document.documentElement.lang,
        articleLang:document.querySelector("article")?.getAttribute("lang")||"",
        htmlAcademic:document.documentElement.classList.contains("lbfl-academic-v1"),
        bodyAcademic:document.body.classList.contains("lbfl-academic-v1-active"),
        articleAcademic:!!article,
        role:article?.getAttribute("data-lbfl-academic-role")||"",
        guide:article?.getAttribute("data-lbfl-learning-guide")||"",
        ctaCount:document.querySelectorAll(".lbfl-learning-guide-cta").length,
        learnLink:hrefs.includes("/learn/"),
        boundaryCount:document.querySelectorAll(".educational-boundary").length,
        legacyCycleCount:document.querySelectorAll("[data-zoology-learning-cycle]").length,
        h1Count:document.querySelectorAll("h1").length,
        routesPresent:positions.every(i=>i>=0),
        routeOrder:positions.every((v,i,a)=>i===0||v>a[i-1]),
        practicalReasoning:body.includes("Practical Reasoning Rule"),
        academicTableWrapCount:document.querySelectorAll(".lbfl-academic-table-wrap").length,
        practicalTableWrapCount:document.querySelectorAll(".zoology-practical-table-scroll").length,
        dualTableWrapCount:document.querySelectorAll(".lbfl-academic-table-wrap.zoology-practical-table-scroll").length,
        nestedTableWrapCount:document.querySelectorAll(".zoology-practical-table-scroll .zoology-practical-table-scroll").length,
        focusableTableRegionCount:document.querySelectorAll('.zoology-practical-table-scroll[tabindex="0"][role="region"]').length,
        safety:body.includes("Safety and Academic Integrity"),
        courseCode:body.includes("213106"),
        moduleCount:expected.filter(r=>hrefs.includes(r)).length,
        tableCount:tables.length,
        overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
        rawTemplate:/\{\{|\{%/.test(body)
      };
    },{expected});

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

    if(opts.javaScriptEnabled!==false && !opts.textSpacing && !opts.reducedMotion){
      await page.addScriptTag({content:axe.source});
      axeBad=await page.evaluate(async()=>{
        const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]}});
        return r.violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>({
          id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary}))
        }));
      });
    }

    const standard=!opts.textSpacing&&!opts.reducedMotion&&opts.javaScriptEnabled!==false;
    const pass=status===200 &&
      metrics.htmlLang==="bn" &&
      /^bn(?:-|$)/i.test(metrics.articleLang) &&
      metrics.htmlAcademic && metrics.bodyAcademic && metrics.articleAcademic &&
      metrics.role==="practical" && metrics.guide==="canonical" &&
      metrics.ctaCount===1 && metrics.learnLink &&
      metrics.boundaryCount===1 && metrics.legacyCycleCount===0 &&
      metrics.h1Count===1 && metrics.routesPresent && metrics.routeOrder &&
      metrics.moduleCount===8 && metrics.practicalReasoning && metrics.safety && metrics.courseCode &&
      metrics.academicTableWrapCount===2 && metrics.practicalTableWrapCount===2 &&
      metrics.dualTableWrapCount===2 && metrics.nestedTableWrapCount===0 &&
      metrics.focusableTableRegionCount===2 &&
      metrics.overflow<=2 && !metrics.rawTemplate &&
      consoleErrors.length===0 && pageErrors.length===0 && localHttpErrors.length===0 &&
      (!standard||(keyboardTarget&&focusVisible&&axeBad.length===0)) &&
      (!opts.textSpacing||metrics.textClip===0) &&
      (!opts.reducedMotion||(metrics.reduceMatches===true&&metrics.motionViolations===0));

    checks.push({name,width,height,opts,status,metrics,keyboardTarget,focusVisible,axeBad,consoleErrors,pageErrors,localHttpErrors,pass});
  }catch(error){
    checks.push({name,width,height,opts,status,error:String(error),pass:false});
  }
  await context.close();
}

for(const [n,w,h] of views) await run(n,w,h);
for(const [n,w,h] of views.filter(v=>["mobile-320","desktop-1280"].includes(v[0]))){
  await run(n,w,h,{textSpacing:true});
  await run(n,w,h,{reducedMotion:true});
  await run(n,w,h,{javaScriptEnabled:false});
}

await browser.close();
const failed=checks.filter(c=>!c.pass);
await fs.writeFile(path.join(out,"results.json"),JSON.stringify({route,checks,failed:failed.length,result:failed.length?"FAIL":"PASS"},null,2)+"\n");
await fs.writeFile(path.join(out,"summary.md"),`# CONV-04F-08 Zoology Practical-I Gateway Browser Certification\n\n- Checks: ${checks.length}\n- Failed: ${failed.length}\n- Result: ${failed.length?"FAIL":"PASS"}\n`);
if(failed.length){console.error(JSON.stringify(failed,null,2));process.exit(1)}
console.log("CONV-04F-08 Zoology Practical-I gateway browser certification: PASS");
