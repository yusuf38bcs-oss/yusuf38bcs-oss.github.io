# CONV-04F-01 — HSC Zoology Gateway Authorization

**Authorized base:** `b73d04616498649b8db66afef2d80103329118f5`
**Target route:** `/biology/hsc-corner/zoology/`
**Target source:** `_biology/hsc-corner/zoology/index.md`
**Baseline blob:** `babb9f70421ce5ae5f37bfe7534a899992ab0e65`

## F-00 authenticated finding

The post-E route already owns the canonical Learning Guide and has no live debt. Its Academic Surface ledger debt is metadata-only:

- `missing_academic_role`
- `missing_academic_system`
- `missing_lang`
- `legacy_language_key`

The existing `language: en` value agrees with the F-01 canonical `lang: en` value and is retained for compatibility.

## Exact learner mutation authority

F-01 may change exactly one learner-facing source:

`_biology/hsc-corner/zoology/index.md`

Authorized source additions are only:

```yaml
lang: en
academic_system: v1
academic_role: academic_gateway
```

No existing prose, heading, link, curriculum/alignment metadata, card, Responsible Learning Boundary, Learning Guide ownership, assessment ownership, or scientific statement may change.

## Route-ledger target

`hsc-zoology-gateway` advances:

```text
progressive + four metadata debts
        ↓
strict + zero source/live debt
```

This is a surface-level CONV-04 promotion. It does **not** claim that the whole HSC Zoology curriculum/pathway is complete.

## Protected boundaries

No mutation is authorized for Digestive System, Higher Zoology, Animal Diversity, Ecology, Genetics, Physiology, Practical, Socratic, Admission/#356, assessment banks/runtime, Worker, Cloudflare, or shared layout/CSS.

## Retained-certification stabilization

The first exact-head run exposed a deterministic race in the retained D-05 browser
certificate: Axe ran immediately after submit while the 0.5-second explanation and
score-board opacity/slide animations were still active. The reported targets were the
animated explanation/result surfaces, while their steady-state foreground/background
tokens are high-contrast.

F-01 therefore authorizes exactly one non-learner retained-test correction:

`.github/scripts/assessment-runtime-second-bank-browser-certification.mjs`

The correction waits 650 ms after submit before Axe inspects the steady state. It does
not change Axe rules, violation severity, questions, answers, scores, runtime behavior,
or any learner-facing source.

## Promotion gate

Draft until exact-head F-01 source preservation, retained C-03/A-E/D contracts, production Jekyll, browser/Axe, keyboard/focus, 320px reflow, text spacing, reduced motion, no-JS, CodeQL, review convergence, required Pages, exact-head solo authority, and Trusted Governance pass.
