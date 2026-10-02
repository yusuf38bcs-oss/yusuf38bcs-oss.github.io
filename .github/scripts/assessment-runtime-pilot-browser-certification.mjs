#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i>=0&&process.argv[i+1]?process.argv[i+1]:fallback};
const base=arg("--base-url","http://127.0.0.1:4173").replace(/\/$/,"");
const out=path.resolve(arg("--output-dir","assessment-runtime-pilot-browser-report"));
const route="/mcq-arena/academic/botany-cell-biology-mcq-1/";
const sourceReturn="/biology/hsc-corner/botany/";
const viewports=[
  {name:"mobile-320",width:320,height:820},
  {name:"mobile-390",width:390,height:844},
  {name:"tablet-768",width:768,height:1024},
  {name:"desktop-1280",width:1280,height:900},
  {name:"wide-1440",width:1440,height:960}
];
const forbidden=["diagnostic complete","diagnostic node","neural retention","cognitive ability","cognitive gaps","cognitive models"];

await fs.mkdir(out,{recursive:true});
const browserInstance=await chromium.launch({headless:true});
const checks=[];

async function standardCheck(view){
  const context=await browserInstance.newContext({viewport:{width:view.width,height:view.height}});
  await context.route("**/*",async rr=>{
    const u=new URL(rr.request().url());
    if(["127.0.0.1","localhost"].includes(u.hostname)) await rr.continue();
    else await rr.fulfill({status:204,body:""});
  });
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(String(e)));
  let status=0,metrics={},violations=[],keyboardFocus=false,focusVisible=false,initialRetryHidden=false,radioKeyboardNavigation=false;

  try{
    const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:20000});
    status=response?.status()??0;
    initialRetryHidden=await page.evaluate(()=>{
      const retry=document.querySelector("[data-assessment-retry]");
      return !!retry?.hidden && getComputedStyle(retry).display==="none";
    });

    for(let i=0;i<220;i+=1){
      await page.keyboard.press("Tab");
      const focus=await page.evaluate(()=>{
        const el=document.activeElement;
        return {
          option:!!el?.hasAttribute?.("data-assessment-option"),
          visible:!!el?.matches?.(":focus-visible")
        };
      });
      if(focus.option){
        keyboardFocus=true;
        focusVisible=focus.visible;
        break;
      }
    }

    if(keyboardFocus){
      await page.keyboard.press("ArrowDown");
      radioKeyboardNavigation=await page.evaluate(()=>{
        const active=document.activeElement;
        const group=active?.closest?.('[role="radiogroup"]');
        if(!active?.matches?.('[data-assessment-option][role="radio"]') || !group) return false;
        const radios=[...group.querySelectorAll('[data-assessment-option][role="radio"]')];
        return active.getAttribute("aria-checked")==="true" &&
          active.tabIndex===0 &&
          radios.filter(radio=>radio.tabIndex===0).length===1;
      });
    }

    const questions=page.locator("[data-assessment-question]");
    const count=await questions.count();
    for(let i=0;i<count;i+=1){
      const options=questions.nth(i).locator("[data-assessment-option]");
      const optionIndex=i===0?2:0;
      await options.nth(optionIndex).click();
    }

    const answeredBeforeSubmit=(await page.locator("[data-assessment-progress-text]").innerText()).trim();
    await page.locator("[data-assessment-submit]").click();

    metrics=await page.evaluate(({forbidden,sourceReturn,answeredBeforeSubmit})=>{
      const bodyText=document.body.innerText||"";
      const bodyLower=bodyText.toLowerCase();
      const repair=document.querySelector("[data-assessment-repair]");
      const firstOption=document.querySelector("[data-assessment-option]");
      const rect=firstOption?.getBoundingClientRect();
      return {
        h1:document.querySelectorAll("h1").length,
        questionCount:document.querySelectorAll("[data-assessment-question]").length,
        optionCount:document.querySelectorAll("[data-assessment-option]").length,
        explanationCount:document.querySelectorAll("[data-assessment-explanation]").length,
        visibleExplanationCount:[...document.querySelectorAll("[data-assessment-explanation]")].filter(el=>getComputedStyle(el).display!=="none").length,
        doneCount:document.querySelectorAll("[data-assessment-question].done").length,
        correctCount:document.querySelectorAll("[data-assessment-question].correct").length,
        wrongCount:document.querySelectorAll("[data-assessment-question].wrong").length,
        answeredBeforeSubmit,
        scoreText:(document.querySelector("[data-assessment-score]")?.textContent||"").trim(),
        repairHref:repair?new URL(repair.href,location.href).pathname:"",
        repairMatches:repair?new URL(repair.href,location.href).pathname===sourceReturn:false,
        retryVisible:!!document.querySelector("[data-assessment-retry]:not([hidden])"),
        submitDisabled:!!document.querySelector("[data-assessment-submit]")?.disabled,
        radiogroupCount:document.querySelectorAll('[role="radiogroup"]').length,
        labelledGroupCount:[...document.querySelectorAll('[role="radiogroup"]')].filter(el=>{
          const id=el.getAttribute("aria-labelledby");
          return !!id && !!document.getElementById(id);
        }).length,
        radioCount:document.querySelectorAll('[data-assessment-option][role="radio"]').length,
        checkedCount:document.querySelectorAll('[data-assessment-option][aria-checked="true"]').length,
        semanticCorrectCount:[...document.querySelectorAll("[data-assessment-option].correct")].filter(el=>(el.getAttribute("aria-label")||"").includes("Correct answer")).length,
        semanticWrongCount:[...document.querySelectorAll("[data-assessment-option].wrong")].filter(el=>(el.getAttribute("aria-label")||"").includes("Incorrect")).length,
        stateStylesDistinct:(()=>{
          const correct=document.querySelector("[data-assessment-option].correct");
          const wrong=document.querySelector("[data-assessment-option].wrong");
          if(!correct||!wrong) return false;
          const c=getComputedStyle(correct),w=getComputedStyle(wrong);
          return [c.backgroundColor,c.color,c.borderColor].join("|")!==[w.backgroundColor,w.color,w.borderColor].join("|");
        })(),
        forbiddenPresent:forbidden.filter(term=>bodyLower.includes(term)),
        overflow:Math.max(0,document.documentElement.scrollWidth-window.innerWidth),
        controlHeight:rect?rect.height:0,
        rawTemplate:/\{[{%]|[%}]\}/.test(bodyText)
      };
    },{forbidden,sourceReturn,answeredBeforeSubmit});

    await page.addScriptTag({content:axe.source});
    violations=await page.evaluate(async()=>{
      const result=await window.axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa"]}});
      return result.violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>({
        id:v.id,impact:v.impact,nodes:v.nodes.length,targets:v.nodes.map(n=>n.target)
      }));
    });

    await page.locator("[data-assessment-retry]").click();
    const reset=await page.evaluate(()=>({
      progress:(document.querySelector("[data-assessment-progress-text]")?.textContent||"").trim(),
      done:document.querySelectorAll("[data-assessment-question].done").length,
      resultsVisible:!!document.querySelector("[data-assessment-results].show"),
      retryHidden:!!document.querySelector("[data-assessment-retry]")?.hidden,
      retryComputedHidden:getComputedStyle(document.querySelector("[data-assessment-retry]")).display==="none",
      enabled:[...document.querySelectorAll("[data-assessment-option]")].every(el=>!el.disabled),
      submitEnabled:!document.querySelector("[data-assessment-submit]")?.disabled,
      rovingGroupCount:[...document.querySelectorAll('[role="radiogroup"]')].filter(group=>
        [...group.querySelectorAll('[data-assessment-option][role="radio"]')].filter(radio=>radio.tabIndex===0).length===1
      ).length
    }));
    metrics.reset=reset;
  }catch(error){errors.push(String(error));}

  const passed=status===200 &&
    initialRetryHidden===true &&
    keyboardFocus===true &&
    focusVisible===true &&
    radioKeyboardNavigation===true &&
    metrics.h1===1 &&
    metrics.questionCount===10 &&
    metrics.optionCount===40 &&
    metrics.explanationCount===10 &&
    metrics.visibleExplanationCount===10 &&
    metrics.doneCount===10 &&
    metrics.correctCount>=1 &&
    metrics.wrongCount>=1 &&
    metrics.answeredBeforeSubmit==="10 / 10 Answered" &&
    /^\d+ \/ 10$/.test(metrics.scoreText||"") &&
    metrics.repairMatches===true &&
    metrics.retryVisible===true &&
    metrics.submitDisabled===true &&
    metrics.radiogroupCount===10 &&
    metrics.labelledGroupCount===10 &&
    metrics.radioCount===40 &&
    metrics.checkedCount===10 &&
    metrics.semanticCorrectCount===10 &&
    metrics.semanticWrongCount>=1 &&
    metrics.stateStylesDistinct===true &&
    Array.isArray(metrics.forbiddenPresent) && metrics.forbiddenPresent.length===0 &&
    metrics.overflow<=2 &&
    metrics.controlHeight>=40 &&
    metrics.rawTemplate===false &&
    metrics.reset?.progress==="0 / 10 Answered" &&
    metrics.reset?.done===0 &&
    metrics.reset?.resultsVisible===false &&
    metrics.reset?.retryHidden===true &&
    metrics.reset?.retryComputedHidden===true &&
    metrics.reset?.enabled===true &&
    metrics.reset?.submitEnabled===true &&
    metrics.reset?.rovingGroupCount===10 &&
    violations.length===0 &&
    errors.length===0;

  checks.push({type:"standard",viewport:view.name,width:view.width,status,keyboardFocus,focusVisible,radioKeyboardNavigation,metrics,violations,errors,passed});
  await context.close();
}

