#!/usr/bin/env node
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

function parseArgs(argv) {
  const values = {};
  for (let index = 2; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || !value) {
      throw new Error("Usage: verify-worker-contract.mjs --base-url URL --output FILE [--expected-worker-version-id UUID]");
    }
    values[key.slice(2)] = value;
  }
  if (!values["base-url"] || !values.output) {
    throw new Error("Both --base-url and --output are required.");
  }
  return values;
}

async function request(url, options = {}) {
  return fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
    ...options,
  });
}

async function main() {
  const args = parseArgs(process.argv);
  const baseUrl = new URL(args["base-url"]);
  const testOrigin = "https://learningbiologyforlife.org";
  const result = {
    worker_base_url: baseUrl.origin,
    tested_at: new Date().toISOString(),
    contracts: {},
  };

  const healthUrl = new URL("/api/health", baseUrl).toString();
  const healthResponse = await request(healthUrl, {
    headers: { Accept: "application/json", Origin: testOrigin },
  });
  assert.equal(healthResponse.status, 200, "GET /api/health must return 200");
  assert.match(
    healthResponse.headers.get("content-type") ?? "",
    /^application\/json/i,
    "GET /api/health must return JSON",
  );
  assert.equal(
    healthResponse.headers.get("access-control-allow-origin"),
    testOrigin,
    "GET /api/health must honour the approved origin",
  );
  const health = await healthResponse.json();
  assert.equal(health.ok, true, "health payload must confirm ok=true");
  assert.ok(Array.isArray(health.routes?.health), "health payload must describe health routes");
  assert.ok(Array.isArray(health.routes?.socratic), "health payload must describe Socratic routes");
  assert.ok(
    health.routes.health.includes("GET /api/health"),
    "health route contract must include GET /api/health",
  );
  assert.ok(
    health.routes.socratic.includes("POST /api/socratic"),
    "health route contract must include POST /api/socratic",
  );
  result.contracts.health = {
    status: healthResponse.status,
    service: health.service,
    version: health.version,
    environment: health.environment,
    result: "PASS",
  };
  if (args["expected-worker-version-id"]) {
    const observedVersionId = healthResponse.headers.get("x-lbfl-worker-version") ?? "";
    assert.equal(
      observedVersionId,
      args["expected-worker-version-id"],
      "GET /api/health must expose the Cloudflare Worker version serving this preview",
    );
    result.contracts.health.deployment_binding = {
      expected_worker_version_id: args["expected-worker-version-id"],
      observed_worker_version_id: observedVersionId,
      result: "PASS",
    };
  }

  const preflightResponse = await request(new URL("/api/socratic", baseUrl).toString(), {
    method: "OPTIONS",
    headers: {
      Origin: testOrigin,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "Content-Type",
    },
  });
  assert.equal(preflightResponse.status, 204, "OPTIONS /api/socratic must return 204");
  assert.match(
    preflightResponse.headers.get("access-control-allow-methods") ?? "",
    /POST/,
    "Socratic preflight must allow POST",
  );

  const invalidSocraticResponse = await request(new URL("/api/socratic", baseUrl).toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: testOrigin,
    },
    body: JSON.stringify({ type: "wrong_contract" }),
  });
  assert.equal(
    invalidSocraticResponse.status,
    400,
    "POST /api/socratic must reject an invalid contract without calling the model",
  );
  assert.match(
    invalidSocraticResponse.headers.get("content-type") ?? "",
    /^application\/json/i,
    "invalid Socratic response must be JSON",
  );
  const invalidSocratic = await invalidSocraticResponse.json();
  assert.equal(invalidSocratic.error, "Invalid Socratic payload contract.");
  assert.equal(invalidSocratic.required?.type, "socratic_reflex");
  result.contracts.socratic = {
    preflight_status: preflightResponse.status,
    invalid_payload_status: invalidSocraticResponse.status,
    model_invocation: "not attempted",
    result: "PASS",
  };

  await mkdir(dirname(args.output), { recursive: true });
  await writeFile(args.output, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

main().catch(async (error) => {
  const message = error instanceof Error ? error.message : String(error);
  const cause = error instanceof Error && error.cause instanceof Error
    ? `; cause: ${error.cause.name}: ${error.cause.message}`
    : "";
  process.stderr.write(`Worker contract verification failed: ${message}${cause}\n`);
  process.exitCode = 1;
});
