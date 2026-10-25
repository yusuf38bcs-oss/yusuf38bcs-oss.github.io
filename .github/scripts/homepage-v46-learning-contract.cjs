#!/usr/bin/env node
/* V4.6 built-artifact, no-JS and learner-action contract. Read-only. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const url = process.env.LBFL_HOMEPAGE_URL || 'http://127.0.0.1:4000/';
const site = path.resolve('_site');
const output = path.resolve('homepage-v46-report');
const viewports = [[320,800],[390,844],[768,1024],[1440,900]];
const selectors = ['.lbfl-v3-hero','#learning-pathways','#curiosity-challenge','.lbfl-v3-journey','.lbfl-v3-repair','.lbfl-v46-spotlight','.lbfl-v3-method','.lbfl-v3-evidence','.lbfl-v3-continue'];
const primary = ['/biology/hsc-corner/','/biology/higher-zoology-tree/','/mcq-arena/','/socratic/'];

function verifyRoute(route) {
  assert(route.startsWith('/') && !route.includes('..'), 'Unsafe route: ' + route);
  const relative = decodeURIComponent(route).replace(/^\\/+/, '');
  const destination = path.join(site, relative, 'index.html');
  assert(fs.existsSync(destination), 'Built lesson missing: ' + route + ' (checked ' + destination + ')');
}

(async () => {
  fs.mkdirSync(output,{recursive:true});
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const [width,height] of viewports) {
      const context = await browser.newContext({viewport:{width,height}});
      const page = await context.newPage();
      const pageErrors = [];
      page.on('pageerror',e=>pageErrors.push(e.message));
      await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
      const state = await page.evaluate(({selectors,height,width}) => {
        const sections=selectors.map(s=>document.querySelector(s));
        const offsets=sections.map(n=>n ? n.getBoundingClientRect().top+window.scrollY : -1);
        const sources=[...document.querySelectorAll('.lbfl-v46-source-card h3 a')].map(a=>new URL(a.href).pathname);
        const paths=[...document.querySelectorAll('.lbfl-v3-pathway-grid a')].map(a=>new URL(a.href).pathname);
        const firstPath=document.querySelector('#learning-pathways');
        const check=document.querySelector('[data-v46-check]');
        return {
          oneH1:document.querySelectorAll('h1').length===1,
          main:Boolean(document.querySelector('main#main-content')),
          order:offsets.every((n,i)=>n>=0&&(i===0||n>=offsets[i-1])),
          paths,sources,
          journey:[...document.querySelectorAll('.lbfl-v3-journey__steps li a')].length,
          bangla:Boolean(document.querySelector('#curiosity-challenge [lang="bn"]')),
          heroActions:Boolean(document.querySelector('.lbfl-v3-actions a[href="#learning-pathways"]')&&document.querySelector('.lbfl-v3-actions a[href="#curiosity-challenge"]')),
          earlyPath:Boolean(firstPath&&(width>700||firstPath.getBoundingClientRect().top+window.scrollY<height*1.7)),
          overflow:document.documentElement.scrollWidth>innerWidth+2,
          control44:Boolean(check&&check.getBoundingClientRect().height>=44),
          noFalseRecency:!/scientifically reviewed|updated today|latest verified/i.test(document.querySelector('.lbfl-v46-spotlight')?.textContent||'')
        };
      },{selectors,height,width});
      assert(state.oneH1&&state.main&&state.order,'Semantic heading/order/landmark failure');
      assert.deepEqual(state.paths,primary,'Primary pathway mismatch');
      assert.equal(state.journey,8,'Connected journey must link eight lessons');
      assert.equal(state.sources.length,6,'Six curated source lessons required');
      assert.equal(new Set(state.sources).size,6,'Duplicate source lessons');
      state.sources.forEach(verifyRoute);
      assert(state.bangla&&state.heroActions&&state.earlyPath,'Learning-first or language requirement missing');
      assert(!state.overflow&&state.control44&&state.noFalseRecency,'Reflow/target/provenance contract failed');
      assert.equal(pageErrors.length,0,'Browser JS errors: '+pageErrors.join('; '));
      await page.screenshot({path:path.join(output,width+'.png'),fullPage:true});
      if(width===390) {
        await page.locator('input[name="lbfl-v46-prediction"][value="in"]').check();
        await page.locator('[data-v46-check]').click();
        assert.match(await page.locator('[data-v46-feedback]').innerText(),/Reconsider the water-potential/);
        assert(await page.locator('[data-v46-evidence]').evaluate(e=>e.open),'Evidence not opened');
        assert(await page.locator('[data-v46-revision]').isVisible(),'Revision not offered');
        await page.locator('[data-v46-reset]').click();
        assert.equal(await page.locator('input[name="lbfl-v46-prediction"]:checked').count(),0,'Reset failed');
        await page.locator('input[name="lbfl-v46-prediction"][value="out"]').check();
        await page.locator('[data-v46-check]').click();
        assert.match(await page.locator('[data-v46-feedback]').innerText(),/matches the water-potential model/);
        await page.locator('[data-v46-motion-toggle]').click();
        assert.equal(await page.locator('[data-v46-motion-toggle]').getAttribute('aria-pressed'),'true');
        assert.equal(await page.locator('body').getAttribute('data-v46-motion-paused'),'true');
      }
      results.push({width,height,pass:true});
      await context.close();
    }
    const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
    const page=await context.newPage();
    await page.goto(url,{waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('.lbfl-v3-pathway-grid a').count(),4,'No-JS paths absent');
    assert.equal(await page.locator('.lbfl-v46-source-card h3 a').count(),6,'No-JS source cards absent');
    assert.equal(await page.locator('.lbfl-v3-journey__steps li a').count(),8,'No-JS journey absent');
    await page.locator('[data-v46-evidence] summary').click();
    assert(await page.locator('[data-v46-evidence]').evaluate(n=>n.open),'No-JS explanation not accessible');
    assert(!(await page.locator('[data-v46-motion-toggle]').isVisible()),'No-JS inert control visible');
    await page.screenshot({path:path.join(output,'390-no-js.png'),fullPage:true});
    await context.close();
    const lab=await browser.newPage();
    await lab.goto(new URL('/labs/homepage-v3/',url).href,{waitUntil:'domcontentloaded'});
    assert.match(await lab.locator('meta[name="robots"]').getAttribute('content'),/noindex/,'Shadow lab must remain noindex');
    await lab.close();
    fs.writeFileSync(path.join(output,'contract.json'),JSON.stringify({status:'PASS',results,noJs:'PASS'},null,2));
    console.log('LBFL_HOMEPAGE_V46_LEARNING_CONTRACT_PASS');
  } catch(error) {
    fs.writeFileSync(path.join(output,'failure.json'),JSON.stringify({status:'FAIL',error:String(error.stack||error),results},null,2));
    console.error(error);
    process.exitCode=1;
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
