#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

function parseArgs() {
  const out = {};
  for (let i = 2; i < process.argv.length; i += 2) out[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
  return out;
}

const cli = parseArgs();
const baseUrl = String(cli.url || "").replace(/\/$/, "");
const expectedSha = String(cli["expected-sha"] || "");
const deploymentId = String(cli["deployment-id"] || "");
const outputDir = String(cli["output-dir"] || "ielts-typography-browser-report");
if (!baseUrl || !/^[0-9a-f]{40}$/.test(expectedSha)) throw new Error("exact --url and --expected-sha are required");

const routes = [
  "/ielts/",
  "/ielts/band-8-roadmap/",
  "/ielts/daily-practice/",
  "/ielts/listening/",
  "/ielts/reading/",
  "/ielts/writing/",
  "/ielts/speaking/"
];

const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 900 }
];

const rootSelector = ".ielts-hub, .ielts-practice, .ielts-writing, .ielts-speaking, .ielts-reading, .ielts-static";

function numericPx(value) {
  const n = Number.parseFloat(String(value || ""));
  return Number.isFinite(n) ? n : null;
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(function(){});
  await page.evaluate(async function(){ if (document.fonts && document.fonts.ready) await document.fonts.ready; });
}

async function inspect(page, status) {
  return page.evaluate(function({ status, rootSelector }) {
    const visible = function(el) {
      if (!el) return false;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== "none" && s.visibility !== "hidden" && Number(s.opacity || 1) > 0 && r.width > 0 && r.height > 0;
    };

    const sample = function(selector) {
      const el = Array.from(document.querySelectorAll(selector)).find(visible);
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        selector,
        tag: el.tagName,
        text: (el.textContent || "").trim().slice(0, 120),
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        fontWeight: s.fontWeight,
        letterSpacing: s.letterSpacing
      };
    };

    const root = Array.from(document.querySelectorAll(rootSelector)).find(visible);
    const rootStyle = root ? getComputedStyle(root) : null;
    const samples = [
      sample(rootSelector),
      sample(rootSelector + " h1"),
      sample(rootSelector + " p"),
      sample(rootSelector + " .btn"),
      sample(rootSelector + " textarea"),
      sample(rootSelector + " select"),
      sample(".sidebar .nav__items a")
    ].filter(Boolean);

    const visibleMainImages = Array.from(document.querySelectorAll("main img, .page__content img")).filter(visible).map(function(img){
      return { src: img.currentSrc || img.src, width: img.naturalWidth, height: img.naturalHeight, alt: img.alt || "" };
    });

    return {
      status,
      rootPresent: Boolean(root),
      rootFontFamily: rootStyle ? rootStyle.fontFamily : null,
      rootFontSize: rootStyle ? rootStyle.fontSize : null,
      rootLineHeight: rootStyle ? rootStyle.lineHeight : null,
      headingVisible: Boolean(Array.from(document.querySelectorAll(rootSelector + " h1, .ielts-static-page .page__title")).find(visible)),
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      samples,
      visibleMainImages,
      fontsStatus: document.fonts ? document.fonts.status : "unsupported",
      interAvailable: document.fonts ? document.fonts.check("16px Inter") : null,
      openSansAvailable: document.fonts ? document.fonts.check('16px "Open Sans"') : null,
      navigatorSaveData: Boolean(navigator.connection && navigator.connection.saveData)
    };
  }, { status, rootSelector });
}

async function inspectReducedMotion(page) {
  return page.evaluate(function(rootSelector) {
    const root = document.querySelector(rootSelector);
    if (!root) return { rootPresent: false, offenders: [] };
    const visible = function(el) {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
    };
    const seconds = function(value) {
      return String(value || "0s").split(",").map(function(v){
        const t = v.trim();
        if (t.endsWith("ms")) return Number.parseFloat(t) / 1000;
        if (t.endsWith("s")) return Number.parseFloat(t);
        return 0;
      }).filter(Number.isFinite);
    };
    const offenders = [];
    for (const el of [root, ...root.querySelectorAll("*")]) {
      if (!visible(el)) continue;
      const s = getComputedStyle(el);
      const maxTransition = Math.max(0, ...seconds(s.transitionDuration));
      const maxAnimation = Math.max(0, ...seconds(s.animationDuration));
      if (maxTransition > 0.1 || maxAnimation > 0.1) {
        offenders.push({
          tag: el.tagName,
          id: el.id || "",
          className: typeof el.className === "string" ? el.className : "",
          transitionDuration: s.transitionDuration,
          animationDuration: s.animationDuration
        });
      }
    }
    return { rootPresent: true, offenders: offenders.slice(0, 40) };
  }, rootSelector);
}

async function inspectTextSpacing(page) {
  await page.addStyleTag({ content:
    rootSelector + " * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } " +
    rootSelector + " p { margin-bottom: 2em !important; }"
  });
  return page.evaluate(function(rootSelector) {
    const root = document.querySelector(rootSelector);
    return {
      rootPresent: Boolean(root),
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      rootOverflow: root ? root.scrollWidth > root.clientWidth + 2 : true
    };
  }, rootSelector);
}

