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

const STORAGE_KEY = "lbfl-ielts-speaking-simulator:v1";
const ADS_REQUEST = /(?:adsbygoogle|pagead2\.googlesyndication\.com|googleadservices\.com|doubleclick\.net)/i;

function argument(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const previewUrl = argument("--url").replace(/\/$/, "");
const expectedSha = argument("--expected-sha");
const outputDir = path.resolve(argument("--output-dir", "ielts-speaking-browser-certification"));
const speakingUrl = `${previewUrl}/ielts/speaking/`;

if (!previewUrl || !expectedSha) {
  console.error("Usage: ielts-speaking-browser-certification.mjs --url URL --expected-sha SHA [--output-dir DIR]");
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
  await page.locator("[data-ielts-speaking-simulator]").waitFor({ state: "visible", timeout: 10_000 });
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
  const required = [
    "speakingPartSelect",
    "speakingNewPrompt",
    "speakingPlan",
    "speaking-start",
    "speaking-reset-timer",
    "speakingNotes",
    "speaking-check-fluency",
    "speakingReflection",
    "speaking-save",
    "speaking-retry",
    "speaking-reset",
  ];
  const seen = new Map();

  for (let index = 0; index < 220; index += 1) {
    await page.keyboard.press("Tab");
    const focus = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element || element === document.body) return null;

      const dataAttributes = [
        "data-speaking-start",
        "data-speaking-reset-timer",
        "data-speaking-save",
        "data-speaking-retry",
        "data-speaking-reset",
      ];
      const marker = dataAttributes.find((attribute) => element.hasAttribute(attribute));
      const key = element.id || (marker ? marker.replace("data-", "") : "");
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);

      return {
        focusVisible: element.matches(":focus-visible"),
        inViewport: rect.bottom >= 0 && rect.top <= window.innerHeight && rect.right >= 0 && rect.left <= window.innerWidth,
        key,
        outline: `${style.outlineStyle} ${style.outlineWidth}`,
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
    response = await page.goto(speakingUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
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
        checklistItems: document.querySelectorAll("[data-speaking-check]").length,
        headingVisible: visible("#ielts-speaking-title"),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        modeOptions: document.querySelectorAll("#speakingPartSelect option").length,
        notesVisible: visible("#speakingNotes"),
        planVisible: visible("#speakingPlan"),
        rootVisible: visible("[data-ielts-speaking-simulator]"),
        timer: document.querySelector("[data-speaking-timer]")?.textContent?.trim(),
        timerPhase: document.querySelector("[data-speaking-timer-phase]")?.textContent?.trim(),
        viewport: { height: window.innerHeight, width: window.innerWidth },
      };
    });

    const axe = await axeViolations(page);
    const keyboard = await keyboardCheck(page);
    const layoutPassed = response?.status() === 200 &&
      layout.viewport.width === viewport.width && layout.viewport.height === viewport.height &&
      layout.rootVisible && layout.headingVisible && layout.planVisible && layout.notesVisible &&
      layout.modeOptions === 3 && layout.checklistItems === 4 &&
      layout.timer === "00:45" && layout.timerPhase === "Response" && !layout.horizontalOverflow;
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

async function setStoredState(page, transform) {
  await page.evaluate(({ key, transformSource }) => {
    const current = JSON.parse(localStorage.getItem(key) || "null");
    if (!current) throw new Error(`Missing ${key} state`);
    const transformFunction = eval(`(${transformSource})`);
    localStorage.setItem(key, JSON.stringify(transformFunction(current)));
  }, { key: STORAGE_KEY, transformSource: transform.toString() });
}

