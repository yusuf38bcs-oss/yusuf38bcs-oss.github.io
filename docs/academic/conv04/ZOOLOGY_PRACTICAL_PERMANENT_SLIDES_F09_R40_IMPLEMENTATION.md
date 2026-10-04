# CONV-04F-09-R40 — prac-02 Permanent Slides Implementation

status: IMPLEMENTATION CANDIDATE
phase: CONV-04F-09-R40
authorized_base: 5af320549210f44cd3eacec919766ef86665214b
authorization_gate: CONV-04F-09-R4 / PR #430
selected_module: prac-02
learner_mutation_count: 1
scientific_rewrite: NONE
curriculum_rewrite: NONE

## Exact baseline

- source: `_biology/higher-zoology-tree/practical/02-permanent-slides.bn.md`
- baseline blob: `50825b1a7178d062c437cf10b2a1d8ef8c1780f8`
- route: `/biology/higher-zoology-tree/practical/permanent-slides/`
- course: `nu-zoology-practical-213106`
- module order: `prac-01 → prac-02 → prac-03`
- course-contract blob: `a02365ea6743c44a1eddaf84ad05f66d670ade6b`
- coverage-ledger blob: `ab66ddafc1346b65337bc52236d1029a77cf5792`
- shared Practical CSS: `0962ae71cd1e424e27949b409f5284493f722dd3`
- shared Practical JS: `207684413ad7925686334cafc3748861a439f206`

## Authenticated content preservation

| Section | Count |
|---|---:|
| Whole animals | 8 |
| Arthropod mouthparts | 6 |
| Parasites | 11 |
| Larval forms | 10 |
| Histological preparations | 8 |
| **Total teaching bank** | **43** |

The implementation preserves the syllabus rule **at least 20 slides / ≥20** and does not invent a fixed canonical 30.

Protected teaching elements:
- modern terminology note for traditional “protozoans” wording;
- mouthpart slide-answer rule;
- Permanent-slide Spotting Template;
- six-step Microscope Workflow.

## Authorized learner transform

Only the following learner-facing changes are authorized:

1. add `academic_system: v1`;
2. add `academic_role: practical`;
3. add `learning_guide: canonical`;
4. inject exactly one `{% include education/learning-guide-cta.html %}` immediately after the existing H1.

Everything else in the learner source must remain identical to the authenticated baseline.

## Strict route registration

The Academic Route Ledger gains exactly one strict row:

- id: `higher-zoology-practical-permanent-slides`
- canonical route: `/biology/higher-zoology-tree/practical/permanent-slides/`
- role: `practical`
- language: `bn`
- boundary owner: `layout`
- Learning Guide owner: `canonical`
- assessment owner: `mcq-arena`
- source/live debt: zero.

## Protected surfaces

No mutation is authorized to:
- Practical gateway;
- prac-01 Museum Specimens;
- prac-03 through prac-08;
- Practical course contract;
- coverage ledger;
- shared Practical CSS/JS;
- navigation;
- assessment runtime;
- Admission;
- Socratic;
- Worker configuration.

## Exact-head gate

```text
main@5af320549210f44cd3eacec919766ef86665214b
        ↓
isolated R40 learner transform
        ↓
exact source-preservation validator
        ↓
retained CONV-04 + Practical validators
        ↓
Jekyll exact-head build
        ↓
Cloudflare exact-head preview
        ↓
browser/Axe/keyboard/reflow/spacing/reduced-motion/no-JS
        ↓
Ready + zero unresolved threads
        ↓
SOLO exact-head authority + Trusted Governance
        ↓
merge
        ↓
exact-main Cloudflare production + canonical parity
        ↓
authorize prac-03 only after PASS
```
