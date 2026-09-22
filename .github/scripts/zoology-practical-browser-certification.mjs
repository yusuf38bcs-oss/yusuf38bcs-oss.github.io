#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import axe from "axe-core";
import { chromium } from "playwright";

function argument(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const baseUrl = argument("--url").replace(/\/$/, "");
const expectedSha = argument("--expected-sha");
const deploymentId = argument("--deployment-id");
const outputDir = path.resolve(argument("--output-dir", "zoology-practical-browser-report"));

if (!baseUrl || !/^[0-9a-f]{40}$/.test(expectedSha) || !deploymentId) {
  throw new Error("--url, exact --expected-sha, and --deployment-id are required");
}

const practicalRoutes = [
  { name: "gateway", route: "/biology/higher-zoology-tree/practical/" },
  { name: "museum", route: "/biology/higher-zoology-tree/practical/museum-specimens/" },
  { name: "slides", route: "/biology/higher-zoology-tree/practical/permanent-slides/" },
  { name: "whole-mounts", route: "/biology/higher-zoology-tree/practical/whole-mounts/" },
  { name: "dissection", route: "/biology/higher-zoology-tree/practical/dissection/" },
  { name: "temporary-mounts", route: "/biology/higher-zoology-tree/practical/temporary-mounts/" },
  { name: "appendages", route: "/biology/higher-zoology-tree/practical/appendages/" },
  { name: "zooplankton", route: "/biology/higher-zoology-tree/practical/zooplankton/" },
  { name: "field-report", route: "/biology/higher-zoology-tree/practical/field-report/" }
];

const childRoutes = practicalRoutes.slice(1).map((item) => item.route);
const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 900 }
];

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
}

