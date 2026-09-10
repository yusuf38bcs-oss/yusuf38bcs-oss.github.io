#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const graphPath =
  path.join(
    root,
    "docs",
    "agent",
    "lbfl-execution-graph.json"
  );

const nodeSchemaPath =
  path.join(
    root,
    "docs",
    "agent",
    "lbfl-node.schema.json"
  );

const stateSchemaPath =
  path.join(
    root,
    "docs",
    "agent",
    "lbfl-state.schema.json"
  );

const allowedClasses = [
  "deterministic_gate",
  "specialist_audit",
  "deterministic_join",
  "policy_router",
  "reasoning_node",
  "mutation_node",
  "controlled_cycle",
  "human_gate",
  "state_node"
];

const allowedFailureRoutes = [
  "RETRY",
  "FALLBACK",
  "SKIP",
  "REPAIR",
  "ESCALATE",
  "HOLD",
  "FAIL_CLOSED",
  "STOP"
];

const allowedInputSources = [
  "edge",
  "state",
  "context"
];

function loadJson(file) {
  return JSON.parse(
    fs.readFileSync(
      file,
      "utf8"
    )
  );
}

function clone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}

function sameSet(a, b) {

  return (
    JSON.stringify(
      [...a].sort()
    ) ===
    JSON.stringify(
      [...b].sort()
    )
  );
}

