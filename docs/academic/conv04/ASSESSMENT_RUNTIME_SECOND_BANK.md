# CONV-04D-05 — Botany Cell Division Second-Bank Runtime Migration

**Route:** `/mcq-arena/academic/botany-cell-division-mcq-2/`
**Authorized base:** `a104260266a292bee58f6935a5038693380e8c04`

## Purpose

D-05 tests reuse of the D-04-certified authored assessment runtime on exactly one second authored bank before any broader migration. The shared runtime remains `assets/js/learning/academic-assessment-runtime.js` and is reused unchanged.

## Preserved content

The migration preserves exactly:

- 8 question texts;
- 32 option texts;
- 8 answer-key indices;
- 8 authored explanations.

No academic correction or paraphrase is authorized.

## Operational learning loop

**Attempt → Feedback → Repair → Reattempt**

Attempt updates the actual answered count and progress. Feedback exposes correctness state and all authored explanations. Repair sends an imperfect result to `/biology/hsc-corner/botany/`. Reattempt resets interaction state in-page without reload.

## Accessibility and resilience

The exact-head candidate must prove keyboard radio-group behavior with roving tabindex and arrow navigation, visible focus, wall-clock timer integrity, disabled Submit after submission and restored Submit on reattempt, exactly one H1, zero serious/critical Axe violations, horizontal overflow no greater than 2 px, usable 320/390/768/1280/1440 layouts, readable no-JS questions/options, and no raw template or diagnostic/neural/cognitive framing.

## Protected boundary

D-05 does not modify the D-04 pilot, the other four unmigrated Academic MCQ banks, the Academic gateway, the shared authored runtime, `assets/js/learning/mcq-engine.js`, `_includes/components/mcq-arena.html`, model tests, Biology content, Socratic, Practical, BOT-08, Admission / PR #356, Worker, or Cloudflare configuration.

## Promotion rule

D-05 may become Ready or merge only after exact-head source/content preservation, Jekyll, five-viewport browser/Axe, wall-clock timer, no-JS, retained B/C/D contracts, CodeQL, review convergence, exact-head solo authority, Trusted Governance, and required Pages status pass.
