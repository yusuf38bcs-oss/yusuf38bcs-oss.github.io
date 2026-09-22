#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import axe from "axe-core";
import { chromium } from "playwright";

function arg(name, fallback = "") {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const previewUrl = arg("--url").replace(/\/$/, "");
const expectedSha = arg("--expected-sha");
const deploymentId = arg("--deployment-id");
const outputDir = path.resolve(arg("--output-dir", "zoology-practical-browser-report"));
if (!previewUrl || !/^[0-9a-f]{40}$/.test(expectedSha) || !deploymentId) {
  throw new Error("--url, exact --expected-sha, and --deployment-id are required");
}

const ROUTES = [
  { id: "gateway", route: "/biology/higher-zoology-tree/practical/" },
  { id: "museum", route: "/biology/higher-zoology-tree/practical/museum-specimens/" },
  { id: "slides", route: "/biology/higher-zoology-tree/practical/permanent-slides/" },
  { id: "whole-mounts", route: "/biology/higher-zoology-tree/practical/whole-mounts/" },
  { id: "dissection", route: "/biology/higher-zoology-tree/practical/dissection/" },
  { id: "temporary-mounts", route: "/biology/higher-zoology-tree/practical/temporary-mounts/" },
  { id: "appendages", route: "/biology/higher-zoology-tree/practical/appendages/" },
  { id: "zooplankton", route: "/biology/higher-zoology-tree/practical/zooplankton/" },
  { id: "field-report", route: "/biology/higher-zoology-tree/practical/field-report/" }
];

const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 800 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 900 }
];

const MODULE_HREFS = ROUTES.slice(1).map((x) => x.route);

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
}

async function inspectPage(page, status, routeId) {
  await page.evaluate(axe.source);
  return page.evaluate(async ({ status, routeId, moduleHrefs }) => {
    const visible = (el) => {
      if (!el) return false;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== "none" && s.visibility !== "hidden" && Number(s.opacity || 1) > 0 && r.width > 0 && r.height > 0;
    };

    const axeResult = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }
    });

    const h1s = Array.from(document.querySelectorAll("h1")).filter(visible);
    const practicalLinks = Array.from(document.querySelectorAll('a[href="/biology/higher-zoology-tree/practical/"], a[href^="/biology/higher-zoology-tree/practical/"]'))
      .filter(visible)
      .map((a) => ({ href: a.getAttribute("href"), text: (a.textContent || "").trim() }));

    const main = document.querySelector("main") || document.querySelector(".page__content") || document.body;
    const tables = Array.from(main.querySelectorAll("table")).map((table) => {
      const r = table.getBoundingClientRect();
      return { width: r.width, viewportWidth: innerWidth, extendsViewport: r.left < -1 || r.right > innerWidth + 1 };
    });

    const images = Array.from(main.querySelectorAll("img")).filter(visible).map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt || "",
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    }));

    const navPractical = Array.from(document.querySelectorAll('a[href="/biology/higher-zoology-tree/practical/"]')).filter(visible);

    return {
      status,
      routeId,
      title: document.title,
      visibleH1Count: h1s.length,
      h1Text: h1s.map((x) => (x.textContent || "").trim()),
      mainPresent: Boolean(main),
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      tables,
      practicalLinks,
      navPracticalVisibleCount: navPractical.length,
      gatewayHasAllModules: routeId !== "gateway" || moduleHrefs.every((href) => practicalLinks.some((x) => x.href === href)),
      images,
      axeViolations: axeResult.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.map((n) => ({ target: n.target, html: n.html }))
      }))
    };
  }, { status, routeId, moduleHrefs: MODULE_HREFS });
}

async function keyboardGateway(page) {
  const seen = new Set();
  const focusFailures = [];
  for (let i = 0; i < 180; i += 1) {
    await page.keyboard.press("Tab");
    const state = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        href: el.getAttribute("href") || "",
        focusVisible: el.matches(":focus-visible"),
        inViewport: r.bottom >= 0 && r.top <= innerHeight && r.right >= 0 && r.left <= innerWidth,
        outline: s.outlineStyle + " " + s.outlineWidth,
        text: (el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 100)
      };
    });
    if (!state) continue;
    if (MODULE_HREFS.includes(state.href)) {
      seen.add(state.href);
      if (!state.focusVisible || !state.inViewport) focusFailures.push(state);
    }
    if (seen.size === MODULE_HREFS.length) break;
  }
  return { moduleLinksReached: [...seen], allModuleLinksReached: seen.size === MODULE_HREFS.length, focusFailures };
}

async function textSpacing(page) {
  await page.addStyleTag({ content: ".page__content * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } .page__content p { margin-bottom: 2em !important; }" });
  return page.evaluate(() => ({
    documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    contentOverflow: (() => {
      const el = document.querySelector(".page__content");
      return el ? el.scrollWidth > el.clientWidth + 2 : true;
    })()
  }));
}

async function reducedMotion(page) {
  return page.evaluate(() => {
    const root = document.querySelector(".page__content");
    if (!root) return { rootPresent: false, offenders: [] };
    const parse = (v) => String(v || "0s").split(",").map((x) => {
      const t = x.trim();
      return t.endsWith("ms") ? Number.parseFloat(t) / 1000 : Number.parseFloat(t) || 0;
    });
    const offenders = [];
    for (const el of [root, ...root.querySelectorAll("*")]) {
      const s = getComputedStyle(el);
      const longest = Math.max(0, ...parse(s.animationDuration), ...parse(s.transitionDuration));
      if (longest > 0.1) offenders.push({
        tag: el.tagName,
        className: typeof el.className === "string" ? el.className : "",
        duration: longest
      });
    }
    return { rootPresent: true, offenders: offenders.slice(0, 30) };
  });
}

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
let gatewayKeyboard = null;

