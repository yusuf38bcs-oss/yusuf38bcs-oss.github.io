#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE=(process.env.LBFL_R3_URL||'http://127.0.0.1:4000').replace(/\/$/,'');
const REPORT=process.env.LBFL_R3_REPORT||'lbfl-r3-browser-report';
const PREFIX=process.env.LBFL_R3_PREFIX||'';
fs.mkdirSync(REPORT,{recursive:true});
const rows=[];let failed=false;
const browser=await chromium.launch({headless:true});
function assert(ok,name,info={}){rows.push({name,pass:Boolean(ok),...info});if(!ok)failed=true;}
try {
 for(const width of [320,390,768,1024,1440]) {
  const ctx=await browser.newContext({viewport:{width,height:width===320?800:900},reducedMotion:'reduce'});
  await ctx.route(/sibforms\.com|googletagmanager\.com|google-analytics\.com|googlesyndication\.com/,route=>route.fulfill({status:204,body:''}));
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/', `${PREFIX}/labs/lbfl-scientific-review/`, `${PREFIX}/labs/lbfl-scientific-integration/`]) {
   const response=await page.goto(BASE+route,{waitUntil:'domcontentloaded',timeout:60000});
   await page.evaluate(() => { for (const img of document.querySelectorAll('#lbfl-science-review img')) { if (img.loading === 'lazy') img.loading = 'eager'; } });
   if (route !== '/') {
     await page.waitForFunction(() => [...document.querySelectorAll('#lbfl-science-review img[src]')].filter(x => (x.getAttribute('src') || '').length > 0).every(x => x.complete && x.naturalWidth > 0), { timeout: 20000 }).catch(() => {});
   }
   await page.waitForTimeout(250);
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+2,bodyOverflow:document.body.scrollWidth>innerWidth+2,h1:document.querySelectorAll('h1').length,meta:document.querySelector('meta[name="robots"]')?.content||'',img:[...document.querySelectorAll('#lbfl-science-review img')].filter(x=>(x.getAttribute('src')||'').length>0).map(x=>({src:x.getAttribute('src'),ok:x.complete&&x.naturalWidth>0})),js:document.querySelector('#lbfl-science-review')?.dataset.initialized||null,ids:[...document.querySelectorAll('[id]')].map(x=>x.id),header:!!document.querySelector('.lbfl-v3-header'),footer:!!document.querySelector('.lbfl-v3-footer'),search:!!document.querySelector('.lbfl-v3-search-button'),newsletter:!!document.querySelector('#newsletter'),consent:!!document.querySelector('#gdpr-banner')}));
   const tag=route==='/'?'root':route.includes('integration')?'shell':'lab';
   assert(response?.ok(),`${tag}/${width}/response`,{status:response?.status()});
   assert(!state.overflow&&!state.bodyOverflow,`${tag}/${width}/no-overflow`,{state});
   assert(state.ids.length===new Set(state.ids).size,`${tag}/${width}/unique-ids`);
   assert(state.h1===1,`${tag}/${width}/one-h1`,{count:state.h1});
   assert(errors.length===0,`${tag}/${width}/no-pageerror`,{errors});
   if(tag!=='root') {
    assert(/noindex/i.test(state.meta),`${tag}/${width}/noindex`);
    assert(state.img.length>=8&&state.img.every(x=>x.ok),`${tag}/${width}/figure-load`,{figures:state.img.length,broken:state.img.filter(x=>!x.ok)});
    assert(state.js==='true',`${tag}/${width}/initialized`);
   }
   if(tag==='root'){
    const data=await page.evaluate(()=>({steps:[...document.querySelectorAll('.lbfl-v3-journey__steps li')].map(x=>x.textContent),hasLab:!!document.querySelector('#lbfl-science-review')}));
    assert(data.steps.length===8,`${tag}/${width}/eight-current-lectures`);
    assert(data.steps.some(x=>x.includes('Cell Wall and Vacuole'))&&data.steps.some(x=>x.includes('Plastid and Chloroplast')),`${tag}/${width}/lectures-07-08`);
    assert(!data.hasLab,`${tag}/${width}/root-not-replaced`);
   }
   if(tag==='shell'){
    assert(state.header&&state.footer&&state.search&&state.newsletter&&state.consent,`${tag}/${width}/shared-owners`,{header:state.header,footer:state.footer,search:state.search,newsletter:state.newsletter,consent:state.consent});
    const contracts=await page.evaluate(()=>({shellMain:!!document.querySelector('#main-content[data-lbfl-academic-role="platform_home"]'),journeys:[...document.querySelectorAll('#lbfl-science-review a[href*="lecture-"]')].map(x=>x.getAttribute('href')),galleries:document.querySelectorAll('#lbfl-science-review [data-plate-target]').length,reviewRibbon:!!document.querySelector('.review-ribbon'),dialog:!!document.querySelector('#lbfl-r2-figure-dialog')}));
    assert(contracts.shellMain&&contracts.dialog&&!contracts.reviewRibbon,`${tag}/${width}/shell-composition`);
    assert(contracts.journeys.length>=8&&contracts.galleries>=8,`${tag}/${width}/learning-and-figures`,{contracts});
    if(width===390||width===1440)await page.screenshot({path:`${REPORT}/shell-${width}.png`,fullPage:true});
   }
  }
  // Only on integrated shell: exercise prediction and dialog without compromising user's independent reasoning.
  await page.goto(BASE+PREFIX+'/labs/lbfl-scientific-integration/',{waitUntil:'domcontentloaded'});
  const root=page.locator('#lbfl-science-review');
  const evidence=page.locator('#lbfl-r2-explanation');
  const before=await evidence.getAttribute('open');
  await page.locator('#lbfl-r2-commit').click();
  const feedback=await page.locator('#lbfl-r2-feedback').innerText();
  const after=await evidence.getAttribute('open');
  assert(before===null&&after===null&&feedback.length>5,`shell/${width}/prediction-not-auto-revealed`);
  const figure=page.locator('#lbfl-science-review [data-plate-target]').first();
  await figure.click();
  const dialog=page.locator('#lbfl-r2-figure-dialog');
  assert(await dialog.evaluate(el=>el.open),`shell/${width}/figure-opens`);
  await page.locator('#lbfl-r2-figure-plus').click();
  assert((await page.locator('#lbfl-r2-figure-scale').innerText()).includes('150%'),`shell/${width}/zoom-150`);
  await page.locator('#lbfl-r2-close-figure').click();
  assert(await figure.evaluate(el=>document.activeElement===el),`shell/${width}/figure-focus-restores`);
  const reduce=await page.locator('#lbfl-r2-motion').isDisabled();
  assert(reduce,`shell/${width}/reduced-motion-respected`);
  // True scripting-disabled context; ensure content remains useful.
  const off=await browser.newContext({javaScriptEnabled:false,viewport:{width,height:800}});
  const p2=await off.newPage();await p2.goto(BASE+PREFIX+'/labs/lbfl-scientific-integration/',{waitUntil:'domcontentloaded'});
  const nojs=await p2.evaluate(()=>({paths:document.querySelectorAll('#lbfl-science-review a[href]').length,figures:document.querySelectorAll('#lbfl-science-review img').length,details:document.querySelectorAll('#lbfl-science-review details').length}));
  assert(nojs.paths>=12&&nojs.figures>=8&&nojs.details>=1,`shell/${width}/no-js-content`,{nojs});
  await off.close();await ctx.close();
 }
} catch(e){assert(false,'uncaught-certification-exception',{message:String(e),stack:e?.stack||''});}
finally {await browser.close();const result={source:BASE,passed:!failed,checks:rows.length,failedChecks:rows.filter(x=>!x.pass),results:rows};fs.writeFileSync(`${REPORT}/report.json`,JSON.stringify(result,null,2));console.log(JSON.stringify({passed:!failed,checks:rows.length,failedChecks:result.failedChecks},null,2));}
if(failed)process.exitCode=1;
