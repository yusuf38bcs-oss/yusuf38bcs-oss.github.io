#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const VIEWPORTS = [
  { name: "mobile-320x800", width: 320, height: 800 },
  { name: "mobile-375x812", width: 375, height: 812 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "laptop-1024x768", width: 1024, height: 768 },
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "large-1920x1080", width: 1920, height: 1080 },
];

const STORAGE_KEY = "lbfl-ielts-reading-trainer:v1";
const PENDING_STATE_PATCH_KEY = "__lbfl-reading-certification-state-patch";
const ADS_REQUEST = /(?:adsbygoogle|pagead2\.googlesyndication\.com|googleadservices\.com|doubleclick\.net)/i;

function argument(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const previewUrl = argument("--url").replace(/\/$/, "");
const expectedSha = argument("--expected-sha");
const outputDir = path.resolve(argument("--output-dir", "ielts-reading-browser-certification"));
const readingUrl = `${previewUrl}/ielts/reading/`;

if (!previewUrl || !expectedSha) {
  console.error("Usage: ielts-reading-browser-certification.mjs --url URL --expected-sha SHA [--output-dir DIR]");
  process.exit(2);
}

await fs.mkdir(outputDir, { recursive: true });

function createProbe(page) {
  const requests = [];
  const consoleErrors = [];
  const pageErrors = [];

  page.on("request", (request) => requests.push({
    headers: request.headers(),
    resourceType: request.resourceType(),
    url: request.url(),
  }));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(String(error)));

  return { requests, consoleErrors, pageErrors };
}

function adRequests(requests) {
  return requests.filter((request) => ADS_REQUEST.test(request.url));
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(900);
  try {
    await page.locator("[data-ielts-reading-trainer]").waitFor({ state: "visible", timeout: 10_000 });
  } catch (err) {
    // If the main root isn't visible, continue — tests will catch missing elements later.
    console.warn("settle: trainer root not visible:", String(err));
  }
}

async function axeViolations(page) {
  try {
    if (!axe || !axe.source) return [];
    await page.evaluate(axe.source);
    return await page.evaluate(async () => {
      try {
        const result = await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
        });
        return result.violations.map((violation) => ({
          help: violation.help,
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.map((node) => ({ html: node.html, target: node.target })),
        }));
      } catch (err) {
        // If axe.run fails in the page context, return a single diagnostic violation so the report flags it.
        return [{ help: `axe.run failed: ${String(err)}`, id: "axe-run-failure", impact: "critical", nodes: [] }];
      }
    });
  } catch (err) {
    // If injecting axe fails, return a diagnostic violation entry. This keeps the contract of returning an array.
    return [{ help: `axe injection failed: ${String(err)}`, id: "axe-inject-failure", impact: "critical", nodes: [] }];
  }
}

async function keyboardCheck(page) {
  const required = [
    "readingSetSelect",
    "reading-new-set",
    "reading-start",
    "reading-reset-timer",
    "reading-heat-q1-0",
    "reading-submit",
    "reading-retry",
  ];
  const seen = new Map();

  for (let index = 0; index < 240; index += 1) {
    await page.keyboard.press("Tab");
    const focus = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element || element === document.body) return null;

      const dataAttributes = [
        "data-reading-new-set",
        "data-reading-start",
        "data-reading-reset-timer",
        "data-reading-submit",
        "data-reading-retry",
      ];
      const marker = dataAttributes.find((attribute) => element.hasAttribute(attribute));
      const key = element.id || (marker ? marker.replace("data-", "") : "");
      const rect = element.getBoundingClientRect();

      return {
        focusVisible: element.matches(":focus-visible"),
        inViewport: rect.bottom >= 0 && rect.top <= window.innerHeight && rect.right >= 0 && rect.left <= window.innerWidth,
        key,
        tag: element.tagName,
      };
    });

    if (focus?.key) seen.set(focus.key, focus);
    if (required.every((key) => seen.has(key))) break;
  }

  return {
    focusSequence: [...seen.values()],
    passed: required.every((key) => {
      const item = seen.get(key);
      return item?.focusVisible && item.inViewport;
    }),
  };
}

