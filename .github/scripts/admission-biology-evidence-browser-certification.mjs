#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const baseUrl = "http://127.0.0.1:4000";
const outputDir = "admission-biology-evidence-report";

const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

const routes = [
  { route: "/admission/", kind: "hub" },
  ...Array.from({ length: 7 }, (_, index) => ({
    route: `/admission/day-${index + 1}/`,
    kind: "day",
    day: index + 1,
  })),
  { route: "/admission/foundation-model-test-01/", kind: "model-test" },
  { route: "/admission/biology/", kind: "index" },
  { route: "/admission/biology/du/2016-17/", kind: "paper", exam: "DU", v2Questions: 0 },
  { route: "/admission/biology/medical/2016-17/", kind: "paper", exam: "Medical", v2Questions: 22 },
];

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
}

async function keyboardProbe(page) {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo(0, 0);
    const scope = document.querySelector("main") || document.body;
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
    let index = 0;
    for (const el of scope.querySelectorAll(selector)) {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const visible =
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || 1) > 0 &&
        rect.width > 0 &&
        rect.height > 0;
      if (visible) el.dataset.keyboardProbeId = `kb-${index++}`;
    }
  });

  const expected = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[data-keyboard-probe-id]")).map((el) => el.dataset.keyboardProbeId)
  );
  if (expected.length === 0) return false;

  const visited = new Set();
  const limit = expected.length * 3 + 20;
  for (let i = 0; i < limit; i += 1) {
    await page.keyboard.press("Tab");
    const result = await page.evaluate(() => {
      const el = document.activeElement;
      if (!(el instanceof HTMLElement)) return null;
      const id = el.dataset.keyboardProbeId;
      if (!id) return null;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        id,
        visible: rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none",
        focusVisible: el.matches(":focus-visible"),
      };
    });
    if (result?.id && result.visible && result.focusVisible) visited.add(result.id);
    if (visited.size === expected.length) break;
  }

  await page.evaluate(() => {
    document.querySelectorAll("[data-keyboard-probe-id]").forEach((el) => delete el.dataset.keyboardProbeId);
  });
  return visited.size === expected.length;
}

async function inspect(page, spec, responseStatus) {
  return page.evaluate(({ spec, responseStatus }) => {
    const root = document.documentElement;
    const body = document.body;
    const text = body.innerText || "";
    const forbidden = [
      /officially verified/i,
      /\bF-V2\b/i,
      /final\s+Matrix/i,
      /\bQYI\b/i,
    ].filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);

    const result = {
      responseStatus,
      documentOverflow: root.scrollWidth > innerWidth + 2 || body.scrollWidth > innerWidth + 2,
      forbidden,
      stale237: /PR\s*#237/i.test(text),
      routeContract: true,
      sourceIntegrity: true,
      questionCount: null,
      v2QuestionCount: null,
      status: null,
      permanentQuestionIds: null,
    };

    if (spec.kind === "hub") {
      result.routeContract = Boolean(
        document.querySelector('a[href="/admission/day-1/"], a[href$="/admission/day-1/"]') &&
        document.querySelector('a[href="/admission/foundation-model-test-01/"], a[href$="/admission/foundation-model-test-01/"]') &&
        document.querySelector('a[href="/admission/biology/"], a[href$="/admission/biology/"]')
      );
      return result;
    }

    if (spec.kind === "day") {
      const complete = document.querySelector(`[data-admission-complete="${spec.day}"]`);
      const expectedNext = spec.day < 7
        ? `/admission/day-${spec.day + 1}/`
        : "/admission/foundation-model-test-01/";
      result.routeContract = Boolean(
        complete &&
        document.querySelector(`a[href="${expectedNext}"], a[href$="${expectedNext}"]`)
      );
      return result;
    }

    if (spec.kind === "model-test") {
      const form = document.querySelector('[data-admission-quiz][data-test-id="admission-foundation-01"]');
      const questions = Array.from(document.querySelectorAll("fieldset[data-question-id]"));
      const ids = questions.map((q) => q.dataset.questionId || "");
      const topics = questions.map((q) => q.dataset.topicId || "");
      const sources = questions.map((q) => q.dataset.sourceRef || "");
      const sourceStates = questions.map((q) => q.dataset.sourceStatus || "");
      const names = questions.map((q) => {
        const radio = q.querySelector('input[type="radio"]');
        return radio?.getAttribute("name") || "";
      });
      const q20 = document.querySelector('[data-question-id="admission-foundation-01-q20"] legend')?.textContent || "";
      const permanentUnique = ids.length === 30 && new Set(ids).size === 30;
      const namesUnique = names.length === 30 && new Set(names).size === 30 && names.every(Boolean);
      result.questionCount = questions.length;
      result.permanentQuestionIds = permanentUnique;
      result.sourceIntegrity =
        topics.every(Boolean) &&
        sources.every((source) => source.startsWith("NCTB-HSC-")) &&
        sourceStates.every((state) => state === "topic-aligned-primary-page-verification-pending");
      result.routeContract = Boolean(
        form &&
        permanentUnique &&
        namesUnique &&
        result.sourceIntegrity &&
        /For\s+x²\s*\+\s*y²\s*=\s*25/i.test(q20) &&
        !/For\s+y\s*=\s*x²\s*\+\s*y²\s*=\s*25/i.test(q20) &&
        document.querySelector("[data-foundation-source-boundary]") &&
        /recommended 15-minute target/i.test(text)
      );
      return result;
    }

    if (spec.kind === "index") {
      result.routeContract = Boolean(
        document.querySelector('a[href*="/admission/biology/du/2016-17/"]') &&
        document.querySelector('a[href*="/admission/biology/medical/2016-17/"]')
      );
      return result;
    }

    const evidence = document.querySelector("[data-admission-evidence]");
    const questions = Array.from(document.querySelectorAll(".admission-evidence__question"));
    const sourceLinks = Array.from(document.querySelectorAll(".admission-evidence__source-links a, .admission-evidence__source h3 a"));
    const v2Count = document.querySelectorAll('[data-question-verification="V2"]').length;

    result.questionCount = questions.length;
    result.v2QuestionCount = v2Count;
    result.status = evidence ? {
      exam: evidence.dataset.exam,
      paperState: evidence.dataset.paperState,
      verification: evidence.dataset.verificationStatus,
      recordCount: evidence.dataset.recordCount,
      matrixRelease: evidence.dataset.matrixRelease,
    } : null;

    result.sourceIntegrity =
      sourceLinks.length > 0 &&
      sourceLinks.every((anchor) => /^https?:\/\//i.test(anchor.getAttribute("href") || ""));

    result.routeContract = Boolean(
      evidence &&
      evidence.dataset.exam === spec.exam &&
      evidence.dataset.paperState === "F-S2" &&
      evidence.dataset.verificationStatus === "V1" &&
      evidence.dataset.recordCount === "30" &&
      evidence.dataset.matrixRelease === "false" &&
      questions.length === 30 &&
      v2Count === spec.v2Questions &&
      document.querySelector("[data-evidence-boundary]") &&
      result.sourceIntegrity
    );

    return result;
  }, { spec, responseStatus });
}

