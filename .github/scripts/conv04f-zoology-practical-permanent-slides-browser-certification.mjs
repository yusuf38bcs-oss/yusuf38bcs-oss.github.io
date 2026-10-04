#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i>=0&&process.argv[i+1]?process.argv[i+1]:fallback};
const base=arg("--base-url","http://127.0.0.1:4173").replace(/\/$/,"");
const allowedHosts=new Set(["127.0.0.1","localhost",new URL(base).hostname]);
const out=path.resolve(arg("--output-dir","conv04f-zoology-practical-permanent-slides-browser-report"));
const route="/biology/higher-zoology-tree/practical/permanent-slides/";
const views=[
  ["mobile-320",320,900],["mobile-390",390,900],["tablet-768",768,1024],
  ["desktop-1280",1280,900],["wide-1440",1440,960]
];

await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const checks=[];
const isExpectedCloudflareInsightsSriError=message=>
  message.includes("Failed to find a valid digest in the 'integrity' attribute") &&
  message.includes("https://static.cloudflareinsights.com/beacon.min.js/");

async function listCountAfterHeading(page,label){
  return page.evaluate(label=>{
    const cleanHeading=x=>{
      const clone=x.cloneNode(true);
      clone.querySelectorAll("a").forEach(a=>a.remove());
      return clone.textContent.trim();
    };
    const h=[...document.querySelectorAll(".page__content h2")].find(x=>cleanHeading(x)===label);
    if(!h) return -1;
    let n=h.nextElementSibling;
    while(n && n.tagName!=="H2"){
      if(n.tagName==="OL") return n.querySelectorAll(":scope > li").length;
      n=n.nextElementSibling;
    }
    return -1;
  },label);
}

