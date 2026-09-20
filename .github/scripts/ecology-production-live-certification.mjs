#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";

const args = process.argv.slice(2);
const value = (flag, fallback = "") => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : fallback;
};

const baseUrl = new URL(value("--base-url", "https://learningbiologyforlife.org"));
assert.equal(baseUrl.origin, "https://learningbiologyforlife.org", "Live certification is restricted to the canonical production origin");

const token = process.env.PRODUCTION_CERTIFICATION_BYPASS_TOKEN ?? "";
assert.match(token, /^[0-9a-f]{64}$/, "Production certification bypass token is missing or invalid");

const canonicalLectures = [
  {number: "01", route: "/biology/higher-zoology-tree/ecology/ecology-history-scopes-area/"},
  {number: "02", route: "/biology/higher-zoology-tree/ecology/levels-of-ecological-organization/"},
  {number: "03", route: "/biology/higher-zoology-tree/ecology/habitat-niche-ecotone-edge-effect/"},
  {number: "04", route: "/biology/higher-zoology-tree/ecology/abiotic-factors-limiting-factors-tolerance/"},
  {number: "05", route: "/biology/higher-zoology-tree/ecology/adaptation-acclimatization-environmental-response/"},
  {number: "06", route: "/biology/higher-zoology-tree/ecology/population-ecology-a-science-of-life-motion-of-a-species/"},
  {number: "07", route: "/biology/higher-zoology-tree/ecology/population-ecology-concept-on-size-of-population/"},
  {number: "08", route: "/biology/higher-zoology-tree/ecology/population-demography-age-structure-sex-ratio/"},
  {number: "09", route: "/biology/higher-zoology-tree/ecology/population-growth-carrying-capacity-regulation/"},
  {number: "10", route: "/biology/higher-zoology-tree/ecology/survivorship-curve-life-table-growth-models/"},
  {number: "11", route: "/biology/higher-zoology-tree/ecology/life-history-strategies-ecological-tradeoffs/"},
  {number: "12", route: "/biology/higher-zoology-tree/ecology/population-sampling-field-methods/"},
  {number: "13", route: "/biology/higher-zoology-tree/ecology/community-ecology-an-equation-of-living-together/"},
  {number: "14", route: "/biology/higher-zoology-tree/ecology/competition-niche-resource-partitioning/"},
  {number: "15", route: "/biology/higher-zoology-tree/ecology/predation-herbivory-parasitism/"},
  {number: "16", route: "/biology/higher-zoology-tree/ecology/mutualism-commensalism-facilitation/"},
  {number: "17", route: "/biology/higher-zoology-tree/ecology/species-diversity-dominance-keystone-species/"},
  {number: "18", route: "/biology/higher-zoology-tree/ecology/succession-disturbance-stability-resilience/"},
  {number: "19", route: "/biology/higher-zoology-tree/ecology/ecosystem-structure-functional-components/"},
  {number: "20", route: "/biology/higher-zoology-tree/ecology/food-chains-food-webs-trophic-levels/"},
  {number: "21", route: "/biology/higher-zoology-tree/ecology/energy-flow-ecological-pyramids/"},
  {number: "22", route: "/biology/higher-zoology-tree/ecology/ecosystem-productivity/"},
  {number: "23", route: "/biology/higher-zoology-tree/ecology/decomposition-detritus-soil-processes/"},
  {number: "24", route: "/biology/higher-zoology-tree/ecology/biogeochemical-cycles/"},
  {number: "25", route: "/biology/higher-zoology-tree/ecology/terrestrial-aquatic-ecosystems/"},
  {number: "26", route: "/biology/higher-zoology-tree/ecology/biodiversity-patterns-measurement-value/"},
  {number: "27", route: "/biology/higher-zoology-tree/ecology/biodiversity-loss-extinction-invasive-species/"},
  {number: "28", route: "/biology/higher-zoology-tree/ecology/conservation-biology-restoration/"},
  {number: "29", route: "/biology/higher-zoology-tree/ecology/bangladesh-ecology-field-inquiry/"}
];