async function runBehavior(browser) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  const probe = createProbe(page);
  const checks = {};

  try {
    await page.goto(speakingUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });
    await settle(page);

    checks.threeModes = await page.locator("#speakingPartSelect option").count() === 3;
    checks.fourCriteria = await page.locator("[data-speaking-check]").count() === 4;
    checks.initialTimer = (await page.locator("[data-speaking-timer]").textContent()).trim() === "00:45" &&
      (await page.locator("[data-speaking-timer-phase]").textContent()).trim() === "Response";

    await page.locator("#speakingPlan").fill("Plan alpha with one example.");
    await page.locator("#speakingNotes").fill("Paused once before the example.");
    await page.locator("#speakingReflection").fill("State the main point before the example.");
    await page.locator("#speaking-check-fluency").check();
    await page.locator("#speaking-check-lexical").check();
    await page.locator("[data-speaking-save]").click();

    checks.localSave = await page.evaluate((key) => Boolean(localStorage.getItem(key)), STORAGE_KEY);
    await page.reload({ waitUntil: "domcontentloaded" });
    await settle(page);
    checks.reloadRestore = await page.locator("#speakingPlan").inputValue() === "Plan alpha with one example." &&
      await page.locator("#speakingNotes").inputValue() === "Paused once before the example." &&
      await page.locator("#speakingReflection").inputValue() === "State the main point before the example." &&
      await page.locator("#speaking-check-fluency").isChecked() &&
      await page.locator("#speaking-check-lexical").isChecked();

    const firstTopic = (await page.locator("[data-speaking-topic]").textContent()).trim();
    await page.locator("#speakingNewPrompt").click();
    const secondTopic = (await page.locator("[data-speaking-topic]").textContent()).trim();
    checks.promptSwitch = Boolean(firstTopic && secondTopic && firstTopic !== secondTopic);

    await page.locator("#speakingPartSelect").selectOption("part1");
    await page.locator("[data-speaking-start]").click();
    await page.waitForTimeout(1150);
    await page.locator("[data-speaking-pause]").click();
    const pausedTimer = (await page.locator("[data-speaking-timer]").textContent()).trim();
    checks.timerPause = (await page.locator("[data-speaking-timer-status]").textContent()).toLowerCase().includes("paused") &&
      pausedTimer !== "00:45";
    await page.locator("[data-speaking-reset-timer]").click();
    checks.timerReset = (await page.locator("[data-speaking-timer]").textContent()).trim() === "00:45" &&
      (await page.locator("[data-speaking-timer-phase]").textContent()).trim() === "Response";

    await page.locator("#speakingPartSelect").selectOption("part2");
    checks.part2Initial = (await page.locator("[data-speaking-timer]").textContent()).trim() === "01:00" &&
      (await page.locator("[data-speaking-timer-phase]").textContent()).trim() === "Preparation";

    await setStoredState(page, (current) => ({ ...current, part: "part2", phaseIndex: 0, remaining: 1 }));
    await page.reload({ waitUntil: "domcontentloaded" });
    await settle(page);
    await page.locator("[data-speaking-start]").click();
    await page.waitForFunction(() => document.querySelector("[data-speaking-timer-phase]")?.textContent?.trim() === "Speaking", null, { timeout: 5_000 });
    await page.locator("[data-speaking-pause]").click();
    checks.part2Transition = (await page.locator("[data-speaking-timer-phase]").textContent()).trim() === "Speaking" &&
      (await page.locator("[data-speaking-timer]").textContent()).trim().startsWith("01:") ||
      (await page.locator("[data-speaking-timer]").textContent()).trim() === "02:00";

    await setStoredState(page, (current) => ({ ...current, part: "part2", phaseIndex: 1, remaining: 1 }));
    await page.reload({ waitUntil: "domcontentloaded" });
    await settle(page);
    await page.locator("[data-speaking-start]").click();
    await page.waitForFunction(() => document.activeElement?.id === "speakingNotes", null, { timeout: 5_000 });
    checks.part2Completion = (await page.locator("[data-speaking-timer]").textContent()).trim() === "00:00" &&
      (await page.locator("[data-speaking-timer-status]").textContent()).includes("Time is up") &&
      await page.locator("#speakingNotes").evaluate((element) => element === document.activeElement);

    const retryTopic = (await page.locator("[data-speaking-topic]").textContent()).trim();
    await page.locator("#speakingPlan").fill("Keep this plan for the retry.");
    await page.locator("#speaking-check-fluency").check();
    await page.locator("[data-speaking-retry]").click();
    checks.retry = (await page.locator("[data-speaking-attempt]").textContent()).trim() === "Attempt 2" &&
      (await page.locator("[data-speaking-topic]").textContent()).trim() === retryTopic &&
      await page.locator("#speakingPlan").inputValue() === "Keep this plan for the retry." &&
      !(await page.locator("#speaking-check-fluency").isChecked()) &&
      (await page.locator("[data-speaking-timer]").textContent()).trim() === "01:00" &&
      (await page.locator("[data-speaking-timer-phase]").textContent()).trim() === "Preparation" &&
      await page.locator("#speakingPlan").evaluate((element) => element === document.activeElement);

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
    await page.goto(speakingUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    const state = await page.evaluate(() => {
      const seconds = (value) => value.split(",").map((part) => {
        const token = part.trim();
        return token.endsWith("ms") ? Number.parseFloat(token) / 1000 : Number.parseFloat(token) || 0;
      });
      const offenders = [];
      document.querySelectorAll(".ielts-speaking *").forEach((element) => {
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
    await page.goto(speakingUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    const state = await page.evaluate(() => ({
      navigatorSaveData: Boolean(navigator.connection?.saveData),
      rootVisible: Boolean(document.querySelector("[data-ielts-speaking-simulator]")),
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
    "# IELTS Speaking Exact-Head Browser Certification",
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
    `- Functional Speaking Simulator checks: **${report.behavior.passed ? "PASS" : "FAIL"}**`,
    `- Reduced motion: **${report.reducedMotion.passed ? "PASS" : "FAIL"}**`,
    `- Save-Data: **${report.saveData.passed ? "PASS" : "FAIL"}**`,
    "",
  );

  for (const [name, passed] of Object.entries(report.behavior.checks)) {
    lines.push(`- ${name}: **${passed ? "PASS" : "FAIL"}**`);
  }

  lines.push("");
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
    route: "/ielts/speaking/",
    saveData,
    viewports,
  };
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(outputDir, "ielts-speaking-browser-certification.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await fs.writeFile(
  path.join(outputDir, "ielts-speaking-browser-certification.md"),
  `${markdown(report)}\n`,
);

console.log(markdown(report));
if (!report.passed) process.exit(1);
