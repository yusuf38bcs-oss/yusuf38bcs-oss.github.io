#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const targetUrl = process.env.LBFL_HOMEPAGE_URL || "http://127.0.0.1:4000/";
const outputDir = process.env.LBFL_REPORT_DIR || "homepage-responsive-layout-report";

const viewports = [
  { name: "320", width: 320, height: 800, compact: true },
  { name: "360", width: 360, height: 800, compact: true },
  { name: "390", width: 390, height: 844, compact: true },
  { name: "412", width: 412, height: 915, compact: true },
  { name: "480", width: 480, height: 900, compact: true },
  { name: "768", width: 768, height: 1024, compact: true },
  { name: "1024", width: 1024, height: 900, compact: true },
  { name: "1280", width: 1280, height: 900, compact: false },
  { name: "1440", width: 1440, height: 900, compact: false },
  { name: "1920", width: 1920, height: 1080, compact: false },
];

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

async function inspect(page, compact) {
  return page.evaluate((compactMode) => {
    const tolerance = 2;
    const selectors = {
      featured: ".lbfl-home-v2__featured",
      featuredMarker: ".lbfl-home-v2__featured > .lbfl-home-v2__narrative-marker",
      featuredIntro: ".lbfl-home-v2__featured-intro",
      learningRoute: ".lbfl-home-v2__learning-route",
      bridge: ".lbfl-home-v2__bridge",
      bridgeMarker: ".lbfl-home-v2__bridge > .lbfl-home-v2__narrative-marker",
      bridgeCopy: ".lbfl-home-v2__bridge-copy",
      criticalCycle: ".lbfl-home-v2__critical-cycle",
      editorial: ".lbfl-home-v2__editorial",
      editorialMarker: ".lbfl-home-v2__editorial > .lbfl-home-v2__narrative-marker",
      editorialCopy: ".lbfl-home-v2__editorial-copy",
      editorialProfile: ".lbfl-home-v2__editorial-profile",
      reflectGrid: ".lbfl-reflection-lab__grid",
      hero: ".lbfl-premium-hero",
      heroCopy: ".lbfl-premium-hero__copy",
      heroArtwork: ".lbfl-premium-cell",
    };

    function element(selector) {
      return document.querySelector(selector);
    }

    function visible(target) {
      if (!target) return false;
      const style = getComputedStyle(target);
      const rect = target.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    }

    function rect(selector) {
      const target = element(selector);
      if (!visible(target)) return null;
      const value = target.getBoundingClientRect();
      return {
        top: value.top,
        right: value.right,
        bottom: value.bottom,
        left: value.left,
        width: value.width,
        height: value.height,
      };
    }

    function columns(selector) {
      const target = element(selector);
      if (!visible(target)) return 0;
      const value = getComputedStyle(target).gridTemplateColumns.trim();
      if (!value || value === "none") return 0;
      return value.split(/\s+/).filter(Boolean).length;
    }

    function directChildOverlaps(selector) {
      const target = element(selector);
      if (!target) return ["missing container"];
      const children = Array.from(target.children).filter(visible);
      const overlaps = [];
      for (let leftIndex = 0; leftIndex < children.length; leftIndex += 1) {
        const left = children[leftIndex].getBoundingClientRect();
        for (let rightIndex = leftIndex + 1; rightIndex < children.length; rightIndex += 1) {
          const right = children[rightIndex].getBoundingClientRect();
          const width = Math.min(left.right, right.right) - Math.max(left.left, right.left);
          const height = Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top);
          if (width > tolerance && height > tolerance) overlaps.push(`${leftIndex}:${rightIndex}`);
        }
      }
      return overlaps;
    }

    const boundedSelectors = [
      ".lbfl-premium-header__inner",
      ".lbfl-premium-hero__copy",
      ".lbfl-home-v2__section",
      ".lbfl-home-v2__featured",
      ".lbfl-home-v2__learning-route > li",
      ".lbfl-home-v2__bridge",
      ".lbfl-home-v2__critical-cycle > li",
      ".lbfl-home-v2__editorial",
      ".lbfl-home-v2__method-list > li",
      ".lbfl-reflection-lab__inner",
      ".lbfl-reflection-lab__grid > article",
    ];

    const clipped = [];
    const innerOverflow = [];
    boundedSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((target, index) => {
        if (!visible(target)) return;
        const value = target.getBoundingClientRect();
        if (value.left < -tolerance || value.right > window.innerWidth + tolerance) clipped.push(`${selector}[${index}]`);
        if (target.scrollWidth > target.clientWidth + tolerance) innerOverflow.push(`${selector}[${index}]`);
      });
    });

    const viewportMeta = element('meta[name="viewport"]');
    const desktopNav = element(".lbfl-premium-header__desktop-nav");
    const mobileMenu = element(".lbfl-premium-header__menu");
    const header = element(".lbfl-premium-header");
    const heroRect = rect(selectors.hero);
    const copyRect = rect(selectors.heroCopy);
    const artworkRect = rect(selectors.heroArtwork);

    const featuredMarkerRect = rect(selectors.featuredMarker);
    const featuredIntroRect = rect(selectors.featuredIntro);
    const learningRouteRect = rect(selectors.learningRoute);
    const bridgeMarkerRect = rect(selectors.bridgeMarker);
    const bridgeCopyRect = rect(selectors.bridgeCopy);
    const criticalCycleRect = rect(selectors.criticalCycle);
    const editorialMarkerRect = rect(selectors.editorialMarker);
    const editorialCopyRect = rect(selectors.editorialCopy);
    const editorialProfileRect = rect(selectors.editorialProfile);

    const learningCardWidths = Array.from(document.querySelectorAll(".lbfl-home-v2__learning-route > li"))
      .filter(visible)
      .map((target) => target.getBoundingClientRect().width);

    function markerBeforeContent(markerRect, firstRect, secondRect) {
      return Boolean(markerRect && firstRect && secondRect && markerRect.bottom <= Math.min(firstRect.top, secondRect.top) + tolerance);
    }

    function sameRow(firstRect, secondRect) {
      return Boolean(firstRect && secondRect && Math.abs(firstRect.top - secondRect.top) <= tolerance * 2);
    }

    function readingOrder(rectangles) {
      return rectangles.every((value, index) => {
        if (index === 0) return Boolean(value);
        return Boolean(value && rectangles[index - 1] && value.top >= rectangles[index - 1].bottom - tolerance);
      });
    }

    const compactContract = compactMode ? {
      narrativeSingleColumn: columns(selectors.featured) === 1 && columns(selectors.bridge) === 1 && columns(selectors.editorial) === 1,
      supportingSingleColumn: columns(selectors.learningRoute) === 1 && columns(selectors.criticalCycle) === 1 && columns(selectors.reflectGrid) === 1,
      readingOrder:
        readingOrder([featuredMarkerRect, featuredIntroRect, learningRouteRect]) &&
        readingOrder([bridgeMarkerRect, bridgeCopyRect, criticalCycleRect]) &&
        readingOrder([editorialMarkerRect, editorialCopyRect, editorialProfileRect]),
      compactHeader: desktopNav && getComputedStyle(desktopNav).display === "none" && visible(mobileMenu),
    } : null;

    const desktopContract = compactMode ? null : {
      narrativeTwoColumn: columns(selectors.featured) === 2 && columns(selectors.bridge) === 2 && columns(selectors.editorial) === 2,
      markerRows:
        markerBeforeContent(featuredMarkerRect, featuredIntroRect, learningRouteRect) &&
        markerBeforeContent(bridgeMarkerRect, bridgeCopyRect, criticalCycleRect) &&
        markerBeforeContent(editorialMarkerRect, editorialCopyRect, editorialProfileRect),
      alignedContentRows:
        sameRow(featuredIntroRect, learningRouteRect) &&
        sameRow(bridgeCopyRect, criticalCycleRect) &&
        sameRow(editorialCopyRect, editorialProfileRect),
      learningRouteSingleColumn: columns(selectors.learningRoute) === 1,
      readableLearningCards: learningCardWidths.length > 0 && Math.min(...learningCardWidths) >= 300,
      desktopHeader: visible(desktopNav) && mobileMenu && getComputedStyle(mobileMenu).display === "none",
    };

    return {
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
      sectionOverlaps: {
        featured: directChildOverlaps(selectors.featured),
        bridge: directChildOverlaps(selectors.bridge),
        editorial: directChildOverlaps(selectors.editorial),
      },
      headerHeight: header ? header.getBoundingClientRect().height : null,
      heroSharesFrame: Boolean(
        heroRect && copyRect && artworkRect &&
        copyRect.top >= heroRect.top - tolerance && copyRect.bottom <= heroRect.bottom + tolerance &&
        artworkRect.top >= heroRect.top - tolerance && artworkRect.bottom <= heroRect.bottom + tolerance
      ),
      compactContract,
      desktopContract,
    };
  }, compact);
}

