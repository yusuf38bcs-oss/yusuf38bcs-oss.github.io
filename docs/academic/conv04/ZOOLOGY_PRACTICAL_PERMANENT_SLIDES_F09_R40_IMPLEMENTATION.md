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
4. inject exactly one `{% include education/learning-guide-cta.html %}` immediately after the existing H1;
5. wrap the four unchanged Markdown reference tables with the existing `lbfl-academic-table-wrap zoology-practical-table-scroll` primitive, with keyboard-focusable named regions.

The table cells, headings, scientific/taxonomic wording, preparation counts, lists and workflow prose remain identical to the authenticated baseline.

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


## Exact-head remediation after first R40 run

Initial candidate `32caec1a7f727b2ed7afc1e5b22ca7da8e0480af` authenticated the source/curriculum contract and exact-head Cloudflare preview, but exposed two presentation/certification issues:

- the shared Practical browser suite reported one Axe violation on prac-02 at all tested viewports; the route's raw Markdown tables had not yet adopted the existing Academic-v1 table wrapper used by converged surfaces;
- the R40-specific harness read generated heading permalink anchors as part of heading text and, after JS table enhancement, failed to locate the histology/microscope list headings by exact text.

Remediation is structural only:
- apply the existing Academic-v1 + Practical table wrapper to the four unchanged tables;
- normalize generated heading text in the certification harness by removing heading-anchor links before comparison.

Shared CSS/JS remain byte-identical. No scientific, taxonomic or curriculum text is changed.


## Security/governance remediation — post-review

Four exact-head review findings on candidate `587aeca87ef16d563d67b4c5adf294f59cc2cfef` were accepted and remediated without learner-content changes:

1. **PR preview credential boundary:** the pull-request workflow no longer receives a Cloudflare Pages deployment token. It authenticates the exact candidate/base, validates R40 scope, builds `_site`, and uploads the validated site artifact. PR preview deployment is owned by the trusted Cloudflare Pages Git integration rather than candidate workflow code.
2. **Retained validator base:** production parity binds `PR_BASE_SHA` to `TARGET_SHA^` before the R40 validator executes, so later retained certification cannot silently fall back to the original R40 base.
3. **Stale-main race:** the production deployment step re-reads `origin/main` immediately before Wrangler and aborts before mutation if main moved.
4. **Shared dependency triggers:** production parity now triggers for shared Practical CSS/JS, Academic CSS, and the canonical Learning Guide CTA include.

Cloudflare production credentials are removed from job-level environment scope and are exposed only to the trusted production steps that require them. The learner source, 43-preparation corpus, scientific/taxonomic/curriculum wording, Practical shared assets, course contract, coverage ledger, and module order are unchanged by this remediation.


## Retained-validator hardening after Ready review

Two additional P2 findings discovered during the Ready-state review were accepted and fixed before promotion:

- successor authority now parses the **top-level** `authorized_base` scalar from `CONV04_STATE.md`; historical occurrences elsewhere in the state document cannot satisfy exact-base authority;
- the R40 validator file itself is included in `protected_artifacts`, preventing later non-maintenance phases from silently weakening the retained validator.

The phase scalar is likewise read from the top-level state block. These changes are certification/governance-only and do not alter the learner source or curriculum corpus.
