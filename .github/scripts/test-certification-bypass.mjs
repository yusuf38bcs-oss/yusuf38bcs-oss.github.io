import assert from "node:assert/strict";
import test from "node:test";

import {
  CERTIFICATION_HEADER_NAME,
  assertCertificationTokenAbsent,
  certificationHeadersForUrl,
  installCertificationBypassRoute,
  requireCertificationToken,
  sanitizeRecordedHeaders,
} from "./certification-bypass.mjs";

const TOKEN = "0123456789abcdef".repeat(4);

test("accepts only a 64-character lowercase hexadecimal token", () => {
  assert.equal(requireCertificationToken(TOKEN), TOKEN);
  for (const invalid of ["", TOKEN.slice(1), `${TOKEN}0`, TOKEN.toUpperCase(), undefined]) {
    assert.throws(
      () => requireCertificationToken(invalid),
      (error) => !String(error).includes(TOKEN),
    );
  }
});

test("adds the header only to the two exact HTTPS production hosts", () => {
  for (const url of [
    "https://learningbiologyforlife.org/",
    "https://learningbiologyforlife.org/biology/hsc-corner/",
    "https://api.learningbiologyforlife.org/api/health",
  ]) {
    assert.deepEqual(certificationHeadersForUrl(url, { accept: "text/html" }, TOKEN), {
      accept: "text/html",
      [CERTIFICATION_HEADER_NAME]: TOKEN,
    });
  }
});

test("rejects non-production, non-HTTPS, lookalike, and non-default-port targets", () => {
  for (const url of [
    "http://learningbiologyforlife.org/",
    "https://www.learningbiologyforlife.org/",
    "https://preview.learningbiologyforlife.org/",
    "https://learningbiologyforlife.org.evil.example/",
    "https://learningbiologyforlife.org:8443/",
    "https://example.pages.dev/",
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
    "not a URL",
  ]) {
    assert.equal(certificationHeadersForUrl(url, {}, TOKEN), null, url);
  }
});

test("removes the certification header from recorded request metadata", () => {
  assert.deepEqual(
    sanitizeRecordedHeaders({
      Accept: "application/json",
      "X-LBFL-Certification": TOKEN,
      "save-data": "on",
    }),
    { Accept: "application/json", "save-data": "on" },
  );
});

test("detects evidence leakage without repeating the credential", () => {
  assert.doesNotThrow(() => assertCertificationTokenAbsent("safe evidence", TOKEN, "Evidence"));
  assert.throws(
    () => assertCertificationTokenAbsent(`unsafe ${TOKEN}`, TOKEN, "Evidence"),
    (error) => {
      assert.equal(String(error).includes(TOKEN), false);
      return true;
    },
  );
});

test("routes attach the credential only to allowed requests", async () => {
  let handler;
  const context = {
    async route(pattern, callback) {
      assert.equal(pattern, "**/*");
      handler = callback;
    },
  };
  await installCertificationBypassRoute(context, TOKEN);

  const calls = [];
  const route = (url) => ({
    async continue(options) {
      calls.push(options);
    },
    request() {
      return { headers: () => ({ accept: "*/*" }), url: () => url };
    },
  });

  await handler(route("https://api.learningbiologyforlife.org/api/health"));
  await handler(route("https://third-party.example/pixel"));
  assert.equal(calls[0].headers[CERTIFICATION_HEADER_NAME], TOKEN);
  assert.equal(calls[1], undefined);
});
