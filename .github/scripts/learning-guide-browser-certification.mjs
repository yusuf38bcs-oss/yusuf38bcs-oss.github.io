#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i>=0&&process.argv[i+1]?process.argv[i+1]:fallback};
const base=arg("--base-url","http://127.0.0.1:4173").replace(/\/$/,"");
const out=path.resolve(arg("--output-dir","learning-guide-browser-report"));
const route="/learn/";
const cycle=["Understand","Retrieve","Explain","Apply","Reflect","Repair"];
const frameworkPaths=[
  "/frameworks/lolo-lala/",
  "/frameworks/bloom-taxonomy/",
  "/frameworks/cq-studio/",
  "/frameworks/assessment-rubric/",
  "/frameworks/practical-framework/"
];
const viewports=[
  {name:"mobile-320",width:320,height:820},
  {name:"mobile-390",width:390,height:844},
  {name:"tablet-768",width:768,height:1024},
  {name:"desktop-1280",width:1280,height:900},
  {name:"wide-1440",width:1440,height:960}
];

await fs.mkdir(out,{recursive:true});
const browserInstance=await chromium.launch({headless:true});
const checks=[];

async function runCheck(view,options={}){
  const jsEnabled=options.javaScriptEnabled!==false;
  const context=await browserInstance.newContext({
    viewport:{width:view.width,height:view.height},
    javaScriptEnabled:jsEnabled
  });

  await context.route("**/*",async rr=>{
    const u=new URL(rr.request().url());
    if(["127.0.0.1","localhost"].includes(u.hostname)) await rr.continue();
    else await rr.fulfill({status:204,body:""});
  });

  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",error=>errors.push(String(error)));

  let status=0;
  let metrics={};
  let violations=[];
  let keyboardFocus=false;
  let focusVisible=false;

  try{
    const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:20000});
    status=response?.status()??0;

    if(options.textSpacing){
      await page.addStyleTag({content:"*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}"});
    }

    for(let i=0;i<80;i+=1){
      await page.keyboard.press("Tab");
      const focused=await page.evaluate(()=>{
        const el=document.activeElement;
        return {
          academicButton:!!el?.classList?.contains("lbfl-academic-button"),
          focusVisible:!!el?.matches?.(":focus-visible")
        };
      });
      if(focused.academicButton){
        keyboardFocus=true;
        focusVisible=focused.focusVisible;
        break;
      }
    }

    metrics=await page.evaluate(({cycle,frameworkPaths})=>{
      const stages=[...document.querySelectorAll("[data-learning-stage]")].map(el=>el.getAttribute("data-learning-stage"));
      const hrefs=[...document.querySelectorAll("a[href]")].map(a=>new URL(a.href,location.href).pathname);
      const firstButton=document.querySelector("a.lbfl-academic-button");
      const lead=document.querySelector(".lbfl-academic-lead");
      const rect=firstButton?.getBoundingClientRect();
      const styleSnapshot=(el)=>{
        if(!el) return null;
        const cs=getComputedStyle(el);
        let ancestor=el;
        let resolvedBackground=cs.backgroundColor;
        while(
          ancestor &&
          (resolvedBackground==="rgba(0, 0, 0, 0)" || resolvedBackground==="transparent")
        ){
          ancestor=ancestor.parentElement;
          if(ancestor) resolvedBackground=getComputedStyle(ancestor).backgroundColor;
        }
        return {
          color:cs.color,
          backgroundColor:cs.backgroundColor,
          resolvedBackground,
          opacity:cs.opacity,
          fontSize:cs.fontSize,
          fontWeight:cs.fontWeight
        };
      };
      return {
        h1:document.querySelectorAll("h1").length,
        lang:document.documentElement.lang,
        htmlAcademic:document.documentElement.classList.contains("lbfl-academic-v1"),
        bodyAcademic:document.body.classList.contains("lbfl-academic-v1-active"),
        articleAcademic:document.querySelector("[data-lbfl-academic-surface='v1']")!==null,
        role:document.querySelector("[data-lbfl-academic-role]")?.getAttribute("data-lbfl-academic-role")||"",
        stages,
        cyclePass:JSON.stringify(stages)===JSON.stringify(cycle),
        frameworkLinks:frameworkPaths.map(p=>({path:p,present:hrefs.includes(p)})),
        overflow:Math.max(0,document.documentElement.scrollWidth-window.innerWidth),
        controlHeight:rect?rect.height:0,
        leadStyle:styleSnapshot(lead),
        buttonStyle:styleSnapshot(firstButton),
        bodyStyle:styleSnapshot(document.body),
        contentStyle:styleSnapshot(document.querySelector(".page__content")),
        rawTemplate:/\{[{%]|[%}]\}/.test(document.body.innerText||"")
      };
    },{cycle,frameworkPaths});

    if(jsEnabled && !options.textSpacing){
      await page.addScriptTag({content:axe.source});
      violations=await page.evaluate(async()=>{
        const result=await window.axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa"]}});
        return result.violations
          .filter(v=>["serious","critical"].includes(v.impact))
          .map(v=>({
            id:v.id,
            impact:v.impact,
            nodes:v.nodes.length,
            targets:v.nodes.map(n=>n.target),
            failures:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))
          }));
      });
    }
  }catch(error){
    errors.push(String(error));
  }

  const frameworkPass=Array.isArray(metrics.frameworkLinks)&&metrics.frameworkLinks.every(x=>x.present);
  const passed=status===200 &&
    metrics.h1===1 &&
    metrics.lang==="en" &&
    metrics.htmlAcademic===true &&
    metrics.bodyAcademic===true &&
    metrics.articleAcademic===true &&
    metrics.role==="academic_gateway" &&
    metrics.cyclePass===true &&
    frameworkPass &&
    metrics.overflow<=2 &&
    keyboardFocus===true &&
    focusVisible===true &&
    metrics.controlHeight>=40 &&
    metrics.rawTemplate===false &&
    violations.length===0 &&
    errors.length===0;

  checks.push({
    viewport:view.name,
    width:view.width,
    javaScriptEnabled:jsEnabled,
    textSpacing:!!options.textSpacing,
    status,
    keyboardFocus,
    focusVisible,
    metrics,
    violations,
    errors,
    passed
  });

  await context.close();
}