try {
  for (const viewport of VIEWPORTS) {
    for (const spec of ROUTES) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: "reduce",
        extraHTTPHeaders: { "Save-Data": "on" }
      });
      await context.addInitScript(() => {
        try {
          Object.defineProperty(Navigator.prototype, "connection", {
            configurable: true,
            get: () => ({ saveData: true, effectiveType: "2g", downlink: 0.3, rtt: 2000 })
          });
        } catch (_) {}
      });

      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
      page.on("pageerror", (e) => pageErrors.push(String(e)));

      const response = await page.goto(previewUrl + spec.route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await settle(page);
      const state = await inspectPage(page, response?.status() || 0, spec.id);
      const motion = await reducedMotion(page);
      const spacing = await textSpacing(page);

      if (spec.id === "gateway" && viewport.name === "mobile-390") {
        await page.goto(previewUrl + spec.route, { waitUntil: "domcontentloaded", timeout: 60000 });
        await settle(page);
        gatewayKeyboard = await keyboardGateway(page);
      }

      const result = {
        viewport: viewport.name,
        width: viewport.width,
        route: spec.route,
        ...state,
        reducedMotion: motion,
        textSpacing: spacing,
        saveData: {
          requestHeaderSent: true,
          navigatorSaveData: await page.evaluate(() => Boolean(navigator.connection?.saveData)),
          visibleContentImages: state.images.length
        },
        consoleErrors,
        pageErrors
      };

      result.passed =
        result.status === 200 &&
        result.visibleH1Count >= 1 &&
        result.mainPresent &&
        !result.documentOverflow &&
        result.axeViolations.length === 0 &&
        result.navPracticalVisibleCount >= 1 &&
        result.gatewayHasAllModules &&
        result.reducedMotion.rootPresent &&
        result.reducedMotion.offenders.length === 0 &&
        result.textSpacing.documentOverflow === false &&
        result.textSpacing.contentOverflow === false &&
        result.saveData.navigatorSaveData &&
        result.consoleErrors.length === 0 &&
        result.pageErrors.length === 0;

      results.push(result);

      try {
        await page.screenshot({ path: path.join(outputDir, viewport.name + "-" + spec.id + ".png"), fullPage: true });
      } catch (error) {
        result.screenshotWarning = String(error);
      }

      await context.close();
    }
  }
} finally {
  await browser.close();
}

const keyboardPassed = Boolean(gatewayKeyboard && gatewayKeyboard.allModuleLinksReached && gatewayKeyboard.focusFailures.length === 0);
const passed = results.every((r) => r.passed) && keyboardPassed;
const report = {
  contract: "lbfl-zoology-practical-213106-browser-v1",
  expectedSha,
  previewUrl,
  deploymentId,
  generatedAt: new Date().toISOString(),
  gatewayKeyboard,
  passed,
  results
};

await fs.writeFile(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2) + "\n");

const md = [
  "# Zoology Practical-I 213106 — Exact-Preview Browser Certification",
  "",
  "- Exact head: " + expectedSha,
  "- Preview: " + previewUrl,
  "- Deployment ID: " + deploymentId,
  "- Gateway keyboard modules: **" + (keyboardPassed ? "PASS" : "FAIL") + "**",
  "- Overall: **" + (passed ? "PASS" : "FAIL") + "**",
  "",
  "| Viewport | Route | HTTP | Axe | Overflow | Text spacing | Motion | Nav | Result |",
  "|---|---|---:|---:|---:|---:|---:|---:|---:|"
];

for (const r of results) {
  md.push("| " + r.viewport + " | " + r.route + " | " + r.status + " | " + r.axeViolations.length + " | " + (r.documentOverflow ? "FAIL" : "PASS") + " | " + (!r.textSpacing.documentOverflow && !r.textSpacing.contentOverflow ? "PASS" : "FAIL") + " | " + (r.reducedMotion.offenders.length === 0 ? "PASS" : "FAIL") + " | " + (r.navPracticalVisibleCount >= 1 ? "PASS" : "FAIL") + " | " + (r.passed ? "PASS" : "FAIL") + " |");
}
await fs.writeFile(path.join(outputDir, "report.md"), md.join("\n") + "\n");

for (const r of results) {
  console.log(r.viewport + " " + r.route + ": " + (r.passed ? "PASS" : "FAIL") + " axe=" + r.axeViolations.length + " overflow=" + r.documentOverflow + " spacing=" + (r.textSpacing.documentOverflow || r.textSpacing.contentOverflow) + " motionOffenders=" + r.reducedMotion.offenders.length + " nav=" + r.navPracticalVisibleCount + " errors=" + (r.consoleErrors.length + r.pageErrors.length));
}
console.log("Gateway keyboard: " + (keyboardPassed ? "PASS" : "FAIL"));
console.log(passed ? "ZOOLOGY_PRACTICAL_BROWSER_PASS" : "ZOOLOGY_PRACTICAL_BROWSER_FAIL");
process.exitCode = passed ? 0 : 1;