try {
  for (const viewport of viewports) {
    for (const spec of practicalRoutes) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: "reduce"
      });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(String(error)));

      const response = await page.goto(baseUrl + spec.route, {
        waitUntil: "domcontentloaded",
        timeout: 60000
      });
      await settle(page);

      await page.evaluate(axe.source);
      const axeViolations = await page.evaluate(async () => {
        const result = await window.axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]
          }
        });
        return result.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          help: violation.help,
          nodes: violation.nodes.map((node) => ({
            target: node.target,
            html: node.html
          }))
        }));
      });

      const state = await page.evaluate(({ childRoutes, isGateway }) => {
        const visible = (element) => {
          if (!element) return false;
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity || 1) > 0 &&
            rect.width > 0 &&
            rect.height > 0;
        };

        const h1 = Array.from(document.querySelectorAll("h1")).find(visible);
        const article = document.querySelector("article");
        const sidebar = document.querySelector(".contextual-sidebar-nav");
        const sidebarLinks = sidebar
          ? Array.from(sidebar.querySelectorAll("a[href]")).map((a) => new URL(a.href, location.href).pathname)
          : [];
        const gatewayLinks = Array.from(document.querySelectorAll('a[href*="/biology/higher-zoology-tree/practical/"]'))
          .map((a) => new URL(a.href, location.href).pathname);
        const tables = Array.from(document.querySelectorAll("table")).map((table) => {
          const wrapper = table.closest(".zoology-practical-table-scroll");
          if (!wrapper) {
            return {
              wrapperPresent: false,
              wrapperFocusable: false,
              scrollContractPassed: false,
              tableWidth: table.scrollWidth,
              containerWidth: table.clientWidth
            };
          }
          const style = getComputedStyle(wrapper);
          const needsHorizontalScroll = table.scrollWidth > wrapper.clientWidth + 2;
          const scrollable = ["auto", "scroll"].includes(style.overflowX);
          return {
            wrapperPresent: true,
            wrapperFocusable: wrapper.tabIndex >= 0,
            scrollContractPassed: wrapper.tabIndex >= 0 && (!needsHorizontalScroll || scrollable),
            tableWidth: table.scrollWidth,
            containerWidth: wrapper.clientWidth
          };
        });

        return {
          title: document.title,
          h1Visible: Boolean(h1),
          h1Text: h1?.textContent?.trim() || "",
          articleBangla: Boolean(article && /^bn(?:_|-|$)/i.test(article.getAttribute("lang") || "")),
          contextualSidebarPresent: Boolean(sidebar),
          sidebarLinks,
          sidebarHasGateway: sidebarLinks.includes("/biology/higher-zoology-tree/practical/"),
          sidebarHasAllChildren: childRoutes.every((route) => sidebarLinks.includes(route)),
          gatewayHasAllChildren: isGateway ? childRoutes.every((route) => gatewayLinks.includes(route)) : true,
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
          tablesContained: tables.every((table) => table.scrollContractPassed),
          tableCount: tables.length
        };
      }, { childRoutes, isGateway: spec.name === "gateway" });

      const focus = await page.evaluate(() => {
        const first = document.querySelector(".contextual-sidebar-nav a[href]");
        if (!first) return { present: false };
        return { present: true, href: first.getAttribute("href") };
      });
      let keyboardPassed = false;
      if (focus.present) {
        for (let i = 0; i < 160; i += 1) {
          await page.keyboard.press("Tab");
          const active = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el || el === document.body) return null;
            return {
              inSidebar: Boolean(el.closest?.(".contextual-sidebar-nav")),
              focusVisible: el.matches?.(":focus-visible") || false
            };
          });
          if (active?.inSidebar) {
            keyboardPassed = active.focusVisible;
            break;
          }
        }
      }

      const passed =
        response?.status() === 200 &&
        state.h1Visible &&
        state.articleBangla &&
        state.contextualSidebarPresent &&
        state.sidebarHasGateway &&
        state.sidebarHasAllChildren &&
        state.gatewayHasAllChildren &&
        !state.horizontalOverflow &&
        state.tablesContained &&
        keyboardPassed &&
        axeViolations.length === 0 &&
        consoleErrors.length === 0 &&
        pageErrors.length === 0;

      results.push({
        viewport: viewport.name,
        route: spec.route,
        status: response?.status() || 0,
        state,
        keyboardPassed,
        axeViolations,
        consoleErrors,
        pageErrors,
        passed
      });

      await context.close();
    }
  }

  const parentContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const parentPage = await parentContext.newPage();
  const parentResponse = await parentPage.goto(baseUrl + "/biology/higher-zoology-tree/", {
    waitUntil: "domcontentloaded",
    timeout: 60000
  });
  await settle(parentPage);
  const parentState = await parentPage.evaluate(() => {
    const practical = document.querySelector('a[href="/biology/higher-zoology-tree/practical/"]');
    return {
      practicalLinkPresent: Boolean(practical),
      practicalLinkText: practical?.textContent?.trim() || ""
    };
  });
  await parentContext.close();

  const passed =
    results.every((result) => result.passed) &&
    parentResponse?.status() === 200 &&
    parentState.practicalLinkPresent;

  const report = {
    contract: "lbfl-zoology-practical-213106-browser-v1",
    expectedSha,
    previewUrl: baseUrl,
    deploymentId,
    generatedAt: new Date().toISOString(),
    parentGateway: {
      status: parentResponse?.status() || 0,
      ...parentState
    },
    passed,
    results
  };

  await fs.writeFile(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2) + "\n");

  const markdown = [
    "# Zoology Practical-I Exact-Preview Browser Certification",
    "",
    "- Exact head: `" + expectedSha + "`",
    "- Preview: " + baseUrl,
    "- Deployment ID: `" + deploymentId + "`",
    "- Overall: **" + (passed ? "PASS" : "FAIL") + "**",
    "",
    "- Higher Zoology → Practical link: **" + (parentState.practicalLinkPresent ? "PASS" : "FAIL") + "**",
    "",
    "| Viewport | Route | HTTP | Sidebar | Keyboard | Axe | Overflow | Tables | Result |",
    "|---|---|---:|---:|---:|---:|---:|---:|---:|"
  ];
  for (const result of results) {
    markdown.push(
      "| " + result.viewport +
      " | " + result.route +
      " | " + result.status +
      " | " + (result.state.sidebarHasAllChildren ? "PASS" : "FAIL") +
      " | " + (result.keyboardPassed ? "PASS" : "FAIL") +
      " | " + result.axeViolations.length +
      " | " + (result.state.horizontalOverflow ? "FAIL" : "PASS") +
      " | " + (result.state.tablesContained ? "PASS" : "FAIL") +
      " | " + (result.passed ? "PASS" : "FAIL") + " |"
    );
  }
  markdown.push("");
  await fs.writeFile(path.join(outputDir, "report.md"), markdown.join("\n") + "\n");

  console.log(markdown.join("\n"));
  console.log(passed ? "ZOOLOGY_PRACTICAL_BROWSER_PASS" : "ZOOLOGY_PRACTICAL_BROWSER_FAIL");
  process.exitCode = passed ? 0 : 1;
} finally {
  await browser.close();
}