for(const view of viewports) await runCheck(view);
await runCheck({name:"no-js-320",width:320,height:820},{javaScriptEnabled:false});
await runCheck({name:"no-js-1280",width:1280,height:900},{javaScriptEnabled:false});
await runCheck({name:"text-spacing-320",width:320,height:820},{textSpacing:true});
await runCheck({name:"text-spacing-1280",width:1280,height:900},{textSpacing:true});

await browserInstance.close();

const failures=checks.filter(c=>!c.passed);
const report={
  token:failures.length?"LEARNING_GUIDE_BROWSER_FAIL":"LEARNING_GUIDE_BROWSER_PASS",
  route,
  canonical_cycle:cycle,
  checks:checks.length,
  serious_critical_axe:checks.reduce((sum,c)=>sum+c.violations.length,0),
  failures
};

await fs.writeFile(path.join(out,"report.json"),JSON.stringify(report,null,2)+"\n");
await fs.writeFile(
  path.join(out,"summary.md"),
  "# CONV-04C-02 Learning Guide Browser Certification\n\n"+
  "- Route: "+route+"\n"+
  "- Browser checks: "+checks.length+"\n"+
  "- Canonical stages: "+cycle.join(" → ")+"\n"+
  "- Serious/critical Axe violations: "+report.serious_critical_axe+"\n"+
  "- Result: "+(failures.length?"FAIL":"PASS")+"\n"
);

console.log(report.token);
if(failures.length){
  console.error(JSON.stringify(failures,null,2));
  process.exit(1);
}