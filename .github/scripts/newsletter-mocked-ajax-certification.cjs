#!/usr/bin/env node
// Isolated Brevo lifecycle contract certification; never sends a real subscription.
// Network and vendor main.js are mocked. This tests our integration contract, not Brevo's real backend.
"use strict";
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const URL = process.env.LBFL_NEWSLETTER_TEST_URL || "http://127.0.0.1:4000/contact/";

function installMockBrevo() {
  window.invisibleCaptchaCallback = function () {};
  SVGElement.prototype.removeClass = function () {};
  const form = document.getElementById("sib-form");
  window.__lbflVendor = { attempts: 0, requests: 0, completed: 0, rejectedBeforeAJAX: 0, results: [] };
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const vendor = window.__lbflVendor;
    vendor.attempts++;
    const email = document.getElementById("EMAIL").value;
    // A syntactically valid address rejected by the vendor before any AJAX.
    if (email.indexOf("vendor-reject") !== -1) {
      vendor.rejectedBeforeAJAX++;
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    const loader = form.querySelector(".sib-loader");
    const error = document.getElementById("error-message");
    const success = document.getElementById("success-message");
    error.classList.remove("sib-form-message-panel--active");
    success.classList.remove("sib-form-message-panel--active");
    vendor.requests++;
    button.style.display = "none";
    loader.style.display = "block";
    fetch("/__lbfl_mock_brevo__/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
    }).then(function (response) {
      if (!response.ok) throw new Error("Mock HTTP " + response.status);
      success.querySelector(".sib-form-message-panel__inner-text").textContent =
        "Mock Brevo subscription accepted.";
      success.classList.add("sib-form-message-panel--active");
      vendor.results.push("success");
    }).catch(function (errorResponse) {
      error.querySelector(".sib-form-message-panel__inner-text").textContent =
        "Mock subscription failed: " + errorResponse.message;
      error.classList.add("sib-form-message-panel--active");
      vendor.results.push("failure");
    }).finally(function () {
      button.style.display = "";
      loader.style.display = "none";
      vendor.completed++;
    });
  });
}

async function waitForIntercepted(page, intercepted, count) {
  for (let i = 0; i < 75 && intercepted.length < count; i++) {
    await page.waitForTimeout(25);
  }
  assert.equal(intercepted.length, count, "exactly " + count + " intercepted AJAX requests");
}

