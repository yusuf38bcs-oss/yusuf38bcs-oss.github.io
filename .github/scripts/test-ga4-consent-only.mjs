#!/usr/bin/env node
// Non-authorizing, non-executing source contract. Full dynamic behavior
// must be certified separately in an exact-head browser after preview resolution.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const consent = readFileSync("_includes/head/analytics-consent.html", "utf8");
const custom = readFileSync("_includes/head/custom.html", "utf8");
const v2 = readFileSync("_includes/head/homepage-v2-services.html", "utf8");
const ads = readFileSync("_data/adsense.yml", "utf8");
const main = readFileSync("_layouts/default.html", "utf8");
const v3 = readFileSync("_layouts/homepage-v3.html", "utf8");
const prefs = readFileSync("_pages/utility/cookie-preferences.md", "utf8");

test("No analytics library is injected by the consent include before a grant", () => {
  assert.match(consent, /data-lbfl-ga4-direct=/);
  assert.match(consent, /window\[GA4_DISABLE_KEY\]\s*=\s*true/);
  assert.match(consent, /function startConsentedGa4\(\)/);
  assert.match(consent, /function updateDirectGa4\(state\)/);
  assert.match(consent, /if \(state !== "granted"\)/);
  assert.match(consent, /updateDirectGa4\(state\)/);
});

test("Decline, persistence, withdrawal remain bound to current consent controls", () => {
  assert.match(consent, /CONSENT_KEY\s*=\s*"cookie-consent"/);
  assert.match(consent, /window\.gdprDecline\s*=\s*function/);
  assert.match(consent, /window\.gdprAccept\s*=\s*function/);
  assert.match(consent, /if \(consent === "granted" \|\| consent === "denied"\)/);
  assert.match(consent, /pushAnalyticsConsent\(consent\)/);
  assert.match(consent, /window\.gtag\("consent", "update"/);
  assert.match(prefs, /data-gdpr-consent="denied"/);
});

test("One GA4 config and one pageview call are protected by a once-only guard", () => {
  assert.match(consent, /var ga4Started = false/);
  assert.match(consent, /if \(!DIRECT_GA4 \|\| ga4Started\) return/);
  assert.match(consent, /if \(ga4Started\)/);
  assert.equal((consent.match(/window\.gtag\("config", GA4_ID/g) || []).length, 1);
  assert.equal((consent.match(/window\.gtag\("event", "page_view"/g) || []).length, 1);
  assert.match(consent, /send_page_view:\s*false/);
  assert.match(consent, /"G-2SCLLF93NS"/);
});

test("Existing GTM tag detection prevents a parallel direct GA4 startup", () => {
  assert.match(consent, /document\.querySelector\(/);
  assert.ok(consent.includes("googletagmanager.com/gtm.js"));
  assert.ok(consent.includes("googletagmanager.com/gtag/js"));
  assert.match(main, /mode == 'live' and site\.data\.adsense\.certified_cmp_ready == true/);
  assert.match(v3, /mode == 'live' and site\.data\.adsense\.certified_cmp_ready == true/);
});

test("Personal inputs, URL queries and fragments are excluded from page_view", () => {
  assert.match(consent, /window\.location\.origin \+ window\.location\.pathname/);
  assert.match(consent, /page_location:\s*safePageLocation\(\)/);
  assert.match(consent, /page_referrer:\s*""/);
  assert.doesNotMatch(consent, /window\.location\.search|window\.location\.hash/);
  assert.doesNotMatch(consent, /student_id|student_name|quiz_answer|user_id:/i);
  assert.match(consent, /allow_google_signals:\s*false/);
  assert.match(consent, /allow_ad_personalization_signals:\s*false/);
});

test("AdSense review configuration and GTM guard are still fail-closed", () => {
  assert.match(ads, /mode:\s*review/);
  assert.match(ads, /certified_cmp_ready:\s*false/);
  assert.match(custom, /{% if lbfl_gtm_allowed %}/);
  assert.match(v2, /{% if lbfl_gtm_allowed %}/);
  assert.match(consent, /adsense\.mode == 'live' and site\.data\.adsense\.certified_cmp_ready == true/);
  assert.doesNotMatch(consent, /googlesyndication|adsbygoogle/);
});

test("No secret, deployment or protected governance workflow is altered", () => {
  const workflow = readFileSync(".github/workflows/ga4-consent-only-fixtures.yml", "utf8");
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /pull_request:/);
  assert.doesNotMatch(workflow, /pull_request_target|workflow_dispatch|wrangler deploy|secrets\./);
});
