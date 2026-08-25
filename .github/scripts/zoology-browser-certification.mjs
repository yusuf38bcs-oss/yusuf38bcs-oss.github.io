#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const siteDir = path.resolve(arg("--site-dir", "_site"));
const baseUrl = arg("--base-url", "http://127.0.0.1:4173").replace(/\/$/, "");
const outputDir = path.resolve(arg("--output-dir", "zoology-browser-report"));
const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "desktop-1280", width: 1280, height: 900 },
];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile() && entry.name === "index.html") files.push(absolute);
  }
  return files;
}

function routeFor(file) {
  const relative = path.relative(siteDir, path.dirname(file)).split(path.sep).join("/");
  return `/${relative}/`.replace(/\/+/g, "/");
}

async function isLearnerContentPage(file) {
  const html = await fs.readFile(file, "utf8");
  if (/<meta[^>]+http-equiv=["']?refresh["']?/i.test(html)) return false;
  return html.includes('class="page"') && html.includes('class="page__content"');
}

const roots = [
  path.join(siteDir, "biology", "hsc-corner", "zoology"),
  path.join(siteDir, "biology", "higher-zoology-tree"),
];
const discoveredFiles = (await Promise.all(roots.map(walk))).flat();
const learnerFiles = [];
for (const file of discoveredFiles) {
  if (await isLearnerContentPage(file)) learnerFiles.push(file);
}
const routes = [...new Set(learnerFiles.map(routeFor))].sort();
if (!routes.length) throw new Error("No rendered learner-content Zoology routes were discovered");

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

for (const route of routes) {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const blockedExternal = [];
    await context.route("**/*", async (requestRoute) => {
      const request = requestRoute.request();
      const requestUrl = new URL(request.url());
      if (["127.0.0.1", "localhost"].includes(requestUrl.hostname)) {
        await requestRoute.continue();
        return;
      }
      blockedExternal.push({ resourceType: request.resourceType(), url: requestUrl.origin });
      await requestRoute.fulfill({ status: 204, body: "" });
    });

    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const localHttpErrors = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push({ text: message.text(), location: message.location() });
      }
    });
    page.on("pageerror", (error) => pageErrors.push(String(error)));
    page.on("response", (response) => {
      const responseUrl = new URL(response.url());
      if (
        ["127.0.0.1", "localhost"].includes(responseUrl.hostname) &&
        response.status() >= 400
      ) {
        localHttpErrors.push({ status: response.status(), url: responseUrl.pathname });
      }
    });

    let status = 0;
    let metrics = null;
    let axeViolations = [];
    try {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 15_000 });
      status = response?.status() ?? 0;
      metrics = await page.evaluate(() => {
        const resetButton = document.querySelector(".socratic-console-clear-btn");
        return {
          hasContent: Boolean(document.querySelector(".page__content")),
          hasCycle: Boolean(document.querySelector("[data-zoology-learning-cycle]")),
          hasStylesheet: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some((link) =>
            String(link.getAttribute("href") || "").includes("zoology-academic.css")),
          horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
          resetInquiryLabel: resetButton ? resetButton.textContent.trim() === "Reset inquiry" : true,
        };
      });
      if (metrics.hasCycle && viewport.name === "mobile-390") {
        await page.addScriptTag({ content: axe.source });
        const axeResult = await page.evaluate(async () => {
          const target = document.querySelector("[data-zoology-learning-cycle]");
          return window.axe.run(target, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
          });
        });
        axeViolations = axeResult.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.length,
        }));
      }
    } catch (error) {
      pageErrors.push(String(error));
    }

    const passed = status === 200 &&
      metrics?.hasContent === true &&
      metrics?.hasStylesheet === true &&
      metrics?.hasCycle === true &&
      metrics?.resetInquiryLabel === true &&
      (metrics?.horizontalOverflow ?? 999) <= 2 &&
      consoleErrors.length === 0 &&
      pageErrors.length === 0 &&
      localHttpErrors.length === 0 &&
      axeViolations.length === 0;

    results.push({
      route,
      viewport: viewport.name,
      status,
      metrics,
      blockedExternal,
      localHttpErrors,
      consoleErrors,
      pageErrors,
      axeViolations,
      passed,
    });
    await context.close();
  }
}

await browser.close();
const passed = results.every((result) => result.passed);
const report = {
  passed,
  discoveredHtmlCount: discoveredFiles.length,
  routeCount: routes.length,
  checks: results.length,
  generatedAt: new Date().toISOString(),
  results,
};
await fs.writeFile(path.join(outputDir, "zoology-browser-certification.json"), `${JSON.stringify(report, null, 2)}\n`);

const failures = results.filter((result) => !result.passed);
const markdown = [
  "# Zoology Browser Certification",
  "",
  `- Learner-content routes: ${routes.length}`,
  `- Viewport checks: ${results.length}`,
  `- Result: ${passed ? "PASS" : "FAIL"}`,
  "",
  ...(failures.length
    ? [
        "## Failures",
        "",
        ...failures.map((failure) => {
          const http = failure.localHttpErrors?.length
            ? `; local HTTP ${failure.localHttpErrors.map((item) => `${item.status} ${item.url}`).join(", ")}`
            : "";
          return `- ${failure.route} @ ${failure.viewport}${http}`;
        }),
      ]
    : [
        "All discovered learner-content Zoology routes passed the scoped design, overflow, local-resource, application-console, AI-label and learning-cycle checks. Compatibility redirects, meta-refresh aliases and layout:null artifacts under historical Zoology paths are intentionally excluded from this academic-design matrix and remain covered by site/SEO validation. Third-party network calls were isolated with local 204 responses and recorded separately in the JSON evidence.",
      ]),
  "",
].join("\n");
await fs.writeFile(path.join(outputDir, "zoology-browser-certification.md"), markdown);
console.log(markdown);
process.exit(passed ? 0 : 1);
