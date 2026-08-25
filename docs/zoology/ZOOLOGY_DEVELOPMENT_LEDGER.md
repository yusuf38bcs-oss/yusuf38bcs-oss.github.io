# LBFL Zoology Development Ledger

## Controlling baseline

- Parent integration authority: PR #253 exact head `4fb8e4a39fb68e9f38e5f5b8df8663ab74168b5d`.
- Zoology implementation branch must remain dependent on that exact integration lineage until #253 is separately merged.
- A PR merge, staging deployment, production deployment and production certification are separate authorities.

## Development stages

| Stage | Scope | Exit gate |
|---|---|---|
| Z0.5 | Restore current `main` → `staging` development lineage | `CURRENT_MAIN_TO_STAGING_EXACT_HEAD_PASS` |
| Z1A | Academic safety: digestion enzyme/location correctness, mechanism wording, inherited contradictions | `ZOOLOGY_ACADEMIC_SAFETY_PASS` |
| Z1B | Learner-facing publishing hygiene: remove source-processing/build language and UI implementation residue | `ZOOLOGY_PUBLISHING_HYGIENE_PASS` |
| Z2 | HSC Zoology gateway: make active course systems discoverable from their canonical parent | `HSC_ZOOLOGY_GATEWAY_PASS` |
| Z3 | Unified lecture design: LOLO → LALA cycle, readable hierarchy, responsive tables/cards, reduced-motion support | `ZOOLOGY_DESIGN_CONTRACT_PASS` |
| Z4 | Canonical Higher Zoology architecture: Physiology authority, legacy bridges/redirects, Research Methodology surfacing | `HIGHER_ZOOLOGY_CANONICAL_IA_PASS` |
| Z5 | Socratic learning and assessment alignment | `ZOOLOGY_PEDAGOGY_ASSESSMENT_PASS` |
| Z6 | Full browser, Axe, keyboard, mobile, performance and media hardening | `ZOOLOGY_UX_A11Y_PERF_PASS` |
| Z7 | Independent academic evidence review | `ZOOLOGY_INDEPENDENT_ACADEMIC_PASS` |
| Z8 | Exact-head release candidate freeze and recertification | `ZOOLOGY_RC_EXACT_HEAD_PASS` |
| Z9 | Separately authorized staging/production promotion and exact deployed-SHA certification | `ZOOLOGY_PREMIUM_LIVE_PASS` |

## This PR boundary

This implementation covers Z1A, Z1B, Z2 and Z3 only. Z4–Z9 remain separate governed stages so canonical redirects, assessment expansion and production promotion cannot be smuggled into an academic/design remediation PR.
