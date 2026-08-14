#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import { chromium } from "playwright";
import {
  assertCertificationTokenAbsent,
  installCertificationBypassRoute,
  requireCertificationToken,
  sanitizeRecordedHeaders,
} from "./certification-bypass.mjs";

const ADS_REQUEST = /(?:adsbygoogle|pagead2\.googlesyndication\.com|googleadservices\.com|doubleclick\.net)/i;
const EXPECTED_ACCOUNT = "ca-pub-9144658795059352";
const VIEWPORTS = [
  { name: "mobile-320x800", width: 320, height: 800 },
  { name: "mobile-375x812", width: 375, height: 812 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "laptop-1024x768", width: 1024, height: 768 },
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "large-1920x1080", width: 1920, height: 1080 },
];

function argument(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const previewUrl = argument("--url");
const expectedSha = argument("--expected-sha");
const outputDir = path.resolve(argument("--output-dir", "browser-certification"));
const certificationToken = requireCertificationToken(
  process.env.PRODUCTION_CERTIFICATION_BYPASS_TOKEN,
);
delete process.env.PRODUCTION_CERTIFICATION_BYPASS_TOKEN;

if (!previewUrl || !expectedSha) {
  console.error("Usage: adsense-browser-certification.mjs --url URL --expected-sha SHA [--output-dir DIR]");
  process.exit(2);
}

await fs.mkdir(outputDir, { recursive: true });

function createProbe(page) {
  const requests = [];
  const consoleErrors = [];
  const pageErrors = [];

  page.on("request", (request) => {
    requests.push({
      headers: sanitizeRecordedHeaders(request.headers()),
      method: request.method(),
      resourceType: request.resourceType(),
      url: request.url(),
    });
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(String(error)));

  return { requests, consoleErrors, pageErrors };
}

function adRequests(requests, start = 0) {
  return requests.slice(start).filter((request) => ADS_REQUEST.test(request.url));
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(2600);
}

async function readConsentState(page) {
  return page.evaluate(() => {
    const normalize = (item) => {
      if (Array.isArray(item)) return item;
      if (item && typeof item === "object" && Object.prototype.hasOwnProperty.call(item, "0")) {
        return Array.from(item);
      }
      return item;
    };
    const consentCalls = (window.dataLayer || [])
      .map(normalize)
      .filter((item) => Array.isArray(item) && item[0] === "consent")
      .map((item) => ({ command: item[1], payload: item[2] || {} }));
    const updates = consentCalls.filter((call) => call.command === "update");
    const defaults = consentCalls.filter((call) => call.command === "default");
    const banner = document.querySelector("#gdpr-banner[data-cookie-banner]");
    return {
      bannerVisible: Boolean(
        banner && !banner.hidden && banner.classList.contains("is-visible") &&
        getComputedStyle(banner).display !== "none"
      ),
      cookie: document.cookie,
      defaults,
      localStorage: window.localStorage.getItem("cookie-consent"),
      meta: Array.from(document.querySelectorAll('meta[name="google-adsense-account"]')).map(
        (element) => element.content
      ),
      scripts: Array.from(document.scripts).map((script) => script.src).filter(Boolean),
      updates,
    };
  });
}

function updateIsAnalyticsOnly(update, state) {
  const keys = Object.keys(update?.payload || {}).sort();
  return keys.length === 1 && keys[0] === "analytics_storage" &&
    update.payload.analytics_storage === state;
}

function advertisingDefaultsRemainDenied(defaults) {
  return defaults.some(({ payload }) =>
    payload?.ad_storage === "denied" &&
    payload?.ad_user_data === "denied" &&
    payload?.ad_personalization === "denied"
  );
}

async function runViewport(browser, viewport) {
  const context = await browser.newContext({
    reducedMotion: "no-preference",
    viewport: { width: viewport.width, height: viewport.height },
  });
  await installCertificationBypassRoute(context, certificationToken);
  const page = await context.newPage();
  const probe = createProbe(page);
  let response;

  try {
    response = await page.goto(previewUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    await page.locator("#gdpr-banner[data-cookie-banner]").waitFor({ state: "visible", timeout: 10_000 });

    const layout = await page.evaluate(() => {
      const visible = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      const banner = document.querySelector("#gdpr-banner[data-cookie-banner]");
      const bannerRect = banner?.getBoundingClientRect();
      const heroImage = document.querySelector(".lbfl-premium-cell__image");
      return {
        bannerFits: Boolean(
          bannerRect && bannerRect.left >= -1 && bannerRect.right <= window.innerWidth + 1 &&
          bannerRect.top >= -1 && bannerRect.bottom <= window.innerHeight + 1
        ),
        bannerVisible: visible("#gdpr-banner[data-cookie-banner]"),
        ctaVisible: visible('.lbfl-premium-hero a[href="/biology/hsc-corner/"]'),
        headingVisible: visible(".lbfl-premium-hero h1"),
        heroImageLoaded: Boolean(heroImage?.complete && heroImage.naturalWidth > 0),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        logoVisible: visible('.lbfl-premium-header__brand[aria-label="Learning Biology For Life home"]'),
        menuOrNavVisible: visible('.lbfl-premium-header__desktop-nav') || visible('.lbfl-premium-header__menu > summary'),
        meta: Array.from(document.querySelectorAll('meta[name="google-adsense-account"]')).map(
          (element) => element.content
        ),
        searchVisible: visible('.lbfl-premium-header__search > summary'),
        viewport: { height: window.innerHeight, width: window.innerWidth },
      };
    });

    await page.evaluate(axe.source);
    const axeResult = await page.evaluate(async () => {
      const result = await window.axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
        },
      });
      return result.violations.map((violation) => ({
        help: violation.help,
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => ({ html: node.html, target: node.target })),
      }));
    });

    const focusSequence = [];
    for (let index = 0; index < 100; index += 1) {
      await page.keyboard.press("Tab");
      const focus = await page.evaluate(() => {
        const element = document.activeElement;
        if (!element || element === document.body) return null;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return {
          action: element.getAttribute("data-cookie-consent-action"),
          focusVisible: element.matches(":focus-visible"),
          inViewport: rect.bottom >= 0 && rect.top <= window.innerHeight && rect.right >= 0 && rect.left <= window.innerWidth,
          label: element.getAttribute("aria-label") || element.textContent?.trim().slice(0, 80) || element.tagName,
          outline: `${style.outlineStyle} ${style.outlineWidth}`,
          tag: element.tagName,
        };
      });
      if (focus) focusSequence.push(focus);
      if (
        focusSequence.some((entry) => entry.action === "accept") &&
        focusSequence.some((entry) => entry.action === "decline")
      ) break;
    }

    const focusPassed = ["accept", "decline"].every((action) =>
      focusSequence.some((entry) => entry.action === action && entry.focusVisible && entry.inViewport)
    );
    const layoutPassed = response?.status() === 200 &&
      layout.viewport.width === viewport.width && layout.viewport.height === viewport.height &&
      layout.bannerFits && layout.bannerVisible && layout.ctaVisible && layout.headingVisible &&
      layout.heroImageLoaded && !layout.horizontalOverflow && layout.logoVisible &&
      layout.menuOrNavVisible && layout.searchVisible &&
      layout.meta.length === 1 && layout.meta[0] === EXPECTED_ACCOUNT;
    const passed = layoutPassed && axeResult.length === 0 && focusPassed &&
      adRequests(probe.requests).length === 0 && probe.consoleErrors.length === 0 &&
      probe.pageErrors.length === 0;

    await page.screenshot({
      fullPage: true,
      path: path.join(outputDir, `${viewport.name}.png`),
    });

    return {
      ...viewport,
      adsenseRequests: adRequests(probe.requests),
      axeViolations: axeResult,
      consoleErrors: probe.consoleErrors,
      focusPassed,
      focusSequence,
      layout,
      layoutPassed,
      pageErrors: probe.pageErrors,
      passed,
      status: response?.status() || 0,
    };
  } finally {
    await context.close();
  }
}