function validateGraph(graph) {

  const errors = [];

  const fail =
    message =>
      errors.push(message);

  if (graph.version !== "1.1.0") {
    fail(
      `expected graph version 1.1.0; found ${graph.version}`
    );
  }

  if (
    !Array.isArray(graph.nodes) ||
    graph.nodes.length !== 21
  ) {
    fail(
      `expected exactly 21 nodes; found ${graph.nodes?.length}`
    );
  }

  if (
    !Array.isArray(graph.edges) ||
    graph.edges.length !== 29
  ) {
    fail(
      `expected exactly 29 edges; found ${graph.edges?.length}`
    );
  }

  const nodes =
    Array.isArray(graph.nodes)
      ? graph.nodes
      : [];

  const edges =
    Array.isArray(graph.edges)
      ? graph.edges
      : [];

  const ids =
    nodes.map(
      node =>
        node.id
    );

  const idSet =
    new Set(ids);

  if (
    idSet.size !==
    ids.length
  ) {
    fail(
      "duplicate node IDs detected"
    );
  }

  const byId =
    new Map(
      nodes.map(
        node => [
          node.id,
          node
        ]
      )
    );

  const incoming =
    id =>
      edges.filter(
        edge =>
          edge.to === id
      );

  const outgoing =
    id =>
      edges.filter(
        edge =>
          edge.from === id
      );

  const requiredNodes = [
    "authenticate_baseline",
    "audit_plan_router",
    "academic_truth_audit",
    "ui_responsive_audit",
    "seo_route_audit",
    "accessibility_audit",
    "security_supply_chain_audit",
    "runtime_worker_audit",
    "synthesize_findings",
    "risk_router",
    "remediation_design",
    "isolated_implementation",
    "candidate_verification_cycle",
    "release_plan",
    "exact_head_certification",
    "human_release_authority",
    "production_deployment",
    "live_certification",
    "production_recovery",
    "recovery_certification",
    "close_and_persist"
  ];

  for (
    const id
    of requiredNodes
  ) {

    if (
      !byId.has(id)
    ) {
      fail(
        `required node missing: ${id}`
      );
    }
  }

  for (
    const node
    of nodes
  ) {

    for (
      const key
      of [
        "id",
        "class",
        "job",
        "inputs",
        "input_sources",
        "outputs",
        "mutations",
        "failure"
      ]
    ) {

      if (
        !(key in node)
      ) {
        fail(
          `node ${node.id ?? "<unknown>"} missing ${key}`
        );
      }
    }

    if (
      !allowedClasses.includes(
        node.class
      )
    ) {
      fail(
        `node ${node.id} has invalid class: ${node.class}`
      );
    }

    if (
      !Array.isArray(node.inputs) ||
      !Array.isArray(node.outputs)
    ) {
      fail(
        `node ${node.id} inputs/outputs must be arrays`
      );

      continue;
    }

    if (
      new Set(node.inputs).size !==
      node.inputs.length
    ) {
      fail(
        `node ${node.id} has duplicate inputs`
      );
    }

    if (
      new Set(node.outputs).size !==
      node.outputs.length
    ) {
      fail(
        `node ${node.id} has duplicate outputs`
      );
    }

    const sourceKeys =
      Object.keys(
        node.input_sources ??
        {}
      );

    if (
      !sameSet(
        sourceKeys,
        node.inputs
      )
    ) {
      fail(
        `node ${node.id} input_sources must exactly match inputs`
      );
    }

    for (
      const [input, source]
      of Object.entries(
        node.input_sources ??
        {}
      )
    ) {

      if (
        !allowedInputSources.includes(
          source
        )
      ) {
        fail(
          `node ${node.id} input ${input} has invalid provenance ${source}`
        );
      }
    }

    for (
      const route
      of Object.values(
        node.failure ??
        {}
      )
    ) {

      if (
        !allowedFailureRoutes.includes(
          route
        )
      ) {
        fail(
          `node ${node.id} has invalid failure route ${route}`
        );
      }
    }

    if (
      node.mutations?.allowed ===
        true &&
      (
        typeof node.mutations.scope !==
          "string" ||
        node.mutations.scope.length ===
          0
      )
    ) {
      fail(
        `mutation node ${node.id} lacks bounded scope`
      );
    }

    if (
      node.mutations?.production ===
        true &&
      node.mutations?.allowed !==
        true
    ) {
      fail(
        `node ${node.id} declares production mutation without mutation authority`
      );
    }

    if (
      node.class ===
      "controlled_cycle"
    ) {

      const c =
        node.convergence;

      if (
        !Number.isInteger(
          c?.max_rounds
        ) ||
        c.max_rounds < 1
      ) {
        fail(
          `controlled cycle ${node.id} lacks finite max_rounds`
        );
      }

      if (
        !Number.isInteger(
          c?.dry_rounds
        ) ||
        c.dry_rounds < 1
      ) {
        fail(
          `controlled cycle ${node.id} lacks finite dry_rounds`
        );
      }

      if (
        Number.isInteger(
          c?.max_rounds
        ) &&
        Number.isInteger(
          c?.dry_rounds
        ) &&
        c.dry_rounds >
          c.max_rounds
      ) {
        fail(
          `controlled cycle ${node.id} has dry_rounds > max_rounds`
        );
      }

      if (
        typeof c?.completion_test !==
          "string" ||
        c.completion_test.length ===
          0
      ) {
        fail(
          `controlled cycle ${node.id} lacks completion_test`
        );
      }

      if (
        typeof c?.budget_ref !==
          "string" ||
        c.budget_ref.length ===
          0
      ) {
        fail(
          `controlled cycle ${node.id} lacks budget_ref`
        );
      }

      if (
        !allowedFailureRoutes.includes(
          c?.escalation_route
        )
      ) {
        fail(
          `controlled cycle ${node.id} has invalid escalation_route`
        );
      }
    }

    if (
      node.class ===
      "deterministic_join"
    ) {

      const jp =
        node.join_policy;

      if (
        jp?.mode !==
        "all_selected"
      ) {
        fail(
          `join ${node.id} must use all_selected semantics`
        );
      }

      if (
        typeof jp?.selector_node !==
          "string" ||
        !byId.has(
          jp.selector_node
        )
      ) {
        fail(
          `join ${node.id} selector_node invalid`
        );
      }

      const selector =
        byId.get(
          jp?.selector_node
        );

      if (
        selector &&
        !selector.outputs.includes(
          jp.selector_output
        )
      ) {
        fail(
          `join ${node.id} selector_output is not produced by selector node`
        );
      }

      if (
        !Array.isArray(
          jp?.aggregate_inputs
        ) ||
        jp.aggregate_inputs.length ===
          0
      ) {
        fail(
          `join ${node.id} lacks aggregate_inputs`
        );
      }
    }
  }

  // Edge contracts

  for (
    const edge
    of edges
  ) {

    const source =
      byId.get(
        edge.from
      );

    const target =
      byId.get(
        edge.to
      );

    if (!source) {
      fail(
        `edge source missing: ${edge.from}`
      );

      continue;
    }

    if (!target) {
      fail(
        `edge target missing: ${edge.to}`
      );

      continue;
    }

    if (
      typeof edge.condition !==
        "string" ||
      edge.condition.trim().length ===
        0
    ) {
      fail(
        `edge ${edge.from} -> ${edge.to} lacks condition`
      );
    }

    if (
      !Array.isArray(
        edge.contract
      ) ||
      edge.contract.length ===
        0
    ) {
      fail(
        `edge ${edge.from} -> ${edge.to} has empty contract`
      );

      continue;
    }

    if (
      new Set(
        edge.contract
      ).size !==
      edge.contract.length
    ) {
      fail(
        `edge ${edge.from} -> ${edge.to} has duplicate contract fields`
      );
    }

    for (
      const field
      of edge.contract
    ) {

      if (
        !source.outputs.includes(
          field
        )
      ) {
        fail(
          `edge ${edge.from} -> ${edge.to} carries non-output field ${field}`
        );
      }

      if (
        !target.inputs.includes(
          field
        )
      ) {
        fail(
          `edge ${edge.from} -> ${edge.to} sends undeclared target input ${field}`
        );
      }
    }

    for (
      const input
      of target.inputs
    ) {

      if (
        target.input_sources?.[input] ===
          "edge" &&
        !edge.contract.includes(
          input
        )
      ) {
        fail(
          `edge ${edge.from} -> ${edge.to} omits required edge input ${input}`
        );
      }
    }
  }

  // Reachability

  const adjacency =
    new Map(
      nodes.map(
        node => [
          node.id,
          []
        ]
      )
    );

  for (
    const edge
    of edges
  ) {
    adjacency
      .get(edge.from)
      ?.push(
        edge.to
      );
  }

  const visited =
    new Set();

  const queue =
    [
      "authenticate_baseline"
    ];

  while (
    queue.length
  ) {

    const current =
      queue.shift();

    if (
      visited.has(
        current
      )
    ) {
      continue;
    }

    visited.add(
      current
    );

    for (
      const next
      of adjacency.get(
        current
      ) ?? []
    ) {

      if (
        !visited.has(
          next
        )
      ) {
        queue.push(
          next
        );
      }
    }
  }

  for (
    const node
    of nodes
  ) {

    if (
      !visited.has(
        node.id
      )
    ) {
      fail(
        `unreachable node: ${node.id}`
      );
    }
  }

  // Audit routing

  const expectedSpecialists = [
    "accessibility_audit",
    "academic_truth_audit",
    "runtime_worker_audit",
    "security_supply_chain_audit",
    "seo_route_audit",
    "ui_responsive_audit"
  ].sort();

  const specialistIds =
    nodes
      .filter(
        node =>
          node.class ===
          "specialist_audit"
      )
      .map(
        node =>
          node.id
      )
      .sort();

  if (
    !sameSet(
      specialistIds,
      expectedSpecialists
    )
  ) {
    fail(
      "unexpected specialist-audit set"
    );
  }

  for (
    const id
    of expectedSpecialists
  ) {

    const inc =
      incoming(id);

    if (
      inc.length !== 1 ||
      inc[0].from !==
        "audit_plan_router"
    ) {
      fail(
        `specialist ${id} bypasses audit_plan_router`
      );
    }

    if (
      !outgoing(id).some(
        edge =>
          edge.to ===
          "synthesize_findings"
      )
    ) {
      fail(
        `specialist ${id} does not reach synthesis`
      );
    }
  }

  const synthesisSources =
    incoming(
      "synthesize_findings"
    )
      .map(
        edge =>
          edge.from
      )
      .sort();

  if (
    !sameSet(
      synthesisSources,
      expectedSpecialists
    )
  ) {
    fail(
      "synthesize_findings incoming specialist set is incomplete or polluted"
    );
  }

  // Single-entry privilege gates

  const requireOnlyIncoming =
    (
      target,
      source
    ) => {

      const inc =
        incoming(
          target
        );

      if (
        inc.length !== 1 ||
        inc[0].from !==
          source
      ) {
        fail(
          `${target} must have exactly one incoming authority edge from ${source}`
        );
      }
    };

  requireOnlyIncoming(
    "exact_head_certification",
    "release_plan"
  );

  requireOnlyIncoming(
    "human_release_authority",
    "exact_head_certification"
  );

  requireOnlyIncoming(
    "production_deployment",
    "human_release_authority"
  );

  requireOnlyIncoming(
    "production_recovery",
    "live_certification"
  );

  requireOnlyIncoming(
    "recovery_certification",
    "production_recovery"
  );

  // Production mutation boundary

  const productionMutators =
    nodes
      .filter(
        node =>
          node.mutations?.production ===
          true
      )
      .map(
        node =>
          node.id
      )
      .sort();

  if (
    !sameSet(
      productionMutators,
      [
        "production_deployment",
        "production_recovery"
      ]
    )
  ) {
    fail(
      `unexpected production mutation set: ${productionMutators.join(", ")}`
    );
  }

  const deployment =
    byId.get(
      "production_deployment"
    );

  if (
    Object.values(
      deployment?.failure ??
      {}
    ).includes(
      "RETRY"
    )
  ) {
    fail(
      "production_deployment may not RETRY ambiguous production mutation failures"
    );
  }

  const recovery =
    byId.get(
      "production_recovery"
    );

  if (
    recovery?.class !==
    "mutation_node"
  ) {
    fail(
      "production_recovery must be a one-shot mutation_node, not an automatic cycle"
    );
  }

  if (
    Object.values(
      recovery?.failure ??
      {}
    ).includes(
      "RETRY"
    )
  ) {
    fail(
      "production_recovery may not RETRY production mutation failures automatically"
    );
  }

  // Rollout / rollback / operation identity

  const requiresInput =
    (
      id,
      field
    ) => {

      if (
        !byId.get(id)
          ?.inputs
          .includes(
            field
          )
      ) {
        fail(
          `${id} must consume ${field}`
        );
      }
    };

  const requiresOutput =
    (
      id,
      field
    ) => {

      if (
        !byId.get(id)
          ?.outputs
          .includes(
            field
          )
      ) {
        fail(
          `${id} must produce/pass ${field}`
        );
      }
    };

  requiresOutput(
    "release_plan",
    "rollback_plan"
  );

  requiresOutput(
    "release_plan",
    "rollout_plan"
  );

  requiresOutput(
    "release_plan",
    "deployment_operation_id"
  );

  for (
    const id
    of [
      "exact_head_certification",
      "human_release_authority"
    ]
  ) {

    for (
      const field
      of [
        "rollback_plan",
        "rollout_plan",
        "deployment_operation_id"
      ]
    ) {

      requiresInput(
        id,
        field
      );

      requiresOutput(
        id,
        field
      );
    }
  }

  for (
    const field
    of [
      "rollback_plan",
      "rollout_plan",
      "deployment_operation_id"
    ]
  ) {
    requiresInput(
      "production_deployment",
      field
    );
  }

  requiresOutput(
    "production_deployment",
    "rollback_plan"
  );

  requiresOutput(
    "production_deployment",
    "deployment_operation_id"
  );

  requiresInput(
    "live_certification",
    "rollback_plan"
  );

  requiresInput(
    "live_certification",
    "deployment_operation_id"
  );

  requiresOutput(
    "live_certification",
    "rollback_plan"
  );

  requiresOutput(
    "live_certification",
    "deployment_operation_id"
  );

  requiresInput(
    "production_recovery",
    "rollback_plan"
  );

  requiresInput(
    "production_recovery",
    "deployment_operation_id"
  );

  requiresOutput(
    "production_recovery",
    "deployment_operation_id"
  );

  requiresInput(
    "recovery_certification",
    "deployment_operation_id"
  );

  // Universal production path proof

  function allSimplePaths(
    start,
    target,
    maxPaths = 10000
  ) {

    const result = [];

    function walk(
      current,
      path,
      seen
    ) {

      if (
        result.length >=
        maxPaths
      ) {
        throw new Error(
          `path explosion while checking ${target}`
        );
      }

      if (
        current ===
        target
      ) {

        result.push(
          [...path]
        );

        return;
      }

      for (
        const next
        of adjacency.get(
          current
        ) ?? []
      ) {

        if (
          seen.has(
            next
          )
        ) {
          continue;
        }

        seen.add(
          next
        );

        path.push(
          next
        );

        walk(
          next,
          path,
          seen
        );

        path.pop();

        seen.delete(
          next
        );
      }
    }

    walk(
      start,
      [start],
      new Set([
        start
      ])
    );

    return result;
  }

  function containsOrdered(
    path,
    required
  ) {

    let previous =
      -1;

    for (
      const id
      of required
    ) {

      const index =
        path.indexOf(
          id
        );

      if (
        index < 0 ||
        index <= previous
      ) {
        return false;
      }

      previous =
        index;
    }

    return true;
  }

  let deployPaths =
    [];

  try {

    deployPaths =
      allSimplePaths(
        "authenticate_baseline",
        "production_deployment"
      );
  }
  catch (error) {
    fail(
      error.message
    );
  }

  if (
    deployPaths.length ===
    0
  ) {
    fail(
      "production_deployment is unreachable"
    );
  }

  for (
    const p
    of deployPaths
  ) {

    if (
      !containsOrdered(
        p,
        [
          "release_plan",
          "exact_head_certification",
          "human_release_authority",
          "production_deployment"
        ]
      )
    ) {
      fail(
        `production privilege bypass: ${p.join(" -> ")}`
      );
    }
  }

  let recoveryPaths =
    [];

  try {

    recoveryPaths =
      allSimplePaths(
        "authenticate_baseline",
        "production_recovery"
      );
  }
  catch (error) {
    fail(
      error.message
    );
  }

  if (
    recoveryPaths.length ===
    0
  ) {
    fail(
      "production_recovery is unreachable"
    );
  }

  for (
    const p
    of recoveryPaths
  ) {

    if (
      !containsOrdered(
        p,
        [
          "release_plan",
          "exact_head_certification",
          "human_release_authority",
          "production_deployment",
          "live_certification",
          "production_recovery"
        ]
      )
    ) {
      fail(
        `recovery privilege bypass: ${p.join(" -> ")}`
      );
    }
  }

  const liveOut =
    outgoing(
      "live_certification"
    );

  if (
    !liveOut.some(
      edge =>
        edge.to ===
          "close_and_persist" &&
        edge.condition ===
          "live_status == PASS"
    )
  ) {
    fail(
      "live PASS route to close_and_persist missing"
    );
  }

  if (
    !liveOut.some(
      edge =>
        edge.to ===
          "production_recovery" &&
        edge.condition ===
          "live_status != PASS"
    )
  ) {
    fail(
      "live non-PASS recovery route missing"
    );
  }

  if (
    !outgoing(
      "production_recovery"
    ).some(
      edge =>
        edge.to ===
        "recovery_certification"
    )
  ) {
    fail(
      "production recovery lacks independent recovery certification"
    );
  }

  if (
    !Array.isArray(
      graph.release_invariants
    ) ||
    graph.release_invariants.length <
      10
  ) {
    fail(
      "release_invariants must contain at least 10 explicit invariants"
    );
  }

  return errors;
}

