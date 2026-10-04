# CONV-04F-09-R61 — prac-04 Dissection Implementation

status: IMPLEMENTATION CANDIDATE
phase: CONV-04F-09-R61
authorized_base: cae5dd2252081007fab2ccd581006bc03fee37d0
authorization_gate: CONV-04F-09-R60 / PR #435
selected_module: prac-04
learner_mutation_count: 1
scientific_rewrite: NONE
anatomical_rewrite: NONE
curriculum_rewrite: NONE
dissection_protocol_rewrite: NONE
safety_rewrite: NONE
heading_normalization: NONE

## Exact baseline

- source: `_biology/higher-zoology-tree/practical/04-dissection.bn.md`
- baseline blob: `0bca70d74c04305fd2399f54fbb5c650f0b158c3`
- route: `/biology/higher-zoology-tree/practical/dissection/`
- course: `nu-zoology-practical-213106`
- module order: `prac-03 → prac-04 → prac-05`
- course-contract blob: `a02365ea6743c44a1eddaf84ad05f66d670ade6b`
- coverage-ledger blob: `ab66ddafc1346b65337bc52236d1029a77cf5792`
- shared Practical CSS: `0962ae71cd1e424e27949b409f5284493f722dd3`
- shared Practical JS: `207684413ad7925686334cafc3748861a439f206`

## Protected content

- heading hierarchy: 6 H1 / 22 H2 / 29 H3;
- General Dissection Rules: 7;
- External Morphology taxa: 5;
- Major Dissections: 11;
- Minor Dissections: 6;
- Drawing Template rules: 7;
- Practical Viva Questions: 6;
- major syllabus map: circulatory 2, nervous 5, reproductive 4;
- minor syllabus map: digestive 3, nervous 3.

No preservative, anaesthetic, fixative, stain, clearing-agent, concentration, exposure-time, incision-depth prescription, anatomy statement, label set, comparison, common-error note, or safety instruction is rewritten.

## Authorized learner transform

Only:
1. add `academic_system: v1`;
2. add `academic_role: practical`;
3. add `learning_guide: canonical`;
4. inject exactly one canonical Learning Guide CTA immediately after the first existing H1.

No table wrapper is added because the baseline contains no Markdown table.
No heading normalization is authorized in R61.

## Strict route registration

Exactly one row:
- id: `higher-zoology-practical-dissection`
- route: `/biology/higher-zoology-tree/practical/dissection/`
- source: `_biology/higher-zoology-tree/practical/04-dissection.bn.md`
- role: `practical`
- language: `bn`
- boundary owner: `layout`
- Learning Guide owner: `canonical`
- assessment owner: `mcq-arena`
- enforcement: `strict`
- source/live debt: zero.

## Protected surfaces

Practical gateway, prac-01–prac-03, prac-05–prac-08, course contract, coverage ledger, shared Practical CSS/JS, Academic CSS, canonical Learning Guide include, navigation, assessment runtime, Admission, Socratic surfaces, Worker configuration, and R60 authorization remain protected.

## Promotion

```text
main@cae5dd2252081007fab2ccd581006bc03fee37d0
        ↓
isolated R61 structural transform
        ↓
exact source-preservation validator
        ↓
retained CONV-04 + Practical validators
        ↓
Jekyll + browser/Axe/keyboard/reflow/spacing/motion/no-JS
        ↓
Cloudflare exact-head preview
        ↓
zero unresolved review threads
        ↓
SOLO exact-head authority + Trusted Governance
        ↓
merge
        ↓
exact-main Cloudflare immutable + canonical Dissection production parity
        ↓
authorize prac-05 only after PASS
```
