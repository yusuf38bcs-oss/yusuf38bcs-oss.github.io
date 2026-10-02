#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import axe from "axe-core";
import { chromium } from "playwright";
const base=(process.argv[process.argv.indexOf("--base-url")+1]||"http://127.0.0.1:4173").replace(/\/$/,"");
const out=path.resolve(process.argv[process.argv.indexOf("--output-dir")+1]||"conv04e-bot08-browser-report");
await fs.mkdir(out,{recursive:true});
const route="/biology/hsc-corner/botany/lecture-08-plastid-chloroplast/";
const views=[["mobile-320",320,900],["mobile-390",390,900],["tablet-768",768,1024],["desktop-1280",1280,900],["wide-1440",1440,960]];
const browser=await chromium.launch({headless:true}); const checks=[];
for(const [name,width,height] of views){
 const context=await browser.newContext({viewport:{width,height}});
 await context.route("**/*",async rr=>{const u=new URL(rr.request().url()); if(["127.0.0.1","localhost"].includes(u.hostname)) await rr.continue(); else await rr.fulfill({status:204,body:""});});
 const page=await context.newPage(); const errs=[]; page.on("pageerror",e=>errs.push(String(e)));
 const res=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:20000});
 const m=await page.evaluate(()=>({lang:document.documentElement.lang,academic:document.documentElement.classList.contains("lbfl-academic-v1"),role:document.querySelector("[data-lbfl-academic-role]")?.getAttribute("data-lbfl-academic-role"),guide:document.querySelector("[data-lbfl-learning-guide]")?.getAttribute("data-lbfl-learning-guide"),cta:document.querySelectorAll(".lbfl-learning-guide-cta").length,mcq:document.querySelectorAll(".lbfl-mcq-card").length,cq:document.querySelectorAll(".lbfl-cq-card").length,overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),text:document.body.innerText}));
 await page.addScriptTag({content:axe.source}); const bad=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa"]}});return r.violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,details:v.nodes.map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary}))}));});
 let quizPass=true;
 if(name==="desktop-1280"){
   for(let i=1;i<=10;i++) await page.locator(`input[name="bot08-q${i}"]`).first().check();
   await page.locator("[data-submit]").click();
   quizPass=await page.locator("[data-score]").evaluate(el=>/\d+ \/ 10/.test(el.textContent||""));
   await page.locator("[data-reset]").click();
   quizPass=quizPass && await page.locator("[data-score]").evaluate(el=>(el.textContent||"").includes("সব ১০টি"));
 }
 const pass=res?.status()===200&&m.lang==="bn"&&m.academic&&m.role==="lecture"&&m.guide==="canonical"&&m.cta===1&&m.mcq===10&&m.cq===3&&m.overflow<=2&&m.text.includes("Plastid and Chloroplast")&&m.text.includes("not-certified")===false&&bad.length===0&&errs.length===0&&quizPass;
 checks.push({name,status:res?.status(),metrics:m,axe:bad,errors:errs,quizPass,pass});
 await context.close();
}
await browser.close();
const failed=checks.filter(x=>!x.pass);
await fs.writeFile(path.join(out,"results.json"),JSON.stringify({checks,failed:failed.length,result:failed.length?"FAIL":"PASS"},null,2)+"\n");
await fs.writeFile(path.join(out,"summary.md"),`# CONV-04E-02 BOT-08 Browser Certification\n\n- Checks: ${checks.length}\n- Failed: ${failed.length}\n- Result: ${failed.length?"FAIL":"PASS"}\n`);
if(failed.length){console.error(JSON.stringify(failed,null,2));process.exit(1)}
console.log("CONV-04E-02 BOT-08 browser certification: PASS");
