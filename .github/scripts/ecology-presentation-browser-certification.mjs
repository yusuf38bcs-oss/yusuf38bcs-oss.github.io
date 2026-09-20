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
const outputDir = path.resolve(arg("--output-dir", "ecology-presentation-report"));

const lectureRoutes = [
  "/biology/higher-zoology-tree/ecology/ecology-history-scopes-area/",
  "/biology/higher-zoology-tree/ecology/levels-of-ecological-organization/",
  "/biology/higher-zoology-tree/ecology/habitat-niche-ecotone-edge-effect/",
  "/biology/higher-zoology-tree/ecology/abiotic-factors-limiting-factors-tolerance/",
  "/biology/higher-zoology-tree/ecology/adaptation-acclimatization-environmental-response/",
  "/biology/higher-zoology-tree/ecology/population-ecology-a-science-of-life-motion-of-a-species/",
  "/biology/higher-zoology-tree/ecology/population-ecology-concept-on-size-of-population/",
  "/biology/higher-zoology-tree/ecology/population-demography-age-structure-sex-ratio/",
  "/biology/higher-zoology-tree/ecology/population-growth-carrying-capacity-regulation/",
  "/biology/higher-zoology-tree/ecology/survivorship-curve-life-table-growth-models/",
  "/biology/higher-zoology-tree/ecology/life-history-strategies-ecological-tradeoffs/",
  "/biology/higher-zoology-tree/ecology/population-sampling-field-methods/",
  "/biology/higher-zoology-tree/ecology/community-ecology-an-equation-of-living-together/",
  "/biology/higher-zoology-tree/ecology/competition-niche-resource-partitioning/",
  "/biology/higher-zoology-tree/ecology/predation-herbivory-parasitism/",
  "/biology/higher-zoology-tree/ecology/mutualism-commensalism-facilitation/",
  "/biology/higher-zoology-tree/ecology/species-diversity-dominance-keystone-species/",
  "/biology/higher-zoology-tree/ecology/succession-disturbance-stability-resilience/",
  "/biology/higher-zoology-tree/ecology/ecosystem-structure-functional-components/",
  "/biology/higher-zoology-tree/ecology/food-chains-food-webs-trophic-levels/",
  "/biology/higher-zoology-tree/ecology/energy-flow-ecological-pyramids/",
  "/biology/higher-zoology-tree/ecology/ecosystem-productivity/",
  "/biology/higher-zoology-tree/ecology/decomposition-detritus-soil-processes/",
  "/biology/higher-zoology-tree/ecology/biogeochemical-cycles/",
  "/biology/higher-zoology-tree/ecology/terrestrial-aquatic-ecosystems/",
  "/biology/higher-zoology-tree/ecology/biodiversity-patterns-measurement-value/",
  "/biology/higher-zoology-tree/ecology/biodiversity-loss-extinction-invasive-species/",
  "/biology/higher-zoology-tree/ecology/conservation-biology-restoration/",
  "/biology/higher-zoology-tree/ecology/bangladesh-ecology-field-inquiry/"
];

const supportRoutes = [
  "/biology/higher-zoology-tree/",
  "/biology/higher-zoology-tree/ecology/",
  "/biology/higher-zoology-tree/ecology/course-index/"
];

