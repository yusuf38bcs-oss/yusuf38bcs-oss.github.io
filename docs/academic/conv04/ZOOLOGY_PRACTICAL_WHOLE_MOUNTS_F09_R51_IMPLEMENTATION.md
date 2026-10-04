# CONV-04F-09-R51 — prac-03 Whole Mounts Implementation

status: IMPLEMENTATION CANDIDATE
phase: CONV-04F-09-R51
authorized_base: ee9608a739e33ef01b0f5776c3e8827c7ea8dd12
authorization_gate: CONV-04F-09-R50 / PR #433
selected_module: prac-03
learner_mutation_count: 1
scientific_rewrite: NONE
taxonomic_rewrite: NONE
curriculum_rewrite: NONE
chemical_protocol_rewrite: NONE
safety_rewrite: NONE

## Exact baseline

- source: `_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md`
- baseline blob: `904933f7b29a301f72b7d370582d605364b906e6`
- route: `/biology/higher-zoology-tree/practical/whole-mounts/`
- course: `nu-zoology-practical-213106`
- module order: `prac-02 → prac-03 → prac-04`
- course-contract blob: `a02365ea6743c44a1eddaf84ad05f66d670ade6b`
- coverage-ledger blob: `ab66ddafc1346b65337bc52236d1029a77cf5792`
- shared Practical CSS: `0962ae71cd1e424e27949b409f5284493f722dd3`
- shared Practical JS: `207684413ad7925686334cafc3748861a439f206`

## Authenticated content preservation

Protected learner corpus:

- 1 H1;
- 6 H2 sections;
- 1 H3 Safety note;
- 10 suggested whole-mount preparations and their labels;
- 9-stage Core Workflow;
- 6-step Permanent Whole Mount general logic;
- 8 Quality-control checks;
- 5 Drawing Rules;
- Temporary Whole Mount guidance;
- departmental-SOP boundary and hazard/PPE/ventilation/waste guidance.

No chemical recipe, concentration, exposure time, fixative/stain choice or unsafe laboratory instruction is added.

## Authorized learner transform

Only:

1. add `academic_system: v1`;
2. add `academic_role: practical`;
3. add `learning_guide: canonical`;
4. inject exactly one canonical Learning Guide CTA after the existing H1;
5. wrap the unchanged 10-row table in the existing `lbfl-academic-table-wrap zoology-practical-table-scroll` keyboard-focusable named region.

## Strict route registration

Exactly one Academic Route Ledger row:

- id: `higher-zoology-practical-whole-mounts`
- canonical route: `/biology/higher-zoology-tree/practical/whole-mounts/`
- source: `_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md`
- role: `practical`
- language: `bn`
- boundary owner: `layout`
- Learning Guide owner: `canonical`
- assessment owner: `mcq-arena`
- enforcement: `strict`
- source/live debt: zero.

## Protected surfaces

No mutation authorized to the Practical gateway, prac-01/prac-02, prac-04–prac-08, course contract, coverage ledger, shared Practical CSS/JS, Academic CSS, canonical Learning Guide include, navigation, assessment runtime, Admission, Socratic surfaces, Worker configuration, or R50 authorization artifact.

## Promotion

```text
main@ee9608a739e33ef01b0f5776c3e8827c7ea8dd12
        ↓
isolated R51 structural transform
        ↓
exact source-preservation validator
        ↓
retained CONV-04 + Practical validators
        ↓
Jekyll + exact-head browser/Axe/keyboard/reflow/spacing/motion/no-JS
        ↓
Cloudflare exact-head preview
        ↓
zero unresolved review threads
        ↓
SOLO exact-head authority + Trusted Governance
        ↓
merge
        ↓
exact-main Cloudflare immutable + canonical prac-03 production parity
        ↓
authorize prac-04 only after PASS
```
