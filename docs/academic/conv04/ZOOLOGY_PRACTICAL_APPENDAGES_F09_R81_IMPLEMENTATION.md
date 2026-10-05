# CONV-04F-09-R81 — prac-06 Appendages Implementation

status: IMPLEMENTATION CANDIDATE
phase: CONV-04F-09-R81
authorized_base: `bbe90f4454ac25982f60b531f47e887ebe51c096`
authorization_gate: CONV-04F-09-R80 / PR #439
selected_module: prac-06
learner_mutation_count: 1
scientific_rewrite: NONE
anatomical_rewrite: NONE
taxonomic_rewrite: NONE
curriculum_rewrite: NONE
functional_mapping_rewrite: NONE
heading_normalization: NONE

## Exact baseline

- source: `_biology/higher-zoology-tree/practical/06-appendages.bn.md`
- baseline blob: `36e36c4dd8cfffb99f1669033b4a21bc0e45d939`
- route: `/biology/higher-zoology-tree/practical/appendages/`
- course: `nu-zoology-practical-213106`
- module order: `prac-05 → prac-06 → prac-07`
- course-contract blob: `a02365ea6743c44a1eddaf84ad05f66d670ade6b`
- coverage-ledger blob: `ab66ddafc1346b65337bc52236d1029a77cf5792`
- route-ledger baseline: `626570000de690b8235668e89f4b0d0924e644c0`

## Protected content

- source hierarchy: 1 H1 / 5 H2 / 6 H3;
- 2 Markdown tables / 19 Markdown table lines;
- cockroach mouth parts: exactly 5 data rows;
- prawn appendages: exactly 10 data rows;
- syllabus functional grouping: exactly 5 groups;
- course-sheet placement: exactly 6 numbered rules;
- self-check: exactly 5 bullets.

Protected functional/anatomical distinctions include the cockroach biting-chewing mouth-part plan; cursorial legs; antennae as sensory rather than true prehensile organs; cerci-mediated escape; reproductive appendages; the prawn protopod/endopod/exopod plan; antennule/statocyst relation; walking, grasping, swimming, reproductive and tail-fan roles; and the exact syllabus functional grouping.

No scientific, anatomical, taxonomic, curriculum, or functional mapping is rewritten.

## Authorized learner transform

Only:
1. add `academic_system: v1`;
2. add `academic_role: practical`;
3. add `learning_guide: canonical`;
4. inject exactly one canonical Learning Guide CTA immediately after the existing H1;
5. wrap each of the two existing Markdown tables with the already-existing Academic-v1 / Practical keyboard-focusable named scroll-region primitive.

No table cell, table row, heading, paragraph, functional claim, placement rule, or self-check item may be changed.
No heading normalization is authorized.

## Strict route registration

Exactly one row:
- id: `higher-zoology-practical-appendages`
- route: `/biology/higher-zoology-tree/practical/appendages/`
- source: `_biology/higher-zoology-tree/practical/06-appendages.bn.md`
- role: `practical`
- language: `bn`
- boundary owner: `layout`
- Learning Guide owner: `canonical`
- assessment owner: `mcq-arena`
- enforcement: `strict`
- source/live debt: zero.

## Security and certification boundary

The production-parity workflow is **push-to-main only**. It has no manual `workflow_dispatch`, so branch-selected workflow definitions cannot expose the Cloudflare credential. Retries use GitHub workflow rerun.

The bootstrap validator fails closed unless phase is exactly R81. The Academic Route Ledger must equal the authenticated R80 base ledger plus exactly one Appendages row. The learner source must normalize byte-for-byte back to the R80 baseline after removing only the authorized metadata, CTA, and two accessibility wrappers.

## Promotion

```text
main@bbe90f4454ac25982f60b531f47e887ebe51c096
        ↓
isolated R81 structural transform
        ↓
exact source + complete-ledger preservation validator
        ↓
retained CONV-04 + Practical validators
        ↓
Jekyll + browser/Axe/keyboard/reflow/spacing/motion/no-JS
        ↓
Cloudflare exact-head preview
        ↓
fresh Codex review + zero unresolved threads
        ↓
SOLO exact-head authority + Trusted Governance
        ↓
merge
        ↓
push-only exact-main Cloudflare immutable + canonical Appendages production parity
        ↓
authorize prac-07 only after PASS
```
