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


## Exact-head certification remediation

Initial R61 head `786347219621f5403c8d03b43a6074bc3a9b9d3e` passed source preservation, retained academic contracts, Jekyll, preview deployment, Axe, keyboard focus, content census, and overflow checks. The dedicated browser harness failed because it compared the rendered H2 count directly with the **22 source H2** baseline. The canonical Learning Guide CTA renders one additional `How to Learn with LBFL` H2, so the correct rendered count is **23**, while the learner source remains exactly **22 H2** and byte-identical to the authorized transform.

Remediation changes only the browser certification assertion to require 23 rendered H2 headings **and** the canonical Learning Guide heading. No learner source, scientific/anatomical content, heading hierarchy, route ownership, CSS/JS, or runtime behavior is changed.


## Codex review remediation

Five review findings on the original R61 review commit were authenticated. The current candidate incorporates the following certification/governance-only remediations:

1. **Bootstrap phase fail-closed:** every comparison directly against the authenticated R60 base is treated as R61 bootstrap validation, and any top-level phase other than exactly `CONV-04F-09-R61` is rejected.
2. **Rendered H2 census:** source custody remains exactly 22 H2 headings; browser certification requires 23 rendered H2 headings because the canonical Learning Guide CTA contributes exactly one `How to Learn with LBFL` H2.
3. **Complete route-ledger proof:** on the R61 bootstrap base, the full Academic Route Ledger must equal the authenticated base ledger plus exactly one Dissection row inserted after Whole Mounts; unrelated route mutations cannot pass.
4. **Production-host HTTP integrity:** browser certification records >=400 responses from the configured base hostname as well as localhost, so broken same-origin production assets fail parity.
5. **Cloudflare credential boundary:** the secret-bearing Dissection production-parity workflow is no longer manually dispatchable. It is triggered only by a push to `main`; retries use GitHub's workflow rerun mechanism rather than executing a branch-selected workflow definition.

These remediations do not alter the Dissection learner source, its 6/22/29 source heading hierarchy, anatomy/curriculum/dissection corpus, route identity, shared CSS/JS, or assessment/runtime ownership.
