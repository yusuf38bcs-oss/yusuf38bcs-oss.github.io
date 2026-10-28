import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";

// Non-authorizing GA4 consent regression harness: no network, no credentials.
const source = readFileSync("_includes/head/analytics-consent.html", "utf8");
const script = source.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, "consent script exists");

function scenario({ consent = null, direct = true, existingTag = false } = {}) {
  const stored = new Map(consent ? [["cookie-consent", consent]] : []);
  let cookie = consent ? "cookie-consent=" + consent : "";
  const scripts = [];
  const localStorage = {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, val) => stored.set(key, val),
    removeItem: (key) => stored.delete(key),
  };
  const document = {
    currentScript: { getAttribute: (key) =>
      key === "data-lbfl-ga4-direct" ? String(direct) : null },
    readyState: "complete",
    get cookie() { return cookie; },
    set cookie(value) { cookie = value.split(";")[0]; },
    querySelectorAll: () => [],
    querySelector: (selector) => existingTag && selector.includes("/gtm.js")
      ? { src: "https://www.googletagmanager.com/gtm.js" } : null,
    createElement: () => ({
      setAttribute() {}, addEventListener() {}, remove() {},
    }),
    head: { appendChild: (element) => scripts.push(element.src) },
    addEventListener() {},
  };
  const window = {
    location: {
      origin: "https://learningbiologyforlife.org", pathname: "/biology/hsc/zoology/",
      search: "?answer=student-secret", hash: "#email=secret@example.com",
    },
    localStorage,
    setTimeout() {},
    dataLayer: [],
  };
  runInNewContext(script, { window, document, localStorage, Date, Promise }, {
    filename: "analytics-consent.html", timeout: 1000,
  });
  const commands = () => window.dataLayer.filter(
    (entry) => entry && typeof entry === "object" && "0" in entry
  ).map((entry) => Array.from(entry));
  return { window, stored, scripts, commands };
}

test("Fresh: denied default does not load optional tags", () => {
  const h = scenario();
  assert.deepEqual(h.scripts, []);
  assert.equal(h.window["ga-disable-G-2SCLLF93NS"], true);
});

test("Decline and stored decline never load tags", () => {
  const h = scenario(); h.window.gdprDecline();
  assert.equal(h.stored.get("cookie-consent"), "denied");
  assert.deepEqual(h.scripts, []);
  assert.deepEqual(scenario({ consent: "denied" }).scripts, []);
});

test("Accept and repeated accept initialize GA4 only once", () => {
  const h = scenario(); h.window.gdprAccept(); h.window.gdprAccept();
  assert.deepEqual(h.scripts, [
    "https://www.googletagmanager.com/gtag/js?id=G-2SCLLF93NS",
  ]);
  assert.equal(h.window["ga-disable-G-2SCLLF93NS"], false);
  const calls = h.commands();
  const config = calls.filter((x) => x[0] === "config");
  const pageviews = calls.filter((x) => x[0] === "event" && x[1] === "page_view");
  assert.equal(config.length, 1);
  assert.equal(pageviews.length, 1);
  assert.equal(config[0][2].send_page_view, false);
  assert.equal(config[0][2].allow_google_signals, false);
  assert.equal(config[0][2].allow_ad_personalization_signals, false);
  assert.equal(pageviews[0][2].page_location,
    "https://learningbiologyforlife.org/biology/hsc/zoology/");
  assert.equal(pageviews[0][2].page_referrer, "");
  assert.ok(!JSON.stringify(calls).includes("student-secret"));
  assert.ok(!JSON.stringify(calls).includes("secret@example"));
});

test("Stored grant initializes once per document", () => {
  const h = scenario({ consent: "granted" });
  assert.equal(h.scripts.length, 1);
  assert.equal(h.commands().filter((x) => x[0] === "event" && x[1] === "page_view").length, 1);
});

test("Withdraw: stop further analytics, preserve prior consent history", () => {
  const h = scenario(); h.window.gdprAccept(); h.window.gdprDecline();
  assert.equal(h.window["ga-disable-G-2SCLLF93NS"], true);
  assert.equal(h.stored.get("cookie-consent"), "denied");
  assert.equal(h.commands().filter((x) => x[0] === "event" && x[1] === "page_view").length, 1);
});

test("Existing GTM and live/CMP modes never duplicate GA4", () => {
  const existing = scenario({ existingTag: true }); existing.window.gdprAccept();
  assert.deepEqual(existing.scripts, []);
  const live = scenario({ direct: false }); live.window.gdprAccept();
  assert.deepEqual(live.scripts, []);
});

test("Source and advertising controls are unchanged", () => {
  const ads = readFileSync("_data/adsense.yml", "utf8");
  const custom = readFileSync("_includes/head/custom.html", "utf8");
  const v2 = readFileSync("_includes/head/homepage-v2-services.html", "utf8");
  const def = readFileSync("_layouts/default.html", "utf8");
  assert.match(ads, /mode:\s*review/);
  assert.match(ads, /certified_cmp_ready:\s*false/);
  assert.match(custom, /{% if lbfl_gtm_allowed %}/);
  assert.match(v2, /{% if lbfl_gtm_allowed %}/);
  assert.match(def, /mode == 'live' and site\.data\.adsense\.certified_cmp_ready == true/);
  assert.match(source, /data-lbfl-ga4-direct=/);
  assert.doesNotMatch(source, /googlesyndication|adsbygoogle/);
  assert.match(source, /script\[src\*=\"googletagmanager\.com\/gtm\.js\"/);
});