async function run(name,width,height,opts={}){
  const context=await browser.newContext({
    viewport:{width,height},
    javaScriptEnabled:opts.javaScriptEnabled!==false,
    reducedMotion:opts.reducedMotion?"reduce":"no-preference"
  });
  await context.route("**/*",async r=>{
    const u=new URL(r.request().url());
    if(allowedHosts.has(u.hostname)) await r.continue();
    else await r.fulfill({status:204,body:""});
  });
  const page=await context.newPage();
  const consoleErrors=[],externalConsoleWarnings=[],pageErrors=[],localHttpErrors=[];
  page.on("console",m=>{
    if(m.type()!=="error") return;
    const message=m.text();
    if(isExpectedCloudflareInsightsSriError(message)) externalConsoleWarnings.push(message);
    else consoleErrors.push(message);
  });
  page.on("pageerror",e=>pageErrors.push(String(e)));
  page.on("response",r=>{
    const u=new URL(r.url());
    if(["127.0.0.1","localhost"].includes(u.hostname)&&r.status()>=400){
      localHttpErrors.push({status:r.status(),url:r.url()});
    }
  });

  let status=0,metrics={},axeBad=[],ctaKeyboard=false,tableKeyboard=false;
  try{
    const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:25000});
    status=response?.status()||0;

    if(opts.textSpacing){
      await page.addStyleTag({content:"*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}"});
    }

    if(opts.javaScriptEnabled!==false && !opts.textSpacing && !opts.reducedMotion){
      for(let i=0;i<200;i++){
        await page.keyboard.press("Tab");
        const hit=await page.evaluate(()=>({
          cta:!!document.activeElement?.closest?.(".lbfl-learning-guide-cta"),
          table:!!document.activeElement?.matches?.(".zoology-practical-table-scroll"),
          visible:!!document.activeElement?.matches?.(":focus-visible")
        }));
        if(hit.cta&&hit.visible) ctaKeyboard=true;
        if(hit.table&&hit.visible) tableKeyboard=true;
        if(ctaKeyboard&&tableKeyboard) break;
      }
    }

    metrics=await page.evaluate(()=>{
      const article=document.querySelector("[data-lbfl-academic-surface='v1']");
      const content=document.querySelector(".page__content");
      const text=content?.innerText||"";
      const tables=[...content?.querySelectorAll("table")||[]];
      const rowCounts=tables.map(t=>Math.max(0,t.querySelectorAll("tr").length-1));
      const cleanHeading=h=>{
        const clone=h.cloneNode(true);
        clone.querySelectorAll("a").forEach(a=>a.remove());
        return clone.textContent.trim();
      };
      const h2Texts=[...content?.querySelectorAll("h2")||[]].map(cleanHeading);
      const pre=[...content?.querySelectorAll("pre")||[]].map(x=>x.textContent||"").join("\n");
      return {
        htmlLang:document.documentElement.lang||"",
        articleLang:article?.getAttribute("lang")||"",
        htmlAcademic:document.documentElement.classList.contains("lbfl-academic-v1"),
        articleAcademic:!!article,
        role:article?.getAttribute("data-lbfl-academic-role")||"",
        guide:article?.getAttribute("data-lbfl-learning-guide")||"",
        ctaCount:content?.querySelectorAll(".lbfl-learning-guide-cta").length||0,
        learnLink:[...content?.querySelectorAll("a[href]")||[]].some(a=>new URL(a.href).pathname==="/learn/"),
        boundaryCount:content?.querySelectorAll(".educational-boundary").length||0,
        legacyCycleCount:content?.querySelectorAll("[data-zoology-learning-cycle]").length||0,
        h1Texts:[...content?.querySelectorAll("h1")||[]].map(cleanHeading),
        h2Texts,rowCounts,
        tableCount:tables.length,
        wrapperCount:content?.querySelectorAll(".zoology-practical-table-scroll").length||0,
        focusableWrapperCount:content?.querySelectorAll('.zoology-practical-table-scroll[tabindex="0"][role="region"]').length||0,
        academicWrapperCount:content?.querySelectorAll(".lbfl-academic-table-wrap.zoology-practical-table-scroll").length||0,
        syllabusRule:text.includes("at least 20 slides")&&text.includes("43-preparation reference bank")&&text.includes("≥20"),
        terminology:text.includes("Modern terminology note:")&&text.includes("traditional teaching term"),
        mouthpartRule:text.includes("Slide-answer rule")&&text.includes("which parts are modified and what function they perform"),
        spotting:pre.includes("Slide:")&&pre.includes("Preparation:")&&pre.includes("Observed characters:")&&pre.includes("Identification:")&&pre.includes("Reason:"),
        rawTemplate:/\{\{|\{%/.test(text),
        overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth)
      };
    });
    metrics.histologyCount=await listCountAfterHeading(page,"E. Histological Slides of Invertebrates");
    metrics.microscopeCount=await listCountAfterHeading(page,"Microscope Workflow");

    if(opts.textSpacing){
      metrics.textClip=await page.evaluate(()=>[...document.querySelectorAll(".page__content p,.page__content li,.page__content h1,.page__content h2,.page__content h3,.page__content a,.page__content td,.page__content th")].filter(el=>{
        const cs=getComputedStyle(el);
        return (["hidden","clip"].includes(cs.overflowY)&&el.scrollHeight>el.clientHeight+2)||
               (["hidden","clip"].includes(cs.overflowX)&&el.scrollWidth>el.clientWidth+2);
      }).length);
    }

    if(opts.reducedMotion){
      metrics.reduceMatches=await page.evaluate(()=>matchMedia("(prefers-reduced-motion: reduce)").matches);
      metrics.motionViolations=await page.evaluate(()=>[...document.querySelectorAll("[data-lbfl-academic-surface='v1'] *")].filter(el=>{
        const cs=getComputedStyle(el);
        const anim=cs.animationDuration.split(",").some(v=>parseFloat(v)*1000>20);
        const trans=cs.transitionDuration.split(",").some(v=>parseFloat(v)*1000>20);
        return anim||trans;
      }).length);
    }

    const standard=!opts.textSpacing&&!opts.reducedMotion&&opts.javaScriptEnabled!==false;
    if(standard){
      await page.addScriptTag({content:axe.source});
      axeBad=await page.evaluate(async()=>{
        const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]}});
        return r.violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>({
          id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary}))
        }));
      });
    }

    const expectedH2=[
      "A. Whole Animals — Protozoans, Rotifers & Arthropods",
      "B. Mouth Parts of Arthropods",
      "C. Parasites — Nematodes & Platyhelminths",
      "D. Larval Forms of Invertebrates",
      "E. Histological Slides of Invertebrates",
      "Permanent-slide Spotting Template",
      "Microscope Workflow"
    ];
    const jsOn=opts.javaScriptEnabled!==false;
    const pass=status===200 &&
      metrics.htmlLang==="bn" && /^bn(?:-|$)/i.test(metrics.articleLang) &&
      metrics.htmlAcademic && metrics.articleAcademic &&
      metrics.role==="practical" && metrics.guide==="canonical" &&
      metrics.ctaCount===1 && metrics.learnLink &&
      metrics.boundaryCount===1 && metrics.legacyCycleCount===0 &&
      metrics.h1Texts.length===1 && metrics.h1Texts[0]==="Study of Permanent Slides" &&
      expectedH2.every(h=>metrics.h2Texts.includes(h)) &&
      metrics.tableCount===4 && metrics.rowCounts.join("|")==="8|6|11|10" &&
      metrics.histologyCount===8 && metrics.microscopeCount===6 &&
      metrics.syllabusRule && metrics.terminology && metrics.mouthpartRule && metrics.spotting &&
      metrics.overflow<=2 && !metrics.rawTemplate &&
      consoleErrors.length===0 && pageErrors.length===0 && localHttpErrors.length===0 &&
      (!jsOn || metrics.wrapperCount===4) &&
      (!jsOn || metrics.focusableWrapperCount===4) &&
      metrics.academicWrapperCount===4 &&
      (!standard || (ctaKeyboard&&tableKeyboard&&axeBad.length===0)) &&
      (!opts.textSpacing || metrics.textClip===0) &&
      (!opts.reducedMotion || (metrics.reduceMatches===true&&metrics.motionViolations===0));

    checks.push({name,width,height,opts,status,metrics,ctaKeyboard,tableKeyboard,axeBad,consoleErrors,externalConsoleWarnings,pageErrors,localHttpErrors,pass});
  }catch(error){
    checks.push({name,width,height,opts,status,error:String(error),pass:false});
  }finally{
    await context.close();
  }
}

for(const [n,w,h] of views) await run(n,w,h);
for(const [n,w,h] of views.filter(v=>["mobile-320","desktop-1280"].includes(v[0]))){
  await run(n+"-spacing",w,h,{textSpacing:true});
  await run(n+"-reduced",w,h,{reducedMotion:true});
  await run(n+"-nojs",w,h,{javaScriptEnabled:false});
}

await browser.close();
const report={route,base,checks,pass:checks.every(x=>x.pass)};
await fs.writeFile(path.join(out,"report.json"),JSON.stringify(report,null,2)+"\n");
const md=["# CONV-04F-09-R40 Permanent Slides Browser Certification","",`- Route: ${route}`,`- Base: ${base}`,`- Result: ${report.pass?"PASS":"FAIL"}`,"",...checks.map(c=>`- ${c.name}: ${c.pass?"PASS":"FAIL"}`)].join("\n")+"\n";
await fs.writeFile(path.join(out,"summary.md"),md);
if(!report.pass){
  console.error(JSON.stringify(report,null,2));
  process.exit(1);
}
console.log(`CONV-04F-09-R40 Permanent Slides browser certification: PASS checks=${checks.length}`);