async function runConsentMatrix(browser) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  await installCertificationBypassRoute(context, certificationToken);
  const page = await context.newPage();
  const probe = createProbe(page);

  try {
    await page.goto(previewUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    await page.locator("#gdpr-banner[data-cookie-banner]").waitFor({ state: "visible", timeout: 10_000 });
    const fresh = await readConsentState(page);

    let requestBoundary = probe.requests.length;
    await page.getByRole("button", { name: "Accept", exact: true }).click();
    await page.waitForTimeout(500);
    const accepted = await readConsentState(page);
    const acceptedAds = adRequests(probe.requests, requestBoundary);

    requestBoundary = probe.requests.length;
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    const storedReload = await readConsentState(page);
    const storedReloadAds = adRequests(probe.requests, requestBoundary);

    requestBoundary = probe.requests.length;
    await page.evaluate(() => {
      window.localStorage.removeItem("cookie-consent");
      document.cookie = "cookie-consent=; Max-Age=0; Path=/; SameSite=Lax; Secure";
    });
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    await page.locator("#gdpr-banner[data-cookie-banner]").waitFor({ state: "visible", timeout: 10_000 });
    const reset = await readConsentState(page);
    const resetAds = adRequests(probe.requests, requestBoundary);

    requestBoundary = probe.requests.length;
    await page.getByRole("button", { name: "Decline", exact: true }).click();
    await page.waitForTimeout(500);
    const declined = await readConsentState(page);
    const declinedAds = adRequests(probe.requests, requestBoundary);

    const acceptedUpdate = accepted.updates.at(-1);
    const reloadUpdate = storedReload.updates.at(-1);
    const declinedUpdate = declined.updates.at(-1);
    const passed = fresh.bannerVisible && fresh.localStorage === null &&
      fresh.meta.length === 1 && fresh.meta[0] === EXPECTED_ACCOUNT &&
      accepted.localStorage === "granted" && !accepted.bannerVisible &&
      updateIsAnalyticsOnly(acceptedUpdate, "granted") &&
      advertisingDefaultsRemainDenied(accepted.defaults) &&
      storedReload.localStorage === "granted" && !storedReload.bannerVisible &&
      updateIsAnalyticsOnly(reloadUpdate, "granted") &&
      reset.localStorage === null && reset.bannerVisible &&
      declined.localStorage === "denied" && !declined.bannerVisible &&
      updateIsAnalyticsOnly(declinedUpdate, "denied") &&
      advertisingDefaultsRemainDenied(declined.defaults) &&
      [acceptedAds, storedReloadAds, resetAds, declinedAds].every((requests) => requests.length === 0) &&
      [fresh, accepted, storedReload, reset, declined].every((state) =>
        state.scripts.every((script) => !ADS_REQUEST.test(script))
      ) && probe.consoleErrors.length === 0 && probe.pageErrors.length === 0;

    return {
      accepted,
      acceptedAds,
      consoleErrors: probe.consoleErrors,
      declined,
      declinedAds,
      fresh,
      pageErrors: probe.pageErrors,
      passed,
      reset,
      resetAds,
      storedReload,
      storedReloadAds,
    };
  } finally {
    await context.close();
  }
}

