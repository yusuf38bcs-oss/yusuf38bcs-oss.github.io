# CONV-04F-07-R1 — D-06 Post-submit Contrast Remediation

**Status:** isolated retained-certification remediation
**Exact base:** `78eff4725e7fd935a9584507a522b6958fb71bec`
**Target route:** `/mcq-arena/academic/zoology-respiratory-system-mcq-5/`
**Target source:** `_mcq-arena/academic/zoology-respiratory-system-mcq-5.md`

## Authenticated defect

Repeated exact-head D-06 browser certification reported serious Axe `color-contrast` failures on all eight revealed explanations plus score/repair content immediately after submission. The affected content is revealed through `fadeIn` and `slideUp` keyframes that animate `opacity: 0 → 1`, temporarily reducing effective text contrast.

## Authorized mutation

Only the two reveal keyframes may change:

- `slideUp`: retain transform motion; remove opacity interpolation.
- `fadeIn`: replace opacity interpolation with a 4px transform-only reveal.

Question text, option text, answer keys, authored explanations, score semantics, timer, shared authored runtime, source-return, keyboard behavior and assessment ownership remain unchanged.

Scientific/question/answer/explanation rewrite: **PROHIBITED**

## Exact changed-file boundary

- `_mcq-arena/academic/zoology-respiratory-system-mcq-5.md`
- `.github/scripts/validate-assessment-runtime-third-bank.rb`
- `.github/scripts/validate-learning-guide-contract.rb` — phase-parser compatibility only (`-R#` suffix)
- `docs/academic/conv04/CONV04_STATE.md`
- `docs/academic/conv04/ASSESSMENT_RUNTIME_THIRD_BANK_CONTRAST_R1_AUTHORIZATION.md`

## Retained-contract compatibility

The Academic Design System and Learning Guide retained phase parsers are widened only from `CONV-04X-NN` to also accept the repository's already-used remediation form `CONV-04X-NN-R#`. No design-system CSS, Learning Guide behavior, tokens, components, learner rendering, or enforcement strength changes.

## Promotion gate

Require unchanged-head D-06 content-preservation PASS, five-viewport browser/Axe PASS, retained CONV-04 contracts, Jekyll, CodeQL, zero unresolved review threads and Trusted Governance before merge.
