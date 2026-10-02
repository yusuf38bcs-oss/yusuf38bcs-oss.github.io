# CONV-04D-01 — Assessment Ownership Census

**Authenticated base:** `824a8188f7d7837091cc5d969a9b5194e49408bc`
**Mode:** read-only assessment census; no learner mutation.

## 1. Academic MCQ collection inventory

The Jekyll configuration defines `mcq-arena` as an output collection with the permalink pattern `/mcq-arena/:path/`.

Under `_mcq-arena/academic/`, the authenticated repository contains the gateway plus six learner assessment files:

1. `botany-cell-biology-mcq-1.md`
2. `botany-cell-division-mcq-2.md`
3. `digestive-system-mcq-set-01.md`
4. `zoology-animal-diversity-mcq-1.md`
5. `zoology-chordata-arthropoda-mcq-pro.md`
6. `zoology-respiratory-system-mcq-5.md`

The gateway `_mcq-arena/academic/index.md` currently enumerates:

```liquid
{% assign category_posts = site.categories["MCQ"] %}
```

That queries post categories rather than the `mcq-arena` collection. Production therefore renders **“No diagnostic modules found in the Academic Matrix.”** despite the six collection assessments existing in source.

Disposition: **D-02 implementation defect — authenticated.**

## 2. Existing assessment-loop evidence

The canonical Learning Guide already defines:

`Attempt → Feedback → Repair → Reattempt`

Current evidence is fragmented:

- authored MCQ pages contain answers/explanations, but interaction patterns differ;
- `assets/js/learning/mcq-engine.js` renders attempt results, correct answers, and validity logic;
- `_includes/components/mcq-arena.html` contains a separate local MCQ runtime and score-only completion path;
- `_pages/assessments/biology-model-test.md` explicitly instructs learners to attempt without help, review wrong answers, return to the lesson, and repeat after correction;
- the HSC Zoology gateway says to return to the source lesson after any MCQ or model-test mistake.

No single assessment owner currently guarantees all four canonical steps across the assessment surface.

## 3. Ownership conflict

Two runtime implementations exist:

1. `assets/js/learning/mcq-engine.js`
2. inline JavaScript inside `_includes/components/mcq-arena.html`

D-01 records this as **assessment-runtime duplication debt**. It does not select or delete a runtime.

## 4. Language and framing debt

The Academic MCQ gateway currently uses language such as:

- “Diagnostic Node”
- “Validate Your Cognitive Models”
- “verify your neural retention”
- “highlight cognitive gaps”

The platform Learning Guide instead frames assessment as retrieval, feedback, misconception/source return, repair, and reattempt. D-02 should converge assessment wording to educational assessment language without presenting the MCQ surface as a diagnostic or validated cognitive measure.

## 5. Preserved assessment assets

D-01 does not alter:

- the six current academic MCQ files;
- model-test content;
- authored answer keys/explanations;
- the Learning Guide;
- current MCQ engine code;
- current MCQ component code.

## 6. D-02 target

The smallest clean D-02 target is the Academic MCQ gateway plus the minimum shared assessment component/runtime needed to certify:

`Attempt → Feedback → source return → Repair → Reattempt`

D-02 should not rewrite all six assessment banks at once.