async function inspectMenu(page) {
  const summary = page.locator(".lbfl-premium-header__menu > summary");
  if (!(await summary.isVisible())) return { applicable: false, passed: true };
  await summary.click();
  const panel = page.locator(".lbfl-premium-header__menu-panel");
  const result = await panel.evaluate((target) => {
    const rect = target.getBoundingClientRect();
    const style = getComputedStyle(target);
    return {
      applicable: true,
      passed: style.display !== "none" && rect.width > 0 && rect.height > 0 && rect.left >= -1 && rect.right <= window.innerWidth + 1 && rect.top >= -1 && rect.top < window.innerHeight,
    };
  });
  await page.keyboard.press("Escape");
  return result;
}

function passes(result) {
  const noSectionOverlap = Object.values(result.layout.sectionOverlaps).every((items) => items.length === 0);
  const base =
    result.layout.viewportMetaPassed &&
    !result.layout.documentOverflow &&
    result.layout.clipped.length === 0 &&
    result.layout.innerOverflow.length === 0 &&
    noSectionOverlap &&
    result.layout.heroSharesFrame &&
    result.menu.passed &&
    result.consoleErrors.length === 0 &&
    result.pageErrors.length === 0;

  if (!base) return false;

  if (result.compact) {
    const contract = result.layout.compactContract;
    return Boolean(contract && contract.narrativeSingleColumn && contract.supportingSingleColumn && contract.readingOrder && contract.compactHeader && result.layout.headerHeight <= 66);
  }

  const contract = result.layout.desktopContract;
  return Boolean(contract && contract.narrativeTwoColumn && contract.markerRows && contract.alignedContentRows && contract.learningRouteSingleColumn && contract.readableLearningCards && contract.desktopHeader);
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "no-preference" });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
      page.on("pageerror", (error) => pageErrors.push(String(error)));

      await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
      await settle(page);

      const layout = await inspect(page, viewport.compact);
      const menu = await inspectMenu(page);
      const result = { ...viewport, layout, menu, consoleErrors, pageErrors };
      result.passed = passes(result);
      results.push(result);

      await page.screenshot({ fullPage: true, path: path.join(outputDir, `homepage-${viewport.name}.png`) });
      await context.close();
    }
  } finally {
    await browser.close();
  }

  const report = { targetUrl, generatedAt: new Date().toISOString(), passed: results.every((result) => result.passed), results };
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));

  for (const result of results) {
    console.log(`${result.name}px ${result.compact ? "compact" : "desktop"}: ${result.passed ? "PASS" : "FAIL"} overflow=${result.layout.documentOverflow || result.layout.innerOverflow.length > 0} clipped=${result.layout.clipped.length} console=${result.consoleErrors.length} page=${result.pageErrors.length}`);
  }

  console.log(report.passed ? "HOMEPAGE_RESPONSIVE_LAYOUT_PASS" : "HOMEPAGE_RESPONSIVE_LAYOUT_FAIL");
  process.exitCode = report.passed ? 0 : 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
