#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i>=0&&process.argv[i+1]?process.argv[i+1]:fallback};
const base=arg("--base-url","http://127.0.0.1:4173").replace(/\/$/,"");
const out=path.resolve(arg("--output-dir","assessment-gateway-browser-report"));
const route="/mcq-arena/academic/";
const expected=[
  "/mcq-arena/academic/botany-cell-biology-mcq-1/",
  "/mcq-arena/academic/botany-cell-division-mcq-2/",
  "/mcq-arena/academic/digestive-system-mcq-set-01/",
  "/mcq-arena/academic/zoology-animal-diversity-mcq-1/",
  "/mcq-arena/academic/zoology-chordata-arthropoda-mcq-pro/",
  "/mcq-arena/academic/zoology-respiratory-system-mcq-5/"
];
const forbidden=["diagnostic node","diagnostic modules","neural retention","cognitive models","cognitive gaps"];
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
  const context=await browserInstance.newContext({viewport:{width:view.width,height:view.height},javaScriptEnabled:jsEnabled});
  await context.route("**/*",async rr=>{
    const u=new URL(rr.request().url());
    if(["127.0.0.1","localhost"].includes(u.hostname)) await rr.continue();
    else await rr.fulfill({status:204,body:""});
  });
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(String(e)));
  let status=0,metrics={},violations=[],keyboardFocus=false,focusVisible=false;

  try{
    const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:20000});
    status=response?.status()??0;
    if(options.textSpacing){
      await page.addStyleTag({content:"*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}"});
    }
    for(let i=0;i<100;i+=1){
      await page.keyboard.press("Tab");
      const focused=await page.evaluate(()=>{
        const el=document.activeElement;
        return {
          assessmentStart:!!el?.hasAttribute?.("data-assessment-start"),
          focusVisible:!!el?.matches?.(":focus-visible")
        };
      });
      if(focused.assessmentStart){
        keyboardFocus=true;
        focusVisible=focused.focusVisible;
        break;
      }
    }

    metrics=await page.evaluate(({expected,forbidden})=>{
      const body=(document.body.innerText||"").toLowerCase();
      const assessmentLinks=[...document.querySelectorAll("[data-assessment-start]")].map(a=>new URL(a.href,location.href).pathname);
      const sourceLinks=[...document.querySelectorAll("[data-assessment-source]")].map(a=>new URL(a.href,location.href).pathname);
      const firstStart=document.querySelector("[data-assessment-start]");
      const rect=firstStart?.getBoundingClientRect();
      return {
        h1:document.querySelectorAll("h1").length,
        lang:document.documentElement.lang,
        htmlAcademic:document.documentElement.classList.contains("lbfl-academic-v1"),
        bodyAcademic:document.body.classList.contains("lbfl-academic-v1-active"),
        articleAcademic:document.querySelector("[data-lbfl-academic-surface='v1']")!==null,
        role:document.querySelector("[data-lbfl-academic-role]")?.getAttribute("data-lbfl-academic-role")||"",
        moduleCount:document.querySelectorAll("[data-assessment-module]").length,
        startCount:assessmentLinks.length,
        sourceCount:sourceLinks.length,
        assessmentLinks,
        uniqueExpected:expected.every(p=>assessmentLinks.includes(p)),
        sourceLinksValid:sourceLinks.length===6 && sourceLinks.every(p=>["/biology/hsc-corner/botany/","/biology/hsc-corner/zoology/"].includes(p)),
        canonicalLoop:(document.body.innerText||"").includes("Attempt → Feedback → Repair → Reattempt"),
        forbiddenPresent:forbidden.filter(term=>body.includes(term)),
        falseEmpty:body.includes("no diagnostic modules found"),
        learnLink:[...document.querySelectorAll("a[href]")].some(a=>new URL(a.href,location.href).pathname==="/learn/"),
        overflow:Math.max(0,document.documentElement.scrollWidth-window.innerWidth),
        controlHeight:rect?rect.height:0,
        rawTemplate:/\{[{%]|[%}]\}/.test(document.body.innerText||"")
      };
    },{expected,forbidden});

    if(jsEnabled && !options.textSpacing){
      await page.addScriptTag({content:axe.source});
      violations=await page.evaluate(async()=>{
        const result=await window.axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa"]}});
        return result.violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>({
          id:v.id,impact:v.impact,nodes:v.nodes.length,targets:v.nodes.map(n=>n.target)
        }));
      });
    }
  }catch(error){errors.push(String(error));}

  const passed=status===200 &&
    metrics.h1===1 &&
    metrics.lang==="en" &&
    metrics.htmlAcademic===true &&
    metrics.bodyAcademic===true &&
    metrics.articleAcademic===true &&
    metrics.role==="assessment_gateway" &&
    metrics.moduleCount===6 &&
    metrics.startCount===6 &&
    metrics.sourceCount===6 &&
    metrics.uniqueExpected===true &&
    metrics.sourceLinksValid===true &&
    metrics.canonicalLoop===true &&
    Array.isArray(metrics.forbiddenPresent) && metrics.forbiddenPresent.length===0 &&
    metrics.falseEmpty===false &&
    metrics.learnLink===true &&
    metrics.overflow<=2 &&
    keyboardFocus===true &&
    focusVisible===true &&
    metrics.controlHeight>=40 &&
    metrics.rawTemplate===false &&
    violations.length===0 &&
    errors.length===0;

  checks.push({viewport:view.name,width:view.width,javaScriptEnabled:jsEnabled,textSpacing:!!options.textSpacing,status,keyboardFocus,focusVisible,metrics,violations,errors,passed});
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
  token:failures.length?"ASSESSMENT_GATEWAY_BROWSER_FAIL":"ASSESSMENT_GATEWAY_BROWSER_PASS",
  route,
  expected_modules:expected.length,
  checks:checks.length,
  serious_critical_axe:checks.reduce((sum,c)=>sum+c.violations.length,0),
  failures
};
await fs.writeFile(path.join(out,"report.json"),JSON.stringify(report,null,2)+"\n");
await fs.writeFile(path.join(out,"summary.md"),
  "# CONV-04D-02 Academic MCQ Gateway Browser Certification\n\n"+
  "- Route: "+route+"\n"+
  "- Expected assessment modules: "+expected.length+"\n"+
  "- Browser checks: "+checks.length+"\n"+
  "- Serious/critical Axe violations: "+report.serious_critical_axe+"\n"+
  "- Result: "+(failures.length?"FAIL":"PASS")+"\n"
);
console.log(report.token);
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exit(1);}