assert.equal(canonicalLectures.length, 29);
assert.deepEqual(
  canonicalLectures.map((x) => x.number),
  Array.from({length: 29}, (_, i) => String(i + 1).padStart(2, "0")),
  "Canonical lecture numbers must be 01-29",
);

const courseIndexSource = fs.readFileSync("_biology/higher-zoology-tree/ecology/course-index.md", "utf8");
const indexedRoutes = [...courseIndexSource.matchAll(/^\|\s*\d{2}\s*\|\s*[^|]+?\s*\|\s*\[Open\]\(\{\{\s*'([^']+)'/gm)].map((match) => match[1]);
assert.deepEqual(indexedRoutes, canonicalLectures.map((x) => x.route), "Course index must exactly match the immutable live-cert route manifest");

const headers = {
  Accept: "text/html,application/xhtml+xml",
  "x-lbfl-certification": token,
};

async function fetchText(url, accept = headers.Accept) {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {...headers, Accept: accept},
        redirect: "manual",
        signal: AbortSignal.timeout(20000),
      });
      const text = await response.text();
      if (response.status === 200) return {response, text};
      lastError = new Error(`${url} returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
  }
  throw lastError;
}

function canonicalHref(html) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    if (!/rel=["'][^"']*canonical[^"']*["']/i.test(tag)) continue;
    const match = tag.match(/href=["']([^"']+)["']/i);
    if (match) return match[1];
  }
  return "";
}

for (const lecture of canonicalLectures) {
  const url = new URL(lecture.route, baseUrl);
  const {response, text} = await fetchText(url);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html/i, `${lecture.number} must return HTML`);
  assert.ok(text.includes("data-zoology-learning-cycle"), `${lecture.number} is missing the Ecology/Zoology learning-cycle marker`);
  const canonical = canonicalHref(text);
  assert.ok(canonical, `${lecture.number} is missing a canonical link`);
  assert.equal(new URL(canonical).pathname, lecture.route, `${lecture.number} canonical route mismatch`);
  assert.ok(!/\b404\b[^<]*(?:not found|page)/i.test(text), `${lecture.number} looks like a 404 body`);
}

const gatewayUrl = new URL("/biology/higher-zoology-tree/ecology/", baseUrl);
const gateway = await fetchText(gatewayUrl);
assert.ok(gateway.text.includes("Start the 29-Lecture Ecology Course"), "Gateway does not expose the 29-lecture course CTA");

const indexUrl = new URL("/biology/higher-zoology-tree/ecology/course-index/", baseUrl);
const indexPage = await fetchText(indexUrl);
assert.ok(indexPage.text.includes("Complete 29-Lecture Route Map"), "Course index marker is missing");

const ecologySitemapUrl = new URL("/ecology-sitemap.xml", baseUrl);
const ecologySitemap = await fetchText(ecologySitemapUrl, "application/xml,text/xml,*/*");
for (const lecture of canonicalLectures) {
  assert.ok(ecologySitemap.text.includes(new URL(lecture.route, baseUrl).href), `Ecology sitemap is missing lecture ${lecture.number}`);
}
assert.ok(ecologySitemap.text.includes(gatewayUrl.href), "Ecology sitemap is missing the gateway");
assert.ok(ecologySitemap.text.includes(indexUrl.href), "Ecology sitemap is missing the course index");

const robotsUrl = new URL("/robots.txt", baseUrl);
const robots = await fetchText(robotsUrl, "text/plain,*/*");
assert.ok(robots.text.includes("https://learningbiologyforlife.org/ecology-sitemap.xml"), "robots.txt does not advertise the Ecology sitemap");

console.log("ECOLOGY_29_LIVE_PASS");
console.log("lecture_http_200=29/29");
console.log("gateway_http_200=200");
console.log("course_index_http_200=200");
console.log("ecology_sitemap_http_200=200");
console.log("robots_http_200=200");
