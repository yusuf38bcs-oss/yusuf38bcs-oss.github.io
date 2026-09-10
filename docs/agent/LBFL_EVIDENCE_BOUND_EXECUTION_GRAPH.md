# LBFL Evidence-Bound Execution Graph

## Status

Architecture-only Draft candidate. This package does not itself authorize learner-facing changes, required GitHub checks, Cloudflare or Worker changes, merge, deployment, or production promotion.

## Core doctrine

> Skills are bounded nodes. Edges are authenticated data contracts. Verification occurs before authority increases. Production mutation requires candidate-bound planning, exact-head certification, and explicit human authorization.

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

Durable state records repository authority, exact candidate identity, evidence freshness, execution scope, retries, decisions, blockers, exact-head human approval, deployment identity, and recovery evidence.

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

Release-critical identity, security, governance, certification, or authority failures remain fail-closed.

## Validation boundary

The hardened validator is installed in the next block.

It must prove all production privilege paths rather than merely prove that one valid incoming certification edge exists.

## Production side-effect discipline

Production deployment and recovery do not automatically retry ambiguous production mutations. Each authorized deployment carries a candidate-bound `deployment_operation_id` through exact-head certification, human authorization, deployment, live certification, and recovery evidence. A failed or ambiguous production mutation routes to HOLD or ESCALATE rather than repeating an uncertain side effect. Recovery is a one-shot pre-authorized mutation followed by independent recovery certification.

Controlled non-production verification cycles declare an explicit completion test, durable budget reference, and escalation route.

## Explicit non-scope

This Draft candidate does not authorize:

- Ready transition;
- merge;
- workflow or ruleset mutation;
- required-check changes;
- Cloudflare Pages deployment;
- Worker or DNS mutation;
- secret mutation;
- OpenAI provider migration;
- AdSense or CMP activation;
- production promotion.
