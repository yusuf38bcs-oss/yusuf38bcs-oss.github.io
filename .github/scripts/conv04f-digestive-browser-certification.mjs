#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i>=0&&process.argv[i+1]?process.argv[i+1]:fallback};
const base=arg("--base-url","http://127.0.0.1:4173").replace(/\/$/,"");
const out=path.resolve(arg("--output-dir","conv04f-digestive-browser-report"));
const route="/biology/hsc-corner/zoology/digestive-system/";
const expectedRoutes=[
  "/biology/hsc-corner/zoology/digestive-system/human-digestive-system-overview/",
  "/biology/hsc-corner/zoology/digestive-system/oral-cavity-saliva-teeth/",
  "/biology/hsc-corner/zoology/digestive-system/stomach/",
  "/biology/hsc-corner/zoology/digestive-system/liver-bile/",
  "/biology/hsc-corner/zoology/digestive-system/pancreas/",
  "/biology/hsc-corner/zoology/digestive-system/intestine/",
  "/biology/hsc-corner/zoology/digestive-system/carbohydrate-digestion/",
  "/biology/hsc-corner/zoology/digestive-system/amino-acid-pathway/",
  "/biology/hsc-corner/zoology/digestive-system/lipid-digestion/",
  "/biology/hsc-corner/zoology/digestive-system/absorption/",
  "/biology/hsc-corner/zoology/digestive-system/lecture-11/",
  "/biology/hsc-corner/zoology/digestive-system/large-intestine/",
  "/biology/hsc-corner/zoology/digestive-system/health-issues/",
  "/biology/hsc-corner/zoology/digestive-system/revision/"
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

async function run(view,opts={}){
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
    const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:20000});
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
        if(f.target){keyboardTarget=true;focusVisible=f.visible;break}
      }
    }

    metrics=await page.evaluate(({expectedRoutes})=>{
      const article=document.querySelector("[data-lbfl-academic-surface='v1']");
      const body=document.body.innerText||"";
      const cards=[...document.querySelectorAll(".lbfl-academic-grid > a.lbfl-academic-card[href]")];
      const cardRoutes=cards.map(a=>new URL(a.href,location.href).pathname);
      const hrefs=[...document.querySelectorAll("a[href]")].map(a=>new URL(a.href,location.href).pathname);
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
        cardCount:cards.length,
        cardRoutes,
        routesPresent:expectedRoutes.every(r=>hrefs.includes(r)),
        exactOrder:JSON.stringify(cardRoutes)===JSON.stringify(expectedRoutes),
        editorial:body.includes("Editorial and Exam Alignment"),
        learningGoal:body.includes("Learning goal:"),
        legacyHero:document.querySelectorAll(".digestive-course-hero").length,
        legacyGrid:document.querySelectorAll(".digestive-lecture-grid").length,
        legacyCards:document.querySelectorAll(".digestive-lecture-card").length,
        overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
        rawTemplate:/\{\{|\{%/.test(body)
      };
    },{expectedRoutes});

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

    const pass=status===200 &&
      metrics.htmlLang==="bn" &&
      metrics.h1Count===1 &&
      metrics.htmlAcademic &&
      metrics.bodyAcademic &&
      metrics.articleAcademic &&
      metrics.role==="course_index" &&
      metrics.guide==="canonical" &&
      metrics.ctaCount===1 &&
      metrics.guideLink &&
      metrics.boundaryCount===1 &&
      metrics.cardCount===14 &&
      metrics.routesPresent &&
      metrics.exactOrder &&
      metrics.editorial &&
      metrics.learningGoal &&
      metrics.legacyHero===0 &&
      metrics.legacyGrid===0 &&
      metrics.legacyCards===0 &&
      metrics.overflow<=2 &&
      !metrics.rawTemplate &&
      consoleErrors.length===0 &&
      pageErrors.length===0 &&
      localHttpErrors.length===0 &&
      (opts.javaScriptEnabled===false || (axeBad.length===0 && keyboardTarget && focusVisible)) &&
      (!opts.textSpacing || metrics.textClip===0) &&
      (!opts.reducedMotion || (metrics.reduceMatches===true && metrics.motionViolations===0));

    checks.push({route,viewport:view.name,opts,status,metrics,keyboardTarget,focusVisible,axeBad,consoleErrors,pageErrors,localHttpErrors,pass});
  }catch(error){
    checks.push({route,viewport:view.name,opts,status,error:String(error),pass:false});
  }
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
await fs.writeFile(path.join(out,"results.json"),JSON.stringify({route,checks,failed:failed.length,result:failed.length?"FAIL":"PASS"},null,2)+"\n");
await fs.writeFile(path.join(out,"summary.md"),"# CONV-04F-06 Digestive System Browser Certification\n\n- Checks: "+checks.length+"\n- Failed: "+failed.length+"\n- Result: "+(failed.length?"FAIL":"PASS")+"\n");
if(failed.length){console.error(JSON.stringify(failed,null,2));process.exit(1)}
console.log("CONV-04F-06 Digestive System browser certification: PASS");