function validateSchemas(
  nodeSchema,
  stateSchema
) {

  const errors = [];

  const fail =
    message =>
      errors.push(message);

  if (
    !sameSet(
      nodeSchema
        ?.properties
        ?.class
        ?.enum ??
        [],
      allowedClasses
    )
  ) {
    fail(
      "node schema class enum is incomplete"
    );
  }

  if (
    !sameSet(
      nodeSchema
        ?.properties
        ?.failure
        ?.additionalProperties
        ?.enum ??
        [],
      allowedFailureRoutes
    )
  ) {
    fail(
      "node schema failure-route enum is incomplete"
    );
  }

  if (
    !sameSet(
      nodeSchema
        ?.properties
        ?.input_sources
        ?.additionalProperties
        ?.enum ??
        [],
      allowedInputSources
    )
  ) {
    fail(
      "node schema input provenance enum is incomplete"
    );
  }

  const mutationSchema =
    nodeSchema
      ?.properties
      ?.mutations;

  if (
    mutationSchema
      ?.additionalProperties !==
      false
  ) {
    fail(
      "mutation schema must reject undeclared properties"
    );
  }

  for (
    const key
    of [
      "allowed",
      "scope",
      "production"
    ]
  ) {

    if (
      !(
        key in
        (
          mutationSchema
            ?.properties ??
          {}
        )
      )
    ) {
      fail(
        `mutation schema lacks property ${key}`
      );
    }
  }

  if (
    !Array.isArray(
      mutationSchema
        ?.allOf
    ) ||
    mutationSchema.allOf.length <
      2
  ) {
    fail(
      "mutation schema lacks conditional scope/production enforcement"
    );
  }

  const convergenceSchema =
    nodeSchema
      ?.properties
      ?.convergence;

  const convergenceRequired =
    convergenceSchema
      ?.required ??
    [];

  for (
    const key
    of [
      "max_rounds",
      "dry_rounds",
      "completion_test",
      "budget_ref",
      "escalation_route"
    ]
  ) {

    if (
      !convergenceRequired.includes(
        key
      )
    ) {
      fail(
        `convergence schema does not require ${key}`
      );
    }
  }

  const humanRequired =
    stateSchema
      ?.properties
      ?.human_approvals
      ?.items
      ?.required ??
    [];

  for (
    const key
    of [
      "actor",
      "decision",
      "exact_head",
      "exact_base",
      "authorized_scope",
      "approved_at",
      "authorization_ref",
      "rollback_plan_ref",
      "rollout_plan_ref"
    ]
  ) {

    if (
      !humanRequired.includes(
        key
      )
    ) {
      fail(
        `human approval schema does not require ${key}`
      );
    }
  }

  const nodeStateProps =
    stateSchema
      ?.properties
      ?.nodes
      ?.additionalProperties
      ?.properties ??
    {};

  if (
    nodeStateProps
      .started_at
      ?.format !==
      "date-time"
  ) {
    fail(
      "node state started_at must use date-time format"
    );
  }

  if (
    nodeStateProps
      .completed_at
      ?.format !==
      "date-time"
  ) {
    fail(
      "node state completed_at must use date-time format"
    );
  }

  const evidenceProps =
    stateSchema
      ?.properties
      ?.evidence
      ?.items
      ?.properties ??
    {};

  if (
    evidenceProps
      .freshness_checked_at
      ?.format !==
      "date-time"
  ) {
    fail(
      "evidence freshness_checked_at must use date-time format"
    );
  }

  if (
    !(
      "deployment_operation_id"
      in
      (
        stateSchema
          ?.properties
          ?.authority
          ?.properties ??
        {}
      )
    )
  ) {
    fail(
      "durable authority state lacks deployment_operation_id"
    );
  }

  return errors;
}

