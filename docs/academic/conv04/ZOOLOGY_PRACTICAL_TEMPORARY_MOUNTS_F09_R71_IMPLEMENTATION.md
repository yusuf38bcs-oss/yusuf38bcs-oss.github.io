# CONV-04F-09-R71 — prac-05 Temporary Mounts Implementation

status: IMPLEMENTATION CANDIDATE
phase: CONV-04F-09-R71
authorized_base: 8edd547bb96c453f86031d6e1a5f3819adf5f1af
authorization_gate: CONV-04F-09-R70 / PR #437
selected_module: prac-05
learner_mutation_count: 1
scientific_rewrite: NONE
anatomical_rewrite: NONE
curriculum_rewrite: NONE
mounting_protocol_rewrite: NONE
safety_rewrite: NONE
heading_normalization: NONE

## Exact baseline

- source: `_biology/higher-zoology-tree/practical/05-temporary-mounts.bn.md`
- baseline blob: `b01e88d0bfe9441e984ac2a10f3a0ee761379850`
- route: `/biology/higher-zoology-tree/practical/temporary-mounts/`
- course: `nu-zoology-practical-213106`
- module order: `prac-04 → prac-05 → prac-06`
- course-contract blob: `a02365ea6743c44a1eddaf84ad05f66d670ade6b`
- coverage-ledger blob: `ab66ddafc1346b65337bc52236d1029a77cf5792`
- route-ledger baseline: `f613fb45fc40c21d496dec6dad3a5dc13d3e865b`

## Protected content

- source hierarchy: 5 H1 / 14 H2 / 0 H3;
- 19 numbered procedure steps;
- 16 bullet items;
- 0 Markdown tables;
- earthworm brain: 7 procedure steps;
- cockroach salivary gland: 6 procedure steps;
- prawn statocyst: 6 procedure steps;
- 3/3 required temporary mounts;
- 7-mark checklist: exactly 7 checks.

Protected anatomy/identification includes cerebral ganglia + circumpharyngeal connectives; salivary glands/reservoirs/ducts and the fat-body distinction; antennular statocyst, sensory setae and retained statolith/sand particles; and the existing equilibrium/orientation interpretation.

No anaesthetic, preservative, fixative, stain, clearing-agent, concentration, exposure-time, dissection-depth, unsupported anatomical, or new hazard instruction is added or rewritten.

## Authorized learner transform

Only:
1. add `academic_system: v1`;
2. add `academic_role: practical`;
3. add `learning_guide: canonical`;
4. inject exactly one canonical Learning Guide CTA immediately after the first existing H1.

No table wrapper is added because the baseline contains no Markdown table.
No heading normalization is authorized.

## Strict route registration

Exactly one row:
- id: `higher-zoology-practical-temporary-mounts`
- route: `/biology/higher-zoology-tree/practical/temporary-mounts/`
- source: `_biology/higher-zoology-tree/practical/05-temporary-mounts.bn.md`
- role: `practical`
- language: `bn`
- boundary owner: `layout`
- Learning Guide owner: `canonical`
- assessment owner: `mcq-arena`
- enforcement: `strict`
- source/live debt: zero.

## Security and certification boundary

The production-parity workflow is **push-to-main only**. It has no manual `workflow_dispatch`, so a branch-selected workflow definition cannot expose the Cloudflare credential. Retries use GitHub workflow rerun.

The bootstrap validator must fail closed unless phase is exactly R71, and the Academic Route Ledger must equal the authenticated R70 base ledger plus exactly one Temporary Mounts row.

## Promotion

```text
main@8edd547bb96c453f86031d6e1a5f3819adf5f1af
        ↓
isolated R71 structural transform
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
push-only exact-main Cloudflare immutable + canonical Temporary Mounts production parity
        ↓
authorize prac-06 only after PASS
```
