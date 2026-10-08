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
      const scripts = Array.from(document.querySelectorAll("script[src]")).map((x) => x.getAttribute("src") || "");
      const homepageCss = stylesheets.find((x) => x.includes("/assets/css/homepage-v3.css")) || "";
      const homepageJs = scripts.find((x) => x.includes("/assets/js/home/homepage-v3.js")) || "";
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
        legalTargets44: Array.from(document.querySelectorAll(".footer-legal-links a")).every((a) => {
          const rect = a.getBoundingClientRect();
          return rect.height >= 44 && rect.width >= 44;
        }),
        journeyCount: journey.length,
        has07: journey.some((x) => /Cell Wall and Vacuole/i.test(x.textContent || "")),
        has08: journey.some((x) => /Plastid and Chloroplast/i.test(x.textContent || "")),
        hreflangEn: hrefs.some((x) => x.lang === "en" && /learningbiologyforlife\.org\/$/.test(x.href || "")),
        hreflangBn: hrefs.some((x) => x.lang === "bn" && /learningbiologyforlife\.org\/bn\/$/.test(x.href || "")),
        hreflangDefault: hrefs.some((x) => x.lang === "x-default" && /learningbiologyforlife\.org\/$/.test(x.href || "")),
        respiratoryCssAbsent: !stylesheets.some((x) => x.includes("respiratory-system.css")),
        assetRevisionImmutable:
          /[?&]v=css-[0-9a-f]{12}-js-[0-9a-f]{12}/.test(homepageCss) &&
          /[?&]v=css-[0-9a-f]{12}-js-[0-9a-f]{12}/.test(homepageJs),
        horizontalOverflow:
          document.documentElement.scrollWidth > window.innerWidth + 2 ||
          document.body.scrollWidth > window.innerWidth + 2,
      };
    });

    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(250);
    const legalPrint = await page.evaluate(() => {
      const area = document.querySelector(".lbfl-v3-footer .footer-legal-area");
      const links = Array.from(document.querySelectorAll(".lbfl-v3-footer .footer-legal-links a"));

      function parseRgb(value) {
        const match = String(value || "").match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
        return match ? match.slice(1, 4).map(Number) : null;
      }

      function channel(value) {
        const normalized = value / 255;
        return normalized <= 0.03928
          ? normalized / 12.92
          : Math.pow((normalized + 0.055) / 1.055, 2.4);
      }

      function luminance(rgb) {
        return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
      }

      function contrast(foreground, background) {
        const fg = parseRgb(foreground);
        const bg = parseRgb(background);
        if (!fg || !bg) return 0;
        const light = Math.max(luminance(fg), luminance(bg));
        const dark = Math.min(luminance(fg), luminance(bg));
        return (light + 0.05) / (dark + 0.05);
      }

      if (!area) {
        return { safe: false, visible: false, background: "", color: "", minLinkContrast: 0 };
      }

      const style = getComputedStyle(area);
      const background = style.backgroundColor;
      const color = style.color;
      const linkContrasts = links.map((link) => contrast(getComputedStyle(link).color, background));
      const minLinkContrast = linkContrasts.length ? Math.min(...linkContrasts) : 0;
      const areaContrast = contrast(color, background);
      const visible = style.display !== "none" && style.visibility !== "hidden";

      return {
        safe:
          visible &&
          background === "rgb(255, 255, 255)" &&
          areaContrast >= 4.5 &&
          minLinkContrast >= 4.5,
        visible,
        background,
        color,
        areaContrast,
        minLinkContrast,
      };
    });
    await page.emulateMedia({ media: "screen" });

    const legalFocus = {
      focused: false,
      visible: false,
      cleared: false,
      style: { style: "", width: 0, offset: 0, color: "" },
    };
    const firstLegalLink = page.locator(".footer-legal-links a").first();
    if (await firstLegalLink.isVisible()) {
      await firstLegalLink.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      legalFocus.focused = await firstLegalLink.evaluate((el) => document.activeElement === el).catch(() => false);
      legalFocus.style = await firstLegalLink.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          style: style.outlineStyle,
          width: Number.parseFloat(style.outlineWidth) || 0,
          offset: Number.parseFloat(style.outlineOffset) || 0,
          color: style.outlineColor,
        };
      }).catch(() => ({ style: "", width: 0, offset: 0, color: "" }));
      legalFocus.visible =
        legalFocus.focused &&
        legalFocus.style.style !== "none" &&
        legalFocus.style.width >= 3 &&
        legalFocus.style.offset >= 3;
      await page.keyboard.press("Tab");
      legalFocus.cleared = await firstLegalLink.evaluate((el) => {
        const computed = getComputedStyle(el);
        const inlineFocusProperties = [
          "transition",
          "outline-style",
          "outline-width",
          "outline-color",
          "outline-offset",
        ];
        return (
          document.activeElement !== el &&
          inlineFocusProperties.every((property) => el.style.getPropertyValue(property) === "") &&
          (computed.outlineStyle === "none" || (Number.parseFloat(computed.outlineWidth) || 0) === 0)
        );
      }).catch(() => false);
    }

    const noJsFallback = await page.evaluate(() => {
      const root = document.documentElement;
      const hadNoJs = root.classList.contains("no-js");
      const hadJs = root.classList.contains("js");
      root.classList.add("no-js");
      root.classList.remove("js");
      const search = document.querySelector(".lbfl-v3-search-button.search__toggle");
      const newsletter = document.querySelector("[data-brevo-open]");
      const state = {
        searchHidden: Boolean(search) && getComputedStyle(search).display === "none",
        newsletterHidden: Boolean(newsletter) && getComputedStyle(newsletter).display === "none",
      };
      if (!hadNoJs) root.classList.remove("no-js");
      if (hadJs) root.classList.add("js");
      return state;
    });

    const search = { opened: false };
    const searchToggle = page.locator(".lbfl-v3-search-button.search__toggle");
    if (await searchToggle.isVisible()) {
      await searchToggle.click();
      search.opened = await page.locator(".search-content").isVisible().catch(() => false);
      await page.keyboard.press("Escape").catch(() => {});
    }

    const newsletter = {
      opened: false,
      focusedEmail: false,
      closed: false,
      closeSize: { width: 0, height: 0 },
      closeFocused: false,
      closeFocusVisible: false,
      closeFocusCleared: false,
      closeFocusStyle: { style: "", width: 0, offset: 0, color: "" },
      escapeFocusStable: false,
      hiddenEscapeNoTriggerSteal: false,
      printSafe: false,
      printDisplay: null,
      printModalDisplay: null,
      scrollLocked: false,
      consentSuppressed: false,
      bodyEscapeStable: false,
      bodyHiddenEscapeNoTriggerSteal: false,
    };
    const newsletterButton = page.locator("[data-brevo-open]");
    if (await newsletterButton.isVisible()) {
      await newsletterButton.click();
      const modal = page.locator("#brevo-newsletter-modal");
      newsletter.opened = await modal.isVisible();
      newsletter.scrollLocked = await page.evaluate(() => {
        const htmlOverflow = getComputedStyle(document.documentElement).overflow;
        const bodyOverflow = getComputedStyle(document.body).overflow;
        return htmlOverflow === "hidden" && bodyOverflow === "hidden";
      });
      newsletter.consentSuppressed = await page.locator("#gdpr-banner").evaluate((el) => {
        const wasHidden = el.hidden;
        el.hidden = false;
        const style = getComputedStyle(el);
        const suppressed = style.visibility === "hidden" && style.pointerEvents === "none";
        el.hidden = wasHidden;
        return suppressed;
      });
      newsletter.closeSize = await page.locator(".brevo-modal-close").evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
      await page.waitForTimeout(120);
      newsletter.focusedEmail = await page.locator("#EMAIL").evaluate((el) => document.activeElement === el).catch(() => false);

      await page.keyboard.press("Shift+Tab");
      newsletter.closeFocused = await page.locator(".brevo-modal-close").evaluate((el) => document.activeElement === el).catch(() => false);
      newsletter.closeFocusStyle = await page.locator(".brevo-modal-close").evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          style: style.outlineStyle,
          width: Number.parseFloat(style.outlineWidth) || 0,
          offset: Number.parseFloat(style.outlineOffset) || 0,
          color: style.outlineColor,
        };
      }).catch(() => ({ style: "", width: 0, offset: 0, color: "" }));
      newsletter.closeFocusVisible =
        newsletter.closeFocusStyle.style !== "none" &&
        newsletter.closeFocusStyle.width >= 3 &&
        newsletter.closeFocusStyle.offset >= 3;
      await page.locator("#EMAIL").focus();
      newsletter.closeFocusCleared = await page.locator(".brevo-modal-close").evaluate((el) => {
        const computed = getComputedStyle(el);
        const inlineFocusProperties = [
          "outline-style",
          "outline-width",
          "outline-color",
          "outline-offset",
        ];
        return (
          document.activeElement !== el &&
          inlineFocusProperties.every((property) => el.style.getPropertyValue(property) === "") &&
          (computed.outlineStyle === "none" || (Number.parseFloat(computed.outlineWidth) || 0) === 0)
        );
      }).catch(() => false);

      await page.emulateMedia({ media: "print" });
      newsletter.printDisplay = await page.locator("#newsletter").evaluate((el) => getComputedStyle(el).display);
      newsletter.printModalDisplay = await modal.evaluate((el) => getComputedStyle(el).display);
      newsletter.printSafe =
        newsletter.printDisplay === "none" &&
        newsletter.printModalDisplay === "none";
      await page.emulateMedia({ media: "screen" });

      await page.keyboard.press("Escape");
      newsletter.closed = !(await modal.isVisible());

      await searchToggle.focus();
      await page.keyboard.press("Escape");
      await page.waitForTimeout(30);
      newsletter.escapeFocusStable = await searchToggle.evaluate((el) => document.activeElement === el).catch(() => false);
      newsletter.hiddenEscapeNoTriggerSteal = await page.evaluate(() =>
        document.activeElement !== document.querySelector("[data-brevo-open]")
      ).catch(() => false);

      await page.evaluate(() => {
        document.body.setAttribute("tabindex", "-1");
        document.body.focus();
        document.body.removeAttribute("tabindex");
      });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(30);
      newsletter.bodyEscapeStable = await page.evaluate(() => document.activeElement === document.body).catch(() => false);
      newsletter.bodyHiddenEscapeNoTriggerSteal = await page.evaluate(() =>
        document.activeElement !== document.querySelector("[data-brevo-open]")
      ).catch(() => false);
    }

    const checks = {
      ...staticState,
      legalPrint,
      legalFocusFocused: legalFocus.focused,
      legalFocusVisible: legalFocus.visible,
      legalFocusCleared: legalFocus.cleared,
      legalFocusStyle: legalFocus.style,
      noJsFallback,
      searchOpened: search.opened,
      newsletterOpened: newsletter.opened,
      newsletterFocusedEmail: newsletter.focusedEmail,
      newsletterClosed: newsletter.closed,
      newsletterCloseSize: newsletter.closeSize,
      newsletterCloseFocused: newsletter.closeFocused,
      newsletterCloseFocusVisible: newsletter.closeFocusVisible,
      newsletterCloseFocusCleared: newsletter.closeFocusCleared,
      newsletterCloseFocusStyle: newsletter.closeFocusStyle,
      newsletterEscapeFocusStable: newsletter.escapeFocusStable,
      newsletterHiddenEscapeNoTriggerSteal: newsletter.hiddenEscapeNoTriggerSteal,
      newsletterPrintSafe: newsletter.printSafe,
      newsletterPrintDisplay: newsletter.printDisplay,
      newsletterPrintModalDisplay: newsletter.printModalDisplay,
      newsletterScrollLocked: newsletter.scrollLocked,
      newsletterConsentSuppressed: newsletter.consentSuppressed,
      newsletterBodyEscapeStable: newsletter.bodyEscapeStable,
      newsletterBodyHiddenEscapeNoTriggerSteal: newsletter.bodyHiddenEscapeNoTriggerSteal,
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
      checks.assetRevisionImmutable &&
      checks.legalPrint.safe &&
      checks.legalFocusFocused &&
      checks.legalFocusVisible &&
      checks.legalFocusCleared &&
      checks.noJsFallback.searchHidden &&
      checks.noJsFallback.newsletterHidden &&
      checks.searchToggleVisible &&
      checks.searchToggleSize.width >= 44 &&
      checks.searchToggleSize.height >= 44 &&
      checks.searchOpened &&
      checks.newsletterVisible &&
      checks.newsletterButtonVisible &&
      checks.newsletterOpened &&
      checks.newsletterFocusedEmail &&
      checks.newsletterClosed &&
      checks.newsletterCloseSize.width >= 44 &&
      checks.newsletterCloseSize.height >= 44 &&
      checks.newsletterCloseFocused &&
      checks.newsletterCloseFocusVisible &&
      checks.newsletterCloseFocusCleared &&
      checks.newsletterHiddenEscapeNoTriggerSteal &&
      checks.newsletterBodyHiddenEscapeNoTriggerSteal &&
      checks.newsletterScrollLocked &&
      checks.newsletterConsentSuppressed &&
      checks.newsletterPrintSafe &&
      checks.legal &&
      checks.legalTargets44 &&
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