let graph;
let nodeSchema;
let stateSchema;

try {

  graph =
    loadJson(
      graphPath
    );

  nodeSchema =
    loadJson(
      nodeSchemaPath
    );

  stateSchema =
    loadJson(
      stateSchemaPath
    );
}
catch (error) {

  console.error(
    `FAIL: JSON load error: ${error.message}`
  );

  process.exit(1);
}

const errors = [
  ...validateGraph(
    graph
  ),

  ...validateSchemas(
    nodeSchema,
    stateSchema
  )
];

// Negative self-test 1:
// preserve node/edge counts while introducing a real authority bypass.

const bypassGraph =
  clone(graph);

const bypassRisk =
  bypassGraph.nodes.find(
    node =>
      node.id ===
      "risk_router"
  );

const bypassHuman =
  bypassGraph.nodes.find(
    node =>
      node.id ===
      "human_release_authority"
  );

const replaceIndex =
  bypassGraph.edges.findIndex(
    edge =>
      edge.from ===
        "risk_router" &&
      edge.to ===
        "close_and_persist"
  );

if (
  !bypassRisk ||
  !bypassHuman ||
  replaceIndex < 0
) {

  errors.push(
    "negative bypass self-test setup failed"
  );
}
else {

  for (
    const field
    of bypassHuman.inputs
  ) {

    if (
      !bypassRisk.outputs.includes(
        field
      )
    ) {
      bypassRisk.outputs.push(
        field
      );
    }
  }

  bypassGraph.edges[
    replaceIndex
  ] = {

    from:
      "risk_router",

    to:
      "human_release_authority",

    condition:
      "route == UNSAFE_BYPASS_TEST",

    contract:
      [...bypassHuman.inputs]
  };

  const bypassErrors =
    validateGraph(
      bypassGraph
    );

  if (
    !bypassErrors.some(
      e =>
        e.includes(
          "human_release_authority must have exactly one incoming authority edge"
        ) ||
        e.includes(
          "production privilege bypass"
        )
    )
  ) {
    errors.push(
      "negative self-test failed: certification bypass was not specifically detected"
    );
  }
}

