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

const STORAGE_PREFIX = "lbfl-ielts-writing-lab:";
const ADS_REQUEST = /(?:adsbygoogle|pagead\.googlesyndication\.com|googleadservices\.com|doubleclick\.net)/i;

function argument(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const previewUrl = argument("--url").replace(/\/$/, "");
const expectedSha = argument("--expected-sha");
const outputDir = path.resolve(argument("--output-dir", "ielts-writing-browser-certification"));
const writingUrl = `${previewUrl}/ielts/writing/`;

if (!previewUrl || !expectedSha) {
  console.error("Usage: ielts-writing-browser-certification.mjs --url URL --expected-sha SHA [--output-dir DIR]");
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
  await page.waitForTimeout(1200);
  await page.locator("[data-ielts-writing-lab]").waitFor({ state: "visible", timeout: 10_000 });
}

async function axeViolations(page) {
  await page.evaluate(axe.source);
  return page.evaluate(async () => {
    const result = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    });
    return result.violations.map((violation) => ({
      help: violation.help,
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => ({ html: node.html, target: node.target })),
    }));
  });
}

async function keyboardCheck(page) {
  const seen = new Map();
  for (let index = 0; index < 180; index += 1) {
    await page.keyboard.press("Tab");
    const focus = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element || element === document.body) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        focusVisible: element.matches(":focus-visible"),
        id: element.id,
        inViewport: rect.bottom >= 0 && rect.top <= window.innerHeight && rect.right >= 0 && rect.left <= window.innerWidth,
        tag: element.tagName,
        outline: `${style.outlineStyle} ${style.outlineWidth}`,
      };
    });
    if (focus?.id) seen.set(focus.id, focus);
    if (["writingTaskSelect", "writingDurationSelect", "writingResponse", "writingModelToggle", "writingWeakestSentence"].every((id) => seen.has(id))) break;
  }
  const required = ["writingTaskSelect", "writingDurationSelect", "writingResponse", "writingModelToggle", "writingWeakestSentence"];
  return {
    focusSequence: [...seen.values()],
    passed: required.every((id) => {
      const item = seen.get(id);
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
    response = await page.goto(writingUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
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
        headingVisible: visible("#ielts-writing-title"),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        options: document.querySelectorAll("#writingTaskSelect option").length,
        responseVisible: visible("#writingResponse"),
        rootVisible: visible("[data-ielts-writing-lab]"),
        timer: document.querySelector("[data-writing-timer]")?.textContent?.trim(),
        viewport: { height: window.innerHeight, width: window.innerWidth },
      };
    });
    const axe = await axeViolations(page);
    const keyboard = await keyboardCheck(page);
    const layoutPassed = response?.status() === 200 &&
      layout.viewport.width === viewport.width && layout.viewport.height === viewport.height &&
      layout.rootVisible && layout.headingVisible && layout.responseVisible &&
      layout.options === 4 && layout.timer === "20:00" && !layout.horizontalOverflow;
    const passed = layoutPassed && axe.length === 0 && keyboard.passed &&
      adRequests(probe.requests).length === 0 && probe.consoleErrors.length === 0 && probe.pageErrors.length === 0;
    await page.screenshot({ fullPage: true, path: path.join(outputDir, `${viewport.name}.png`) });
    return {
      ...viewport,
      adsenseRequests: adRequests(probe.requests),
      axeViolations: axe,
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

async function runBehavior(browser) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  const probe = createProbe(page);
  const checks = {};
  try {
    await page.goto(writingUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });
    await settle(page);

    checks.fourPrompts = await page.locator("#writingTaskSelect option").count() === 4;
    checks.task1Threshold = (await page.locator("[data-writing-threshold]").textContent()).includes("150");
    await page.locator("#writingResponse").fill("one two three");
    checks.wordCount = (await page.locator("[data-writing-word-count]").textContent()).trim() === "3 words";
    await page.locator("#writingPlan").fill("A short practice plan.");
    await page.locator("[data-writing-duration]").selectOption("40");
    checks.timerChange = (await page.locator("[data-writing-timer]").textContent()).trim() === "40:00";
    await page.locator("[data-writing-model-toggle]").click();
    checks.modelReveal = await page.locator("[data-writing-model-toggle]").getAttribute("aria-expanded") === "true" &&
      await page.locator("[data-writing-model]").isVisible();
    for (const checkbox of await page.locator("[data-writing-check]").all()) await checkbox.check();
    checks.review = (await page.locator("[data-writing-review-summary]").textContent()).includes("4 of 4");
    await page.locator("[data-writing-save]").click();
    checks.localSave = await page.evaluate((prefix) => Object.keys(localStorage).some((key) => key.startsWith(prefix)), STORAGE_PREFIX);

    await page.locator("[data-writing-task]").selectOption("task-2-practical-skills");
    checks.task2Threshold = (await page.locator("[data-writing-threshold]").textContent()).includes("250");
    await page.locator("[data-writing-task]").selectOption("task-1-public-transport");
    checks.taskSwitch = (await page.locator("#writingResponse").inputValue()) === "one two three";
    await page.locator("[data-writing-start]").click();
    await page.waitForTimeout(1100);
    await page.locator("[data-writing-pause]").click();
    checks.timerPause = (await page.locator("[data-writing-timer-status]").textContent()).includes("paused");
    await page.locator("[data-writing-reset-timer]").click();
    checks.timerReset = (await page.locator("[data-writing-timer]").textContent()).trim() === "40:00";

    await page.reload({ waitUntil: "domcontentloaded" });
    await settle(page);
    await page.once("dialog", (dialog) => dialog.accept());
    await page.locator("[data-writing-reset-attempt]").click();
    checks.reset = (await page.locator("#writingResponse").inputValue()) === "" &&
      !(await page.evaluate((key) => Boolean(localStorage.getItem(key)), `${STORAGE_PREFIX}task-1-public-transport`));

    return {
      checks,
      consoleErrors: probe.consoleErrors,
      pageErrors: probe.pageErrors,
      passed: Object.values(checks).every(Boolean) && probe.consoleErrors.length === 0 && probe.pageErrors.length === 0,
    };
  } finally {
    await context.close();
  }
}

