#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const arg=(name,fallback)=>{
  const i=process.argv.indexOf(name);
  return i>=0&&process.argv[i+1]?process.argv[i+1]:fallback;
};

const base=arg("--base-url","http://127.0.0.1:4173").replace(/\/$/,"");
const out=path.resolve(arg("--output-dir","conv04f-zoology-practical-museum-browser-report"));
const route="/biology/higher-zoology-tree/practical/museum-specimens/";
const baseHost=new URL(base).hostname;

const expectedPositions={
  sycon:"0% 0%",
  adamsia:"50% 0%",
  tubifex:"100% 0%",
  lumbricus:"0% 25%",
  ancylostoma:"50% 25%",
  enterobius:"100% 25%",
  wuchereria:"0% 50%",
  hirudo:"50% 50%",
  fasciola:"100% 50%",
  schistosoma:"0% 75%",
  pila:"50% 75%",
  octopus:"100% 75%",
  centipedes:"0% 100%",
  echinus:"50% 100%",
  holothuria:"100% 100%"
};

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
    if(u.hostname===baseHost||["127.0.0.1","localhost"].includes(u.hostname)){
      await r.continue();
    }else{
      await r.fulfill({status:204,body:""});
    }
  });

  const page=await context.newPage();
  const consoleErrors=[];
  const pageErrors=[];
  const localHttpErrors=[];

  page.on("console",m=>{if(m.type()==="error")consoleErrors.push(m.text())});
  page.on("pageerror",e=>pageErrors.push(String(e)));
  page.on("response",r=>{
    const u=new URL(r.url());
    if((u.hostname===baseHost||["127.0.0.1","localhost"].includes(u.hostname))&&r.status()>=400){
      localHttpErrors.push({status:r.status(),url:r.url()});
    }
  });

  let status=0;
  let metrics={};
  let axeBad=[];
  let keyboardTarget=false;
  let focusVisible=false;

  try{
    const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:30000});
    status=response?.status()||0;

    if(opts.textSpacing){
      await page.addStyleTag({
        content:"*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}"
      });
    }

    if(opts.javaScriptEnabled!==false&&!opts.textSpacing&&!opts.reducedMotion){
      for(let i=0;i<320;i++){
        await page.keyboard.press("Tab");
        const f=await page.evaluate(()=>({
          target:!!document.activeElement?.closest?.(".zoology-practical-table-scroll"),
          visible:!!document.activeElement?.matches?.(":focus-visible")
        }));
        if(f.target){
          keyboardTarget=true;
          focusVisible=f.visible;
          break;
        }
      }
    }

    metrics=await page.evaluate(({expectedPositions})=>{
      const article=document.querySelector("[data-lbfl-academic-surface='v1']");
      const body=document.body.innerText||"";
      const specimenHeadings=[...document.querySelectorAll(".page__content h2")]
        .filter(h=>/^\d+\.\s/.test((h.textContent||"").trim()));
      const tables=[...document.querySelectorAll(".page__content table")];
      const figures=[...document.querySelectorAll(".museum-verified-figure")];
      const spritePositions={};
      for(const [specimen] of Object.entries(expectedPositions)){
        const el=document.querySelector('.museum-verified-figure[data-specimen="'+specimen+'"] .museum-verified-image');
        spritePositions[specimen]=el?getComputedStyle(el).backgroundPosition:null;
      }
      const hrefs=[...document.querySelectorAll("a[href]")].map(a=>new URL(a.href,location.href).pathname);
      const moduleCss=[...document.querySelectorAll('link[rel="stylesheet"]')].filter(l=>new URL(l.href,location.href).pathname==="/assets/css/zoology-practical-museum.css").length;
      const sharedCss=[...document.querySelectorAll('link[rel="stylesheet"]')].filter(l=>new URL(l.href,location.href).pathname==="/assets/css/zoology-practical.css").length;
      const sharedJs=[...document.querySelectorAll("script[src]")].filter(s=>new URL(s.src,location.href).pathname==="/assets/js/zoology-practical.js").length;

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
        h1Count:document.querySelectorAll(".page__content h1").length,
        specimenHeadingCount:specimenHeadings.length,
        tableCount:tables.length,
        practicalTableWrapCount:document.querySelectorAll(".zoology-practical-table-scroll").length,
        nestedTableWrapCount:document.querySelectorAll(".zoology-practical-table-scroll .zoology-practical-table-scroll").length,
        focusableTableRegionCount:document.querySelectorAll('.zoology-practical-table-scroll[tabindex="0"][role="region"]').length,
        verifiedFigureCount:figures.length,
        verifiedImageCount:document.querySelectorAll(".museum-verified-image").length,
        oldPlaceholderFigureCount:document.querySelectorAll(".museum-specimen-figure").length,
        sourceInlineStyleCount:document.querySelectorAll(".page__content .museum-verified-image[style]").length,
        moduleCssCount:moduleCss,
        sharedCssCount:sharedCss,
        sharedJsCount:sharedJs,
        coverageText:body.includes("48/48 unique syllabus labels"),
        figureGuide:body.includes("Figure Guide"),
        spottingTemplate:body.includes("Spotting Template"),
        nomenclatureNotes:body.includes("Syllabus Nomenclature Notes"),
        spritePositions,
        overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
        rawTemplate:/\{\{|\{%/.test(body)
      };
    },{expectedPositions});

    metrics.spritePositionsPass=Object.entries(expectedPositions)
      .every(([specimen,pos])=>metrics.spritePositions[specimen]===pos);

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
        const ad=cs.animationDuration.split(",").some(v=>parseFloat(v)*1000>20);
        const td=cs.transitionDuration.split(",").some(v=>parseFloat(v)*1000>20);
        return ad||td||cs.scrollBehavior==="smooth";
      }).length);
    }

    if(opts.javaScriptEnabled!==false&&!opts.textSpacing&&!opts.reducedMotion){
      await page.addScriptTag({content:axe.source});
      axeBad=await page.evaluate(async()=>{
        const r=await axe.run(document,{
          runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]}
        });
        return r.violations
          .filter(v=>["serious","critical"].includes(v.impact))
          .map(v=>({
            id:v.id,
            impact:v.impact,
            nodes:v.nodes.map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary}))
          }));
      });
    }

    const jsEnabled=opts.javaScriptEnabled!==false;
    const standard=jsEnabled&&!opts.textSpacing&&!opts.reducedMotion;

    const common=status===200 &&
      metrics.htmlLang==="bn" &&
      /^bn(?:-|$)/i.test(metrics.articleLang) &&
      metrics.htmlAcademic && metrics.bodyAcademic && metrics.articleAcademic &&
      metrics.role==="practical" && metrics.guide==="canonical" &&
      metrics.ctaCount===1 && metrics.learnLink &&
      metrics.boundaryCount===1 && metrics.legacyCycleCount===0 &&
      metrics.h1Count===1 &&
      metrics.specimenHeadingCount===48 &&
      metrics.tableCount===49 &&
      metrics.verifiedFigureCount===15 &&
      metrics.verifiedImageCount===15 &&
      metrics.oldPlaceholderFigureCount===0 &&
      metrics.sourceInlineStyleCount===0 &&
      metrics.moduleCssCount===1 &&
      metrics.sharedCssCount===1 &&
      metrics.sharedJsCount===1 &&
      metrics.coverageText && metrics.figureGuide &&
      metrics.spottingTemplate && metrics.nomenclatureNotes &&
      metrics.spritePositionsPass &&
      !metrics.rawTemplate &&
      consoleErrors.length===0 && pageErrors.length===0 && localHttpErrors.length===0;

    const jsContract=!jsEnabled ||
      (metrics.practicalTableWrapCount===49 &&
       metrics.nestedTableWrapCount===0 &&
       metrics.focusableTableRegionCount===49 &&
       metrics.overflow<=2);

    const pass=common && jsContract &&
      (!standard||(keyboardTarget&&focusVisible&&axeBad.length===0)) &&
      (!opts.textSpacing||metrics.textClip===0) &&
      (!opts.reducedMotion||(metrics.reduceMatches===true&&metrics.motionViolations===0));

    checks.push({
      name,width,height,opts,status,metrics,keyboardTarget,focusVisible,
      axeBad,consoleErrors,pageErrors,localHttpErrors,pass
    });
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
await fs.writeFile(
  path.join(out,"results.json"),
  JSON.stringify({route,checks,failed:failed.length,result:failed.length?"FAIL":"PASS"},null,2)+"\n"
);
await fs.writeFile(
  path.join(out,"summary.md"),
  "# CONV-04F-09 Zoology Practical-I Museum Specimens Browser Certification\n\n"+
  "- Checks: "+checks.length+"\n"+
  "- Failed: "+failed.length+"\n"+
  "- Result: "+(failed.length?"FAIL":"PASS")+"\n"
);

if(failed.length){
  console.error(JSON.stringify(failed,null,2));
  process.exit(1);
}

console.log("CONV-04F-09 Zoology Practical-I Museum Specimens browser certification: PASS");
