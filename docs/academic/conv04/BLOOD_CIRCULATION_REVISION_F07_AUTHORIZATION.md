# CONV-04F-07 — Blood Circulation Revision Map Convergence

**Status:** IMPLEMENTATION CANDIDATE — certification pending
**Exact base:** `9895c190f75d0d6b3167370a043181e9cc5c14ad`
**Target route:** `/biology/higher-zoology-tree/physiology/human-blood-circulation-overview/`
**Target source:** `_biology/higher-zoology-tree/physiology/human-blood-circulation-overview.md`
**Baseline source:** `_biology/higher-zoology-tree/physiology/human-blood-circulation-overview.md`
**Candidate source:** `_biology/higher-zoology-tree/physiology/human-blood-circulation-overview.md`
**Baseline blob:** `0eceb2542287fc99356b73dc400b3ede8a8db4f4`

## F-07 authenticated finding

The route already has the correct semantic ledger role `revision`, Bangla language ownership, layout-owned educational boundary, canonical Learning Guide ownership, and MCQ Arena assessment ownership.

Its pre-F-07 debt was:

- `missing_academic_role`
- `missing_academic_system`
- `missing_lang`
- `legacy_language_key`
- `rendered_blank_hero_space`
- `rendered_word_fragmentation`

The first four are source metadata debt. The final two are rendered debt and must be retired only by exact-head browser evidence; F-07 does not delete the existing header metadata or rewrite learner content to make those findings disappear.

## Exact learner mutation authority

Exactly one learner-facing source may change:

`_biology/higher-zoology-tree/physiology/human-blood-circulation-overview.md`

Authorized additions only:

```yaml
polyglot_root_language: true
academic_system: v1
academic_role: revision
learning_guide: canonical
```

plus exactly one canonical Learning Guide CTA immediately after the page H1.

All existing scientific prose, headings, Study Route, six linked series pages, mind map, diagrams, comparison table, short-answer bank, MCQ validity logic, Synaptic Bridge and references are preserved.

## Route-ledger target

`blood-circulation-revision` advances from progressive with explicit debt to:

```text
enforcement: strict
source_debt: []
live_debt: []
```

The live-debt promotion is valid only if the exact-head rendered certification demonstrates no visible blank hero space, no fragmentation-causing overflow/break-all behavior, correct Bangla document language, one canonical Learning Guide CTA, one layout educational boundary, responsive 320px reflow, text spacing, reduced motion, no-JS and Axe serious/critical zero.

## Protected boundaries

No F-07 mutation is authorized for the Blood Circulation master hub, the five linked lecture/application pages, the Human Physiology integration course contract, shared CSS/layout, assessments/runtime, Practical, Socratic, Admission/#356, Worker or Cloudflare configuration.

## Promotion gate

Draft until unchanged-head F-07 source preservation, retained A–F06/D/E, production Jekyll, exact-head browser/Axe/keyboard/reflow/text-spacing/reduced-motion/no-JS, CodeQL, review convergence, required Pages and Trusted Governance pass.




## Route-scoped language compatibility

Exact-head Jekyll diagnostics proved that adding Polyglot front matter `lang: bn` to this historical root Bangla route moves the rendered page to the non-default `/bn/...` site and removes the established root output. Polyglot documents this prefixing behavior for non-default languages. The prior `exclude_from_localization` experiment was also rejected because that option is intended for root-level static paths/folders rather than collection-document language ownership.

F-07 therefore does **not** set `lang: bn` on this page. Instead:

- existing `language: bn` remains the content-language source;
- source and ledger explicitly opt in with `polyglot_root_language: true`;
- the Academic Surface validator accepts `language` as effective language only for that dual-opt-in route;
- the default layout renders `<html lang="bn">` from `page.language` only for the same explicit opt-in;
- all other routes keep the existing `page.lang` / Polyglot behavior unchanged.

This preserves the established Bangla root URL and the separate explicit English `/en/...` counterpart without changing scientific content, route slug, site-wide default language, or other routes.