async function runViewport(browser, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
  const page = await context.newPage();
  const probe = createProbe(page);
  let response;

  try {
    response = await page.goto(readingUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);

    const layout = await page.evaluate(() => {
      const visible = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };

      return {
        headingVisible: visible("#ielts-reading-title"),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        passageParagraphs: document.querySelectorAll("[data-reading-passage] p").length,
        passageVisible: visible("[data-reading-passage]"),
        questionCount: document.querySelectorAll("[data-reading-question]").length,
        resultHidden: document.querySelector("[data-reading-result]")?.hidden === true,
        rootVisible: visible("[data-ielts-reading-trainer]"),
        setOptions: document.querySelectorAll("#readingSetSelect option").length,
        timer: document.querySelector("[data-reading-timer]")?.textContent?.trim(),
        viewport: { height: window.innerHeight, width: window.innerWidth },
      };
    });

    const axeReport = await axeViolations(page);
    const keyboard = await keyboardCheck(page);
    const layoutPassed = response?.status() === 200 &&
      layout.viewport.width === viewport.width && layout.viewport.height === viewport.height &&
      layout.rootVisible && layout.headingVisible && layout.passageVisible &&
      layout.passageParagraphs === 4 && layout.questionCount === 6 && layout.setOptions === 3 &&
      layout.timer === "20:00" && layout.resultHidden && !layout.horizontalOverflow;
    const passed = layoutPassed && Array.isArray(axeReport) && axeReport.length === 0 && keyboard.passed &&
      adRequests(probe.requests).length === 0 && probe.consoleErrors.length === 0 && probe.pageErrors.length === 0;

    await page.screenshot({ fullPage: true, path: path.join(outputDir, `${viewport.name}.png`) });

    return {
      ...viewport,
      adsenseRequests: adRequests(probe.requests),
      axeViolations: axeReport,
      consoleErrors: probe.consoleErrors,
      focusPassed: keyboard.passed,
      focusSequence: keyboard.focusSequence,
      layout,
      layoutPassed,
      pageErrors: probe.pageErrors,
      passed,
      status: response?.status() || 0,
    };
  } finally {
    await context.close();
  }
}

async function installStoredStatePatchBridge(page) {
  await page.addInitScript(({ pendingKey, storageKey }) => {
    try {
      const rawPatch = sessionStorage.getItem(pendingKey);
      if (!rawPatch) return;

      sessionStorage.removeItem(pendingKey);
      const currentRaw = localStorage.getItem(storageKey);
      const current = currentRaw ? JSON.parse(currentRaw) : {};
      const patch = JSON.parse(rawPatch);
      localStorage.setItem(storageKey, JSON.stringify({ ...current, ...patch }));
    } catch (err) {
      // Don't throw — make the probe resilient. Log a warning so the probe captures it if possible.
      try { console.warn('installStoredStatePatchBridge: failed to apply patch', String(err)); } catch (_) {}
    }
  }, { pendingKey: PENDING_STATE_PATCH_KEY, storageKey: STORAGE_KEY });
}

async function queueStoredStatePatch(page, patch) {
  await page.evaluate(({ pendingKey, patchValue }) => {
    sessionStorage.setItem(pendingKey, JSON.stringify(patchValue));
  }, { pendingKey: PENDING_STATE_PATCH_KEY, patchValue: patch });
}

