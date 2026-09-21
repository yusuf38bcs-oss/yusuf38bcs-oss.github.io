#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const targetUrl = process.env.LBFL_HOMEPAGE_URL || "http://127.0.0.1:4000/";
const outputDir = process.env.LBFL_REPORT_DIR || "homepage-responsive-layout-report";

const viewports = [
  { name: "320", width: 320, height: 800 },
  { name: "360", width: 360, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "412", width: 412, height: 915 },
  { name: "480", width: 480, height: 900 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 900 },
  { name: "1280", width: 1280, height: 900 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
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

async function inspect(page, viewportWidth) {
  return page.evaluate((width) => {
    const tolerance = 2;
    const compactHeader = width <= 1024;
    const phoneLayout = width <= 700;
    const veryCompact = width <= 420;

    const selectors = {
      header: ".lbfl-v3-header",
      headerInner: ".lbfl-v3-header__inner",
      desktopNav: ".lbfl-v3-nav",
      menuButton: ".lbfl-v3-menu-button",
      language: ".lbfl-v3-language-switcher",
      languageEn: ".lbfl-v3-language-switcher a[lang='en']",
      languageBn: ".lbfl-v3-language-switcher a[lang='bn']",
      desktopEditorial: ".lbfl-v3-nav a[href*='editorial-policy']",
      hero: ".lbfl-v3-hero",
      heroGrid: ".lbfl-v3-hero__grid",
      heroCopy: ".lbfl-v3-hero__copy",
      heroTitle: ".lbfl-v3-hero h1",
      heroBrandLine: ".lbfl-v3-hero__brand-line",
      heroPromise: ".lbfl-v3-hero__promise",
      heroActions: ".lbfl-v3-actions",
      cycle: ".lbfl-v3-cycle",
      heroVisual: ".lbfl-v3-hero__visual",
      specimenLabel: ".lbfl-v3-specimen-label",
      specimenNote: ".lbfl-v3-specimen-note",
      pathways: ".lbfl-v3-pathways",
      pathwayGrid: ".lbfl-v3-pathway-grid",
      journey: ".lbfl-v3-journey",
      journeyGrid: ".lbfl-v3-journey__grid",
      method: ".lbfl-v3-method",
      methodGrid: ".lbfl-v3-method-grid",
      repair: ".lbfl-v3-repair",
      repairGrid: ".lbfl-v3-repair-grid",
      evidence: ".lbfl-v3-evidence",
      evidenceGrid: ".lbfl-v3-evidence__grid",
      evidenceCards: ".lbfl-v3-evidence__cards",
      evidenceKicker: ".lbfl-v3-evidence .lbfl-v3-kicker",
      evidenceEditorialLink: ".lbfl-v3-evidence__links a[href*='editorial-policy']",
      continueSection: ".lbfl-v3-continue",
      continueInner: ".lbfl-v3-continue__inner",
      footer: ".lbfl-v3-footer",
      footerEditorial: ".lbfl-v3-footer a[href*='editorial-policy']",
    };

    function element(selector) {
      return document.querySelector(selector);
    }

    function visible(target) {
      if (!target) return false;
      const style = getComputedStyle(target);
      const rect = target.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
    }

    function rectOf(target) {
      if (!visible(target)) return null;
      const rect = target.getBoundingClientRect();
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    }

    function rect(selector) {
      return rectOf(element(selector));
    }

    function columns(selector) {
      const target = element(selector);
      if (!visible(target)) return 0;
      const value = getComputedStyle(target).gridTemplateColumns.trim();
      if (!value || value === "none") return 0;
      return value.split(/\s+/).filter(Boolean).length;
    }

    function gap(firstSelector, secondSelector) {
      const first = rect(firstSelector);
      const second = rect(secondSelector);
      if (!first || !second) return null;
      return second.top - first.bottom;
    }

    function contains(parentSelector, childSelector) {
      const parent = rect(parentSelector);
      const child = rect(childSelector);
      return Boolean(
        parent && child &&
        child.left >= parent.left - tolerance &&
        child.right <= parent.right + tolerance &&
        child.top >= parent.top - tolerance &&
        child.bottom <= parent.bottom + tolerance
      );
    }

    function targetSize(selector) {
      const value = rect(selector);
      return value ? { width: value.width, height: value.height } : null;
    }

    const boundedSelectors = [
      selectors.headerInner,
      selectors.language,
      selectors.heroCopy,
      selectors.heroActions,
      selectors.cycle,
      ".lbfl-v3-pathway-card",
      ".lbfl-v3-journey__steps",
      ".lbfl-v3-method-grid > li",
      ".lbfl-v3-repair-grid > li",
      ".lbfl-v3-evidence__cards > article",
      ".lbfl-v3-continue__links > a",
      ".lbfl-v3-footer__grid",
    ];

    const clipped = [];
    const innerOverflow = [];
    boundedSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((target, index) => {
        if (!visible(target)) return;
        const value = target.getBoundingClientRect();
        if (value.left < -tolerance || value.right > window.innerWidth + tolerance) {
          clipped.push(`${selector}[${index}]`);
        }
        if (target.scrollWidth > target.clientWidth + tolerance) {
          innerOverflow.push(`${selector}[${index}]`);
        }
      });
    });

    const viewportMeta = element('meta[name="viewport"]');
    const root = document.documentElement;
    const body = document.body;
    const header = element(selectors.header);
    const nav = element(selectors.desktopNav);
    const menuButton = element(selectors.menuButton);
    const language = element(selectors.language);
    const en = element(selectors.languageEn);
    const bn = element(selectors.languageBn);
    const desktopEditorial = element(selectors.desktopEditorial);

    const title = element(selectors.heroTitle);
    const titleStyle = title ? getComputedStyle(title) : null;
    const titleFontSize = titleStyle ? parseFloat(titleStyle.fontSize) : 0;
    const titleLineHeight = titleStyle ? parseFloat(titleStyle.lineHeight) : 0;
    const titleLineHeightRatio = titleFontSize > 0 ? titleLineHeight / titleFontSize : 0;

    const sectionRects = [
      selectors.hero,
      selectors.pathways,
      selectors.journey,
      selectors.method,
      selectors.repair,
      selectors.evidence,
      selectors.continueSection,
      selectors.footer,
    ].map((selector) => ({ selector, rect: rect(selector) }));

    const sectionOrder = sectionRects.every((entry, index) => {
      if (!entry.rect) return false;
      if (index === 0) return true;
      const previous = sectionRects[index - 1].rect;
      return Boolean(previous && entry.rect.top >= previous.top);
    });

    const expectedPathwayColumns = phoneLayout ? 1 : compactHeader ? 2 : 4;
    const expectedMethodColumns = phoneLayout ? 1 : compactHeader ? 2 : 4;
    const expectedRepairColumns = phoneLayout ? 1 : 4;
    const expectedEvidenceCardColumns = phoneLayout ? 1 : 2;
    const expectedHeroColumns = phoneLayout ? 1 : 2;
    const expectedJourneyColumns = compactHeader ? 1 : 2;
    const expectedEvidenceColumns = compactHeader ? 1 : 2;
    const expectedContinueColumns = compactHeader ? 1 : 2;

    const languageText = language ? language.textContent.replace(/\s+/g, " ").trim() : "";
    const evidenceKicker = element(selectors.evidenceKicker);

    const visual = element(selectors.heroVisual);
    const heroImage = visual ? visual.querySelector("img") : null;

    return {
      v3Document: root.classList.contains("lbfl-home-v3-document") && body.classList.contains("lbfl-home-v3"),
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
      header: {
        visible: visible(header),
        height: header ? header.getBoundingClientRect().height : null,
        compactContract: compactHeader
          ? Boolean(nav && getComputedStyle(nav).display === "none" && visible(menuButton))
          : Boolean(visible(nav)),
      },
      language: {
        visible: visible(language) && visible(en) && visible(bn),
        text: languageText,
        enText: en ? en.textContent.trim() : "",
        bnText: bn ? bn.textContent.trim() : "",
        enHref: en ? en.getAttribute("href") : null,
        bnHref: bn ? bn.getAttribute("href") : null,
        enTarget: targetSize(selectors.languageEn),
        bnTarget: targetSize(selectors.languageBn),
      },
      editorial: {
        desktopVisible: compactHeader ? true : visible(desktopEditorial),
        evidenceLinkVisible: visible(element(selectors.evidenceEditorialLink)),
        footerLinkVisible: visible(element(selectors.footerEditorial)),
        kicker: evidenceKicker ? evidenceKicker.textContent.replace(/\s+/g, " ").trim() : "",
      },
      hero: {
        visible:
          visible(element(selectors.hero)) &&
          visible(element(selectors.heroCopy)) &&
          visible(title) &&
          visible(element(selectors.heroBrandLine)) &&
          visible(element(selectors.heroPromise)) &&
          visible(element(selectors.heroActions)) &&
          visible(element(selectors.cycle)),
        gridColumns: columns(selectors.heroGrid),
        expectedGridColumns: expectedHeroColumns,
        copyContained: contains(selectors.heroGrid, selectors.heroCopy),
        visualVisible: visible(visual) && Boolean(heroImage && heroImage.complete && heroImage.naturalWidth > 0),
        visualContained: contains(selectors.heroGrid, selectors.heroVisual),
        visualAfterCopy: (() => {
          const copy = rect(selectors.heroCopy);
          const artwork = rect(selectors.heroVisual);
          return phoneLayout ? Boolean(copy && artwork && artwork.top >= copy.bottom - tolerance) : true;
        })(),
        titleBrandGap: gap(selectors.heroTitle, selectors.heroBrandLine),
        brandPromiseGap: gap(selectors.heroBrandLine, selectors.heroPromise),
        titleLineHeightRatio,
        titleFontFamily: titleStyle ? titleStyle.fontFamily : "",
        titleFontWeight: titleStyle ? titleStyle.fontWeight : "",
        actionsTopGap: gap(selectors.heroPromise, selectors.heroActions),
        cycleColumns: columns(selectors.cycle),
        specimenVisible: visible(element(selectors.specimenLabel)) && visible(element(selectors.specimenNote)),
      },
      grids: {
        pathwayColumns: columns(selectors.pathwayGrid),
        expectedPathwayColumns,
        journeyColumns: columns(selectors.journeyGrid),
        expectedJourneyColumns,
        methodColumns: columns(selectors.methodGrid),
        expectedMethodColumns,
        repairColumns: columns(selectors.repairGrid),
        expectedRepairColumns,
        evidenceColumns: columns(selectors.evidenceGrid),
        expectedEvidenceColumns,
        evidenceCardColumns: columns(selectors.evidenceCards),
        expectedEvidenceCardColumns,
        continueColumns: columns(selectors.continueInner),
        expectedContinueColumns,
      },
      sectionOrder,
      footerVisible: visible(element(selectors.footer)),
      compactHeader,
      phoneLayout,
      veryCompact,
    };
  }, viewportWidth);
}

