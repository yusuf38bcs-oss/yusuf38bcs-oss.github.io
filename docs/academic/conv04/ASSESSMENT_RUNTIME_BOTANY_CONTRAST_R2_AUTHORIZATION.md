# CONV-04F-07-R2 — Botany Authored Assessment Contrast Remediation

**Status:** isolated retained-certification remediation
**Exact base:** `f499d0fbf6f128cb227e64807b070141a6a9bed8`
**Phase:** `CONV-04F-07-R2`
**Target routes:**
- `/mcq-arena/academic/botany-cell-biology-mcq-1/`
- `/mcq-arena/academic/botany-cell-division-mcq-2/`

## Authenticated defect

Fresh retained certification on the rebound F-08 candidate exposed serious Axe `color-contrast` failures on D-04 and D-05 after submission. Both Botany authored-assessment pages use the same page-local reveal pattern already authenticated and removed in D-06: `opacity: 0 → 1` on `fadeIn` and `slideUp`.

## Authorized mutation

For each of the two Botany banks only:

- `slideUp`: retain translate motion; remove opacity interpolation.
- `fadeIn`: use a 4px transform-only reveal instead of opacity interpolation.

Questions, options, answer keys, authored explanations, timer/score semantics, source-return, keyboard behavior, shared authored runtime, assessment ownership, and route identity remain unchanged.

Scientific/question/answer/explanation rewrite: **PROHIBITED**

## Exact changed-file boundary

- `.github/scripts/validate-assessment-runtime-pilot.rb`
- `.github/scripts/validate-assessment-runtime-second-bank.rb`
- `_mcq-arena/academic/botany-cell-biology-mcq-1.md`
- `_mcq-arena/academic/botany-cell-division-mcq-2.md`
- `docs/academic/conv04/ASSESSMENT_RUNTIME_BOTANY_CONTRAST_R2_AUTHORIZATION.md`
- `docs/academic/conv04/CONV04_STATE.md`

## Promotion gate

Require exact-head D-04 and D-05 content-preservation PASS, browser/Axe PASS, retained CONV-04 contracts, Jekyll, review convergence, zero unresolved threads, and Trusted Governance before merge.
