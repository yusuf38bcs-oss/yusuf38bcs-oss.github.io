#!/usr/bin/env node
// YESAF E4: unprivileged exact-blob source/coverage assertions. Not release approval.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const prefix = ".github/workflows/conv04f-zoology-practical-";
const retired = Object.freeze({
  appendages: "a28bf51cac8e4ec07a9228d16d636b1a5af73972",
  dissection: "68e11e232a437823258f5f74530db51017ce5de4",
  museum: "bf91156ff62791c21f90c880e72838f2843c3926",
  "permanent-slides": "a17d3221cc69dcb4b4760693814eec40d26d719e",
  "temporary-mounts": "07b28127f234d5819e568497d206851230e13810",
  "whole-mounts": "1f8f8ab0b9347a7c1c3e2e66e729ea1427c31a0a",
  "field-report": "9c5facafde56309951db4e768f7040582c0aa96c",
  zooplankton: "305b555b153c30719fedcc88164947a2c85fe5f9",
});
const academic = Object.freeze({
  ".github/workflows/yesaf-e4-practical-five-readonly-successors.yml":
    "f9fc4772a82f67ffe9637d2c7e00fe5a353a2de6",
  ".github/workflows/yesaf-museum-readonly-certification.yml":
    "2a17be8742e4530d10e8bb2a63942728d1fceb38",
});
const guards = Object.freeze({
  ".github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml":
    "db9acd3be13b6e984e9b07ddb29a853ab0f0f0db",
  ".github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml":
    "72184914ba87b5310a4d350ac3db2a6d9ad47304",
});
function blob(path) {
  return execFileSync("git", ["hash-object", path], { encoding: "utf8" }).trim();
}
function read(path) {
  return readFileSync(path, "utf8");
}
function unsafePublisher(s) {
  return [
    /^\s{2}push\s*:/m,
    /^\s{2}pull_request_target\s*:/m,
    /wrangler\s+(?:pages\s+)?deploy\b/i,
    /cloudflare\/wrangler-action/i,
    /actions\/deploy-pages@/i,
    /\b(?:CLOUDFLARE_API_TOKEN|CLOUDFLARE_PAGES_DEPLOY_TOKEN|CLOUDFLARE_WORKER_DEPLOY_TOKEN)\b/,
    /^\s*(?:pages|id-token|deployments):\s*write\b/m,
    /\bcurl[^\n]*\s+-X\s+(?:POST|PUT|PATCH|DELETE)\b/i,
  ].some(pattern => pattern.test(s));
}
for (const [subject, sha] of Object.entries(retired)) {
  const path = prefix + subject + "-production-parity.yml";
  test(subject + ": SHA-bound historical retirement source", () => {
    assert.equal(blob(path), sha, "retirement blob changed from vetted PR");
  });
  test(subject + ": no push, Cloudflare writer or deploy capability", () => {
    const content = read(path);
    assert.match(content, /(?:Retired|Retired Candidate)/);
    assert.match(content, /^on:\s*\n  workflow_dispatch:/m);
    assert.match(content, /permissions:\s*\n  contents: read/m);
    assert.equal(unsafePublisher(content), false, path + " is unsafe");
    assert.match(content, /retired_notice:/);
  });
}
for (const [path, sha] of Object.entries(academic)) {
  test(path + ": exact read-only successor from source PR", () => {
    assert.equal(blob(path), sha);
    const content = read(path);
    assert.match(content, /^on:\s*\n  pull_request:/m);
    assert.match(content, /permissions:\s*\n  contents: read/m);
    assert.equal(unsafePublisher(content), false, path + " is unsafe");
  });
}
for (const [path, sha] of Object.entries(guards)) {
  test(path + ": guard unchanged from #499 at integration time", () => {
    assert.equal(blob(path), sha);
  });
}
test("five existing subject-specific browser checks remain executable", () => {
  const flow = read(".github/workflows/yesaf-e4-practical-five-readonly-successors.yml");
  for (const subject of ["appendages", "dissection", "permanent-slides", "temporary-mounts", "whole-mounts"]) {
    assert.ok(flow.includes(subject), subject + " missing");
    assert.ok(readFileSync(".github/scripts/conv04f-zoology-practical-" + subject + "-browser-certification.mjs").length > 100);
  }
  assert.match(flow, /matrix:\s*\n\s*subject:/);
  assert.match(flow, /127\.0\.0\.1:4173/);
  assert.match(flow, /validate_practical_213106\.rb/);
  assert.match(flow, /--base-url/);
});
test("Museum retains actual scientific and browser validator, not a mock", () => {
  const s = read(".github/workflows/yesaf-museum-readonly-certification.yml");
  assert.match(s, /certify:/);
  assert.match(s, /jekyll build/);
  assert.match(s, /museum-browser-certification\.mjs/);
  assert.equal(unsafePublisher(s), false);
});
test("untrusted source can never be promoted by this shadow test", () => {
  const f = read(".github/workflows/yesaf-e4-eight-writer-integration-tests.yml");
  assert.match(f, /^on:\s*\n  pull_request:/m);
  assert.match(f, /permissions:\s*\n  contents: read/m);
  assert.match(f, /persist-credentials: false/);
  assert.equal(unsafePublisher(f), false);
  assert.doesNotMatch(f, /^\s*environment:\s*(?:production|github-pages)/m);
});
test("negative fixtures detect attempted reintroduction of production writer", () => {
  for (const injected of [
    "\n  push:\n    branches: [main]\n",
    "\n  pull_request_target:\n",
    "\n  pages: write\n",
    "\n  id-token: write\n",
    "\n  CLOUDFLARE_API_TOKEN: " + "secrets",
    "\n  wrangler pages deploy _site --branch main\n",
    "\n  uses: actions/deploy-pages@v4\n",
  ]) assert.equal(unsafePublisher(injected), true, "bad pattern escaped: " + injected);
});
test("independent release remains explicitly BLOCKED by unresolved controls", () => {
  const note = read("docs/yesaf/E4_G7_8_WRITER_6_ACADEMIC_SHADOW_HOLD.md");
  for (const phrase of [
    "NO MERGE", "NO DEPLOY", "P1", "TOCTOU",
    "1,000", "write-time", "rollback", "independent authorization",
  ]) assert.ok(note.includes(phrase), "missing hold rationale: " + phrase);
});
console.log("YESAF eight-retirement/six-academic SOURCE SHADOW COMPLETE; RELEASE HOLD.");