async function runBehavior(browser) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  const probe = createProbe(page);
  const checks = {};

  try {
    await installStoredStatePatchBridge(page);
    await page.goto(readingUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });
    await settle(page);

    checks.threeSets = await page.locator("#readingSetSelect option").count() === 3;
    checks.sixQuestions = await page.locator("[data-reading-question]").count() === 6;
    checks.initialTimer = (await page.locator("[data-reading-timer]").textContent()).trim() === "20:00";

    await page.locator('[data-reading-question="heat-q1"] input').nth(0).check();
    await page.locator('[data-reading-question="heat-q2"] input').nth(0).check();
    await page.locator('[data-reading-question="heat-q3"] input').nth(2).check();
    await page.locator('[data-reading-question="heat-q4"] input').nth(1).check();
    await page.locator('[data-reading-question="heat-q5"] input').nth(1).check();
    await page.locator('[data-reading-question="heat-q6"] input').nth(2).check();

    checks.answerAutosave = await page.evaluate((key) => {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      return saved?.answers?.["heat-q1"] === "True";
    }, STORAGE_KEY);

    await page.locator("[data-reading-submit]").click();
    checks.rawScore = (await page.locator("[data-reading-result-summary]").textContent()).includes("5 of 6 correct");
    checks.feedbackVisible = await page.locator("[data-reading-feedback]").count() === 6 &&
      await page.locator(".ielts-reading__question.is-incorrect").count() === 1;
    checks.errorLogged = (await page.locator("[data-reading-error-count]").textContent()).trim() === "1 saved error" &&
      await page.locator("[data-reading-error-list] li").count() === 1;

    await page.reload({ waitUntil: "domcontentloaded" });
    await settle(page);
    checks.reloadRestore = !(await page.locator("[data-reading-result]").isHidden()) &&
      (await page.locator("[data-reading-result-summary]").textContent()).includes("5 of 6 correct") &&
      (await page.locator("[data-reading-error-count]").textContent()).trim() === "1 saved error";

    await page.locator("[data-reading-retry]").click();
    checks.retry = (await page.locator("[data-reading-attempt]").textContent()).trim() === "Attempt 2" &&
      (await page.locator("[data-reading-timer]").textContent()).trim() === "20:00" &&
      await page.locator("[data-reading-result]").isHidden() &&
      !(await page.locator('[data-reading-question="heat-q1"] input').nth(0).isChecked());

    await queueStoredStatePatch(page, { remaining: 6, submitted: false });
    await page.reload({ waitUntil: "domcontentloaded" });
    await settle(page);
    await page.locator("[data-reading-start]").click();
    await page.evaluate(() => {
      try {
        const originalNow = performance.now;
        Object.defineProperty(performance, "now", {
          configurable: true,
          value: () => originalNow() + 3500,
        });
        // keep a reference so we can restore later
        window.__original_performance_now = originalNow;
      } catch (err) {
        // ignore if we can't override
      }
      document.dispatchEvent(new Event("visibilitychange"));
    });
    checks.elapsedTimeCatchUp = (await page.locator("[data-reading-timer]").textContent()).trim() === "00:03";
    await page.locator("[data-reading-pause]").click();
    await page.evaluate(() => {
      try {
        if (window.__original_performance_now) {
          Object.defineProperty(performance, "now", {
            configurable: true,
            value: window.__original_performance_now,
          });
          delete window.__original_performance_now;
        }
      } catch (err) {
        // ignore restore failures
      }
    });
    await page.locator("[data-reading-reset-timer]").click();
    checks.timerReset = (await page.locator("[data-reading-timer]").textContent()).trim() === "20:00";

    const firstTitle = (await page.locator("[data-reading-title]").textContent()).trim();
    await page.locator("#readingSetSelect").selectOption("retrieval-learning");
    const secondTitle = (await page.locator("[data-reading-title]").textContent()).trim();
    checks.setSwitch = Boolean(firstTitle && secondTitle && firstTitle !== secondTitle) &&
      await page.locator("[data-reading-question]").count() === 6 &&
      (await page.locator("[data-reading-timer]").textContent()).trim() === "20:00";

    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("[data-reading-clear-errors]").click();
    checks.clearErrorLog = (await page.locator("[data-reading-error-count]").textContent()).trim() === "0 saved errors" &&
      await page.locator("[data-reading-error-list] li").count() === 0;

    const passed = Object.values(checks).every(Boolean) &&
      adRequests(probe.requests).length === 0 && probe.consoleErrors.length === 0 && probe.pageErrors.length === 0;

    return {
      adsenseRequests: adRequests(probe.requests),
      checks,
      consoleErrors: probe.consoleErrors,
      pageErrors: probe.pageErrors,
      passed,
    };
  } finally {
    await context.close();
  }
}

async function runReducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const probe = createProbe(page);

  try {
    const response = await page.goto(readingUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    const result = await page.evaluate(() => {
      const root = document.querySelector("[data-ielts-reading-trainer]");
      const option = document.querySelector(".ielts-reading__option");
      return {
        mediaMatches: matchMedia("(prefers-reduced-motion: reduce)").matches,
        rootVisible: Boolean(root && root.getBoundingClientRect().height > 0),
        transitionDuration: option ? getComputedStyle(option).transitionDuration : "",
      };
    });

    return {
      ...result,
      adsenseRequests: adRequests(probe.requests),
      consoleErrors: probe.consoleErrors,
      pageErrors: probe.pageErrors,
      passed: response?.status() === 200 && result.mediaMatches && result.rootVisible &&
        adRequests(probe.requests).length === 0 && probe.consoleErrors.length === 0 && probe.pageErrors.length === 0,
    };
  } finally {
    await context.close();
  }
}