async function wallClockTimerCheck(){
  const context=await browserInstance.newContext({viewport:{width:390,height:844}});
  await context.route("**/*",async rr=>{
    const u=new URL(rr.request().url());
    if(["127.0.0.1","localhost"].includes(u.hostname)) await rr.continue();
    else await rr.fulfill({status:204,body:""});
  });
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(String(e)));
  let status=0,metrics={};
  try{
    const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:20000});
    status=response?.status()??0;
    await page.evaluate(()=>{
      const observedNow=Date.now();
      Date.now=()=>observedNow+601000;
    });
    await page.waitForTimeout(1250);
    metrics=await page.evaluate(()=>({
      timerText:(document.querySelector("[data-assessment-timer]")?.textContent||"").trim(),
      resultsVisible:!!document.querySelector("[data-assessment-results].show"),
      submitDisabled:!!document.querySelector("[data-assessment-submit]")?.disabled
    }));
  }catch(error){errors.push(String(error));}
  const passed=status===200 &&
    metrics.timerText.includes("00:00") &&
    metrics.resultsVisible===true &&
    metrics.submitDisabled===true &&
    errors.length===0;
  checks.push({type:"wall-clock-timer",viewport:"mobile-390",width:390,status,metrics,errors,passed});
  await context.close();
}

