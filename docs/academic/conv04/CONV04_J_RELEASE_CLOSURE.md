# CONV-04J Whole-Platform Release / Final Closure

status: IMPLEMENTATION CANDIDATE / HOLD
programme: CONV-04
phase: CONV-04J-R1
j_implementation_base: b3cffae196a34eb6ce97692168c2cc03cfbb5594
authorization_source: PR #457
date: 2026-10-09

## Purpose

CONV-04J-R1 is the final whole-platform release/closure execution candidate under CONV-04J. It does not authorize learner or runtime feature work. Its purpose is to freeze the post-#457 platform state, retain-certify the completed CONV-04 contracts, merge only an unchanged certified governance head, then prove post-merge exact-main production parity before declaring CONV-04 closed.

## Exact mutation allowlist

Only:

- `docs/academic/conv04/CONV04_STATE.md`
- `docs/academic/conv04/CONV04_J_RELEASE_CLOSURE.md`

Any other changed path is out of scope and must fail closed.

## Protected surfaces

No mutation is authorized for:

- learner content;
- Homepage source/CSS/JS;
- Socratic behavior;
- assessment banks or runtime;
- Practical or Ecology learner sources;
- Admission / PR #356;
- route or redirect ownership;
- Worker, Cloudflare, DNS or credentials;
- shared newsletter/consent implementation;
- opportunistic cleanup.

## Pre-merge release gate

The exact J head must:

1. contain authenticated base `b3cffae196a34eb6ce97692168c2cc03cfbb5594`;
2. change only the two allowed governance/evidence files;
3. pass the retained whole-platform exact-head certification matrix;
4. preserve Homepage, Socratic, assessment, Practical, Ecology, route, metadata, accessibility, responsive, security, consent/AdSense and shared-system contracts;
5. have zero unresolved review threads;
6. receive a fresh review on the exact head with no material findings;
7. bind SOLO authority to the exact head;
8. pass LBFL Trusted Release Governance;
9. pass a final unchanged-head audit.

Merge remains HOLD until every item above passes on the same exact SHA.

## Post-merge final closure gate

After the unchanged certified J head merges:

1. authenticate the resulting exact `main`;
2. verify production parity on that exact main;
3. confirm no CONV-04 learner/runtime mutation escaped the governance boundary;
4. update final closure evidence;
5. only then mark CONV-04 formally CLOSED.

Post-merge production parity is not a J pre-merge prerequisite; it is the final CONV-04 closure condition.

## Fail-closed rule

If J discovers a material defect, J does not repair it in place. The gate fails closed and a separately isolated, evidence-backed repair authorization is required before any code mutation.
