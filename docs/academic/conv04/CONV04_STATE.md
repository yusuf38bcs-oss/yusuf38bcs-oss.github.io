# CONV-04 — Clean Academic Experience Convergence

programme: CONV-04
phase: CONV-04D-05
mode: authorized second-bank authored-runtime migration — Botany Cell Division
authorized_base: a104260266a292bee58f6935a5038693380e8c04
branch: conv-04d-05-botany-cell-division-runtime-migration-20261002
production_verified_main: a104260266a292bee58f6935a5038693380e8c04
production_loop: PASS — Attempt → Feedback → Repair → Reattempt
mutation_authority: exact Botany Cell Division assessment bank + D-05 certification/state artifacts
learner_content_authoring: second-bank-runtime-migration-only
existing_learning_method_cleanup: unchanged
gateway_cta_injection: unchanged
learner_mutation_allowlist:
  - _mcq-arena/academic/botany-cell-division-mcq-2.md
shared_authored_runtime: reuse unchanged by default; mutation not authorized in D-05 without a separately evidenced runtime blocker
assessment_ownership: authored-runtime-v1 second-bank migration
bot_08: frozen
admission_pr_356: protected / untouched
worker_cloudflare: out of scope
ready_transition: not authorized until exact-head D-05 content-preservation + browser/Axe + retained-contract certification + review convergence
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
- D-04 production verification: PASS on the public route for Attempt → Feedback → Repair → Reattempt, keyboard radio interaction, score/explanations, source-return, reattempt reset, and runtime health.
- PR #356 remains independent Admission Draft/HOLD work.

## CONV-04D-05 authorization contract

1. Authorize exactly one learner-facing assessment mutation: `_mcq-arena/academic/botany-cell-division-mcq-2.md`.
2. Target route: `/mcq-arena/academic/botany-cell-division-mcq-2/`.
3. Reuse the certified shared authored-bank runtime at `assets/js/learning/academic-assessment-runtime.js` unchanged by default.
4. Preserve exactly all 8 question texts, 32 option texts, 8 answer-key indices, and 8 authored explanations unless a separately authorized academic correction is required.
5. Replace legacy `initQuiz`, inline `submitQuiz`, and reload-only restart behavior with the canonical authored-runtime loop.
6. Repair source-return target: `/biology/hsc-corner/botany/`.
7. Certify keyboard radio behavior, wall-clock timer integrity, submit/retry state, visible feedback, authored explanations, no-JS readability, responsive layout, and zero serious/critical Axe violations.
8. Keep the D-04 pilot, the other four unmigrated Academic MCQ banks, the Academic gateway, generated engine, legacy component, model tests, Biology content, Socratic, Practical, BOT-08, Admission/#356, Worker, and Cloudflare configuration unchanged.

## Next gate

Implement CONV-04D-05 on this isolated branch with exact content preservation and no shared-runtime mutation by default. Then require local/source validator PASS, production Jekyll PASS, five-viewport browser/Axe PASS, no-JS resilience, retained B/C/D contracts, CodeQL, zero unresolved review threads, exact-head solo authority, Trusted Governance, and required Pages checks before merge.