async function runReducedMotion(browser) {
  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 375, height: 812 },
  });
  await installCertificationBypassRoute(context, certificationToken);
  const page = await context.newPage();
  const probe = createProbe(page);

  try {
    await page.goto(previewUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    const state = await page.evaluate(() => {
      const parseSeconds = (value) => value.split(",").map((part) => {
        const token = part.trim();
        return token.endsWith("ms") ? Number.parseFloat(token) / 1000 : Number.parseFloat(token) || 0;
      });
      const offenders = [];
      document.querySelectorAll(".lbfl-home-v2 *, .lbfl-premium-header *, #gdpr-banner *").forEach((element) => {
        const style = getComputedStyle(element);
        const longest = Math.max(
          0,
          ...parseSeconds(style.animationDuration),
          ...parseSeconds(style.transitionDuration)
        );
        if (longest > 0.02) offenders.push({ duration: longest, tag: element.tagName, className: element.className });
      });
      const root = document.querySelector("[data-homepage-v2]");
      return {
        dataset: root?.dataset.reducedMotion,
        mediaMatches: matchMedia("(prefers-reduced-motion: reduce)").matches,
        offenders: offenders.slice(0, 20),
      };
    });
    return {
      ...state,
      adsenseRequests: adRequests(probe.requests),
      consoleErrors: probe.consoleErrors,
      pageErrors: probe.pageErrors,
      passed: state.mediaMatches && state.dataset === "true" && state.offenders.length === 0 &&
        adRequests(probe.requests).length === 0 && probe.consoleErrors.length === 0 &&
        probe.pageErrors.length === 0,
    };
  } finally {
    await context.close();
  }
}

