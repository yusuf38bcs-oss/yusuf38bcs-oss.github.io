# LBFL Release Governance Contract

Status: proposed production control
Baseline: `main@65fbd738d6b7087ca65484098bc89a7973dd5fd5`
Programme ledger: #245

## Release identity invariants

Before merge:

> Tested candidate SHA = reviewed/authorized PR-head SHA.

After merge:

> Authenticated target-branch SHA = deployed SHA = production-certified SHA.

A merge, squash, or rebase may create a target-branch SHA different from the PR head. Pre-merge evidence remains evidence for the reviewed candidate only; it must never be relabelled as evidence for a different post-merge commit. Authenticate and validate the actual target-branch SHA before treating it as deployable, and bind production certification to that exact SHA.

Any change to the candidate head invalidates its authorization and exact-head evidence. Any advance of the target base makes an unchanged candidate stale until the candidate contains the new base and all applicable gates rerun.

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

This exception may not bypass failed CI, stale-base detection, unresolved review threads, production certification, secret-leak gates, or explicit deployment authorization.

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
2. The candidate contains the exact current target-base SHA.
3. Required CI for the changed scope is green at the current head.
4. Promotion authority exists at the current exact head through either:
   - at least one non-author, non-bot `APPROVED` review from a collaborator with GitHub write, maintain, or admin permission, anchored to that head; or
   - the LBFL permanent solo-maintainer exact-head authority described above.
5. No unresolved inline review thread remains.
6. Security-sensitive changes have zero secret/artifact/log leakage.
7. Production-facing changes have the applicable browser, accessibility, deployment-identity and Worker-health evidence.
8. Certification does not itself authorize merge; a separate explicit merge decision is required.

Comment-only reviews do not dismiss an earlier approval. A later decisive state—`CHANGES_REQUESTED` or `DISMISSED`—does. Draft PRs may collect evidence but the governance summary must not pass.

## Trusted-policy boundary

The executable policy uses `pull_request_target`, so GitHub loads it from the repository's trusted default branch (`main`). That default-branch policy governs pull requests whose base is either `main` or `staging`. The workflow evaluates candidate metadata through GitHub APIs and never checks out or executes candidate-controlled files. Review events likewise use the workflow already present on the trusted default branch.

PR #246 is the one-time bootstrap that first introduces this trusted workflow. Because no trusted copy exists on its base yet, #246 cannot use its own candidate-authored workflow run as independent proof of policy integrity. Its eventual merge therefore requires all of the following as an explicit bootstrap decision: ordinary exact-head CI, manual exact-head diff review, zero unresolved findings, authenticated base/head identity, and separate owner merge authorization. After bootstrap, no candidate workflow run may substitute for the trusted default-branch gate.

## Repository ruleset requirements

GitHub repository settings for both `main` and `staging` must enforce controls compatible with the permanent solo-maintainer model:

- require a pull request before merging;
- require the exact-head `LBFL Trusted Release Governance` commit status;
- require required status checks to pass;
- require branches to be up to date before merging (strict mode);
- require conversation resolution before merging;
- block force pushes;
- block branch deletion;
- do not require an unavailable second human reviewer as a permanent prerequisite;
- rely on the trusted executable gate for either qualified independent review or SHA-bound solo-maintainer authority;
- do not permit undocumented bypasses.

The trusted workflow runs from the repository default branch (`main`) and governs PRs targeting either `main` or `staging`; it evaluates candidate metadata without executing candidate code and publishes `LBFL Trusted Release Governance` directly on the exact PR-head SHA. Strict up-to-date enforcement is also mandatory: a success attached to an unchanged head cannot invalidate itself merely because `main` or `staging` later advances. The server-side rule blocks that stale head until it contains the new base and the checks rerun.

GitHub exposes review-thread resolution as a webhook event but not as a GitHub Actions workflow trigger. Therefore server-side **require conversation resolution** is the authoritative fail-closed control when a thread is reopened after a status has passed. The trusted workflow still counts all paginated unresolved threads whenever it runs. If resolving the last thread leaves an earlier failure status in place, rerun the failed governance workflow at the unchanged head before promotion.