async function inspectMenu(page, viewportWidth) {
  if (viewportWidth > 1024) return { applicable: false, passed: true };

  const button = page.locator("[data-v3-menu-open]");
  if (!(await button.isVisible())) return { applicable: true, passed: false, reason: "menu button not visible" };

  await button.click();
  const dialog = page.locator("[data-v3-menu]");
  const editorial = dialog.locator("a[href*='editorial-policy']");
  const contact = dialog.locator("a[href*='contact']");

  const passed =
    (await dialog.isVisible()) &&
    (await editorial.isVisible()) &&
    (await contact.isVisible());

  const result = {
    applicable: true,
    passed,
    dialogVisible: await dialog.isVisible(),
    editorialVisible: await editorial.isVisible(),
    contactVisible: await contact.isVisible(),
  };

  const close = dialog.locator("[data-v3-menu-close]");
  if (await close.isVisible()) await close.click();
  else await page.keyboard.press("Escape");

  return result;
}

function passes(result) {
  const l = result.layout;
  const base =
    l.v3Document &&
    l.viewportMetaPassed &&
    !l.documentOverflow &&
    l.clipped.length === 0 &&
    l.innerOverflow.length === 0 &&
    l.header.visible &&
    l.header.compactContract &&
    l.language.visible &&
    /EN/.test(l.language.text) &&
    /বাংলা/.test(l.language.text) &&
    l.language.enText === "EN" &&
    l.language.bnText === "বাংলা" &&
    l.language.enTarget &&
    l.language.bnTarget &&
    l.language.enTarget.width >= 44 &&
    l.language.enTarget.height >= 44 &&
    l.language.bnTarget.width >= 44 &&
    l.language.bnTarget.height >= 44 &&
    l.editorial.desktopVisible &&
    l.editorial.evidenceLinkVisible &&
    l.editorial.footerLinkVisible &&
    /EDITORIAL\s*&\s*EVIDENCE/i.test(l.editorial.kicker) &&
    l.hero.visible &&
    l.hero.gridColumns === l.hero.expectedGridColumns &&
    l.hero.copyContained &&
    l.hero.visualVisible &&
    l.hero.visualContained &&
    l.hero.visualAfterCopy &&
    l.hero.titleBrandGap !== null &&
    l.hero.titleBrandGap >= 18 &&
    l.hero.titleBrandGap <= 42 &&
    l.hero.brandPromiseGap !== null &&
    l.hero.brandPromiseGap >= 6 &&
    l.hero.brandPromiseGap <= 20 &&
    l.hero.actionsTopGap !== null &&
    l.hero.actionsTopGap >= 18 &&
    l.hero.actionsTopGap <= 36 &&
    l.hero.titleLineHeightRatio >= 1.0 &&
    l.hero.titleLineHeightRatio <= 1.08 &&
    /Manrope/i.test(l.hero.titleFontFamily) &&
    ["700", "800"].includes(l.hero.titleFontWeight) &&
    l.hero.cycleColumns === 4 &&
    l.hero.specimenVisible &&
    l.grids.pathwayColumns === l.grids.expectedPathwayColumns &&
    l.grids.journeyColumns === l.grids.expectedJourneyColumns &&
    l.grids.methodColumns === l.grids.expectedMethodColumns &&
    l.grids.repairColumns === l.grids.expectedRepairColumns &&
    l.grids.evidenceColumns === l.grids.expectedEvidenceColumns &&
    l.grids.evidenceCardColumns === l.grids.expectedEvidenceCardColumns &&
    l.grids.continueColumns === l.grids.expectedContinueColumns &&
    l.sectionOrder &&
    l.footerVisible &&
    result.menu.passed &&
    result.consoleErrors.length === 0 &&
    result.pageErrors.length === 0;

  if (!base) return false;
  if (l.compactHeader && l.header.height > 72) return false;
  return true;
}