function passes(item) {
  return (
    item.responseStatus === 200 &&
    !item.documentOverflow &&
    item.forbidden.length === 0 &&
    !item.stale237 &&
    item.routeContract &&
    item.sourceIntegrity &&
    item.axeViolations === 0 &&
    item.keyboardPassed &&
    item.consoleErrors.length === 0 &&
    item.pageErrors.length === 0
  );
}

async function certifyJourney(browser) {
  const context = await browser.newContext({ viewport: { width: 430, height: 932 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  const checks = {
    gateway: false,
    days: [],
    modelTest: false,
    submitResult: false,
    repair: false,
    reset: false,
    retry: false,
  };

  try {
    let response = await page.goto(`${baseUrl}/admission/`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await settle(page);
    checks.gateway = response?.status() === 200;
    await page.locator('a[href$="/admission/day-1/"]').first().click();
    await settle(page);

    for (let day = 1; day <= 7; day += 1) {
      const onDay = new RegExp(`/admission/day-${day}/?$`).test(new URL(page.url()).pathname);
      const complete = page.locator(`[data-admission-complete="${day}"]`);
      const exists = await complete.count() === 1;
      if (exists) await complete.click();
      const marked = exists ? (await complete.getAttribute("data-completed")) === "true" : false;
      checks.days.push({ day, onDay, completionControl: exists, marked });

      const nextHref = day < 7
        ? `/admission/day-${day + 1}/`
        : "/admission/foundation-model-test-01/";
      await page.locator(`a[href$="${nextHref}"]`).first().click();
      await settle(page);
    }

    checks.modelTest = new URL(page.url()).pathname.endsWith("/admission/foundation-model-test-01/") &&
      await page.locator('fieldset[data-question-id]').count() === 30;

    const quizForm = page.locator('[data-admission-quiz]');
    await quizForm.locator('button[type="submit"]').click();
    const result = quizForm.locator("[data-admission-result]");
    await result.waitFor({ state: "visible" });
    checks.submitResult = /Score:\s*0\s*\/\s*30/i.test(await result.innerText());

    const repairHref = await result.locator('a[href]').first().getAttribute("href");
    if (repairHref) {
      const repairPage = await context.newPage();
      const repairResponse = await repairPage.goto(new URL(repairHref, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 45000 });
      await settle(repairPage);
      checks.repair = repairResponse?.status() === 200;
      await repairPage.close();
    }

    await quizForm.locator("[data-admission-reset]").click();
    const resetState = await quizForm.evaluate((form) => {
      const resultNode = form.querySelector("[data-admission-result]");
      return {
        hiddenAttribute: Boolean(resultNode && resultNode.hidden),
        resultEmpty: Boolean(resultNode && resultNode.innerHTML === ""),
        checkedAnswers: form.querySelectorAll('input[type="radio"]:checked').length,
        gradedFieldsets: form.querySelectorAll("fieldset[data-result]").length,
      };
    });
    checks.resetState = resetState;
    checks.reset =
      resetState.hiddenAttribute &&
      resetState.resultEmpty &&
      resetState.checkedAnswers === 0 &&
      resetState.gradedFieldsets === 0;

    await quizForm.locator('[data-question-id="admission-foundation-01-q01"] input[value="1"]').check();
    await quizForm.locator('button[type="submit"]').click();
    await result.waitFor({ state: "visible" });
    checks.retry = /Score:\s*1\s*\/\s*30/i.test(await result.innerText());

    const passed =
      checks.gateway &&
      checks.days.length === 7 &&
      checks.days.every((item) => item.onDay && item.completionControl && item.marked) &&
      checks.modelTest &&
      checks.submitResult &&
      checks.repair &&
      checks.reset &&
      checks.retry &&
      consoleErrors.length === 0 &&
      pageErrors.length === 0;

    return { name: "full-journey-430", passed, checks, consoleErrors, pageErrors };
  } finally {
    await context.close();
  }
}

async function certifyBangla(browser) {
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    locale: "bn-BD",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  try {
    const response = await page.goto(`${baseUrl}/admission/`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await settle(page);
    const rendering = await page.evaluate(() => {
      const anchor = Array.from(document.querySelectorAll('a[hreflang="bn"]'))
        .find((item) => /বাংলা/.test(item.textContent || ""));
      if (!anchor) return { found: false, visible: false, fontReady: false, overflow: true };
      const rect = anchor.getBoundingClientRect();
      const style = getComputedStyle(anchor);
      return {
        found: true,
        visible: rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden",
        fontReady: document.fonts ? document.fonts.status === "loaded" : true,
        overflow: document.documentElement.scrollWidth > innerWidth + 2 || document.body.scrollWidth > innerWidth + 2,
      };
    });
    await page.addScriptTag({ content: axe.source });
    const axeResult = await page.evaluate(async () => window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    }));
    const passed =
      response?.status() === 200 &&
      rendering.found &&
      rendering.visible &&
      rendering.fontReady &&
      !rendering.overflow &&
      axeResult.violations.length === 0 &&
      consoleErrors.length === 0 &&
      pageErrors.length === 0;
    return {
      name: "bangla-locale-430",
      locale: "bn-BD",
      passed,
      rendering,
      axeViolations: axeResult.violations.length,
      consoleErrors,
      pageErrors,
    };
  } finally {
    await context.close();
  }
}

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
let journey;
let bangla;

try {
  for (const viewport of viewports) {
    for (const spec of routes) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
      page.on("pageerror", (err) => pageErrors.push(String(err)));

      const response = await page.goto(`${baseUrl}${spec.route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await settle(page);
      const inspected = await inspect(page, spec, response?.status() || 0);

      await page.addScriptTag({ content: axe.source });
      const axeResult = await page.evaluate(async () => window.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
      }));
      const keyboardPassed = await keyboardProbe(page);

      const safe = spec.route.replace(/^\//, "").replace(/\/$/, "").replaceAll("/", "-") || "root";
      await page.screenshot({ fullPage: true, path: path.join(outputDir, `${viewport.name}-${safe}.png`) });

      const result = {
        viewport: viewport.name,
        route: spec.route,
        ...inspected,
        axeViolations: axeResult.violations.length,
        axeViolationIds: axeResult.violations.map((v) => v.id),
        keyboardPassed,
        consoleErrors,
        pageErrors,
      };
      result.passed = passes(result);
      results.push(result);
      await context.close();
    }
  }

  journey = await certifyJourney(browser);
  bangla = await certifyBangla(browser);
} finally {
  await browser.close();
}

const report = {
  baseUrl,
  generatedAt: new Date().toISOString(),
  contract: "admission-r1-foundation-integrity-journey-v1",
  requestedViewports: viewports.map((item) => item.name),
  routeCount: routes.length,
  journey,
  bangla,
  passed: results.every((item) => item.passed) && journey.passed && bangla.passed,
  results,
};
await fs.writeFile(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));

for (const item of results) {
  console.log(
    `${item.viewport} ${item.route}: ${item.passed ? "PASS" : "FAIL"} status=${item.responseStatus} overflow=${item.documentOverflow} axe=${item.axeViolations} keyboard=${item.keyboardPassed} forbidden=${item.forbidden.join(",") || "none"}`
  );
}
console.log(`full-journey-430: ${journey.passed ? "PASS" : "FAIL"}`);
console.log(`bangla-locale-430: ${bangla.passed ? "PASS" : "FAIL"}`);
console.log(report.passed ? "ADMISSION_R1_CERTIFICATION_PASS" : "ADMISSION_R1_CERTIFICATION_FAIL");
process.exitCode = report.passed ? 0 : 1;
