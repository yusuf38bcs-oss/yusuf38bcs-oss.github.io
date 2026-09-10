# LBFL Evidence-Bound Execution Graph

## Status

Architecture-only implementation for review. This package does **not** change learner-facing content, GitHub governance rules, Cloudflare configuration, Worker code, secrets, deployment state, or production behavior. The validator is not wired into CI.

## Purpose

The LBFL skill library defines *what* specialist capabilities exist. This graph defines *how* those capabilities may be coordinated safely.

Core rule:

> Skills are bounded nodes. Edges are evidence/data contracts. Verification sits before authority or privilege increases. Durable state preserves what happened, why a route was chosen, and where execution can safely resume.

## Design principles

1. **Sequence is not dependency.** Create an edge only when the downstream node consumes an upstream output or requires its authority.
2. **Authenticate before fan-out.** Establish repository/base/task authority once, then branch independent read-only audits.
3. **Use deterministic code for plumbing.** Hashing, deduplication, joins, route/status checks, schema checks, SHA comparisons, and policy enforcement should not consume model calls without a documented reason.
4. **Use models for judgment.** Research synthesis, academic reasoning, remediation design, and ambiguity classification may use model reasoning, but their outputs remain evidence-bound.
5. **Structured outputs over transcript handoffs.** Nodes pass compact typed fields and artifact references. Reviewers should read authoritative artifacts directly where necessary.
6. **Verification is a privilege boundary.** Information becomes evidence only after verification; recommendations become authorized mutations only after governance/human gates.
7. **Failure stays local when safe.** Optional or independent branches may retry/fallback without repeating completed work. Release-critical identity, security, governance, or certification failures remain fail-closed.
8. **Cycles must converge.** Every repair/research loop needs a completion test, maximum rounds, budget, prior-attempt memory, and escalation path.
9. **No self-promotion.** Generation, verification, approval, and production mutation must not collapse into a single unreviewed authority context.
10. **Exact-head freshness.** Candidate-bound evidence is invalidated when the relevant head/base identity changes.

## Topology

```text
                              ┌─ academic_truth_audit ─────────┐
                              ├─ ui_responsive_audit ──────────┤
authenticate_baseline ────────├─ seo_route_audit ──────────────┤
                              ├─ accessibility_audit ──────────┤── synthesize_findings
                              ├─ security_supply_chain_audit ──┤
                              └─ runtime_worker_audit ──────────┘
                                                                  │
                                                                  ▼
                                                             risk_router
                                                         ┌────────┴─────────┐
                                                         │                  │
                                                   no repair              repair
                                                         │                  │
                                                         │         remediation_design
                                                         │                  │
                                                         │       isolated_implementation
                                                         │                  │
                                                         │       verification_cycle
                                                         │                  │
                                                         └─────────┬────────┘
                                                                   ▼
                                                        exact_head_certification
                                                                   │
                                                        human_release_authority
                                                                   │
                                                         production_deployment
                                                                   │
                                                            live_certification
                                                                   │
                                                            close_and_persist
```

The six audit branches may run independently after baseline authentication. The release join waits only for evidence required by the selected route.

## Node contract

Every production-grade node must declare:

- one bounded job;
- explicit inputs;
- structured outputs;
- mutation authority;
- failure routing;
- convergence rules when cyclic.

The canonical graph is stored in [`lbfl-execution-graph.json`](./lbfl-execution-graph.json).

## Durable state

[`lbfl-state.schema.json`](./lbfl-state.schema.json) defines compact continuation state for:

- task/mission;
- authoritative repository/base/candidate identities;
- completed nodes and artifact references;
- evidence states and SHA binding;
- decisions;
- budgets and retry counts;
- human approvals;
- blockers and previously seen failures;
- deployment/Worker identities when applicable.

The goal is to resume from verified state instead of replaying a giant conversational transcript.

## Failure routes

- `RETRY` — transient tool/network failure.
- `FALLBACK` — preferred source/model/service unavailable.
- `SKIP` — optional branch failed and the selected route does not require it.
- `REPAIR` — output failed validation and can be remediated within scope.
- `ESCALATE` — risk, uncertainty, or conflict requires stronger review/human judgment.
- `HOLD` — required evidence is incomplete.
- `FAIL_CLOSED` — identity, security, governance, or release invariant is broken.
- `STOP` — permission, safety, or resource boundary reached.

## Verification boundaries

```text
information
  -> evidence verification
authenticated evidence
  -> synthesis/policy verification
recommended action
  -> governance gate
authorized candidate mutation
  -> exact-head certification
release candidate
  -> explicit human authority
production mutation
  -> live runtime certification
production fact
```

## Deterministic validator

Run:

```bash
node .github/scripts/validate-lbfl-execution-graph.mjs
```

The validator checks structural invariants without external packages:

- unique node IDs;
- every edge resolves to existing nodes;
- required critical nodes exist;
- production deployment is production-marked;
- no non-deployment node declares production mutation;
- production deployment has an incoming human-authorization edge;
- human authority has an incoming exact-head-certification edge;
- every mutation node has a downstream verification/certification path;
- controlled cycles have finite convergence bounds;
- release invariants are present.

It deliberately does **not** certify the quality of academic, UI, security, Cloudflare, or release evidence. Those remain separate specialist gates.

## Review boundary

Adopting this graph does not itself authorize:

- changing required GitHub checks;
- wiring the validator into CI;
- modifying existing PRs;
- merging a candidate;
- Cloudflare/Worker/DNS mutation;
- secret changes;
- AdSense/CMP activation;
- production promotion.

Those are later graph nodes requiring their own exact evidence and explicit authority.
