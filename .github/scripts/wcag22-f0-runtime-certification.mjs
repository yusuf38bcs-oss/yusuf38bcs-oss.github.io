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
const outputDir = String(cli["output-dir"] || "wcag22-f0-runtime-report");
if (!baseUrl || !/^[0-9a-f]{40}$/.test(expectedSha)) throw new Error("exact --url and --expected-sha are required");

const routes = [
  { name: "home", route: "/", family: "homepage", required: true },
  { name: "single", route: "/about/", family: "single-default", required: true },
  { name: "archive", route: "/archive/", family: "archive", required: true },
  { name: "sidebar", route: "/ielts/", family: "single-contextual-sidebar", required: true },
  { name: "higher-zoology-bn", route: "/biology/higher-zoology-tree/", family: "bangla-higher-zoology", required: true },
  { name: "interactive", route: "/admission/", family: "interactive-single", required: true },
  { name: "pagination", route: "/page2/", family: "paginated-index", required: false }
];

const viewports = [
  { name: "mobile-320", width: 320, height: 800 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 900 }
];

const critical = [
  ["masthead", ".masthead.lbfl-masthead", ["position","z-index","height","background-color","color"]],
  ["desktop-nav-link", ".lbfl-desktop-links a", ["display","color","background-color","outline-color"]],
  ["mobile-menu", ".lbfl-mobile-menu", ["display","position","background-color","z-index"]],
  ["contextual-sidebar", ".contextual-sidebar-nav", ["display","position","top","color","background-color"]],
  ["contextual-sidebar-link", ".contextual-sidebar-nav a", ["color","background-color","outline-color"]],
  ["archive-card", ".archive__item", ["display","color","background-color","border-color"]],
  ["archive-excerpt", ".archive__item-excerpt", ["color","background-color"]],
  ["pagination", ".neural-pagination", ["display","margin-top","border-top-color"]],
  ["pagination-button", ".pagination-btn", ["color","background-color","border-color"]],
  ["interactive-control", "button, input, summary, [tabindex]", ["color","background-color","outline-color","min-height","min-width"]]
];

async function inspectWithCdp(page, cdp, styleSheets, label, selector, properties) {
  const doc = await cdp.send("DOM.getDocument", { depth: 0, pierce: true });
  const q = await cdp.send("DOM.querySelector", { nodeId: doc.root.nodeId, selector: selector }).catch(function(){ return { nodeId: 0 }; });
  if (!q.nodeId) return { label: label, selector: selector, present: false };
  const computed = await cdp.send("CSS.getComputedStyleForNode", { nodeId: q.nodeId });
  const cmap = Object.fromEntries(computed.computedStyle.map(function(p){ return [p.name, p.value]; }));
  const matched = await cdp.send("CSS.getMatchedStylesForNode", { nodeId: q.nodeId });
  const rules = (matched.matchedCSSRules || []).map(function(entry) {
    const rule = entry.rule || {};
    const style = rule.style || {};
    const declarations = (style.cssProperties || []).filter(function(p){ return properties.includes(p.name) && !p.disabled; }).map(function(p){
      return { name: p.name, value: p.value, important: Boolean(p.important) };
    });
    const header = styleSheets.get(rule.styleSheetId) || {};
    return { selector: (rule.selectorList && rule.selectorList.text) || "", origin: rule.origin || "", sourceURL: header.sourceURL || "", declarations: declarations };
  }).filter(function(rule){ return rule.declarations.length > 0; });
  return { label: label, selector: selector, present: true, computed: Object.fromEntries(properties.map(function(p){ return [p, cmap[p] ?? null]; })), matchedRules: rules };
}

async function state(page) {
  return page.evaluate(function() {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(function(x){ return x.href; });
    const sticky = Array.from(document.querySelectorAll("body *")).filter(function(el){
      const p = getComputedStyle(el).position;
      return p === "fixed" || p === "sticky";
    }).slice(0, 30).map(function(el){
      const s = getComputedStyle(el);
      return { tag: el.tagName, id: el.id || "", className: typeof el.className === "string" ? el.className : "", position: s.position, top: s.top, zIndex: s.zIndex };
    });
    return {
      stylesheetHrefs: links,
      mainCssLoaded: links.some(function(href){ return /\/assets\/css\/main\.css(?:\?|$)/.test(href); }),
      lbflMastheads: document.querySelectorAll(".masthead.lbfl-masthead").length,
      neuralMastheads: document.querySelectorAll(".neural-site-masthead").length,
      contextualSidebars: document.querySelectorAll(".contextual-sidebar-nav").length,
      archiveCards: document.querySelectorAll(".archive__item").length,
      neuralPagination: document.querySelectorAll(".neural-pagination").length,
      embeddedPaginationStyle: Array.from(document.querySelectorAll("style")).some(function(node){
        const t = node.textContent || "";
        return t.includes(".neural-pagination") && t.includes(".pagination-btn");
      }),
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      stickyOrFixed: sticky,
      hasInteractiveControl: Boolean(document.querySelector("button, input, summary, [tabindex]"))
    };
  });
}

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
let cssProbe = null;