function summarizeFailure(result) {
  const reasons = [];
  const l = result.layout;
  if (!l.v3Document) reasons.push("missing-v3-root");
  if (!l.viewportMetaPassed) reasons.push("viewport-meta");
  if (l.documentOverflow) reasons.push("document-overflow");
  if (l.clipped.length) reasons.push(`clipped=${l.clipped.join(",")}`);
  if (l.innerOverflow.length) reasons.push(`inner-overflow=${l.innerOverflow.join(",")}`);
  if (!l.header.visible || !l.header.compactContract) reasons.push("header-contract");
  if (!l.language.visible || !/বাংলা/.test(l.language.text)) reasons.push("bilingual-switch");
  if (!l.editorial.desktopVisible || !l.editorial.evidenceLinkVisible || !l.editorial.footerLinkVisible) reasons.push("editorial-discoverability");
  if (!/EDITORIAL\s*&\s*EVIDENCE/i.test(l.editorial.kicker)) reasons.push("editorial-kicker");
  if (!l.hero.visible) reasons.push("hero-visibility");
  if (l.hero.gridColumns !== l.hero.expectedGridColumns) reasons.push(`hero-columns=${l.hero.gridColumns}/${l.hero.expectedGridColumns}`);
  if (!l.hero.visualVisible || !l.hero.visualContained || !l.hero.visualAfterCopy) reasons.push("specimen-layout");
  if (!(l.hero.titleBrandGap >= 18 && l.hero.titleBrandGap <= 42)) reasons.push(`title-brand-gap=${l.hero.titleBrandGap}`);
  if (!(l.hero.brandPromiseGap >= 6 && l.hero.brandPromiseGap <= 20)) reasons.push(`brand-promise-gap=${l.hero.brandPromiseGap}`);
  if (!(l.hero.actionsTopGap >= 18 && l.hero.actionsTopGap <= 36)) reasons.push(`promise-actions-gap=${l.hero.actionsTopGap}`);
  if (!(l.hero.titleLineHeightRatio >= 1.0 && l.hero.titleLineHeightRatio <= 1.08)) reasons.push(`h1-line-height=${l.hero.titleLineHeightRatio}`);
  if (l.hero.cycleColumns !== 4) reasons.push(`cycle-columns=${l.hero.cycleColumns}`);
  for (const key of ["pathway", "journey", "method", "repair", "evidence", "evidenceCard", "continue"]) {
    const actual = l.grids[`${key}Columns`];
    const expected = l.grids[`expected${key[0].toUpperCase() + key.slice(1)}Columns`];
    if (actual !== expected) reasons.push(`${key}-columns=${actual}/${expected}`);
  }
  if (!l.sectionOrder) reasons.push("section-order");
  if (!result.menu.passed) reasons.push("menu-contract");
  if (result.consoleErrors.length) reasons.push(`console=${result.consoleErrors.length}`);
  if (result.pageErrors.length) reasons.push(`page=${result.pageErrors.length}`);
  return reasons;
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: "no-preference",
      });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];

      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(String(error)));

      await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
      await settle(page);

      const layout = await inspect(page, viewport.width);
      const menu = await inspectMenu(page, viewport.width);
      const result = { ...viewport, layout, menu, consoleErrors, pageErrors };
      result.passed = passes(result);
      result.failureReasons = result.passed ? [] : summarizeFailure(result);
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
    generatedAt: new Date().toISOString(),
    contract: "homepage-v3.5.1",
    passed: results.every((result) => result.passed),
    results,
  };

  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));

  for (const result of results) {
    const details = result.passed ? "" : ` reasons=${result.failureReasons.join(";")}`;
    console.log(
      `${result.name}px: ${result.passed ? "PASS" : "FAIL"} overflow=${
        result.layout.documentOverflow || result.layout.innerOverflow.length > 0
      } clipped=${result.layout.clipped.length} menu=${result.menu.passed}${details}`
    );
  }

  console.log(report.passed ? "HOMEPAGE_RESPONSIVE_LAYOUT_PASS" : "HOMEPAGE_RESPONSIVE_LAYOUT_FAIL");
  process.exitCode = report.passed ? 0 : 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