// Negative self-test 2:
// remove rollback_plan without changing graph topology.

const contractGraph =
  clone(graph);

const deploymentEdge =
  contractGraph.edges.find(
    edge =>
      edge.from ===
        "human_release_authority" &&
      edge.to ===
        "production_deployment"
  );

if (
  !deploymentEdge
) {

  errors.push(
    "negative rollback self-test setup failed"
  );
}
else {

  deploymentEdge.contract =
    deploymentEdge.contract.filter(
      field =>
        field !==
        "rollback_plan"
    );

  const contractErrors =
    validateGraph(
      contractGraph
    );

  if (
    !contractErrors.some(
      e =>
        e.includes(
          "omits required edge input rollback_plan"
        )
    )
  ) {
    errors.push(
      "negative self-test failed: missing rollback_plan was not specifically detected"
    );
  }
}

// Negative self-test 3:
// ambiguous production mutation must never auto-RETRY.

const retryGraph =
  clone(graph);

const retryDeployment =
  retryGraph.nodes.find(
    node =>
      node.id ===
      "production_deployment"
  );

if (
  !retryDeployment
) {

  errors.push(
    "negative retry self-test setup failed"
  );
}
else {

  retryDeployment
    .failure
    .deployment_error =
      "RETRY";

  const retryErrors =
    validateGraph(
      retryGraph
    );

  if (
    !retryErrors.some(
      e =>
        e.includes(
          "production_deployment may not RETRY"
        )
    )
  ) {
    errors.push(
      "negative self-test failed: unsafe production RETRY was not detected"
    );
  }
}

