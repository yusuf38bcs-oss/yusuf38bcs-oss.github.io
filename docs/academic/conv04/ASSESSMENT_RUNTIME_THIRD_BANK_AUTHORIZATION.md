# CONV-04D-06 — Zoology Respiratory System Third-Bank Migration Authorization

**Status:** AUTHORIZED — implementation not yet performed
**Authorized base:** `e01794957b184114e4a7ab82f0689acd67b5f14f`
**Authorized branch:** `conv-04d-06-zoology-respiratory-runtime-migration-20261002`
**Target bank:** `_mcq-arena/academic/zoology-respiratory-system-mcq-5.md`
**Target route:** `/mcq-arena/academic/zoology-respiratory-system-mcq-5/`

## Authorization basis

CONV-04D-05 is merged at `main@e01794957b184114e4a7ab82f0689acd67b5f14f` and its public Botany Cell Division route has passed production verification of the complete learner loop:

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

It records the literal 8 question texts, 32 option texts, 8 answer-key indices, and 8 authored explanations from `main@e01794957b184114e4a7ab82f0689acd67b5f14f`. D-06 implementation must preserve those values exactly.

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
