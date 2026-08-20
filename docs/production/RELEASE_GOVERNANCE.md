# LBFL Release Governance Contract

Status: proposed production control
Baseline: `main@65fbd738d6b7087ca65484098bc89a7973dd5fd5`
Programme ledger: #245

## Release identity invariant

For any production or staging promotion:

> Tested SHA = reviewed/authorized SHA = approved SHA = deployed SHA.

Any change to the candidate head or target-base SHA invalidates previous exact-head evidence and requires a complete rerun of the applicable gates.

## Maintainer model

LBFL is a permanent solo-maintainer project owned and maintained by `yusuf38bcs-oss`.

Independent human review remains preferred whenever a qualified reviewer is available, but the release process must not depend on a permanently unavailable second maintainer. Therefore LBFL supports a documented **solo-maintainer exact-head authority** as an explicit alternative to independent approval.

The solo-maintainer path is not self-review disguised as independent review. It is a separate governance authority with stricter machine-verifiable evidence:

- repository owner, PR author, and head-repository owner must all be `yusuf38bcs-oss`;
- the PR must be non-Draft;
- the candidate must contain the exact current target-base SHA;
- required CI for the changed scope must pass at the current head;
- zero unresolved review threads may remain;
- the PR body must contain exactly one permanent exception marker:
  `SOLO-MAINTAINER-EXCEPTION: LBFL-PERMANENT-SOLO-MAINTAINER`;
- the PR body must contain exactly one SHA-bound authorization marker:
  `SOLO-MAINTAINER-APPROVAL: <40-character-current-head-SHA>`;
- the authorization marker is valid only for that exact head; every new commit invalidates it automatically;
- certification evidence never authorizes merge by itself; merge still requires a separate explicit production/release decision.

This exception may not be used to bypass failed CI, stale-base detection, unresolved review threads, production certification, secret-leak gates, or explicit deployment authorization.

## Branch roles

### `main`

Canonical production source branch. Direct feature development is forbidden. Changes arrive through governed pull requests only.

### `staging`

Integration branch for product work. It must periodically absorb the current `main` security/release baseline through an explicit reconciliation PR. Never force-reset `staging` to `main` because staging can contain legitimate product-only history.

### Topic branches

One coherent scope per branch. Preferred namespaces:

- `security/`, `cloudflare/`, `ci/`, `release/`
- `design/`, `responsive/`, `a11y/`, `performance/`
- `biology/`, `evidence/`, `socratic/`, `learning/`, `hsc/`, `admission/`, `ielts/`
- `seo/`, `content/`, `privacy/`, `adsense/`
- `ai/`, `worker/`, `observability/`

## Required pull-request gate

A non-Draft PR targeting `main` or `staging` is promotion-eligible only when all of the following are true:

1. The candidate head is an exact immutable 40-character SHA.
2. The candidate contains the current target-base SHA. A stale candidate must merge/rebase the new base and rerun all evidence.
3. Required CI for the changed scope is green at the current head.
4. Promotion authority exists at the current exact head through either:
   - at least one independent non-author human `APPROVED` review anchored to that head; or
   - the LBFL permanent solo-maintainer exact-head authority described above.
5. No unresolved inline review thread remains.
6. Security-sensitive changes have zero secret/artifact/log leakage.
7. Production-facing changes have the applicable browser, accessibility, deployment-identity and Worker-health evidence.
8. Certification does not itself authorize merge; a separate explicit merge decision is required.

Draft PRs may collect evidence but have no promotion authority.

## Repository ruleset target

GitHub repository settings for both `main` and `staging` should enforce controls compatible with the permanent solo-maintainer model:

- require a pull request before merging;
- require required status checks to pass;
- require branches to be up to date before merging where supported;
- require conversation resolution before merging;
- block force pushes;
- block branch deletion;
- do not require an unavailable second human reviewer as a permanent server-side prerequisite;
- rely on the executable Release Governance Gate for either independent exact-head review or SHA-bound solo-maintainer authority;
- do not permit undocumented bypasses.

If a qualified independent reviewer becomes available, independent approval remains the preferred authority path.

The executable `.github/workflows/release-governance-gate.yml` supplements server-side rulesets; it is not a substitute for branch protection, status checks, or deployment certification.

## Solo-maintainer release sequence

For a solo-maintainer promotion:

1. authenticate the current target branch and candidate head;
2. confirm the candidate contains the current target-base SHA;
3. run all required exact-head CI and scope-specific certification;
4. ensure zero unresolved review threads;
5. record the permanent solo-maintainer exception marker in the PR body;
6. record `SOLO-MAINTAINER-APPROVAL: <current-head-SHA>` in the PR body only after the exact head is known;
7. require the Release Governance Gate to pass at that same head;
8. record a separate explicit merge authorization;
9. merge without force operations;
10. authenticate the resulting target-branch SHA;
11. perform website/Worker deployment as separate authorized actions where applicable;
12. run fresh production certification and rollback verification.

Any candidate commit after step 6 invalidates the authorization marker and returns the PR to HOLD until the marker is deliberately updated to the new exact head after revalidation.

## Reconciliation policy

When `main` and `staging` diverge:

1. create an integration PR from `main` into `staging`;
2. resolve conflicts explicitly in an integration branch if GitHub cannot synthesize the merge;
3. preserve both histories;
4. run staging candidate/preflight and scope-specific tests on the resulting exact head;
5. authorize and merge only after the applicable governance gate passes; and
6. refresh evidence for every still-open staging PR because its base changed.

Never reconcile by force-moving `staging` to `main`.

## Production certification

Production certification must be dispatched from `main` with a full `expected_main_sha`. It must prove:

- current `main` identity is unchanged before and after the run;
- canonical Cloudflare Pages production maps to that SHA;
- canonical production content equals the exact deployment, allowing only the narrowly recognized fail-closed Cloudflare JSD normalization;
- the public `synapticai-proxy` Worker metadata and live version match the target SHA;
- Worker health returns HTTP 200 and production identity;
- browser/Axe/consent/reduced-motion/Save-Data gates pass where required; and
- the certification credential is host-isolated and absent from evidence artifacts and summaries.

## Emergency rule

If an urgent P0 production repair must bypass normal sequencing, record in the PR/issue:

- incident reason;
- exact pre-change production SHA;
- exact repair SHA;
- exact-head solo-maintainer authorization or independent approval;
- rollback command/commit;
- post-merge production certification result; and
- follow-up review to close any temporary governance exception.

Emergency handling never permits secret exposure, force-pushes, stale-head certification, or undocumented production mutation.