async function runSaveData(browser) {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    extraHTTPHeaders: { "Save-Data": "on" },
  });
  const page = await context.newPage();
  const probe = createProbe(page);

  await page.addInitScript(() => {
    try {
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: { saveData: true },
      });
    } catch (_) {
      // The HTTP header remains the authoritative Save-Data signal for this probe.
    }
  });

  try {
    const response = await page.goto(readingUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    const state = await page.evaluate(() => ({
      navigatorSaveData: navigator.connection?.saveData === true,
      rootVisible: Boolean(document.querySelector("[data-ielts-reading-trainer]")?.getBoundingClientRect().height),
    }));
    const documentRequest = probe.requests.find((request) => request.resourceType === "document");
    const header = documentRequest?.headers?.["save-data"] || documentRequest?.headers?.["Save-Data"] || "";

    return {
      ...state,
      adsenseRequests: adRequests(probe.requests),
      consoleErrors: probe.consoleErrors,
      header,
      pageErrors: probe.pageErrors,
      passed: response?.status() === 200 && state.navigatorSaveData && state.rootVisible && header === "on" &&
        adRequests(probe.requests).length === 0 && probe.consoleErrors.length === 0 && probe.pageErrors.length === 0,
    };
  } finally {
    await context.close();
  }
}

function markdownReport(report) {
  const rows = report.viewports.map((item) => (
    `| ${item.name} | ${item.layoutPassed ? "PASS" : "FAIL"} | ${item.axeViolations.length} | ${item.focusPassed ? "PASS" : "FAIL"} | ${item.adsenseRequests.length} | ${item.consoleErrors.length + item.pageErrors.length} | ${item.passed ? "PASS" : "FAIL"} |`
  )).join("\n");

  const behaviorRows = Object.entries(report.behavior.checks)
    .map(([key, value]) => `- ${key}: **${value ? "PASS" : "FAIL"}**`)
    .join("\n");

  return `# IELTS Reading Exact-Head Browser Certification\\n\\n` +
    `- Expected SHA: \`${report.expectedSha}\`\\n` +
    `- Preview: ${report.previewUrl}\\n` +
    `- Route: /ielts/reading/\\n` +
    `- Generated: ${report.generatedAt}\\n` +
    `- Overall: **${report.passed ? "PASS" : "FAIL"}**\\n\\n` +
    `| Viewport | Layout | Axe | Keyboard | Ad requests | Console/page errors | Result |\\n` +
    `|---|---:|---:|---:|---:|---:|---:|\\n${rows}\\n\\n` +
    `- Functional Reading Trainer checks: **${report.behavior.passed ? "PASS" : "FAIL"}**\\n` +
    `- Reduced motion: **${report.reducedMotion.passed ? "PASS" : "FAIL"}**\\n` +
    `- Save-Data: **${report.saveData.passed ? "PASS" : "FAIL"}**\\n\\n` +
    `${behaviorRows}\\n`;
}

const browser = await chromium.launch({ headless: true });
let report;

try {
  const viewports = [];
  for (const viewport of VIEWPORTS) {
    viewports.push(await runViewport(browser, viewport));
  }

  const behavior = await runBehavior(browser);
  const reducedMotion = await runReducedMotion(browser);
  const saveData = await runSaveData(browser);
  const passed = viewports.every((item) => item.passed) && behavior.passed && reducedMotion.passed && saveData.passed;

  report = {
    behavior,
    expectedSha,
    generatedAt: new Date().toISOString(),
    passed,
    previewUrl,
    reducedMotion,
    route: "/ielts/reading/",
    saveData,
    viewports,
  };
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(outputDir, "ielts-reading-browser-certification.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);
await fs.writeFile(
  path.join(outputDir, "ielts-reading-browser-certification.md"),
  markdownReport(report),
  "utf8",
);

console.log(markdownReport(report));
if (!report.passed) process.exit(1);