async function noJsCheck(view){
  const context=await browserInstance.newContext({viewport:{width:view.width,height:view.height},javaScriptEnabled:false});
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(String(e)));
  let status=0,metrics={};
  try{
    const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:20000});
    status=response?.status()??0;
    metrics=await page.evaluate(()=>({
      questionCount:document.querySelectorAll("[data-assessment-question]").length,
      optionCount:document.querySelectorAll("[data-assessment-option]").length,
      readableQuestions:[...document.querySelectorAll(".q-text")].every(el=>(el.textContent||"").trim().length>0),
      readableOptions:[...document.querySelectorAll("[data-assessment-option]")].every(el=>(el.textContent||"").trim().length>0),
      overflow:Math.max(0,document.documentElement.scrollWidth-window.innerWidth),
      rawTemplate:/\{[{%]|[%}]\}/.test(document.body.innerText||"")
    }));
  }catch(error){errors.push(String(error));}
  const passed=status===200&&metrics.questionCount===10&&metrics.optionCount===40&&metrics.readableQuestions===true&&metrics.readableOptions===true&&metrics.overflow<=2&&metrics.rawTemplate===false&&errors.length===0;
  checks.push({type:"no-js",viewport:view.name,width:view.width,status,metrics,errors,passed});
  await context.close();
}

for(const view of viewports) await standardCheck(view);
await wallClockTimerCheck();
await noJsCheck({name:"no-js-320",width:320,height:820});
await noJsCheck({name:"no-js-1280",width:1280,height:900});

await browserInstance.close();
const failures=checks.filter(c=>!c.passed);
const report={
  token:failures.length?"ASSESSMENT_RUNTIME_PILOT_BROWSER_FAIL":"ASSESSMENT_RUNTIME_PILOT_BROWSER_PASS",
  route,
  standard_viewports:viewports.length,
  wall_clock_timer_checks:1,
  no_js_checks:2,
  serious_critical_axe:checks.reduce((sum,c)=>sum+(c.violations?.length||0),0),
  failures
};
await fs.writeFile(path.join(out,"report.json"),JSON.stringify(report,null,2)+"\n");
await fs.writeFile(path.join(out,"summary.md"),
  "# CONV-04D-04 Authored Assessment Runtime Pilot Browser Certification\n\n"+
  "- Route: "+route+"\n"+
  "- Standard viewports: "+viewports.length+"\n"+
  "- Wall-clock timer checks: 1\n"+
  "- No-JS checks: 2\n"+
  "- Serious/critical Axe violations: "+report.serious_critical_axe+"\n"+
  "- Result: "+(failures.length?"FAIL":"PASS")+"\n"
);
console.log(report.token);
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exit(1);}