function sansLike(fontFamily) {
  if (!fontFamily) return false;
  const f = fontFamily.toLowerCase();
  return ["sans-serif","inter","open sans","system-ui","segoe ui","roboto","helvetica","arial","-apple-system","blinkmacsystemfont"].some(function(token){ return f.includes(token); }) &&
    !f.includes("times new roman") &&
    !f.includes("monospace");
}

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const vp of viewports) {
    for (const route of routes) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        reducedMotion: "reduce",
        extraHTTPHeaders: { "Save-Data": "on" }
      });
      await context.addInitScript(function(){
        try {
          Object.defineProperty(Navigator.prototype, "connection", {
            configurable: true,
            get: function(){ return { saveData: true, effectiveType: "2g", downlink: 0.3, rtt: 2000 }; }
          });
        } catch (_) {}
      });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", function(m){ if (m.type() === "error") consoleErrors.push(m.text()); });
      page.on("pageerror", function(e){ pageErrors.push(String(e)); });

      const response = await page.goto(baseUrl + route, { waitUntil: "domcontentloaded", timeout: 45000 });
      await settle(page);
      const state = await inspect(page, response ? response.status() : 0);
      const motion = await inspectReducedMotion(page);
      const spacing = await inspectTextSpacing(page);

      const familiesSansLike = state.samples.every(function(s){ return sansLike(s.fontFamily); });
      const paragraph = state.samples.find(function(s){ return s.tag === "P"; });
      const paragraphSize = paragraph ? numericPx(paragraph.fontSize) : null;
      const paragraphLine = paragraph ? numericPx(paragraph.lineHeight) : null;
      const readableParagraph = !paragraph || (
        paragraphSize !== null &&
        paragraphSize >= 15 &&
        paragraphLine !== null &&
        paragraphLine >= paragraphSize * 1.4
      );
      const saveDataResolved = state.navigatorSaveData === true;

      const passed =
        state.status === 200 &&
        state.rootPresent &&
        state.headingVisible &&
        !state.horizontalOverflow &&
        familiesSansLike &&
        readableParagraph &&
        motion.rootPresent &&
        motion.offenders.length === 0 &&
        spacing.rootPresent &&
        !spacing.horizontalOverflow &&
        !spacing.rootOverflow &&
        consoleErrors.length === 0 &&
        pageErrors.length === 0 &&
        saveDataResolved;

      results.push({
        viewport: vp.name,
        route,
        ...state,
        reducedMotion: motion,
        textSpacing: spacing,
        consoleErrors,
        pageErrors,
        familiesSansLike,
        readableParagraph,
        saveDataClassification: state.visibleMainImages.length === 0 ? "N/A — no visible IELTS content images" : "APPLICABLE — content images present",
        passed
      });

      await context.close();
    }
  }
} finally {
  await browser.close();
}

const routeFamilyConsistency = {};
for (const route of routes) {
  const families = [...new Set(results.filter(function(r){ return r.route === route; }).map(function(r){ return r.rootFontFamily; }))];
  routeFamilyConsistency[route] = { families, consistentAcrossViewports: families.length === 1 };
}
const allFamiliesStable = Object.values(routeFamilyConsistency).every(function(x){ return x.consistentAcrossViewports; });
const passed = results.every(function(r){ return r.passed; }) && allFamiliesStable;

const report = {
  contract: "lbfl-ielts-typography-browser-v1",
  expectedSha,
  previewUrl: baseUrl,
  deploymentId,
  generatedAt: new Date().toISOString(),
  policy: {
    typography: "IELTS surfaces must resolve to a readable sans-serif family; no implicit serif/monospace fallback.",
    paragraphFloor: "LBFL IELTS design guard: visible paragraph text >=15px with computed line-height >=1.4x.",
    textSpacing: "WCAG 1.4.12 stress values must not create horizontal/root overflow.",
    reducedMotion: "Visible IELTS descendants must have no transition/animation duration >0.1s under prefers-reduced-motion.",
    saveData: "If an IELTS route has no visible content images, image suppression is N/A; Save-Data is still sent and navigator.connection.saveData is simulated true."
  },
  routeFamilyConsistency,
  allFamiliesStable,
  passed,
  results
};

await fs.writeFile(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2) + "\n");

const md = [
  "# IELTS Typography + Browser Certification",
  "",
  "- Exact head: " + expectedSha,
  "- Preview: " + baseUrl,
  "- Deployment ID: " + deploymentId,
  "- Overall: **" + (passed ? "PASS" : "FAIL") + "**",
  "",
  "| Viewport | Route | Font family | Paragraph guard | Reduced motion | Text spacing | Save-Data | Result |",
  "|---|---|---|---:|---:|---:|---|---:|"
];
for (const r of results) {
  md.push("| " + r.viewport + " | " + r.route + " | " + String(r.rootFontFamily).replaceAll("|","/") + " | " + (r.readableParagraph ? "PASS" : "FAIL") + " | " + (r.reducedMotion.offenders.length === 0 ? "PASS" : "FAIL") + " | " + (!r.textSpacing.horizontalOverflow && !r.textSpacing.rootOverflow ? "PASS" : "FAIL") + " | " + r.saveDataClassification + " | " + (r.passed ? "PASS" : "FAIL") + " |");
}
md.push("", "## Route font-family consistency", "");
for (const [route, state] of Object.entries(routeFamilyConsistency)) {
  md.push("- " + route + ": " + (state.consistentAcrossViewports ? "PASS" : "FAIL") + " — " + state.families.join(" | "));
}
await fs.writeFile(path.join(outputDir, "report.md"), md.join("\n") + "\n");

for (const r of results) {
  console.log(r.viewport + " " + r.route + ": " + (r.passed ? "PASS" : "FAIL") +
    " family=" + r.rootFontFamily +
    " paragraph=" + (r.readableParagraph ? "PASS" : "FAIL") +
    " motionOffenders=" + r.reducedMotion.offenders.length +
    " spacingOverflow=" + (r.textSpacing.horizontalOverflow || r.textSpacing.rootOverflow) +
    " errors=" + (r.consoleErrors.length + r.pageErrors.length));
}
console.log(passed ? "IELTS_TYPOGRAPHY_BROWSER_PASS" : "IELTS_TYPOGRAPHY_BROWSER_FAIL");
process.exitCode = passed ? 0 : 1;