async function certifyViewport(browser, viewport) {
  const page = await browser.newPage({ viewport });
  const intercepted = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  // No vendor JS or POST can reach Brevo: both are intercepted before execution.
  await page.route("**/sibforms.com/forms/end-form/build/main.js", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "(" + installMockBrevo.toString() + ")();"
    }));
  await page.route("**/__lbfl_mock_brevo__/submit", async (route) => {
    const payload = route.request().postDataJSON();
    const item = { email: payload.email, route, release: null };
    intercepted.push(item);
    await new Promise((resolve) => { item.release = resolve; });
    const code = item.email.indexOf("validation-reject") !== -1 ? 422 :
      item.email.indexOf("server-failure") !== -1 ? 503 : 200;
    await route.fulfill({
      status: code,
      contentType: "application/json",
      body: JSON.stringify({ status: code, simulated: true })
    });
  });
  try {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    const open = page.locator("[data-brevo-open]").first();
    await open.click();
    await page.waitForFunction(() => !!window.__lbflVendor);
    const modal = page.locator("#brevo-newsletter-modal");
    const email = page.locator("#EMAIL");
    const consent = page.locator("#NEWSLETTER_AGREEMENT");
    const button = page.locator('#sib-form button[type="submit"]');
    const loader = page.locator(".sib-loader");

    // Browser-native invalid email: no request.
    await email.fill("not-an-email");
    assert.equal(await email.evaluate((el) => el.validity.typeMismatch), true);
    await email.press("Enter");
    assert.equal(intercepted.length, 0, "invalid email causes no POST");

    // Isolate the consent case from malformed/empty email validation.
    await email.fill("consent-check@example.com");
    await consent.uncheck();
    assert.equal(await consent.evaluate((el) => el.validity.valueMissing), true);
    await email.press("Enter");
    assert.equal(intercepted.length, 0, "valid email with missing consent causes no POST");

    // Synchronous vendor rejection must not poison the pending guard.
    await consent.check();
    await email.fill("vendor-reject@example.com");
    await email.press("Enter");
    await page.waitForFunction(() => window.__lbflVendor.rejectedBeforeAJAX === 1);
    assert.equal(intercepted.length, 0);

    // First request remains pending until the test releases its network response.
    await email.fill("initial-success@example.com");
    await button.focus();
    await button.press("Enter");
    await waitForIntercepted(page, intercepted, 1);
    assert.equal(await button.isVisible(), false, "submit button hidden during AJAX");
    assert.equal(await loader.isVisible(), true, "loader shown during AJAX");
    await page.waitForFunction(() => document.activeElement === document.querySelector(".sib-loader"));
    assert.equal(await loader.evaluate((el) => el.getAttribute("tabindex")), "0",
      "loader enters keyboard flow");
    await email.press("Enter");
    await page.waitForTimeout(50);
    assert.equal(intercepted.length, 1, "double Enter makes only one AJAX request");
    await loader.focus();
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press(i % 2 ? "Shift+Tab" : "Tab");
      assert.equal(await page.evaluate(() =>
        !!document.activeElement.closest("#brevo-newsletter-modal")), true,
      "focus remains within the open modal");
    }
    // Focus loader immediately before fulfillment to verify handoff to restored button.
    await loader.focus();
    intercepted[0].release();
    await page.waitForFunction(() => window.__lbflVendor.completed === 1);
    await page.waitForFunction(() => document.activeElement ===
      document.querySelector('#sib-form button[type="submit"]'), null, { timeout: 3000 })
      .catch(async () => {
        const state = await page.evaluate(() => ({
          active: document.activeElement?.outerHTML?.slice(0, 180),
          buttonDisplay: document.querySelector('#sib-form button[type="submit"]')?.style.display,
          loaderDisplay: document.querySelector(".sib-loader")?.style.display,
          loaderTabIndex: document.querySelector(".sib-loader")?.tabIndex,
          vendorCompleted: window.__lbflVendor?.completed,
          modalHidden: document.querySelector("#brevo-newsletter-modal")?.hidden
        }));
        throw new Error("Loader-to-button focus restoration failed: " + JSON.stringify(state));
      });
    assert.equal(await button.isVisible(), true, "button returns after success");
    assert.equal(await loader.isVisible(), false, "loader disappears after success");
    assert.equal(await page.locator("#success-message").isVisible(), true,
      "success feedback shown");
    assert.equal(await page.evaluate(() => window.__lbflVendor.results[0]), "success");

    // 422 = vendor validation rejection after request; surface error and permit retry.
    await email.fill("validation-reject@example.com");
    await email.press("Enter");
    await waitForIntercepted(page, intercepted, 2);
    assert.equal(await loader.isVisible(), true);
    intercepted[1].release();
    await page.waitForFunction(() => window.__lbflVendor.completed === 2);
    assert.equal(await button.isVisible(), true);
    assert.equal(await loader.isVisible(), false);
    assert.equal(await page.locator("#error-message").isVisible(), true);
    assert.match(await page.locator("#error-message").innerText(), /Mock HTTP 422/);

    // 503 = server failure; actionable error with button/pending restoration.
    await email.fill("server-failure@example.com");
    await email.press("Enter");
    await waitForIntercepted(page, intercepted, 3);
    intercepted[2].release();
    await page.waitForFunction(() => window.__lbflVendor.completed === 3);
    assert.equal(await button.isVisible(), true);
    assert.equal(await loader.isVisible(), false);
    assert.match(await page.locator("#error-message").innerText(), /Mock HTTP 503/);

    // A successful corrected submission is allowed immediately after server failure.
    await email.fill("retry-success@example.com");
    await email.press("Enter");
    await waitForIntercepted(page, intercepted, 4);
    intercepted[3].release();
    await page.waitForFunction(() => window.__lbflVendor.completed === 4);
    assert.equal(await button.isVisible(), true);
    assert.equal(await loader.isVisible(), false);
    assert.equal(await page.locator("#success-message").isVisible(), true);
    assert.deepEqual(await page.evaluate(() => window.__lbflVendor.results),
      ["success", "failure", "failure", "success"]);
    assert.equal(await page.evaluate(() => window.__lbflVendor.requests), 4);

    // Regression: close and reopen while AJAX is still pending. Stale loader
    // focus intent must not steal focus from the reopened modal's email field.
    await email.fill("close-reopen@example.com");
    await button.focus();
    await button.press("Enter");
    await waitForIntercepted(page, intercepted, 5);
    await page.waitForFunction(() => document.activeElement === document.querySelector(".sib-loader"));
    await page.locator(".brevo-modal-close").click();
    assert.equal(await modal.isVisible(), false);
    await open.click();
    await page.waitForFunction(() => document.activeElement === document.querySelector("#EMAIL"));
    intercepted[4].release();
    await page.waitForFunction(() => window.__lbflVendor.completed === 5);
    await page.waitForTimeout(120);
    assert.equal(await email.evaluate((el) => document.activeElement === el), true,
      "reopened modal must retain email focus on in-flight completion");
    assert.equal(await button.isVisible(), true, "pending request restores the button");

    // Keyboard escape closes the dialog; no focus leak remains.
    await page.keyboard.press("Escape");
    assert.equal(await modal.isVisible(), false, "Escape closes newsletter modal");
    assert.equal(await open.evaluate((el) => document.activeElement === el), true,
      "close returns focus to opening control");
    assert.deepEqual(errors, [], "no uncaught browser JS errors");
    console.log("PASS: " + viewport.width + "x" + viewport.height +
      " invalid-email, consent, vendor rejection, single AJAX, delayed completion, 422, 503, retry, loader, close/reopen focus, Escape");
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await certifyViewport(browser, { width: 390, height: 844 });
    await certifyViewport(browser, { width: 1280, height: 800 });
    console.log("NEWSLETTER NETWORK-CONTROLLED CERTIFICATION PASS (mock only; no live subscription)");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error("NEWSLETTER NETWORK-CONTROLLED CERTIFICATION FAIL", error);
  process.exitCode = 1;
});
