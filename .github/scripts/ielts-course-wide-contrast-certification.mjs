#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import axe from "axe-core";
import { chromium } from "playwright";

const BASE_URL = "http://127.0.0.1:4000";
const OUTPUT_DIR = "ielts-course-wide-contrast-report";

const ROUTES = [
  "/ielts/",
  "/ielts/band-8-roadmap/",
  "/ielts/daily-practice/",
  "/ielts/listening/",
  "/ielts/reading/",
  "/ielts/writing/",
  "/ielts/speaking/",
];

const VIEWPORTS = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
}

async function inspect(page, responseStatus) {
  return page.evaluate(async ({ axeSource, responseStatus }) => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || 1) > 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    const requiredSurfaces = Array.from(document.querySelectorAll(
      ".page__title, .sidebar .nav__items a, .ielts-skill-card, " +
      ".ielts-practice__panel, .ielts-writing__panel, .ielts-speaking__panel, .ielts-reading__panel"
    )).filter(visible);

    // Inject the exact pinned axe runtime used by the workflow.
    // eslint-disable-next-line no-eval
    eval(axeSource);
    const axeResult = await window.axe.run(document, {
      runOnly: { type: "rule", values: ["color-contrast"] },
    });

    return {
      responseStatus,
      bodyClasses: Array.from(document.body.classList),
      horizontalOverflow:
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      requiredSurfaceCount: requiredSurfaces.length,
      violations: axeResult.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          html: node.html,
          failureSummary: node.failureSummary,
        })),
      })),
    };
  }, { axeSource: axe.source, responseStatus });
}

await fs.mkdir(OUTPUT_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const viewport of VIEWPORTS) {
    for (const route of ROUTES) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(String(error)));

      const response = await page.goto(`${BASE_URL}${route.replace(/^\//, "")}`, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      await settle(page);

      const state = await inspect(page, response?.status() || 0);
      const passed =
        state.responseStatus === 200 &&
        !state.horizontalOverflow &&
        state.violations.length === 0 &&
        consoleErrors.length === 0 &&
        pageErrors.length === 0;

      const safeRoute = route.replace(/^\//, "").replace(/\/$/, "").replaceAll("/", "-") || "ielts";
      await page.screenshot({
        fullPage: true,
        path: path.join(OUTPUT_DIR, `${viewport.name}-${safeRoute}.png`),
      });

      results.push({
        viewport: viewport.name,
        route,
        ...state,
        consoleErrors,
        pageErrors,
        passed,
      });

      await context.close();
    }
  }
} finally {
  await browser.close();
}

const report = {
  contract: "ielts-course-wide-wcag-aa-contrast-v1",
  generatedAt: new Date().toISOString(),
  rule: {
    normalText: ">= 4.5:1",
    largeText: ">= 3:1",
    uiFocusBoundary: ">= 3:1 by owned IELTS focus token",
    renderedEnforcement: "axe color-contrast on all IELTS routes",
  },
  passed: results.every((result) => result.passed),
  results,
};

await fs.writeFile(
  path.join(OUTPUT_DIR, "report.json"),
  JSON.stringify(report, null, 2) + "\n"
);

const md = [
  "# IELTS Course-wide Contrast Certification",
  "",
  `- Contract: \`${report.contract}\``,
  `- Overall: **${report.passed ? "PASS" : "FAIL"}**`,
  "",
  "| Viewport | Route | Contrast violations | Overflow | Console/page errors | Result |",
  "|---|---|---:|---:|---:|---:|",
];

for (const result of results) {
  md.push(
    `| ${result.viewport} | ${result.route} | ${result.violations.length} | ${result.horizontalOverflow ? "FAIL" : "PASS"} | ${result.consoleErrors.length + result.pageErrors.length} | ${result.passed ? "PASS" : "FAIL"} |`
  );
}

md.push("");
await fs.writeFile(path.join(OUTPUT_DIR, "report.md"), md.join("\n") + "\n");

for (const result of results) {
  console.log(
    `${result.viewport} ${result.route}: ${result.passed ? "PASS" : "FAIL"} contrast=${result.violations.length} overflow=${result.horizontalOverflow}`
  );
  for (const violation of result.violations) {
    console.log(`  ${violation.id}: ${violation.nodes.length} node(s)`);
    for (const node of violation.nodes.slice(0, 8)) {
      console.log(`    ${JSON.stringify(node.target)} :: ${node.failureSummary || ""}`);
    }
  }
}

console.log(report.passed ? "IELTS_COURSE_WIDE_CONTRAST_PASS" : "IELTS_COURSE_WIDE_CONTRAST_FAIL");
process.exitCode = report.passed ? 0 : 1;
