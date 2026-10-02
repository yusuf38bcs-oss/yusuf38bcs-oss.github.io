# CONV-04D-03 — Authored Assessment Runtime Contract

**Contract:** `lbfl-assessment-runtime-v1`
**Version:** `CONV-04D-03-1.0.0`
**Authorized base:** `4ef010685532eb652ed0867e03c8945b49dedb70`
**Status:** architecture-only; implementation deferred to D-04.

## 1. Canonical behavior

Authored interactive Academic MCQ pages must implement:

**Attempt → Feedback → Repair → Reattempt**

A visible score or Restart button alone is not sufficient.

### Attempt

The learner selects answers before correctness is revealed. Answered-count/progress state must reflect actual selections.

### Feedback

Submission reveals:

- selected answer state;
- correct/incorrect state;
- correct answer;
- the authored explanation where one exists.

### Repair

After weak or wrong answers, the surface exposes a clear educational source-return action. The source route is subject/topic learning, not a diagnostic or cognitive label.

### Reattempt

After repair, the learner can restart or retry the assessment without being trapped at the score state.

## 2. Runtime ownership

The future canonical shared runtime for authored Academic MCQ banks is:

`assets/js/learning/academic-assessment-runtime.js`

It owns interaction state, feedback disclosure, progress, repair actions, and reattempt behavior.

It does **not** own question content or answer-key authorship.

## 3. Content ownership

Each assessment document continues to own:

- question wording;
- options;
- correct-answer data;
- authored explanations;
- subject/topic metadata;
- source-return target.

D-04 must preserve the pilot's existing questions, options, answer keys, and explanations exactly unless a separately authorized academic correction is required.

## 4. Runtime boundaries

`assets/js/learning/mcq-engine.js` is not the canonical authored-bank runtime. It remains a separate generated/AI assessment artifact until later consolidation.

`_includes/components/mcq-arena.html` is not the canonical authored-bank runtime and remains legacy debt until separately migrated or retired.

D-03 therefore avoids coupling authored HSC assessment banks to generated-question or Worker-dependent behavior.

## 5. Accessibility and resilience requirements

The D-04 pilot must certify:

- keyboard-operable answer controls;
- visible focus;
- one clear H1;
- no serious/critical Axe violations;
- no horizontal overflow beyond the existing 2 px tolerance;
- usable 320/390/768/1280/1440 layouts;
- authored questions remain readable without JavaScript;
- no raw Liquid or broken template output;
- no diagnostic/neural/cognitive-ability framing.

## 6. D-04 pilot

Pilot file:

`_mcq-arena/academic/botany-cell-biology-mcq-1.md`

Pilot route:

`/mcq-arena/academic/botany-cell-biology-mcq-1/`

Repair source:

`/biology/hsc-corner/botany/`

The pilot must prove the full canonical loop before any multi-bank migration.

## 7. Promotion rule

D-03 may merge only when:

1. the census matches authenticated source evidence;
2. the machine-readable contract matches this document;
3. learner mutation remains frozen;
4. changed-file scope is architecture-only;
5. validator syntax/execution and Jekyll pass;
6. review threads are zero;
7. exact-head governance and required repository checks pass.