if (
  errors.length
) {

  for (
    const error
    of errors
  ) {
    console.error(
      `FAIL: ${error}`
    );
  }

  console.error(
    `FAIL: ${errors.length} invariant violation(s)`
  );

  process.exit(1);
}

console.log(
  `PASS: ${graph.name} v${graph.version}`
);

console.log(
  `PASS: nodes=${graph.nodes.length} edges=${graph.edges.length}`
);

console.log(
  "PASS: node classes, failure routes, mutation scopes, convergence, and input provenance are valid."
);

console.log(
  "PASS: edge contracts are source-output / target-input complete."
);

console.log(
  "PASS: specialist audits are gated by audit_plan_router and join through synthesize_findings."
);

console.log(
  "PASS: every production deployment path crosses release_plan -> exact_head_certification -> human_release_authority."
);

console.log(
  "PASS: every recovery path crosses deployment -> live_certification -> production_recovery."
);

console.log(
  "PASS: rollback, rollout, and deployment_operation_id remain inside the certification/authorization chain."
);

console.log(
  "PASS: production mutation failures are fail-closed; no automatic ambiguous RETRY is permitted."
);

console.log(
  "PASS: node and durable-state schema hardening detected."
);

console.log(
  "PASS: negative self-tests detected bypass, missing rollback contract, and unsafe production RETRY."
);
