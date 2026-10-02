# CONV-04 — Clean Academic Experience Convergence

programme: CONV-04
phase: CONV-04D-03
mode: authored assessment runtime ownership contract
authorized_base: 4ef010685532eb652ed0867e03c8945b49dedb70
branch: conv-04d-03-authored-assessment-runtime-contract-20261002
mutation_authority: D-03 runtime architecture artifacts + CONV04 state only
learner_content_authoring: frozen
existing_learning_method_cleanup: unchanged
gateway_cta_injection: unchanged
learner_mutation_allowlist:
assessment_ownership: authored-runtime-contract / no learner mutation
bot_08: frozen
admission_pr_356: protected / untouched
worker_cloudflare: out of scope
ready_transition: not authorized until exact-head D-03 certification + Jekyll + review convergence
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
- Authoritative D-03 base: 4ef010685532eb652ed0867e03c8945b49dedb70.
- PR #356 remains independent Admission Draft/HOLD work.

## CONV-04D-03 runtime contract

1. Freeze learner-facing assessment mutation while authored-runtime ownership is made explicit.
2. Record six Academic MCQ banks: five interactive inline implementations and one static authored set.
3. Record the shared-style duplication and fragmented inline runtime ownership.
4. Lock a dedicated authored-bank runtime owner: `assets/js/learning/academic-assessment-runtime.js`.
5. Keep generated `mcq-engine.js` and legacy `components/mcq-arena.html` outside authored-bank ownership.
6. Select `botany-cell-biology-mcq-1.md` as the D-04 pilot because its submission/feedback defect is independently reproduced in production.
7. Preserve all pilot question text, options, answer keys, and authored explanations during runtime implementation.
8. Keep BOT-08, Admission/#356, Worker/Cloudflare, model tests, Socratic, Practical, and Biology content protected.

## Next gate

After D-03 merges, authorize CONV-04D-04 to implement the shared authored assessment runtime on exactly the Botany Cell Biology pilot, certify Attempt → Feedback → Repair → Reattempt in browser/Axe tests, and only then consider migration of additional banks.
