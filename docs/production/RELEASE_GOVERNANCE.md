# LBFL Release Governance Contract

Status: proposed production control
Baseline: `main@65fbd738d6b7087ca65484098bc89a7973dd5fd5`
Programme ledger: #245

## Release identity invariant

For any production or staging promotion:

> Tested SHA = reviewed SHA = approved SHA = deployed SHA.

Any change to the candidate head or target-base SHA invalidates previous exact-head evidence and requires a complete rerun of the applicable gates.

## Branch roles

### `main`

Canonical production source branch. Direct feature development is forbidden. Changes arrive through reviewed pull requests only.

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

A non-draft PR targeting `main` or `staging` is promotion-eligible only when all of the following are true:

1. The candidate head is an exact immutable 40-character SHA.
2. The candidate contains the current target-base SHA. A stale candidate must merge/rebase the new base and rerun all evidence.
3. Required CI for the changed scope is green at the current head.
4. At least one independent approval exists at the current head. The PR author, bots, and dismissed/obsolete approvals do not satisfy this requirement.
5. No unresolved inline review thread remains.
6. Security-sensitive changes have zero secret/artifact/log leakage.
7. Production-facing changes have the applicable browser, accessibility, deployment-identity and Worker-health evidence.
8. Certification does not itself authorize merge; a separate explicit merge decision is required.

Draft PRs may collect evidence but have no promotion authority.

## Repository ruleset target

GitHub repository settings for both `main` and `staging` should enforce:

- require a pull request before merging;
- require at least one approval;
- dismiss stale approvals when new commits are pushed;
- require approval of the most recent reviewable push;
- require conversation resolution before merging;
- require status checks to pass;
- require branches to be up to date before merging (strict mode);
- block force pushes;
- block branch deletion;
- do not permit bypass except an explicitly documented emergency administrator path.

The executable `.github/workflows/release-governance-gate.yml` supplements the server-side ruleset; it is not a substitute for GitHub branch/ruleset enforcement.

## Reconciliation policy

When `main` and `staging` diverge:

1. create an integration PR from `main` into `staging`;
2. resolve conflicts explicitly in an integration branch if GitHub cannot synthesize the merge;
3. preserve both histories;
4. run staging candidate/preflight and scope-specific tests on the resulting exact head;
5. merge only after review; and
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
- explicit approver;
- rollback command/commit;
- post-merge production certification result; and
- follow-up review to close any temporary governance exception.
