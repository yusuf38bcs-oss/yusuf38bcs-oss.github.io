# CONV-04D-03 — Authored Assessment Runtime Census

**Authenticated base:** `4ef010685532eb652ed0867e03c8945b49dedb70`  
**Mode:** read-only/runtime-ownership census; no learner mutation.

## 1. Academic assessment inventory

The authoritative `_mcq-arena/academic/` collection contains six learner assessment files in addition to the gateway.

Five are interactive inline implementations:

1. `botany-cell-biology-mcq-1.md`
2. `botany-cell-division-mcq-2.md`
3. `zoology-animal-diversity-mcq-1.md`
4. `zoology-chordata-arthropoda-mcq-pro.md`
5. `zoology-respiratory-system-mcq-5.md`

`digestive-system-mcq-set-01.md` is an authored static MCQ set with answer key and explanations rather than the same inline quiz runtime.

## 2. Duplicated presentation/runtime evidence

All five interactive pages carry the same legacy inline style block.

Three pages — Cell Biology, Cell Division, and Respiratory System — call `initQuiz(...)` and expose `submitQuiz(...)` controls but do not locally define those functions.

Animal Diversity contains the only local definitions of `initQuiz` and `submitQuiz` found in the academic assessment pages.

Chordata & Arthropoda uses a separate standalone JavaScript implementation and still contains score-completion language such as `Diagnostic Complete`.

This means the authored assessment pages do not currently have one explicit runtime owner.

## 3. Existing legacy runtime artifacts

Two additional repository artifacts exist:

- `assets/js/learning/mcq-engine.js` — an AI/generated-question runtime;
- `_includes/components/mcq-arena.html` — a separate legacy MCQ component/runtime.

Neither is the canonical owner of the six authored Academic MCQ banks. D-03 does not delete or rewrite either artifact.

## 4. Live functional evidence

A fresh public-browser audit of:

`/mcq-arena/academic/botany-cell-biology-mcq-1/`

confirmed:

- the ten questions render;
- an option can be visually selected;
- the answered counter remains `0 / 10 Answered`;
- submission does not expose score, correctness, authored explanations, or a source-return repair action;
- Restart resets the page and allows another attempt.

Therefore the current surface exposes **Attempt** and a coarse **Reattempt**, but the canonical **Feedback → Repair** stages are not operational.

## 5. D-03 ownership decision

The canonical runtime for authored Academic MCQ banks will be a dedicated shared runtime at:

`assets/js/learning/academic-assessment-runtime.js`

It will own interaction behavior only. Assessment pages retain ownership of question text, options, answer keys, explanations, and topic/source metadata.

The existing AI-generated `mcq-engine.js` and legacy `components/mcq-arena.html` are not selected as the authored-bank owner because they represent different/legacy execution models.

## 6. Pilot selection

The first implementation pilot is:

`/mcq-arena/academic/botany-cell-biology-mcq-1/`

Reasons:

- the defect is independently reproduced in production;
- the page has ten authored questions and ten authored explanations;
- current question/answer content can remain unchanged;
- its repair source is safely the existing HSC Botany hub;
- it provides a narrow test of the complete loop before migrating the other authored banks.

## 7. Protected boundary

D-03 is architecture-only.

It does **not** modify any assessment page, assessment answer, runtime asset, Biology source page, model test, Socratic surface, Practical surface, BOT-08, Admission/#356, Worker, or Cloudflare configuration.
