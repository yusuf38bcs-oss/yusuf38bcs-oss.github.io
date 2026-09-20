#!/usr/bin/env node
import fs from "node:fs/promises";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";
const base=(process.argv[2]||"http://127.0.0.1:4173").replace(/\/$/,"");
const slugs=["lecture-01-chordate-plan-classification","lecture-02-ascidia","lecture-03-branchiostoma","lecture-04-myxine-petromyzon","lecture-05-scoliodon","lecture-06-labeo-rohita","lecture-07-bufo","lecture-08-hemidactylus","lecture-09-columba-livia","lecture-10-homo-sapiens-eye-ear"];
const routes=["/biology/animal-diversity/","/biology/animal-diversity/course/","/bn/biology/animal-diversity/","/bn/biology/animal-diversity/course/",...slugs.flatMap(s=>[`/biology/animal-diversity/${s}/`,`/bn/biology/animal-diversity/${s}/`])];
const viewports=[{name:"mobile-390",width:390,height:844},{name:"tablet-768",width:768,height:1024},{name:"desktop-1280",width:1280,height:900}];
const browser=await chromium.launch({headless:true}); const results=[];
for(const route of routes){for(const vp of viewports){
 const context=await browser.newContext({viewport:{width:vp.width,height:vp.height},reducedMotion:"reduce",extraHTTPHeaders:{"Save-Data":"on"}});
 const page=await context.newPage(); const consoleErrors=[],pageErrors=[],httpErrors=[];
 page.on("console",m=>{if(m.type()==="error")consoleErrors.push(m.text())}); page.on("pageerror",e=>pageErrors.push(String(e)));
 page.on("response",r=>{if(new URL(r.url()).hostname.match(/127\.0\.0\.1|localhost/) && r.status()>=400)httpErrors.push({status:r.status(),url:r.url()})});
 let status=0,metrics={},violations=[];
 try{const resp=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:20000});status=resp?.status()||0;await page.addScriptTag({content:axe.source});
 metrics=await page.evaluate(()=>({h1:document.querySelectorAll("h1").length,cycle:!!document.querySelector("[data-zoology-learning-cycle]"),framework:!!document.querySelector(".lbfl-framework-links"),overflow:Math.max(0,document.documentElement.scrollWidth-window.innerWidth),brokenImages:Array.from(document.images).filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),switcherPaths:Array.from(document.querySelectorAll(".lbfl-language-switcher a")).map(a=>new URL(a.href,location.href).pathname),nav:!!document.querySelector(".lbfl-course-pagination")}));
 const ax=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa"]}}));violations=ax.violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary}))}));
 }catch(e){pageErrors.push(String(e))}
 const isLecture=/lecture-\d\d-/.test(route);
 const cleanRoute=route.startsWith("/bn/")?route.slice(3):route;
 const expectedEnglish=cleanRoute;
 const expectedBangla="/bn"+cleanRoute;
 const languagePairPass=(metrics.switcherPaths??[]).includes(expectedEnglish)&&(metrics.switcherPaths??[]).includes(expectedBangla);
 const passed=status===200&&metrics.h1===1&&!metrics.cycle&&!metrics.framework&&(metrics.overflow??999)<=2&&(metrics.brokenImages?.length??1)===0&&consoleErrors.length===0&&pageErrors.length===0&&httpErrors.length===0&&violations.length===0&&(!isLecture||metrics.nav===true)&&languagePairPass;
 results.push({route,viewport:vp.name,status,metrics,languagePairPass,expectedEnglish,expectedBangla,violations,consoleErrors,pageErrors,httpErrors,passed}); await context.close();
}}
await browser.close(); const passed=results.every(r=>r.passed); await fs.mkdir("animal-diversity-browser-report",{recursive:true}); await fs.writeFile("animal-diversity-browser-report/report.json",JSON.stringify({passed,checks:results.length,results},null,2)+"\n");
console.log(passed?"ANIMAL_DIVERSITY_10_BROWSER_PASS":"ANIMAL_DIVERSITY_10_BROWSER_FAIL"); if(!passed){for(const r of results.filter(x=>!x.passed))console.log(`${r.route} @ ${r.viewport}`,JSON.stringify({status:r.status,metrics:r.metrics,violations:r.violations,consoleErrors:r.consoleErrors,pageErrors:r.pageErrors,httpErrors:r.httpErrors}));}
process.exit(passed?0:1);