async function runSaveData(browser) {
  const context = await browser.newContext({
    extraHTTPHeaders: { "Save-Data": "on" },
    viewport: { width: 375, height: 812 },
  });
  await installCertificationBypassRoute(context, certificationToken);
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    });
  });
  const page = await context.newPage();
  const probe = createProbe(page);

  try {
    await page.goto(previewUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    const state = await page.evaluate(() => ({
      dataset: document.querySelector("[data-homepage-v2]")?.dataset.saveData,
      navigatorSaveData: Boolean(navigator.connection?.saveData),
    }));
    const documentRequest = probe.requests.find((request) => request.resourceType === "document");
    return {
      ...state,
      adsenseRequests: adRequests(probe.requests),
      consoleErrors: probe.consoleErrors,
      header: documentRequest?.headers?.["save-data"] || "",
      pageErrors: probe.pageErrors,
      passed: state.dataset === "true" && state.navigatorSaveData &&
        documentRequest?.headers?.["save-data"] === "on" &&
        adRequests(probe.requests).length === 0 && probe.consoleErrors.length === 0 &&
        probe.pageErrors.length === 0,
    };
  } finally {
    await context.close();
  }
}

function markdown(report) {
  const lines = [
    "# Exact-Head Browser Certification",
    "",
    `- Expected SHA: \`${report.expectedSha}\``,
    `- Preview: ${report.previewUrl}`,
    `- Generated: ${report.generatedAt}`,
    `- Overall: **${report.passed ? "PASS" : "FAIL"}**`,
    "",
    "| Viewport | Layout | Axe | Keyboard | Ad requests | Console/page errors | Result |",
    "|---|---:|---:|---:|---:|---:|---:|",
  ];
  report.viewports.forEach((result) => {
    lines.push(
      `| ${result.name} | ${result.layoutPassed ? "PASS" : "FAIL"} | ${result.axeViolations.length} | ${result.focusPassed ? "PASS" : "FAIL"} | ${result.adsenseRequests.length} | ${result.consoleErrors.length + result.pageErrors.length} | ${result.passed ? "PASS" : "FAIL"} |`
    );
  });
  lines.push(
    "",
    `- Consent matrix: **${report.consent.passed ? "PASS" : "FAIL"}**`,
    `- Reduced motion: **${report.reducedMotion.passed ? "PASS" : "FAIL"}**`,
    `- Save-Data: **${report.saveData.passed ? "PASS" : "FAIL"}**`,
    "",
    "The consent matrix covers fresh state, Accept, stored-choice reload, reset, and Decline. Every state must retain denied advertising defaults, emit analytics-only updates, and make zero AdSense/adsbygoogle requests.",
    ""
  );
  return lines.join("\n");
}

const browser = await chromium.launch({ headless: true });
let report;
try {
  const viewports = [];
  for (const viewport of VIEWPORTS) viewports.push(await runViewport(browser, viewport));
  const consent = await runConsentMatrix(browser);
  const reducedMotion = await runReducedMotion(browser);
  const saveData = await runSaveData(browser);
  report = {
    consent,
    expectedSha,
    generatedAt: new Date().toISOString(),
    passed: viewports.every((result) => result.passed) && consent.passed &&
      reducedMotion.passed && saveData.passed,
    previewUrl,
    reducedMotion,
    saveData,
    viewports,
  };
} finally {
  await browser.close();
}

const jsonReport = `${JSON.stringify(report, null, 2)}\n`;
const markdownReport = markdown(report);
assertCertificationTokenAbsent(jsonReport, certificationToken, "Browser JSON report");
assertCertificationTokenAbsent(markdownReport, certificationToken, "Browser Markdown report");
await fs.writeFile(path.join(outputDir, "browser-certification.json"), jsonReport);
await fs.writeFile(path.join(outputDir, "browser-certification.md"), markdownReport);
console.log(markdownReport);
process.exit(report.passed ? 0 : 1);