async function runReducedMotion(browser) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const probe = createProbe(page);
  try {
    await page.goto(writingUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    const state = await page.evaluate(() => {
      const seconds = (value) => value.split(",").map((part) => {
        const token = part.trim();
        return token.endsWith("ms") ? Number.parseFloat(token) / 1000 : Number.parseFloat(token) || 0;
      });
      const offenders = [];
      document.querySelectorAll(".ielts-writing *").forEach((element) => {
        const style = getComputedStyle(element);
        const longest = Math.max(0, ...seconds(style.animationDuration), ...seconds(style.transitionDuration));
        if (longest > 0.02) offenders.push({ className: element.className, duration: longest, tag: element.tagName });
      });
      return { mediaMatches: matchMedia("(prefers-reduced-motion: reduce)").matches, offenders };
    });
    return {
      ...state,
      consoleErrors: probe.consoleErrors,
      pageErrors: probe.pageErrors,
      passed: state.mediaMatches && state.offenders.length === 0 && probe.consoleErrors.length === 0 && probe.pageErrors.length === 0,
    };
  } finally {
    await context.close();
  }
}

async function runSaveData(browser) {
  const context = await browser.newContext({
    extraHTTPHeaders: { "Save-Data": "on" },
    viewport: { width: 375, height: 812 },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } });
  });
  const page = await context.newPage();
  const probe = createProbe(page);
  try {
    await page.goto(writingUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    const state = await page.evaluate(() => ({
      navigatorSaveData: Boolean(navigator.connection?.saveData),
      rootVisible: Boolean(document.querySelector("[data-ielts-writing-lab]")),
    }));
    const documentRequest = probe.requests.find((request) => request.resourceType === "document");
    return {
      ...state,
      adsenseRequests: adRequests(probe.requests),
      consoleErrors: probe.consoleErrors,
      header: documentRequest?.headers?.["save-data"] || "",
      pageErrors: probe.pageErrors,
      passed: state.navigatorSaveData && state.rootVisible && documentRequest?.headers?.["save-data"] === "on" &&
        adRequests(probe.requests).length === 0 && probe.consoleErrors.length === 0 && probe.pageErrors.length === 0,
    };
  } finally {
    await context.close();
  }
}

function markdown(report) {
  const lines = [
    "# IELTS Writing Exact-Head Browser Certification",
    "",
    `- Expected SHA: \`${report.expectedSha}\``,
    `- Preview: ${report.previewUrl}`,
    `- Route: ${report.route}`,
    `- Generated: ${report.generatedAt}`,
    `- Overall: **${report.passed ? "PASS" : "FAIL"}**`,
    "",
    "| Viewport | Layout | Axe | Keyboard | Ad requests | Console/page errors | Result |",
    "|---|---:|---:|---:|---:|---:|---:|",
  ];
  report.viewports.forEach((result) => lines.push(
    `| ${result.name} | ${result.layoutPassed ? "PASS" : "FAIL"} | ${result.axeViolations.length} | ${result.focusPassed ? "PASS" : "FAIL"} | ${result.adsenseRequests.length} | ${result.consoleErrors.length + result.pageErrors.length} | ${result.passed ? "PASS" : "FAIL"} |`
  ));
  lines.push(
    "",
    `- Functional Writing Lab checks: **${report.behavior.passed ? "PASS" : "FAIL"}**`,
    `- Reduced motion: **${report.reducedMotion.passed ? "PASS" : "FAIL"}**`,
    `- Save-Data: **${report.saveData.passed ? "PASS" : "FAIL"}**`,
    "",
  );
  return lines.join("\n");
}

const browser = await chromium.launch({ headless: true });
let report;
try {
  const viewports = [];
  for (const viewport of VIEWPORTS) viewports.push(await runViewport(browser, viewport));
  const behavior = await runBehavior(browser);
  const reducedMotion = await runReducedMotion(browser);
  const saveData = await runSaveData(browser);
  report = {
    behavior,
    expectedSha,
    generatedAt: new Date().toISOString(),
    passed: viewports.every((result) => result.passed) && behavior.passed && reducedMotion.passed && saveData.passed,
    previewUrl,
    reducedMotion,
    route: "/ielts/writing/",
    saveData,
    viewports,
  };
} finally {
  await browser.close();
}

await fs.writeFile(path.join(outputDir, "ielts-writing-browser-certification.json"), `${JSON.stringify(report, null, 2)}\n`);
await fs.writeFile(path.join(outputDir, "ielts-writing-browser-certification.md"), `${markdown(report)}\n`);
console.log(markdown(report));
process.exit(report.passed ? 0 : 1);
