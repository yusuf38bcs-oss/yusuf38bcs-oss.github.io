# CONV-04D-06 — Zoology Respiratory System Third-Bank Migration Authorization

**Status:** REAUTHORIZED — implementation not yet performed
**Authorized base:** `d623e0016fdc98ee7b6ddc3b21a7c60c8383965b`
**Authorized branch:** `conv-04d-06-zoology-respiratory-runtime-migration-r2-20261002`
**Target bank:** `_mcq-arena/academic/zoology-respiratory-system-mcq-5.md`
**Target route:** `/mcq-arena/academic/zoology-respiratory-system-mcq-5/`

## Authorization basis

CONV-04D-05 is merged and production-verified, and CONV-04D-05-R1 has now merged via PR #405 at `main@d623e0016fdc98ee7b6ddc3b21a7c60c8383965b`. The R1 merge changed only the retained D-05 validator/workflow pair; the Respiratory target bank and shared authored runtime are byte-identical to the previously authenticated D-06 baseline.

**Attempt → Feedback → Repair → Reattempt**

The post-merge D-05 checks are terminal PASS, including Cloudflare Pages, localized production probe, deploy, Worker build, site build, audit, and analyses.

## Why this bank is next

The remaining Academic gateway banks are structurally heterogeneous. The Respiratory System bank is the narrowest next reuse test because it already uses the same legacy authored-bank pattern as D-04/D-05:

- 8 authored question texts;
- 32 authored option texts;
- 8 answer-key indices;
- 8 authored explanations;
- legacy `initQuiz`;
- inline `submitQuiz`;
- reload-only restart;
- legacy `neural-quiz-wrapper`;
- Zoology curriculum ownership.

By contrast, Digestive System is a static 15-question document rather than the same interactive legacy runtime, while Chordata & Arthropoda uses a separate JavaScript data/rendering engine. Those banks remain outside D-06.

## Exact content-preservation baseline

The machine-readable baseline is:

`_data/academic/assessment_runtime_third_bank_authorization_v1.json`

It records the literal 8 question texts, 32 option texts, 8 answer-key indices, and 8 authored explanations. That corpus was originally authenticated at `main@e01794957b184114e4a7ab82f0689acd67b5f14f` and reauthenticated unchanged at `main@d623e0016fdc98ee7b6ddc3b21a7c60c8383965b`. D-06 implementation must preserve those values exactly.

The existing assessment time limit is **900 seconds (15:00)** and must remain 900 seconds unless a separately authorized behavior correction is justified.

## D-06 mutation authority

D-06 may mutate only:

1. `_mcq-arena/academic/zoology-respiratory-system-mcq-5.md`;
2. D-06-specific validator/browser-certification artifacts;
3. D-06-specific evidence/manifest artifacts;
4. D-06 programme-state/documentation artifacts.

The shared runtime:

`assets/js/learning/academic-assessment-runtime.js`

is **reuse-only and protected by default**.

## Required learner behavior

The migrated bank must implement:

**Attempt → Feedback → Repair → Reattempt**

and prove:

- accurate 0/8 → 8/8 answered progress;
- keyboard-operable ARIA radio groups with roving tabindex and arrow navigation;
- 900-second wall-clock timer integrity;
- visible correct/wrong state and all 8 authored explanations;
- Submit disabled after submission and restored on reattempt;
- repair action to `/biology/hsc-corner/zoology/`;
- in-page reattempt without reload;
- visible focus;
- zero serious/critical Axe violations;
- horizontal overflow no greater than 2 px;
- usable 320/390/768/1280/1440 layouts;
- readable questions/options without JavaScript;
- no raw template output;
- no diagnostic/neural/cognitive-ability framing.

## Protected boundary

D-06 must not mutate D-04, D-05, the other three unmigrated Academic banks, the Academic gateway, the shared authored runtime by default, generated engine, legacy component, model tests, Biology source content, Socratic, Practical, BOT-08, Admission/#356, Worker, or Cloudflare configuration.

## Promotion rule

D-06 may not become Ready or merge until its exact-head candidate proves literal content preservation, 900-second timer preservation, Jekyll build, five-viewport browser/Axe behavior, no-JS resilience, retained B/C/D contracts, CodeQL, review convergence, unchanged base/head governance, exact-head solo authority, and required Pages/Trusted Governance checks.


## Future-phase compatibility contract

D-06 must ship future-phase compatibility in its **first implementation**, not as a later routine R1.

The D-06 validator/workflow must separate:

1. historical authorization provenance;
2. D-06 bootstrap mutation authority;
3. retained D-06 invariants;
4. current candidate/base identity.

### Bootstrap mode

On the original D-06 implementation PR, require:

- exact authorized base `d623e0016fdc98ee7b6ddc3b21a7c60c8383965b`;
- phase `CONV-04D-06`;
- exact D-06 learner mutation allowlist;
- exact D-06 changed-file set;
- literal 8/32/8/8 preservation;
- 900-second timer;
- Zoology source-return;
- shared runtime unchanged;
- canonical Attempt → Feedback → Repair → Reattempt behavior;
- legacy runtime removal.

### Retained mode

On later CONV-04 phases:

- do not require the current PR base to equal the historical D-06 base;
- do not require later candidates to change the D-06 bootstrap file set;
- require all D-06 retained content/runtime invariants to remain true;
- protect the D-06 bank, manifest, implementation record, browser harness, validator and workflow from silent later mutation;
- allow `CONV04_STATE.md` to advance only to a strictly later valid phase.

### Manual certification

`workflow_dispatch` must require an `expected_main_sha` input and certify only when both remote `main` and checked-out HEAD equal that SHA.

This contract is fail-closed and must not weaken any retained D-04/D-05 gate.
