#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";

const args = process.argv.slice(2);
const value = (flag, fallback = "") => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : fallback;
};

const baseUrl = new URL(value("--base-url", "https://learningbiologyforlife.org"));
const output = value("--output", "ecology-live-certification.json");
const token = process.env.PRODUCTION_CERTIFICATION_BYPASS_TOKEN ?? "";
assert.match(token, /^[0-9a-f]{64}$/, "Production certification bypass token is missing or invalid");

const courseIndexSource = fs.readFileSync("_biology/higher-zoology-tree/ecology/course-index.md", "utf8");
const rowPattern = /^\|\s*(\d{2})\s*\|\s*([^|]+?)\s*\|\s*\[Open\]\(\{\{\s*'([^']+)'/gm;
const lectures = [...courseIndexSource.matchAll(rowPattern)].map((match) => ({
  number: match[1],
  title: match[2].trim(),
  route: match[3],
}));
assert.equal(lectures.length, 29, "Course index must expose exactly 29 lecture routes");
assert.equal(new Set(lectures.map((x) => x.route)).size, 29, "Lecture routes must be unique");

const expectedNumbers = Array.from({length: 29}, (_, i) => String(i + 1).padStart(2, "0"));
assert.deepEqual(lectures.map((x) => x.number), expectedNumbers, "Lecture numbers must be 01-29 in order");

const headerName = "x-lbfl-certification";
const headers = {Accept: "text/html,application/xhtml+xml", [headerName]: token};

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
      if (response.status === 200) return {response, text, attempt};
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

const results = [];
for (const lecture of lectures) {
  const url = new URL(lecture.route, baseUrl);
  const {response, text, attempt} = await fetchText(url);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html/i, `${url} must return HTML`);
  assert.ok(text.includes("data-zoology-learning-cycle"), `${url} is missing the Ecology/Zoology learning-cycle marker`);
  const canonical = canonicalHref(text);
  assert.ok(canonical, `${url} is missing a canonical link`);
  assert.equal(new URL(canonical).pathname, lecture.route, `${url} canonical route mismatch`);
  assert.ok(!/\b404\b[^<]*(?:not found|page)/i.test(text), `${url} looks like a 404 body`);
  results.push({number: lecture.number, route: lecture.route, status: response.status, canonical, attempt});
}

const gatewayUrl = new URL("/biology/higher-zoology-tree/ecology/", baseUrl);
const gateway = await fetchText(gatewayUrl);
assert.ok(gateway.text.includes("Start the 29-Lecture Ecology Course"), "Gateway does not expose the 29-lecture course CTA");

const indexUrl = new URL("/biology/higher-zoology-tree/ecology/course-index/", baseUrl);
const indexPage = await fetchText(indexUrl);
assert.ok(indexPage.text.includes("Complete 29-Lecture Route Map"), "Course index marker is missing");

const ecologySitemapUrl = new URL("/ecology-sitemap.xml", baseUrl);
const ecologySitemap = await fetchText(ecologySitemapUrl, "application/xml,text/xml,*/*");
for (const lecture of lectures) {
  const absolute = new URL(lecture.route, baseUrl).href;
  assert.ok(ecologySitemap.text.includes(absolute), `Ecology sitemap is missing ${absolute}`);
}
assert.ok(ecologySitemap.text.includes(gatewayUrl.href), "Ecology sitemap is missing the gateway");
assert.ok(ecologySitemap.text.includes(indexUrl.href), "Ecology sitemap is missing the course index");

const robotsUrl = new URL("/robots.txt", baseUrl);
const robots = await fetchText(robotsUrl, "text/plain,*/*");
assert.ok(robots.text.includes("https://learningbiologyforlife.org/ecology-sitemap.xml"), "robots.txt does not advertise the Ecology sitemap");

const report = {
  token: "ECOLOGY_29_LIVE_PASS",
  tested_at: new Date().toISOString(),
  base_url: baseUrl.href,
  lecture_routes: 29,
  lecture_http_200: results.filter((x) => x.status === 200).length,
  gateway_http_200: gateway.response.status,
  course_index_http_200: indexPage.response.status,
  ecology_sitemap_http_200: ecologySitemap.response.status,
  robots_http_200: robots.response.status,
  results,
};
fs.writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
console.log("ECOLOGY_29_LIVE_PASS");
console.log(`lecture_http_200=${report.lecture_http_200}/29`);
console.log("gateway_http_200=200");
console.log("course_index_http_200=200");
console.log("ecology_sitemap_http_200=200");
console.log("robots_http_200=200");