try {
  for (const vp of viewports) {
    for (const spec of routes) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      const styleSheets = new Map();
      await cdp.send("DOM.enable");
      await cdp.send("CSS.enable");
      cdp.on("CSS.styleSheetAdded", function(e){ styleSheets.set(e.header.styleSheetId, e.header); });
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", function(m){ if (m.type() === "error") consoleErrors.push(m.text()); });
      page.on("pageerror", function(e){ pageErrors.push(String(e)); });

      const response = await page.goto(baseUrl + spec.route, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(function(){ return null; });
      const status = response ? response.status() : 0;
      if (status === 200) {
        await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(function(){});
        await page.evaluate(async function(){ if (document.fonts && document.fonts.ready) await document.fonts.ready; });
        if (!cssProbe) {
          cssProbe = await page.evaluate(async function(){
            const link = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find(function(x){ return /\/assets\/css\/main\.css(?:\?|$)/.test(x.href); });
            if (!link) return { found: false };
            const text = await fetch(link.href, { cache: "no-store" }).then(function(r){ return r.text(); });
            return {
              found: true,
              href: link.href,
              bytes: text.length,
              containsNeuralMastheadRules: text.includes(".neural-site-masthead"),
              containsLbflMastheadRules: text.includes(".lbfl-masthead"),
              containsArchiveItemRules: text.includes(".archive__item"),
              containsContextualSidebarRules: text.includes(".contextual-sidebar-nav")
            };
          });
        }
        const st = await state(page);
        const elements = [];
        for (const item of critical) elements.push(await inspectWithCdp(page, cdp, styleSheets, item[0], item[1], item[2]));
        results.push({ viewport: vp.name, width: vp.width, route: spec.route, family: spec.family, required: spec.required, status: status, finalUrl: page.url(), state: st, elements: elements, consoleErrors: consoleErrors, pageErrors: pageErrors });
        try {
          await page.screenshot({ path: path.join(outputDir, vp.name + "-" + spec.name + ".png"), fullPage: true });
        } catch (error) {
          results[results.length - 1].screenshotWarning = String(error);
          console.warn("F0 screenshot warning " + vp.name + " " + spec.route + ": " + String(error));
        }
      } else {
        results.push({ viewport: vp.name, width: vp.width, route: spec.route, family: spec.family, required: spec.required, status: status, missing: true, consoleErrors: consoleErrors, pageErrors: pageErrors });
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}

const requiredFailures = results.filter(function(r){ return r.required && r.status !== 200; });
const mainCssFailures = results.filter(function(r){ return r.status === 200 && !(r.state && r.state.mainCssLoaded); });
const neuralRendered = results.reduce(function(n,r){ return n + ((r.state && r.state.neuralMastheads) || 0); }, 0);
const lbflRendered = results.reduce(function(n,r){ return n + ((r.state && r.state.lbflMastheads) || 0); }, 0);
const sidebarRendered = results.some(function(r){ return ((r.state && r.state.contextualSidebars) || 0) > 0; });
const archiveRendered = results.some(function(r){ return ((r.state && r.state.archiveCards) || 0) > 0; });
const paginationRendered = results.some(function(r){ return ((r.state && r.state.neuralPagination) || 0) > 0; });
const paginationStyleRendered = results.some(function(r){ return Boolean(r.state && r.state.embeddedPaginationStyle); });
const paginationProbes = results.filter(function(r){ return r.family === "paginated-index"; });
const paginationUnavailableByCurrentData = paginationProbes.length > 0 && paginationProbes.every(function(r){ return r.status === 404; });
const requiredBrowserErrors = results.filter(function(r){ return r.required; }).reduce(function(n,r){ return n + (r.consoleErrors || []).length + (r.pageErrors || []).length; }, 0);
const paginationConditionResolved = (paginationRendered && paginationStyleRendered) || paginationUnavailableByCurrentData;

const gates = {
  exactHeadInputBound: /^[0-9a-f]{40}$/.test(expectedSha),
  deploymentIdentityBound: Boolean(deploymentId),
  productionStylesheetLoaded: Boolean(cssProbe && cssProbe.found) && mainCssFailures.length === 0,
  compiledNeuralRulesPresent: Boolean(cssProbe && cssProbe.containsNeuralMastheadRules),
  lbflMastheadRendered: lbflRendered > 0,
  neuralMastheadRenderedNowhereInSample: neuralRendered === 0,
  contextualSidebarRendered: sidebarRendered,
  archiveCardsRendered: archiveRendered,
  paginationConditionResolved: paginationConditionResolved,
  paginationRenderedWhenInstantiated: paginationRendered,
  embeddedPaginationStyleRenderedWhenInstantiated: paginationStyleRendered,
  paginationUnavailableByCurrentData: paginationUnavailableByCurrentData,
  requiredRoutesHTTP200: requiredFailures.length === 0,
  requiredRouteBrowserRuntimeErrorsZero: requiredBrowserErrors === 0
};
const requiredGateKeys = [
  "exactHeadInputBound",
  "deploymentIdentityBound",
  "productionStylesheetLoaded",
  "compiledNeuralRulesPresent",
  "lbflMastheadRendered",
  "neuralMastheadRenderedNowhereInSample",
  "contextualSidebarRendered",
  "archiveCardsRendered",
  "paginationConditionResolved",
  "requiredRoutesHTTP200",
  "requiredRouteBrowserRuntimeErrorsZero"
];
const passed = requiredGateKeys.every(function(key){ return gates[key] === true; });
const report = { contract: "lbfl-wcag22-f0-runtime-cascade-v1", expectedSha: expectedSha, previewUrl: baseUrl, deploymentId: deploymentId, generatedAt: new Date().toISOString(), compiledCssProbe: cssProbe, gates: gates, requiredGateKeys: requiredGateKeys, passed: passed, results: results };
await fs.writeFile(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2) + "\n");

const md = ["# WCAG 2.2 F0 Runtime Cascade Evidence", "", "- Exact head: " + expectedSha, "- Preview: " + baseUrl, "- Deployment ID: " + (deploymentId || "MISSING"), "- Overall runtime gate: **" + (passed ? "PASS" : "HOLD") + "**", "", "## Gate summary", ""];
Object.entries(gates).forEach(function(pair){ md.push("- " + pair[0] + ": **" + (pair[1] ? "PASS" : "HOLD") + "**"); });
md.push("", "## Route / viewport matrix", "", "| Viewport | Route | HTTP | LBFL masthead | Neural masthead | Sidebar | Archive cards | Pagination | Embedded pagination CSS | Overflow |", "|---|---|---:|---:|---:|---:|---:|---:|---:|---:|");
results.forEach(function(r){
  const st = r.state || {};
  md.push("| " + r.viewport + " | " + r.route + " | " + r.status + " | " + (st.lbflMastheads ?? "-") + " | " + (st.neuralMastheads ?? "-") + " | " + (st.contextualSidebars ?? "-") + " | " + (st.archiveCards ?? "-") + " | " + (st.neuralPagination ?? "-") + " | " + (st.embeddedPaginationStyle ? "yes" : "no") + " | " + (st.horizontalOverflow ? "yes" : "no") + " |");
});
md.push("", "## Matched-rule evidence", "");
results.filter(function(r){ return r.status === 200; }).forEach(function(r){
  md.push("### " + r.viewport + " — " + r.route, "");
  (r.elements || []).filter(function(el){ return el.present; }).forEach(function(el){
    md.push("- **" + el.label + "** " + el.selector + ": " + JSON.stringify(el.computed));
    (el.matchedRules || []).slice(-12).forEach(function(rule){
      md.push("  - " + (rule.selector || "(inline/anonymous)") + " — " + (rule.sourceURL || rule.origin || "inline") + " — " + rule.declarations.map(function(d){ return d.name + ":" + d.value + (d.important ? " !important" : ""); }).join("; "));
    });
  });
  md.push("");
});
await fs.writeFile(path.join(outputDir, "report.md"), md.join("\n") + "\n");
console.log(JSON.stringify(gates, null, 2));
console.log(passed ? "WCAG22_F0_RUNTIME_PASS" : "WCAG22_F0_RUNTIME_HOLD");
process.exitCode = passed ? 0 : 1;
