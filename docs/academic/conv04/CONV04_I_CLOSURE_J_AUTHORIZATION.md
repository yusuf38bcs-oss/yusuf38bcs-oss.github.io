# CONV-04I Formal Closure + CONV-04J Authorization

status: CANDIDATE — effective only after PR #457 merges
programme: CONV-04
phase_closed: CONV-04I
phase_authorized: CONV-04J
closure_base: 27c1a218cb20b4c6dfd44678762e6afda2f9eda7
i_production_verified_main: 27c1a218cb20b4c6dfd44678762e6afda2f9eda7
j_implementation_base: PENDING — bind to exact post-#457 main after this authorization merges
date: 2026-10-09

## CONV-04I closure evidence

CONV-04I completed in two production-verified Homepage steps:

1. PR #456 (`CONV-04I-02 Homepage Shared-System Convergence`) merged from certified head `1f61468228d33b86859782cd2aa3580174b1a248` as `main@75fb1ea12959b6dcc795cfe5fda5362e22fa074c`.
2. PR #459 (`CONV-04I-03 Homepage Hero Alignment Repair`) merged from certified head `8ce4ff16e736bddde4f9fec176858df8b3a13ce3` as exact `main@27c1a218cb20b4c6dfd44678762e6afda2f9eda7`.

PR #459 remained a content-neutral, three-file Homepage repair and preserved the #456 narrative/content contract.

## Exact-main production parity

Repository authentication proves `27c1a218cb20b4c6dfd44678762e6afda2f9eda7` is the current exact `main`.

Live production verification confirms:

- Homepage V3 / Academic-v1 platform-home ownership: PASS;
- V3 narrative and section sequence preserved: PASS;
- “Inside the Cell” journey: exactly 8 items;
- Lecture 07 / Cell Wall and Vacuole present;
- Lecture 08 / Plastid and Chloroplast present;
- shared search, canonical Brevo, legal footer and EN/BN access retained;
- PR #459 responsive Hero repair live in production:
  - base Hero grid `justify-items: stretch`;
  - Hero visual `justify-self: end` and `width: min(100%, 560px)`;
  - <=1024px balanced two-column grid with centered alignment;
  - <=700px copy/controls max-width 560px and visual max-width 520px;
  - <=520px copy/controls/visual share full-width edges;
- live Homepage asset revision: `css-c86b7aff954d-js-844729453546`;
- PR #459 final gate: retained checks PASS, fresh Codex review found no major issues, zero unresolved threads, exact-head Pages preview PASS, SOLO exact-head authority PASS, Trusted Governance PASS, unchanged-head audit PASS.

CONV-04I is therefore eligible for **FORMAL CLOSURE** when this governance-only PR merges.

## CONV-04J authorization

This candidate is authored on production-verified `main@27c1a218cb20b4c6dfd44678762e6afda2f9eda7`.

**J implementation MUST NOT start from `27c1a218cb20b4c6dfd44678762e6afda2f9eda7` before this authorization merges.**

Required sequence:

1. merge PR #457 unchanged after its own exact-head gate passes;
2. authenticate the resulting exact `main`;
3. bind that new post-#457 SHA as `j_implementation_base`;
4. only then create the J implementation candidate.

J implementation may then:

1. freeze the CONV-04 platform state on the bound post-authorization base;
2. mutate only the exact J allowlist below;
3. run the retained whole-platform exact-head certification matrix;
4. verify route, metadata, accessibility, responsive, security, assessment, Practical, Ecology, Socratic, Homepage, consent/AdSense and shared-system retained contracts;
5. reconcile final CONV-04 closure evidence;
6. require fresh review, zero unresolved threads and exact-head Trusted Governance;
7. merge only an unchanged certified J head;
8. authenticate the resulting exact `main` and prove post-merge production parity;
9. mark CONV-04 formally CLOSED only after that final production proof.

### Exact J mutation allowlist

- `docs/academic/conv04/CONV04_STATE.md`
- `docs/academic/conv04/CONV04_J_RELEASE_CLOSURE.md`

The prior Homepage I-02/I-03 mutation authority is historical and CLOSED. It is not J mutation authority.

## Explicit non-authority

CONV-04J does **not** authorize:

- learner-content rewriting;
- Homepage redesign or new Homepage feature work;
- Socratic or assessment behavior changes;
- Admission / PR #356 mutation;
- redirect or route-owner restructuring;
- Worker, Cloudflare, DNS or credential mutation;
- opportunistic cleanup outside release/closure evidence.

If J discovers a material defect, the release gate must fail closed. Any repair requires a separately isolated, evidence-backed mutation authorization before code changes.

## Gate

```text
F                         CLOSED
G-R1                      CLOSED
G + H                     CLOSED
I                         PRODUCTION VERIFIED / closure candidate in #457
J                         AUTHORIZATION CANDIDATE — effective only after #457 merge + post-authorization base binding
CONV-04 final closure     BLOCKED until J exact-head merge + post-merge exact-main production PASS
```
