#!/usr/bin/env node
import process from "node:process";
import { chromium } from "playwright";
import axe from "axe-core";

const base = process.argv[process.argv.indexOf("--url") + 1] || "http://127.0.0.1:4000";
const routes = {
  personality: "/socratic/personality-archetypes/",
  socratic: "/socratic/",
  frequency: "/biology/higher-zoology-tree/biostatistics/frequency_distribution_histogram_and_polygon/",
  correlation: "/biology/higher-zoology-tree/biostatistics/correlation_and_regression/",
  hypothesis: "/biology/higher-zoology-tree/biostatistics/hypothesis_testing/"
};

const browser = await chromium.launch({ headless: true });
const failures = [];

async function open(route) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", e => errors.push(String(e)));
  const response = await page.goto(new URL(route, base).toString(), { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(500);
  if (!response || response.status() !== 200) failures.push(route + ": expected HTTP 200");
  if (errors.length) failures.push(route + ": browser errors: " + errors.join(" | "));
  return page;
}

async function contrast(page, scope = ".page__content") {
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(async (selector) => {
    const root = document.querySelector(selector);
    if (!root) return [{ id: "missing-scope", nodes: [{ target: [selector] }] }];
    const result = await window.axe.run(root, { runOnly: { type: "rule", values: ["color-contrast"] } });
    return result.violations;
  }, scope);
}

{
  const page = await open(routes.personality);
  await page.waitForSelector("[data-personality-form] input[type=radio]", { timeout: 5000 }).catch(() => null);
  const state = await page.evaluate(() => ({
    radios: document.querySelectorAll("[data-personality-form] input[type=radio]").length,
    scriptCount: Array.from(document.scripts).filter(s => s.src.includes("assets/js/learning/personality-engine.js")).length,
    reflectionBoundaries: document.querySelectorAll(".lbfl-reflection-boundary").length,
    genericBoundaries: document.querySelectorAll(".educational-boundary").length
  }));
  if (state.radios !== 40) failures.push("personality: expected 40 rendered radio controls, got " + state.radios);
  if (state.scriptCount !== 1) failures.push("personality: expected one personality runtime, got " + state.scriptCount);
  if (state.reflectionBoundaries !== 1 || state.genericBoundaries !== 0) failures.push("personality: boundary ownership mismatch");
  const violations = await contrast(page, "[data-personality-analysis]");
  if (violations.length) failures.push("personality: color-contrast violations=" + violations.length);
  await page.close();
}

{
  const page = await open(routes.socratic);
  const state = await page.evaluate(() => ({
    reflectionBoundaries: document.querySelectorAll(".lbfl-reflection-boundary").length,
    genericBoundaries: document.querySelectorAll(".educational-boundary").length,
    legacyLinks: document.querySelectorAll('a[href*="/socratic-4/socratic-assessment/"]').length,
    canonicalLinks: document.querySelectorAll('a[href*="/socratic/multiple-intelligences/"]').length
  }));
  if (state.reflectionBoundaries !== 1 || state.genericBoundaries !== 0) failures.push("socratic: boundary ownership mismatch");
  if (state.legacyLinks !== 0) failures.push("socratic: legacy assessment link remains");
  if (state.canonicalLinks < 1) failures.push("socratic: canonical MI link missing");
  await page.close();
}

for (const [name, route] of Object.entries({
  frequency: routes.frequency,
  correlation: routes.correlation,
  hypothesis: routes.hypothesis
})) {
  const page = await open(route);
  const violations = await contrast(page);
  if (violations.length) {
    const targets = violations.flatMap(v => v.nodes.map(n => n.target.join(" "))).slice(0, 10);
    failures.push(name + ": color-contrast violations=" + violations.length + " targets=" + targets.join(","));
  }
  if (name === "frequency") {
    const bg = await page.locator(".biostats-module").evaluate(el => getComputedStyle(el).backgroundColor).catch(() => "");
    if (bg !== "rgb(15, 23, 42)") failures.push("frequency: expected opaque dark module background, got " + bg);
  }
  await page.close();
}

await browser.close();

if (failures.length) {
  console.error("CONV-04I-00 browser certification: FAIL");
  failures.forEach(f => console.error("- " + f));
  process.exit(1);
}
console.log("CONV-04I-00 browser certification: PASS");
