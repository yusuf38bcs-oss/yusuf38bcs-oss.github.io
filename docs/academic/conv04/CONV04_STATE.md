# CONV-04 — Clean Academic Experience Convergence

programme: CONV-04
phase: CONV-04D-04
mode: authored assessment runtime pilot — Botany Cell Biology
authorized_base: b74f47c19508aed4ffd122d4fd7b9a8044419b20
branch: conv-04d-04-botany-cell-biology-runtime-pilot-20261002
mutation_authority: exact Botany Cell Biology assessment pilot + shared authored runtime + D-04 certification/state artifacts
learner_content_authoring: assessment-runtime-pilot-only
existing_learning_method_cleanup: unchanged
gateway_cta_injection: unchanged
learner_mutation_allowlist:
  - _mcq-arena/academic/botany-cell-biology-mcq-1.md
assessment_ownership: authored-runtime-v1 pilot
bot_08: frozen
admission_pr_356: protected / untouched
worker_cloudflare: out of scope
ready_transition: not authorized until exact-head D-04 content-preservation + browser/Axe certification + review convergence
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
- Authoritative D-04 base: b74f47c19508aed4ffd122d4fd7b9a8044419b20.
- PR #356 remains independent Admission Draft/HOLD work.

## CONV-04D-04 pilot contract

1. Authorize exactly one learner-facing assessment mutation: `_mcq-arena/academic/botany-cell-biology-mcq-1.md`.
2. Add the dedicated shared authored-bank runtime at `assets/js/learning/academic-assessment-runtime.js`.
3. Preserve exactly all 10 question texts, 40 option texts, 10 answer-key indices, and 10 authored explanations.
4. Make answered-count/progress state reflect actual selections.
5. On submission, expose correctness state, the correct answer, and each authored explanation.
6. If repair is needed, expose source-return to `/biology/hsc-corner/botany/`.
7. Provide in-page reattempt that resets assessment state.
8. Preserve all other Academic MCQ banks, the gateway, generated engine, legacy component, model test, Biology content, Socratic, Practical, BOT-08, Admission/#356, Worker, and Cloudflare configuration.

## Next gate

Exact-head D-04 source/content-preservation validation + production Jekyll build + five-viewport browser/Axe certification + no-JS resilience + retained B/C/D contracts + CodeQL + review convergence. After unchanged-head solo authority, Trusted Governance and required Pages pass, merge and verify production before authorizing any second-bank migration.
