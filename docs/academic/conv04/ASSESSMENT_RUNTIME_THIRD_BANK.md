# CONV-04D-06 — Zoology Respiratory System Third-Bank Runtime Migration

**Route:** `/mcq-arena/academic/zoology-respiratory-system-mcq-5/`
**Authorized base:** `d623e0016fdc98ee7b6ddc3b21a7c60c8383965b`

## Purpose

D-06 reuses the D-04/D-05-certified authored assessment runtime on the Zoology Respiratory System bank. The shared runtime remains `assets/js/learning/academic-assessment-runtime.js` and is reused unchanged.

D-06 also establishes the permanent future-phase model: **bootstrap contract + retained contract + monotonic successor state + self-protection**. Routine future compatibility must not require a D-06-R1.

## Preserved content

The migration preserves exactly:

- 8 question texts;
- 32 option texts;
- 8 answer-key indices;
- 8 authored explanations;
- 900-second (15:00) time limit.

The literal corpus is bound in `_data/academic/assessment_runtime_third_bank_authorization_v1.json`. No academic correction or paraphrase is authorized.

## Operational learning loop

**Attempt → Feedback → Repair → Reattempt**

Attempt updates the actual answered count and progress. Feedback exposes correctness state and all authored explanations. Repair sends an imperfect result to `/biology/hsc-corner/zoology/`. Reattempt resets interaction state in-page without reload.

## Accessibility and resilience

The exact-head candidate must prove keyboard radio-group behavior with roving tabindex and arrow navigation, visible focus, 900-second wall-clock timer integrity, disabled Submit after submission and restored Submit on reattempt, exactly one H1, zero serious/critical Axe violations, horizontal overflow no greater than 2 px, usable 320/390/768/1280/1440 layouts, readable no-JS questions/options, and no raw template or diagnostic/neural/cognitive framing.

## Future-phase compatibility

### Bootstrap mode

The original D-06 PR must bind exactly to `d623e0016fdc98ee7b6ddc3b21a7c60c8383965b`, identify `phase: CONV-04D-06`, mutate only the exact D-06 file set, and prove every D-06 content/runtime invariant.

### Retained mode

Later CONV-04 phases may use the then-current authenticated PR base and advance `CONV04_STATE.md` only to a strictly later valid phase. They may not silently mutate the D-06 bank, implementation manifest, implementation document, browser harness, validator, or workflow.

Historical D-06 authorization provenance remains immutable.

### Manual certification

Manual `workflow_dispatch` requires `expected_main_sha`; both remote `main` and checked-out HEAD must equal that SHA.

## Protected boundary

D-06 does not modify D-04, D-05, the remaining unmigrated Academic MCQ banks, the Academic gateway, the shared authored runtime, `assets/js/learning/mcq-engine.js`, `_includes/components/mcq-arena.html`, model tests, Biology content, Socratic, Practical, BOT-08, Admission / PR #356, Worker, or Cloudflare configuration.

## Promotion rule

D-06 may become Ready or merge only after exact-head source/content preservation, Jekyll, five-viewport browser/Axe, 900-second wall-clock timer, no-JS, retained B/C/D contracts, CodeQL, review convergence, exact-head solo authority, Trusted Governance, and required Pages status pass.
