#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const arg=(n,f)=>{const i=process.argv.indexOf(n);return i>=0&&process.argv[i+1]?process.argv[i+1]:f};
const base=arg("--base-url","http://127.0.0.1:4173").replace(/\/$/,"");
const out=path.resolve(arg("--output-dir","conv04f-hsc-zoology-browser-report"));
const route="/biology/hsc-corner/zoology/";
const views=[
 ["mobile-320",320,900],["mobile-390",390,900],["tablet-768",768,1024],
 ["desktop-1280",1280,900],["wide-1440",1440,960]
];
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const checks=[];

async function run(name,width,height,opts={}){
  const ctx=await browser.newContext({
    viewport:{width,height},
    javaScriptEnabled:opts.javaScriptEnabled!==false,
    reducedMotion:opts.reducedMotion?"reduce":"no-preference"
  });
  const page=await ctx.newPage();
  const pageErrors=[]; page.on("pageerror",e=>pageErrors.push(String(e)));
  await page.route("**/*",async r=>{
    const u=new URL(r.request().url());
    if(["127.0.0.1","localhost"].includes(u.hostname)) await r.continue();
    else await r.abort();
  });
  let status=0,metrics={},axeBad=[],focusVisible=true;
  try{
    const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:20000});
    status=response?.status()||0;
    if(opts.textSpacing){
      await page.addStyleTag({content:"*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}"});
    }
    if(opts.textSpacing){
      metrics.textSpacing=await page.evaluate(()=>{
        const root=document.querySelector("[data-lbfl-academic-surface='v1']")||document.body;
        const selector="p,li,h1,h2,h3,h4,h5,h6,a,button,summary,.lbfl-info-card,.lbfl-clean-card,.lbfl-academic-card,.lbfl-learning-guide-cta";
        const clipped=[];
        for(const el of root.querySelectorAll(selector)){
          const text=(el.innerText||"").trim();
          if(!text) continue;
          const style=getComputedStyle(el);
          const verticalHidden=["hidden","clip"].includes(style.overflowY);
          const horizontalHidden=["hidden","clip"].includes(style.overflowX);
          const verticalClip=verticalHidden && el.scrollHeight>el.clientHeight+1;
          const horizontalClip=horizontalHidden && el.scrollWidth>el.clientWidth+1;
          if(verticalClip||horizontalClip){
            clipped.push({
              tag:el.tagName,
              className:typeof el.className==="string"?el.className:"",
              verticalClip,
              horizontalClip,
              clientHeight:el.clientHeight,
              scrollHeight:el.scrollHeight,
              clientWidth:el.clientWidth,
              scrollWidth:el.scrollWidth,
              text:text.slice(0,120)
            });
          }
        }
        return {clipped:clipped.slice(0,20)};
      });
    }
    if(opts.reducedMotion){
      metrics.reducedMotion=await page.evaluate(()=>{
        const seconds=value=>String(value||"").split(",").map(part=>{
          const token=part.trim();
          if(token.endsWith("ms")) return (Number.parseFloat(token)||0)/1000;
          if(token.endsWith("s")) return Number.parseFloat(token)||0;
          return Number.parseFloat(token)||0;
        });
        const root=document.querySelector("[data-lbfl-academic-surface='v1']")||document.body;
        const offenders=[];
        for(const el of root.querySelectorAll("*")){
          const style=getComputedStyle(el);
          const longest=Math.max(0,...seconds(style.animationDuration),...seconds(style.transitionDuration));
          if(longest>0.02 || style.scrollBehavior==="smooth"){
            offenders.push({
              tag:el.tagName,
              className:typeof el.className==="string"?el.className:"",
              duration:longest,
              scrollBehavior:style.scrollBehavior
            });
          }
        }
        return {
          mediaMatches:matchMedia("(prefers-reduced-motion: reduce)").matches,
          offenders:offenders.slice(0,20)
        };
      });
    }
    if(opts.javaScriptEnabled!==false && !opts.textSpacing && !opts.reducedMotion){
      focusVisible=false;
      for(let i=0;i<220;i++){
        await page.keyboard.press("Tab");
        const f=await page.evaluate(()=>({
          target:!!document.activeElement?.closest?.(".lbfl-learning-guide-cta"),
          visible:!!document.activeElement?.matches?.(":focus-visible")
        }));
        if(f.target){focusVisible=f.visible;break;}
      }
    }
    const baseMetrics=await page.evaluate(()=> {
      const article=document.querySelector("[data-lbfl-academic-surface='v1']");
      const body=document.body.innerText||"";
      const hrefs=[...document.querySelectorAll("a[href]")].map(a=>new URL(a.href,location.href).pathname);
      return {
        lang:document.documentElement.lang,
        htmlAcademic:document.documentElement.classList.contains("lbfl-academic-v1"),
        bodyAcademic:document.body.classList.contains("lbfl-academic-v1-active"),
        role:article?.getAttribute("data-lbfl-academic-role")||"",
        guide:article?.getAttribute("data-lbfl-learning-guide")||"",
        ctaCount:document.querySelectorAll(".lbfl-learning-guide-cta").length,
        learnLink:hrefs.includes("/learn/"),
        boundaryCount:document.querySelectorAll(".educational-boundary").length,
        legacyFramework:document.querySelectorAll(".lbfl-framework-links").length,
        legacyCycle:document.querySelectorAll("[data-zoology-learning-cycle]").length,
        h1:document.querySelectorAll("h1").length,
        required:["Core Learning Route","Available Zoology Logs","Extended Zoology Pathways","Study Sequence","Responsible Learning Boundary","Connected Nodes"].map(x=>[x,body.includes(x)]),
        overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
        rawTemplate:/\{\{|\{%/.test(body)
      };
    });
    metrics={...metrics,...baseMetrics};
    if(opts.javaScriptEnabled!==false && !opts.textSpacing && !opts.reducedMotion){
      await page.addScriptTag({content:axe.source});
      axeBad=await page.evaluate(async()=>{
        const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa"]}});
        return r.violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length}));
      });
    }
    const standard=!opts.textSpacing&&!opts.reducedMotion&&opts.javaScriptEnabled!==false;
    const pass=status===200&&metrics.lang==="en"&&metrics.htmlAcademic&&metrics.bodyAcademic&&
      metrics.role==="academic_gateway"&&metrics.guide==="canonical"&&metrics.ctaCount===1&&metrics.learnLink&&
      metrics.boundaryCount===1&&metrics.legacyFramework===0&&metrics.legacyCycle===0&&metrics.h1===1&&
      metrics.required.every(x=>x[1])&&metrics.overflow<=2&&!metrics.rawTemplate&&pageErrors.length===0&&
      (!standard||(focusVisible&&axeBad.length===0))&&
      (!opts.textSpacing||(metrics.textSpacing&&metrics.textSpacing.clipped.length===0))&&
      (!opts.reducedMotion||(metrics.reducedMotion&&metrics.reducedMotion.mediaMatches&&metrics.reducedMotion.offenders.length===0));
    checks.push({name,width,height,opts,status,metrics,focusVisible,axeBad,pageErrors,pass});
  }catch(e){checks.push({name,width,height,opts,status,error:String(e),pass:false});}
  await ctx.close();
}

for(const [n,w,h] of views) await run(n,w,h);
for(const [n,w,h] of views.filter(v=>["mobile-320","desktop-1280"].includes(v[0]))){
  await run(n,w,h,{textSpacing:true});
  await run(n,w,h,{reducedMotion:true});
  await run(n,w,h,{javaScriptEnabled:false});
}
await browser.close();
const failed=checks.filter(x=>!x.pass);
await fs.writeFile(path.join(out,"results.json"),JSON.stringify({route,checks,failed:failed.length,result:failed.length?"FAIL":"PASS"},null,2)+"\n");
await fs.writeFile(path.join(out,"summary.md"),`# CONV-04F-01 HSC Zoology Browser Certification\n\n- Checks: ${checks.length}\n- Failed: ${failed.length}\n- Result: ${failed.length?"FAIL":"PASS"}\n`);
if(failed.length){console.error(JSON.stringify(failed,null,2));process.exit(1)}
console.log("CONV-04F-01 HSC Zoology gateway browser certification: PASS");
