# CONV-04D-05 — Second Authored Assessment Migration Authorization

**Status:** AUTHORIZED — implementation not yet performed  
**Authorized base:** `a104260266a292bee58f6935a5038693380e8c04`  
**Authorized branch:** `conv-04d-05-botany-cell-division-runtime-migration-20261002`  
**Target bank:** `_mcq-arena/academic/botany-cell-division-mcq-2.md`  
**Target route:** `/mcq-arena/academic/botany-cell-division-mcq-2/`

## Authorization basis

CONV-04D-04 is merged in authoritative `main@a104260266a292bee58f6935a5038693380e8c04`, and the production Botany Cell Biology assessment has passed direct public verification of the complete canonical learning loop:

**Attempt → Feedback → Repair → Reattempt**

Production verification also confirmed keyboard radio interaction, 10/10 progress completion, submission feedback, visible authored explanations, correct/wrong visual distinction, disabled Submit after submission, Botany source-return, successful source-route navigation, clean in-page reattempt reset, and no obvious runtime/template/overflow failure.

The post-merge `a104260266a292bee58f6935a5038693380e8c04` checks are terminal PASS, including Cloudflare Pages, the localized production probe, build/deploy, audit, CodeQL analyses, and Worker build.

## Selected second bank

The next migration target is the adjacent authored Botany assessment:

`_mcq-arena/academic/botany-cell-division-mcq-2.md`

Authenticated baseline census:

- 8 authored question texts;
- 32 authored option texts;
- 8 answer-key indices;
- 8 authored explanations;
- current legacy `initQuiz` initialization;
- current inline `submitQuiz` submission;
- current reload-only restart;
- current Botany curriculum/topic ownership.

This bank is selected because it is the next Botany chapter after the certified D-04 pilot and therefore provides the narrowest second-bank test of runtime reuse before broader multi-bank convergence.

## D-05 mutation authority

D-05 may mutate only:

1. `_mcq-arena/academic/botany-cell-division-mcq-2.md`;
2. D-05-specific validator/browser-certification artifacts;
3. D-05-specific machine-readable evidence/manifest artifacts;
4. D-05 programme-state/documentation artifacts.

The shared runtime:

`assets/js/learning/academic-assessment-runtime.js`

is **reuse-only and protected by default**. A change to that runtime requires a separately evidenced D-05 blocker and explicit recertification; it is not pre-authorized merely for convenience.

## Content-preservation rule

D-05 must preserve exactly the existing:

- 8 question texts;
- 32 option texts;
- 8 answer-key indices;
- 8 authored explanations.

No paraphrase, academic correction, or answer-key change is authorized in this phase.

## Required learner behavior

The migrated second bank must implement the same certified runtime contract as D-04:

**Attempt → Feedback → Repair → Reattempt**

It must also provide:

- accurate answered/progress state;
- keyboard-operable ARIA radio groups with roving tabindex and arrow-key navigation;
- wall-clock-based timer integrity;
- disabled Submit after submission and restored Submit on reattempt;
- visible correct/wrong state plus authored explanations;
- repair action to `/biology/hsc-corner/botany/`;
- in-page reattempt without reload;
- visible focus;
- no serious/critical Axe violations;
- no horizontal overflow beyond the existing 2 px tolerance;
- usable 320/390/768/1280/1440 layouts;
- readable questions/options without JavaScript;
- no raw Liquid/template output;
- no diagnostic/neural/cognitive-ability framing.

## Protected boundary

D-05 must not mutate:

- the certified D-04 Botany Cell Biology bank;
- the remaining four Academic MCQ banks;
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

D-05 may not become Ready or merge until the exact-head candidate proves content preservation, Jekyll, five-viewport browser behavior, Axe, no-JS resilience, retained B/C/D contracts, CodeQL, review convergence, unchanged base/head governance, and required Cloudflare Pages status.