If a qualified independent reviewer becomes available, independent approval remains the preferred authority path. The executable gate supplements server-side rulesets; it is not a substitute for branch protection, status checks, or deployment certification.

## Solo-maintainer release sequence

For a solo-maintainer promotion:

1. authenticate the current target branch and candidate head;
2. confirm the candidate contains the current target-base SHA;
3. run all required exact-head CI and scope-specific certification;
4. ensure zero unresolved review threads;
5. record the permanent solo-maintainer exception marker in the PR body;
6. record `SOLO-MAINTAINER-APPROVAL: <current-head-SHA>` only after the exact head is known;
7. require the trusted Release Governance Gate to pass at that same head;
8. record a separate explicit merge authorization;
9. merge without force operations;
10. authenticate the resulting target-branch SHA;
11. run the required post-merge validation against that exact target SHA;
12. bind any website or Worker deployment to that target SHA through a separate authorized action;
13. run fresh production certification and rollback verification against the deployed target SHA.

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

## AI provider and Worker deployment control

The public production AI endpoint is `https://api.learningbiologyforlife.org` and must be owned by the dedicated `lbfl-socratic-ai` Worker. The browser contract is provider-independent; provider credentials remain server-side Worker secrets.

The active Socratic provider is OpenAI. The Worker must use the Responses API with strict Structured Outputs and `store: false`, and health must identify the active provider/model without exposing credentials.

A provider migration is a production Worker change even when the custom-domain mapping does not change. Therefore:

- normal PR synchronization must never deploy `lbfl-socratic-ai`;
- provider migration requires an explicit migration event/action;
- a direct provider credential/model/structured-output preflight must pass before Cloudflare mutation;
- `CLOUDFLARE_WORKER_SCRIPT` must resolve exactly to `lbfl-socratic-ai`;
- `api.learningbiologyforlife.org` must already belong to `lbfl-socratic-ai`, or a missing mapping may be repaired only to that Worker using known zone metadata;
- an unexpected hostname owner is a hard failure and must never be overwritten;
- production Worker code must be uploaded with `wrangler versions upload` and promoted with `wrangler versions deploy`; plain `wrangler deploy` is prohibited for this remotely managed custom-domain Worker because it can overwrite trigger configuration;
- the previous production Worker version ID must be captured before promotion;
- failed provider/version/CORS/Socratic verification must automatically redeploy the previous Worker version;
- final custom-domain ownership must be rechecked after success or rollback;
- API keys must never appear in source, workflow inputs, logs, artifacts, summaries, or frontend code.

The legacy `/api/gemini` route may remain temporarily as a compatibility alias, but its name does not define or authorize the active provider. New clients use `/api/socratic`.

## Production certification

Production certification must be dispatched from `main` with a full `expected_main_sha`. It must prove:

- current `main` identity is unchanged before and after the run;
- canonical Cloudflare Pages production maps to that SHA;
- canonical production content equals the exact deployment, allowing only the narrowly recognized fail-closed Cloudflare JSD normalization;
- the public `lbfl-socratic-ai` Worker metadata and live version match the target SHA;
- Worker health returns HTTP 200 and production identity;
- browser/Axe/consent/reduced-motion/Save-Data gates pass where required; and
- the certification credential is host-isolated and absent from evidence artifacts and summaries.

For the AI Worker, production certification additionally proves active provider/model metadata, exact Worker-version header/body equality, canonical-origin CORS, and a genuine non-fallback Socratic response.

## Emergency rule

If an urgent P0 production repair must bypass normal sequencing, record in the PR/issue:

- incident reason;
- exact pre-change production SHA;
- exact repair SHA;
- exact-head solo-maintainer authorization or qualified independent approval;
- rollback command/commit;
- post-merge production certification result; and
- follow-up review to close any temporary governance exception.

Emergency handling never permits secret exposure, force-pushes, stale-head certification, or undocumented production mutation.
