#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const targetUrl = process.env.LBFL_HOMEPAGE_URL || "http://127.0.0.1:4000/";
const styleFile = process.env.LBFL_STYLE_FILE || "";
const outputDir = process.env.LBFL_REPORT_DIR || "homepage-mobile-layer-report";

const viewports = [
  { name: "320", width: 320, height: 800 },
  { name: "360", width: 360, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "412", width: 412, height: 915 },
  { name: "480", width: 480, height: 900 },
  { name: "768", width: 768, height: 1024 },
];

function readInjectedStyle(filePath) {
  if (!filePath) return "";
  const source = fs.readFileSync(filePath, "utf8");
  const match = source.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!match) throw new Error(`No <style> block found in ${filePath}`);
  return match[1];
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((image) => {
        if (image.complete) return image.decode ? image.decode().catch(() => {}) : null;
        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      })
    );
  });
}

async function inspectLayout(page) {
  return page.evaluate(() => {
    const tolerance = 1;
    const selectors = {
      experience: ".lbfl-home-v2__featured",
      experienceCards: ".lbfl-home-v2__learning-list",
      think: ".lbfl-home-v2__bridge",
      trust: ".lbfl-home-v2__editorial",
      reflect: ".lbfl-reflection-lab__grid",
    };

    function isVisible(element) {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    }

    function columnCount(selector) {
      const element = document.querySelector(selector);
      if (!isVisible(element)) return 0;
      const value = getComputedStyle(element).gridTemplateColumns.trim();
      return value ? value.split(/\s+/).length : 0;
    }

    function directChildOverlaps(selector) {
      const container = document.querySelector(selector);
      if (!container) return ["missing container"];
      const children = Array.from(container.children).filter(isVisible);
      const overlaps = [];

      for (let leftIndex = 0; leftIndex < children.length; leftIndex += 1) {
        const left = children[leftIndex].getBoundingClientRect();
        for (let rightIndex = leftIndex + 1; rightIndex < children.length; rightIndex += 1) {
          const right = children[rightIndex].getBoundingClientRect();
          const width = Math.min(left.right, right.right) - Math.max(left.left, right.left);
          const height = Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top);
          if (width > tolerance && height > tolerance) {
            overlaps.push(`${leftIndex}:${rightIndex}`);
          }
        }
      }

      return overlaps;
    }

    const boundedSelectors = [
      ".lbfl-premium-header__inner",
      ".lbfl-premium-hero__copy",
      ".lbfl-home-v2__featured",
      ".lbfl-home-v2__learning-list > li",
      ".lbfl-home-v2__bridge",
      ".lbfl-home-v2__bridge-principles > li",
      ".lbfl-home-v2__editorial",
      ".lbfl-home-v2__method-list > li",
      ".lbfl-reflection-lab__inner",
      ".lbfl-reflection-lab__grid > article",
    ];

    const clipped = [];
    const innerOverflow = [];
    boundedSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        if (!isVisible(element)) return;
        const rect = element.getBoundingClientRect();
        if (rect.left < -tolerance || rect.right > window.innerWidth + tolerance) {
          clipped.push(`${selector}[${index}]`);
        }
        if (element.scrollWidth > element.clientWidth + tolerance) {
          innerOverflow.push(`${selector}[${index}]`);
        }
      });
    });

    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const header = document.querySelector(".lbfl-premium-header");
    const desktopNavigation = document.querySelector(".lbfl-premium-header__desktop-nav");
    const mobileMenu = document.querySelector(".lbfl-premium-header__menu");
    const hero = document.querySelector(".lbfl-premium-hero");
    const heroCopy = document.querySelector(".lbfl-premium-hero__copy");
    const heroArtwork = document.querySelector(".lbfl-premium-cell");
    const heroRect = hero && hero.getBoundingClientRect();
    const copyRect = heroCopy && heroCopy.getBoundingClientRect();
    const artworkRect = heroArtwork && heroArtwork.getBoundingClientRect();

    const columns = Object.fromEntries(
      Object.entries(selectors).map(([name, selector]) => [name, columnCount(selector)])
    );
    const overlaps = Object.fromEntries(
      Object.entries(selectors).map(([name, selector]) => [name, directChildOverlaps(selector)])
    );

    return {
      viewportMeta: viewportMeta ? viewportMeta.getAttribute("content") : null,
      viewportMetaPassed: Boolean(
        viewportMeta &&
        /(?:^|,)\s*width=device-width\s*(?:,|$)/i.test(viewportMeta.content) &&
        /(?:^|,)\s*initial-scale=1(?:\.0)?\s*(?:,|$)/i.test(viewportMeta.content)
      ),
      documentOverflow:
        document.documentElement.scrollWidth > window.innerWidth + tolerance ||
        document.body.scrollWidth > window.innerWidth + tolerance,
      clipped,
      innerOverflow,
      columns,
      overlaps,
      header: {
        height: header ? header.getBoundingClientRect().height : null,
        desktopNavigationHidden: desktopNavigation ? getComputedStyle(desktopNavigation).display === "none" : false,
        mobileMenuVisible: isVisible(mobileMenu),
      },
      hero: {
        height: heroRect ? heroRect.height : null,
        excessiveHeight: heroRect ? heroRect.height > window.innerHeight * 1.25 : true,
        artworkSharesFrame: Boolean(
          heroRect && copyRect && artworkRect &&
          Math.abs(artworkRect.top - heroRect.top) <= tolerance &&
          Math.abs(artworkRect.bottom - heroRect.bottom) <= tolerance &&
          copyRect.top >= heroRect.top - tolerance &&
          copyRect.bottom <= heroRect.bottom + tolerance
        ),
      },
    };
  });
}

