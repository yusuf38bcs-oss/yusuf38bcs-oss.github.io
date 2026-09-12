# LBFL Evidence-Bound Execution Graph

## Status

Architecture-only repository artifact. This package defines execution and authority contracts but does not itself grant repository review state, merge authority, learner-facing changes, required GitHub checks, Cloudflare or Worker changes, deployment, or production promotion.

## Core doctrine

> Skills are bounded nodes. Edges are authenticated data contracts. Verification occurs before authority increases. Production mutation requires candidate-bound planning, exact-head certification, and explicit human authorization.

## v1.2 review hardening

Version 1.2 resolves the architecture-review P1 findings without changing the five-file package boundary:

- `human_release_authority` consumes the durable `human_approvals` state collection and requires an externally recorded `HUMAN_EXTERNAL` approval bound to exact head, exact base, authorized scope, rollout/rollback references, and `deployment_operation_id`;
- `deployment_operation_id` is no longer emitted by the reasoning-class `release_plan`; it is derived by `exact_head_certification` from a deterministic RFC 8785 canonical record, hashed with SHA-256, and encoded as `sha256:<lowercase-hex>`;
- every failure route that exposes `RETRY` now carries a finite retry policy with maximum attempts, explicit backoff timing semantics, the exact retryable failure keys, and a non-RETRY terminal route;
- the node schema declares these contracts while the bundled validator enforces their cross-field relationships and negative tests.

The canonical deployment-operation record is:

```text
repository         = authority.repository
exact_base         = authority.base_sha
exact_head         = candidate_head
target_environment = scope.target_environment
rollout_plan       = rollout_plan
rollback_plan      = rollback_plan
```

That record is canonicalized with RFC 8785 (JCS), hashed with SHA-256, represented as `sha256:` followed by 64 lowercase hexadecimal characters, and persisted at `authority.deployment_operation_id`.

## v1.1 hardening

Version 1.1:

- introduces audit planning before expensive specialist fan-out;
- removes the direct risk-router to human-authority bypass;
- makes edge contracts source-output and target-input explicit;
- requires rollout and rollback planning before exact-head certification;
- propagates exact authorization provenance into production;
- introduces pre-authorized recovery after failed live certification;
- independently certifies recovery;
- strengthens durable approvals, decisions, blockers, node classes, failure routes, and mutation scopes.

## Execution topology

    authenticate_baseline
            |
            v
      audit_plan_router
       / / / | \ \
      v v v  v  v v
      selected specialist audits
              |
              v
      synthesize_findings
              |
              v
          risk_router
       /       |        \
 NO_REPAIR   REPAIR    HUMAN_DECISION_ONLY
    |          |             |
    |    remediation_design  |
    |          |             |
    | isolated_implementation|
    |          |             |
    | candidate_verification |
    |       | PASS | REPAIR  |
    |       v      +---------+
    +--> release_plan
              |
              v
    exact_head_certification
              |
              v
    human_release_authority
              |
              v
     production_deployment
              |
              v
       live_certification
         /           \
       PASS         non-PASS
        |              |
        v              v
 close_and_persist  production_recovery
                       |
                       v
                recovery_certification
                       |
                       v
                close_and_persist

## Privilege boundary

Every production-deployment path must pass, in order:

    release_plan
      -> exact_head_certification
      -> human_release_authority
      -> production_deployment

There is no direct route from risk classification to release authority.

## Rollback boundary

Rollback and rollout plans are produced before certification.

They are therefore candidate-bound evidence rather than plans invented after a production failure.

A recovery mutation is reachable only after non-PASS live certification and must itself be independently certified.

## Audit routing

The audit-plan router chooses the smallest sufficient specialist set.

Independent audits may execute in parallel.

The deterministic synthesis node uses all-selected join semantics.

## Durable state

Durable state records repository authority, exact candidate identity, evidence freshness, execution scope, retry counts, decisions, blockers, externally sourced exact-head human approvals, deterministic deployment operation identity, deployment identity, and recovery evidence.

## Failure routing

Supported routes:

- RETRY
- FALLBACK
- SKIP
- REPAIR
- ESCALATE
- HOLD
- FAIL_CLOSED
- STOP

Release-critical identity, security, governance, certification, or authority failures remain fail-closed. Every node that exposes `RETRY` must also declare a finite `retry_policy`; an unbounded retry is invalid architecture.

## Validation boundary

The bundled validator performs deterministic LBFL structural and cross-contract checks, including production-path ordering, external-human provenance, deterministic operation identity, bounded RETRY contracts, and negative fixtures.

It is intentionally **not** a general Draft 2020-12 JSON Schema instance/meta-schema validation engine. Full Draft 2020-12 validation remains a separate operational-adoption requirement before this architecture controls real release execution.

## Production side-effect discipline

Production deployment and recovery do not automatically retry ambiguous production mutations. `release_plan` prepares rollout and rollback plans but does not invent side-effect identity. `exact_head_certification` deterministically derives the candidate-bound `deployment_operation_id`, which then passes unchanged through external human authorization, deployment, live certification, and recovery evidence. A failed or ambiguous production mutation routes to HOLD or ESCALATE rather than repeating an uncertain side effect. Recovery is a one-shot pre-authorized mutation followed by independent recovery certification.

Controlled non-production verification cycles declare an explicit completion test, durable budget reference, and escalation route.

## Explicit non-scope

This architecture artifact does not authorize:

- merge;
- workflow or ruleset mutation;
- required-check changes;
- Cloudflare Pages deployment;
- Worker or DNS mutation;
- secret mutation;
- OpenAI provider migration;
- AdSense or CMP activation;
- production promotion.
