#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const graphPath = path.join(repoRoot, "docs", "agent", "lbfl-execution-graph.json");

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(graphPath)) {
  fail(`graph file missing: ${graphPath}`);
  process.exit();
}

let graph;
try {
  graph = JSON.parse(fs.readFileSync(graphPath, "utf8"));
} catch (error) {
  fail(`graph JSON is invalid: ${error.message}`);
  process.exit();
}

if (!Array.isArray(graph.nodes) || graph.nodes.length === 0) {
  fail("nodes must be a non-empty array");
  process.exit();
}
if (!Array.isArray(graph.edges)) {
  fail("edges must be an array");
  process.exit();
}

const ids = graph.nodes.map((node) => node.id);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== ids.length) {
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  fail(`duplicate node IDs: ${[...new Set(duplicates)].join(", ")}`);
}

for (const node of graph.nodes) {
  for (const key of ["id", "class", "job", "inputs", "outputs", "mutations", "failure"]) {
    if (!(key in node)) fail(`node ${node.id ?? "<unknown>"} missing ${key}`);
  }
  if (node.class === "controlled_cycle") {
    if (!node.convergence || !Number.isInteger(node.convergence.max_rounds) || node.convergence.max_rounds < 1) {
      fail(`controlled cycle ${node.id} must have finite max_rounds >= 1`);
    }
  }
}

for (const edge of graph.edges) {
  if (!uniqueIds.has(edge.from)) fail(`edge source does not exist: ${edge.from}`);
  if (!uniqueIds.has(edge.to)) fail(`edge target does not exist: ${edge.to}`);
  if (!Array.isArray(edge.contract) || edge.contract.length === 0) {
    fail(`edge ${edge.from} -> ${edge.to} must have a non-empty data contract`);
  }
}

const required = [
  "authenticate_baseline",
  "synthesize_findings",
  "risk_router",
  "exact_head_certification",
  "human_release_authority",
  "production_deployment",
  "live_certification",
  "close_and_persist"
];
for (const id of required) {
  if (!uniqueIds.has(id)) fail(`required critical node missing: ${id}`);
}

const byId = new Map(graph.nodes.map((node) => [node.id, node]));
const deployment = byId.get("production_deployment");
if (deployment && !(deployment.mutations?.allowed === true && deployment.mutations?.production === true)) {
  fail("production_deployment must explicitly declare allowed production mutation");
}

for (const node of graph.nodes) {
  if (node.id !== "production_deployment" && node.mutations?.production === true) {
    fail(`only production_deployment may declare production mutation: ${node.id}`);
  }
}

const incoming = (target) => graph.edges.filter((edge) => edge.to === target);
const outgoing = (source) => graph.edges.filter((edge) => edge.from === source);

if (!incoming("production_deployment").some((edge) => edge.from === "human_release_authority")) {
  fail("production_deployment must be gated by human_release_authority");
}
if (!incoming("human_release_authority").some((edge) => edge.from === "exact_head_certification")) {
  fail("human_release_authority must receive exact_head_certification");
}
if (!outgoing("production_deployment").some((edge) => edge.to === "live_certification")) {
  fail("production_deployment must flow to live_certification");
}

const mutationNodes = graph.nodes.filter((node) => node.mutations?.allowed === true);
for (const node of mutationNodes) {
  if (node.id === "production_deployment") continue;
  const outs = outgoing(node.id).map((edge) => edge.to);
  if (!outs.some((id) => ["candidate_verification_cycle", "exact_head_certification", "live_certification"].includes(id))) {
    fail(`mutation node ${node.id} lacks a downstream verification/certification edge`);
  }
}

if (!Array.isArray(graph.release_invariants) || graph.release_invariants.length < 4) {
  fail("release_invariants must contain at least four explicit invariants");
}

if (!process.exitCode) {
  console.log(`PASS: ${graph.name}`);
  console.log(`nodes=${graph.nodes.length} edges=${graph.edges.length} mutation_nodes=${mutationNodes.length}`);
  console.log("Production path is gated by exact-head certification -> human authority -> deployment -> live certification.");
}
