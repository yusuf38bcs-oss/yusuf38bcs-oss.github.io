# CONV-04D-04 — Botany Cell Biology Authored Runtime Pilot

**Pilot route:** `/mcq-arena/academic/botany-cell-biology-mcq-1/`  
**Authorized base:** `b74f47c19508aed4ffd122d4fd7b9a8044419b20`

## Purpose

D-04 implements the D-03 authored-assessment runtime contract on exactly one learner assessment before any multi-bank migration.

The pilot replaces broken page-local interaction wiring with the shared runtime:

`assets/js/learning/academic-assessment-runtime.js`

The assessment document remains the owner of its question text, options, answer keys, and authored explanations.

## Preserved content

The pilot preserves exactly:

- 10 question texts;
- 40 option texts;
- 10 answer-key indices;
- 10 authored explanations.

No academic correction or paraphrase is authorized in this phase.

## Operational learning loop

The browser-visible behavior must implement:

**Attempt → Feedback → Repair → Reattempt**

### Attempt

Selecting an option updates the real answered count and progress state.

### Feedback

Submitting marks selected/correct states and exposes every authored explanation.

### Repair

If the score is below the complete set, the result exposes a source-return action to:

`/biology/hsc-corner/botany/`

### Reattempt

The learner can reset interaction state and attempt the same authored bank again without reloading the page.

## Accessibility and resilience

The exact-head pilot must prove:

- keyboard-operable answer controls;
- visible focus;
- exactly one H1;
- zero serious/critical Axe violations;
- horizontal overflow no greater than 2 px;
- usable 320/390/768/1280/1440 layouts;
- questions/options remain readable without JavaScript;
- no raw Liquid/template output;
- no learner-visible diagnostic, neural, or cognitive-ability framing.

## Protected boundary

D-04 does not modify:

- the other five Academic MCQ banks;
- the Academic MCQ gateway;
- `assets/js/learning/mcq-engine.js`;
- `_includes/components/mcq-arena.html`;
- model tests;
- Biology source content;
- Socratic or Practical surfaces;
- BOT-08;
- Admission / PR #356;
- Worker or Cloudflare configuration.

## Promotion rule

D-04 may merge only after exact-head source/content-preservation validation, production Jekyll build, browser behavior, Axe, review convergence, required repository checks, Pages, and Trusted Governance all pass.
