#!/usr/bin/env node
// Deterministic Brevo contract simulator. No live subscriber or external POST.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const URL = process.env.LBFL_NEWSLETTER_TEST_URL || "http://127.0.0.1:4000/contact/";
const vendor = `
window.invisibleCaptchaCallback=function(){};
SVGElement.prototype.removeClass=function(){};
const form=document.getElementById("sib-form");
window.__lbflVendor={attempts:0,requests:0,finish:null};
form.addEventListener("submit",function(e){
  e.preventDefault();
  const email=document.getElementById("EMAIL").value;
  // A browser-valid input the vendor rejects before entering AJAX.
  if(email.includes("vendor-reject"))return;
  const v=window.__lbflVendor;v.attempts++;v.requests++;
  const button=form.querySelector('button[type="submit"]');
  const loader=form.querySelector(".sib-loader");
  button.style.display="none";loader.style.display="block";
  v.finish=function(){
    button.style.display="";loader.style.display="none";
  };
});
`;
(async()=>{
 const browser=await chromium.launch({headless:true});
 let page;
 try{
  page=await browser.newPage({viewport:{width:390,height:844}});
  await page.route("**/sibforms.com/forms/end-form/build/main.js",r=>r.fulfill({status:200,contentType:"application/javascript",body:vendor}));
  await page.goto(URL,{waitUntil:"domcontentloaded"});
  await page.locator("[data-brevo-open]").first().click();
  await page.waitForFunction(()=>typeof window.__lbflVendor==="object");
  const email=page.locator("#EMAIL"), consent=page.locator("#NEWSLETTER_AGREEMENT"), button=page.locator('#sib-form button[type="submit"]'), loader=page.locator(".sib-loader");
  await email.fill("vendor-reject@example.com");await consent.check();await email.press("Enter");
  await page.waitForTimeout(50);
  assert.equal(await page.evaluate(()=>window.__lbflVendor.requests),0,"vendor validation short circuits");
  await email.fill("certification@example.com");await email.press("Enter");
  await page.waitForFunction(()=>window.__lbflVendor.requests===1);
  assert.equal(await button.isVisible(),false,"vendor hides button");
  assert.equal(await loader.isVisible(),true,"loader shown");
  await email.press("Enter");await page.waitForTimeout(50);
  assert.equal(await page.evaluate(()=>window.__lbflVendor.requests),1,"no duplicate AJAX");
  for(let i=0;i<7;i++){await page.keyboard.press("Tab");assert.equal(await page.evaluate(()=>document.activeElement.closest("#brevo-newsletter-modal")!==null),true,"focus stays in modal");}
  await page.evaluate(()=>window.__lbflVendor.finish());
  await page.waitForFunction(()=>document.querySelector('#sib-form button[type="submit"]').style.display!=="none");
  await page.waitForTimeout(50);
  assert.equal(await button.isVisible(),true,"button restored");
  await email.fill("certification2@example.com");await email.press("Enter");
  await page.waitForFunction(()=>window.__lbflVendor.requests===2);
  await page.evaluate(()=>window.__lbflVendor.finish());
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#brevo-newsletter-modal").isVisible(),false,"Escape closes modal");
  console.log("NEWSLETTER MOCK CERTIFICATION PASS: pre-AJAX rejection, retry, single pending request, loader visibility, modal Tab cycle, completion and retry, Escape.");
 }finally{await browser.close();}
})().catch(e=>{console.error("NEWSLETTER MOCK CERTIFICATION FAIL",e);process.exitCode=1;});
