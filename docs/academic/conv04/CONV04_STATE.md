# CONV-04 — Clean Academic Experience Convergence

programme: CONV-04
phase: CONV-04D-06
mode: third-bank authored-runtime implementation candidate — Zoology Respiratory System
authorized_base: d623e0016fdc98ee7b6ddc3b21a7c60c8383965b
branch: conv-04d-06-zoology-respiratory-runtime-migration-r2-20261002
production_verified_main: e01794957b184114e4a7ab82f0689acd67b5f14f
production_loop: PASS — Attempt → Feedback → Repair → Reattempt
mutation_authority: exact Zoology Respiratory System assessment bank + D-06 certification/state artifacts
learner_content_authoring: third-bank-runtime-migration-implemented / certification-pending
existing_learning_method_cleanup: unchanged
gateway_cta_injection: unchanged
learner_mutation_allowlist:
  - _mcq-arena/academic/zoology-respiratory-system-mcq-5.md
shared_authored_runtime: reuse unchanged by default; mutation not authorized in D-06 without a separately evidenced runtime blocker
assessment_ownership: authored-runtime-v1 third-bank migration
bot_08: frozen
admission_pr_356: protected / untouched
worker_cloudflare: out of scope
ready_transition: not authorized until exact-head D-06 content-preservation + browser/Axe + retained-contract certification + review convergence
merge: not authorized until unchanged-head governance + required checks PASS

## Completed foundation

- CONV-04A Academic Surface Contract: merged via PR #388.
- CONV-04B Core Academic Design System: merged via PR #389.
- CONV-04B-R1 future-phase certification compatibility: merged via PR #391.
- CONV-04B-R2 explicit learner-mutation authority: merged via PR #396.
- CONV-04C-01 Learning Guide contract: merged via PR #390.
- CONV-04C-01-R1 future-phase scope compatibility: merged via PR #393.
- CONV-04C-02 canonical /learn/ implementation + contrast remediation: merged via PR #392.
- CONV-04C-02-R2 future-phase compatibility: merged via PR #394.
- CONV-04C-03 HSC Zoology gateway convergence: merged via PR #395.
- CONV-04D-01 Assessment Ownership Contract: merged via PR #397.
- CONV-04D-01-R1 future-phase implementation compatibility: merged via PR #398.
- CONV-04D-02 Academic MCQ gateway repair: merged via PR #399.
- CONV-04D-02-R1 gateway framing + retained certification repair: merged via PR #400.
- CONV-04D-03 authored assessment runtime ownership contract: merged via PR #401.
- CONV-04D-04 Botany Cell Biology authored runtime pilot: merged via PR #402 at main@a104260266a292bee58f6935a5038693380e8c04.
- CONV-04D-04-R1 retained-certification compatibility: merged via PR #404 at main@01e443b2155c6cccf65cb525ec39880c7977db7b.
- D-04 production verification: PASS on the public route for Attempt → Feedback → Repair → Reattempt, keyboard radio interaction, score/explanations, source-return, reattempt reset, and runtime health.
- CONV-04D-05 Botany Cell Division second-bank migration: merged via PR #403 at main@e01794957b184114e4a7ab82f0689acd67b5f14f.
- CONV-04D-05-R1 retained-certification future-phase compatibility: merged via PR #405 at main@d623e0016fdc98ee7b6ddc3b21a7c60c8383965b.
- D-05 production verification: PASS on the public route for 8/32/8/8 content, keyboard interaction, score/explanations, Zoology-independent Botany source-return, reattempt reset, and runtime health.
- PR #356 remains independent Admission Draft/HOLD work.

## CONV-04D-06 authorization contract

1. Authorize exactly one learner-facing assessment mutation: `_mcq-arena/academic/zoology-respiratory-system-mcq-5.md`.
2. Target route: `/mcq-arena/academic/zoology-respiratory-system-mcq-5/`.
3. Reuse `assets/js/learning/academic-assessment-runtime.js` unchanged by default.
4. Preserve exactly all 8 question texts, 32 option texts, 8 answer-key indices, and 8 authored explanations recorded in `_data/academic/assessment_runtime_third_bank_authorization_v1.json`.
5. Preserve the existing 900-second assessment time limit.
6. Replace legacy `initQuiz`, inline `submitQuiz`, reload-only restart, and neural wrapper framing with the canonical authored-runtime loop.
7. Repair source-return target: `/biology/hsc-corner/zoology/`.
8. Keep D-04, D-05, the remaining three unmigrated Academic banks, gateway, generated engine, legacy component, model tests, Biology content, Socratic, Practical, BOT-08, Admission/#356, Worker, and Cloudflare configuration unchanged.
9. Ship the D-06 validator/workflow with bootstrap + retained modes from the first implementation; no routine D-06-R1 compatibility repair should be required.
10. Preserve historical authorization provenance while authenticating each future PR against its live current base.
11. Permit CONV04_STATE to advance only monotonically in retained mode.
12. Require workflow_dispatch exact-main authentication through a required expected_main_sha input.

## Implementation status

- Zoology Respiratory System third bank migrated to the certified shared authored runtime.
- Literal content remains exactly 8 questions / 32 options / 8 answer keys / 8 authored explanations.
- Time limit remains exactly 900 seconds (15:00).
- Shared authored runtime remains unchanged from the authorized base.
- D-06 validator and workflow ship with bootstrap + retained modes from the first implementation.
- Later CONV-04 phases must preserve D-06 artifacts and may advance state only monotonically.
- Manual D-06 workflow dispatch requires expected_main_sha exact-main authentication.

## Next gate

Run exact-head D-06 source/content-preservation validation, retained A-D certification, production Jekyll, five-viewport browser/Axe, 900-second wall-clock timer, and no-JS resilience on the unchanged candidate head. Then open/maintain a Draft PR and require CodeQL, zero unresolved review threads, exact-head solo authority, required Pages, and Trusted Governance before merge.