async function inspectMenu(page) {
  const summary = page.locator(".lbfl-premium-header__menu > summary");
  await summary.click();
  const panel = page.locator(".lbfl-premium-header__menu-panel");
  const result = await panel.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      visible: style.display !== "none" && rect.width > 0 && rect.height > 0,
      horizontallyContained: rect.left >= -1 && rect.right <= window.innerWidth + 1,
      verticallyReachable: rect.top >= -1 && rect.top < window.innerHeight,
    };
  });
  await page.keyboard.press("Escape");
  return result;
}

function passes(result) {
  const singleColumn = Object.values(result.layout.columns).every((columns) => columns === 1);
  const noOverlap = Object.values(result.layout.overlaps).every((items) => items.length === 0);
  return Boolean(
    result.layout.viewportMetaPassed &&
    !result.layout.documentOverflow &&
    result.layout.clipped.length === 0 &&
    result.layout.innerOverflow.length === 0 &&
    singleColumn &&
    noOverlap &&
    result.layout.header.height <= 66 &&
    result.layout.header.desktopNavigationHidden &&
    result.layout.header.mobileMenuVisible &&
    !result.layout.hero.excessiveHeight &&
    result.layout.hero.artworkSharesFrame &&
    result.menu.visible &&
    result.menu.horizontallyContained &&
    result.menu.verticallyReachable &&
    result.consoleErrors.length === 0 &&
    result.pageErrors.length === 0
  );
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const injectedStyle = readInjectedStyle(styleFile);
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(String(error)));

      await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
      if (injectedStyle) await page.addStyleTag({ content: injectedStyle });
      await settle(page);

      const layout = await inspectLayout(page);
      const menu = await inspectMenu(page);
      const result = { ...viewport, layout, menu, consoleErrors, pageErrors };
      result.passed = passes(result);
      results.push(result);

      await page.screenshot({
        fullPage: true,
        path: path.join(outputDir, `homepage-${viewport.name}.png`),
      });
      await context.close();
    }
  } finally {
    await browser.close();
  }

  const report = {
    targetUrl,
    injectedStyle: styleFile || null,
    generatedAt: new Date().toISOString(),
    passed: results.every((result) => result.passed),
    results,
  };
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));

  results.forEach((result) => {
    console.log(
      `${result.name}px: ${result.passed ? "PASS" : "FAIL"} ` +
      `columns=${JSON.stringify(result.layout.columns)} ` +
      `overlap=${Object.values(result.layout.overlaps).flat().length} ` +
      `clipped=${result.layout.clipped.length} ` +
      `overflow=${result.layout.documentOverflow || result.layout.innerOverflow.length > 0}`
    );
  });
  console.log(report.passed ? "HOMEPAGE_MOBILE_LAYER_PASS" : "HOMEPAGE_MOBILE_LAYER_FAIL");
  process.exitCode = report.passed ? 0 : 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