const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 900 }
];

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const route of [...lectureRoutes, ...supportRoutes]) {
  const isLecture = lectureRoutes.includes(route);
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });

    await context.route("**/*", async (requestRoute) => {
      const requestUrl = new URL(requestRoute.request().url());
      if (
        ["127.0.0.1", "localhost", "cdn.jsdelivr.net"].includes(requestUrl.hostname)
      ) {
        await requestRoute.continue();
      } else {
        await requestRoute.fulfill({ status: 204, body: "" });
      }
    });

    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const localHttpErrors = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(String(error)));
    page.on("response", (response) => {
      const u = new URL(response.url());
      if (["127.0.0.1", "localhost"].includes(u.hostname) && response.status() >= 400) {
        localHttpErrors.push({ status: response.status(), path: u.pathname });
      }
    });

    let status = 0;
    let metrics = null;
    let violations = [];

    try {
      const response = await page.goto(`${baseUrl}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 20_000
      });
      status = response?.status() ?? 0;
      await page.waitForTimeout(900);

      const hasMathScript = (await page.locator("#MathJax-script").count()) > 0;
      if (hasMathScript) {
        await page.waitForFunction(
          () => window.MathJax?.startup?.promise,
          { timeout: 12_000 }
        );
        await page.evaluate(() => window.MathJax.startup.promise);
      }

      metrics = await page.evaluate(({ isLecture, route }) => {
        const bodyText = document.body.innerText || "";
        const infoCardHeadingColors = route === "/biology/higher-zoology-tree/"
          ? Array.from(document.querySelectorAll(".lbfl-info-card h3")).map((el) => getComputedStyle(el).color)
          : [];
        const infoCardLinkColors = route === "/biology/higher-zoology-tree/"
          ? Array.from(document.querySelectorAll(".lbfl-info-card a")).map((el) => getComputedStyle(el).color)
          : [];

        return {
          hasContent: Boolean(document.querySelector(".page__content")),
          h1Count: document.querySelectorAll("h1").length,
          hasCycle: Boolean(document.querySelector("[data-zoology-learning-cycle]")),
          hasFramework: Boolean(document.querySelector(".lbfl-framework-links")),
          hasLoloLalaBranding: /\b(?:LOLO|LALA)\b/.test(bodyText),
          horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
          hasMathScript: Boolean(document.querySelector("#MathJax-script")),
          mathContainerCount: document.querySelectorAll("mjx-container").length,
          hasRawTex: /\\frac\{|\\\[|\\\(|\\qquad|\\left\(/.test(bodyText),
          infoCardHeadingColors,
          infoCardLinkColors,
          lectureOnlyContract:
            !isLecture ||
            (
              !document.querySelector("[data-zoology-learning-cycle]") &&
              !document.querySelector(".lbfl-framework-links") &&
              !/\b(?:LOLO|LALA)\b/.test(bodyText)
            )
        };
      }, { isLecture, route });

      await page.addScriptTag({ content: axe.source });
      const axeResult = await page.evaluate(async () => {
        const result = await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] }
        });
        return result.violations
          .filter((v) => ["serious", "critical"].includes(v.impact))
          .map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              failureSummary: n.failureSummary
            }))
          }));
      });
      violations = axeResult;

      if (route === "/biology/higher-zoology-tree/") {
        const headingPass =
          metrics.infoCardHeadingColors.length > 0 &&
          metrics.infoCardHeadingColors.every((c) => c === "rgb(248, 250, 252)");
        const linkPass =
          metrics.infoCardLinkColors.length > 0 &&
          metrics.infoCardLinkColors.every((c) => c === "rgb(204, 251, 241)");
        metrics.darkCardContrastContract = headingPass && linkPass;
      } else {
        metrics.darkCardContrastContract = true;
      }
    } catch (error) {
      pageErrors.push(String(error));
    }

    const mathPass =
      !metrics?.hasMathScript ||
      ((metrics?.mathContainerCount ?? 0) > 0 && metrics?.hasRawTex === false);

    const passed =
      status === 200 &&
      metrics?.hasContent === true &&
      metrics?.h1Count === 1 &&
      metrics?.horizontalOverflow <= 2 &&
      metrics?.lectureOnlyContract === true &&
      metrics?.darkCardContrastContract === true &&
      mathPass &&
      violations.length === 0 &&
      consoleErrors.length === 0 &&
      pageErrors.length === 0 &&
      localHttpErrors.length === 0;

    results.push({
      route,
      viewport: viewport.name,
      isLecture,
      status,
      metrics,
      violations,
      consoleErrors,
      pageErrors,
      localHttpErrors,
      passed
    });

    await context.close();
  }
}

await browser.close();

const lectureResults = results.filter((r) => r.isLecture);
const report = {
  passed: results.every((r) => r.passed),
  canonicalLectureRoutes: lectureRoutes.length,
  lectureViewportChecks: lectureResults.length,
  supportViewportChecks: results.length - lectureResults.length,
  viewports: viewports.map((v) => v.name),
  seriousCriticalAxeViolations: results.reduce((n, r) => n + r.violations.length, 0),
  results
};

await fs.writeFile(
  path.join(outputDir, "ecology-presentation-certification.json"),
  JSON.stringify(report, null, 2) + "\n"
);

const failures = results.filter((r) => !r.passed);
const markdown = [
  "# Ecology Presentation P1 Browser Certification",
  "",
  `- Canonical lecture routes: ${lectureRoutes.length}`,
  `- Lecture viewport checks: ${lectureResults.length}`,
  `- Required viewports: 390 / 768 / 1280`,
  `- Serious/critical Axe violations: ${report.seriousCriticalAxeViolations}`,
  `- Result: ${report.passed ? "PASS" : "FAIL"}`,
  "",
  ...(failures.length
    ? ["## Failures", "", ...failures.map((r) => `- ${r.route} @ ${r.viewport}`)]
    : ["All 29 canonical Ecology lectures passed lecture-only rendering, responsive overflow, math rendering and full-page WCAG 2 A/AA serious/critical Axe checks at all three required viewports. Higher Zoology/Ecology support routes also passed the component contrast checks."]),
  ""
].join("\n");

await fs.writeFile(path.join(outputDir, "ecology-presentation-certification.md"), markdown);
console.log(markdown);
process.exit(report.passed ? 0 : 1);
