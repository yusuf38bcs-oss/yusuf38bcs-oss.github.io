#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const target = process.env.LBFL_I02_URL || "http://127.0.0.1:4000/";
const outDir = process.env.LBFL_I02_REPORT_DIR || "conv04-i02-browser-report";
const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

fs.mkdirSync(outDir, { recursive: true });

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
}

const browser = await chromium.launch({ headless: true });
const results = [];
let failed = false;

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(String(error)));

    await page.route("https://sibforms.com/**", async (route) => {
      await route.fulfill({ status: 204, body: "" });
    });

    await page.goto(target, { waitUntil: "domcontentloaded", timeout: 45000 });
    await settle(page);

    const staticState = await page.evaluate(() => {
      const hrefs = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map((x) => ({
        lang: x.getAttribute("hreflang"),
        href: x.getAttribute("href"),
      }));
      const legalTargets = [
        "/about/", "/contact/", "/editorial-policy/", "/privacy-policy/",
        "/terms-and-conditions/", "/disclaimer/", "/cookie-preferences/",
        "/accessibility/", "/corrections/", "/sitemap.xml"
      ];
      const legal = legalTargets.every((href) =>
        Array.from(document.querySelectorAll(".footer-legal-links a")).some((a) => {
          const value = a.getAttribute("href") || "";
          return value === href || value.endsWith(href);
        })
      );
      const main = document.querySelector("#main-content");
      const journey = Array.from(document.querySelectorAll(".lbfl-v3-journey__steps li"));
      const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map((x) => x.getAttribute("href") || "");
      return {
        v3: document.documentElement.classList.contains("lbfl-home-v3-document"),
        academicHtml: document.documentElement.classList.contains("lbfl-academic-v1"),
        academicBody: document.body.classList.contains("lbfl-academic-v1-active"),
        academicSurface: main?.getAttribute("data-lbfl-academic-surface"),
        academicRole: main?.getAttribute("data-lbfl-academic-role"),
        logoVisible: Boolean(document.querySelector(".lbfl-v3-brand .lbfl-platform-brand__logo")),
        logoSrc: document.querySelector(".lbfl-v3-brand .lbfl-platform-brand__logo")?.getAttribute("src") || "",
        searchToggleVisible: Boolean(document.querySelector(".lbfl-v3-search-button.search__toggle")),
        searchToggleSize: (() => {
          const el = document.querySelector(".lbfl-v3-search-button.search__toggle");
          if (!el) return { width: 0, height: 0 };
          const rect = el.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        })(),
        newsletterVisible: Boolean(document.querySelector("#newsletter")),
        newsletterButtonVisible: Boolean(document.querySelector("[data-brevo-open]")),
        legal,
        journeyCount: journey.length,
        has07: journey.some((x) => /Cell Wall and Vacuole/i.test(x.textContent || "")),
        has08: journey.some((x) => /Plastid and Chloroplast/i.test(x.textContent || "")),
        hreflangEn: hrefs.some((x) => x.lang === "en" && /learningbiologyforlife\.org\/$/.test(x.href || "")),
        hreflangBn: hrefs.some((x) => x.lang === "bn" && /learningbiologyforlife\.org\/bn\/$/.test(x.href || "")),
        hreflangDefault: hrefs.some((x) => x.lang === "x-default" && /learningbiologyforlife\.org\/$/.test(x.href || "")),
        respiratoryCssAbsent: !stylesheets.some((x) => x.includes("respiratory-system.css")),
        horizontalOverflow:
          document.documentElement.scrollWidth > window.innerWidth + 2 ||
          document.body.scrollWidth > window.innerWidth + 2,
      };
    });

    const search = { opened: false };
    const searchToggle = page.locator(".lbfl-v3-search-button.search__toggle");
    if (await searchToggle.isVisible()) {
      await searchToggle.click();
      search.opened = await page.locator(".search-content").isVisible().catch(() => false);
      await page.keyboard.press("Escape").catch(() => {});
    }

    const newsletter = { opened: false, focusedEmail: false, closed: false };
    const newsletterButton = page.locator("[data-brevo-open]");
    if (await newsletterButton.isVisible()) {
      await newsletterButton.click();
      const modal = page.locator("#brevo-newsletter-modal");
      newsletter.opened = await modal.isVisible();
      await page.waitForTimeout(120);
      newsletter.focusedEmail = await page.locator("#EMAIL").evaluate((el) => document.activeElement === el).catch(() => false);
      await page.keyboard.press("Escape");
      newsletter.closed = !(await modal.isVisible());
    }

    const checks = {
      ...staticState,
      searchOpened: search.opened,
      newsletterOpened: newsletter.opened,
      newsletterFocusedEmail: newsletter.focusedEmail,
      newsletterClosed: newsletter.closed,
      consoleErrors,
      pageErrors,
    };

    const passed =
      checks.v3 &&
      checks.academicHtml &&
      checks.academicBody &&
      checks.academicSurface === "v1" &&
      checks.academicRole === "platform_home" &&
      checks.logoVisible &&
      checks.logoSrc.includes("/assets/images/logo.png") &&
      checks.searchToggleVisible &&
      checks.searchToggleSize.width >= 44 &&
      checks.searchToggleSize.height >= 44 &&
      checks.searchOpened &&
      checks.newsletterVisible &&
      checks.newsletterButtonVisible &&
      checks.newsletterOpened &&
      checks.newsletterFocusedEmail &&
      checks.newsletterClosed &&
      checks.legal &&
      checks.journeyCount === 8 &&
      checks.has07 &&
      checks.has08 &&
      checks.hreflangEn &&
      checks.hreflangBn &&
      checks.hreflangDefault &&
      checks.respiratoryCssAbsent &&
      !checks.horizontalOverflow &&
      checks.consoleErrors.length === 0 &&
      checks.pageErrors.length === 0;

    if (!passed) failed = true;
    results.push({ viewport, passed, checks });

    await page.screenshot({
      path: path.join(outDir, `${viewport.name}.png`),
      fullPage: true,
    });

    await context.close();
  }
} finally {
  await browser.close();
}

const report = {
  schema: "lbfl-conv04-i02-homepage-browser-v1",
  target,
  result: failed ? "FAIL" : "PASS",
  results,
};

fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
process.exit(failed ? 1 : 0);
