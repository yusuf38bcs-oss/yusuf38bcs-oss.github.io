# CONV-04 — Clean Academic Experience Convergence

programme: CONV-04
phase: CONV-04B
mode: core academic design-system architecture
authorized_base: `9f20bfa7398db8c2e5f1dbdd3db61c43eef3e5bf`
branch: `conv-04b-core-academic-design-system-20261001`
mutation_authority: design manifest + scoped academic stylesheet + opt-in default/homepage layout metadata + legacy-style isolation + validator + minimum CI + state documentation
learner_content_authoring: frozen
bot_08: frozen
admission_pr_356: protected / untouched
worker_cloudflare: out of scope
ready_transition: not authorized until exact-head certification
merge: not authorized until unchanged-head governance PASS

## Completed foundation

- CONV-04A Academic Surface Contract: merged via PR #388.
- Authoritative CONV-04B base: `9f20bfa7398db8c2e5f1dbdd3db61c43eef3e5bf`.
- Progressive route ledger and validator remain authoritative.
- PR #356 remains an independent Admission Draft/HOLD surface.

## CONV-04B locked decisions

1. Academic v1 is opt-in only through `academic_system: v1`.
2. Legacy routes receive no CONV-04B visual change until later migration phases.
3. Core design selectors are scoped to `html.lbfl-academic-v1`.
4. Academic role is exposed as explicit article metadata, not inferred from URL.
5. Shared design tokens use the `--lbfl-academic-*` namespace.
6. Core components implement the information-structure vocabulary from CONV-04A.
7. Important learner content remains DOM-visible without JavaScript.
8. Ordinary prose must not use `overflow-wrap:anywhere` or `word-break:break-all`.
9. The existing 85vh hero and word-fragmentation debt are neutralized only on opted-in academic v1 surfaces through a narrowly documented legacy bridge.
10. No new global hotfix layer, learner-content rewrite, or course migration is authorized in CONV-04B.

## CONV-04B artifacts

- `_data/academic/design_system_v1.json`
- `assets/css/academic-design-system.css`
- `docs/academic/conv04/ACADEMIC_DESIGN_SYSTEM.md`
- `.github/scripts/validate-academic-design-system.rb`
- `.github/workflows/academic-design-system-certification.yml`

Integration points:
- `_includes/head/head.html`
- `_includes/head/custom.html`
- `_layouts/default.html`
- `_layouts/homepage-v3.html`
- `_layouts/single.html`

## Current programme debt retained

CONV-04B does not claim to remove the existing global debt recorded by CONV-04A:
- `global_hero_85vh`;
- `global_overflow_anywhere`;
- `multi_layer_override_stack`;
- `late_lesson_design_stylesheet`.

It creates a clean opt-in target so later route migrations do not need additional page-local design systems.

## Next gate

Exact-head design-system validator + production Jekyll build + required PR checks. Remain Draft until those gates and review-thread audit pass.
