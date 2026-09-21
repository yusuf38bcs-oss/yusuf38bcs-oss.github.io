#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

const baseUrl = (process.env.LBFL_ADMISSION_BASE_URL || "http://127.0.0.1:4000").replace(/\/$/, "");
const outputDir = process.env.LBFL_ADMISSION_REPORT_DIR || "admission-biology-evidence-report";

const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

const routes = [
  { route: "/admission/", kind: "hub" },
  { route: "/admission/biology/", kind: "index" },
  { route: "/admission/biology/du/2016-17/", kind: "paper", exam: "DU", v2Questions: 0 },
  { route: "/admission/biology/medical/2016-17/", kind: "paper", exam: "Medical", v2Questions: 30 },
];

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
}

async function keyboardProbe(page) {
  for (let i = 0; i < 14; i += 1) {
    await page.keyboard.press("Tab");
    const result = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || !["A", "BUTTON"].includes(el.tagName)) return null;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        visible: rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none",
        inViewport: rect.bottom >= 0 && rect.top <= innerHeight && rect.right >= 0 && rect.left <= innerWidth,
      };
    });
    if (result?.visible && result?.inViewport) return true;
  }
  return false;
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
    };

    if (spec.kind === "hub") {
      result.routeContract = Boolean(document.querySelector('a[href="/admission/biology/"], a[href$="/admission/biology/"]'));
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

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

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
      const axeResult = await page.evaluate(async () => {
        return window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
        });
      });
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
} finally {
  await browser.close();
}

const report = {
  baseUrl,
  generatedAt: new Date().toISOString(),
  contract: "admission-biology-evidence-view-v1",
  passed: results.every((item) => item.passed),
  results,
};
await fs.writeFile(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));

for (const item of results) {
  console.log(
    `${item.viewport} ${item.route}: ${item.passed ? "PASS" : "FAIL"} status=${item.responseStatus} overflow=${item.documentOverflow} axe=${item.axeViolations} keyboard=${item.keyboardPassed} forbidden=${item.forbidden.join(",") || "none"}`
  );
}
console.log(report.passed ? "ADMISSION_BIOLOGY_EVIDENCE_PASS" : "ADMISSION_BIOLOGY_EVIDENCE_FAIL");
process.exitCode = report.passed ? 0 : 1;
