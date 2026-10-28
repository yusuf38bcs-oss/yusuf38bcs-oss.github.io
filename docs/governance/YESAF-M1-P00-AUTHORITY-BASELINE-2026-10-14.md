# YESAF M1 / P00 — Production Authority Baseline v2

**Observed:** 14 October 2026. Provider times below are UTC. **Decision:** P00 PARTIAL; PRODUCTION_CUTOVER HOLD.

This is an authenticated observation register, **not** an authorization to mutate production or proof of single-writer enforcement. All live values must be rechecked before cutover.

## Identity and production dependency register

| Resource | Provider observation | State |
|---|---|---|
| GitHub Web | `yusuf38bcs-oss/yusuf38bcs-oss.github.io`, `main@eb4e33c414f73e490a75f52406536998c2e3a9b3` | Exact source SHA matched GitHub |
| Socratic API hostname | `api.learningbiologyforlife.org` → `lbfl-socratic-ai` | Cloudflare domain enabled |
| Socratic active deploy | `65d0ed93-99a7-4b0e-ac70-c8fab9ee1922`, 2026-10-14T07:05:49Z | Active version below at 100% |
| Socratic version | `dc2d049b-4334-4e06-9bcf-b9ac3dd031f2` | Source annotation `LBFL exact-main eb4e33c414f73e490a75f52406536998c2e3a9b3`; **annotation is not a signed provenance attestation** |
| Previous Socratic version | `6bc95dfc-f822-476e-a024-aefeb68fcbee` | Historical candidate only; no rehearsed rollback |
| Orchestrator active deploy | `6c526723-daf1-41f3-b596-e894dc2a54dc`, 2026-10-14T02:25:44Z | Active version below at 100% |
| Orchestrator version | `2469d1a6-9a63-454f-a0ab-b1e09a990abd` | Source annotation `main@7f4373b882235c23c4e83000be28227d8efc9430`; uncorrelated to authenticated run logs |
| Cloudflare Pages | `yusuf38bcs-oss-github-io`, production branch `main` | GitHub integration enabled |
| Canonical Pages production | `9bbedc41-6f70-489d-8d37-ddab8bc3a0fa` | Github push of `eb4e33c...`, successful |
| Other Pages production writes | `c60445d4-b1dc-4945-9789-b99dccd76c78`, `d59b59fd-51f3-4f7d-a9cf-3e36a3ebcf25` | Both **ad_hoc** and successful, same SHA; actor/writer unresolved |
| Pages custom domains | `learningbiologyforlife.org` and `staging.learningbiologyforlife.org` | Both active on **same Pages project**; this does not prove staging isolation |

**Original sources:** authenticated GitHub repo commit, exact main workflow and PRs; authenticated Cloudflare API reads of Workers deployments/versions/domains and Pages project/deployments/domains. No secret contents accessed.

## Verified code-policy gaps

1. Current Web `main` Worker production workflow executes only **static** preflight, yet permits `main` push/dispatch production deployment. This is an actionable boundary violation while independent live preflight is absent.
2. Production deployment on `main` tries up to four Cloudflare secret identifiers. Least-privilege **credential scope and single designated deployment credential are not proved**.
3. Workflow concurrency uses a per-SHA group: distinct SHAs can deploy in parallel. This fails the desired single serial production promotion invariant.
4. <https://github.com/yusuf38bcs-oss/yusuf38bcs-oss.github.io/pull/480> proposes deploy disable and designated-token/lock fixes; it is **Draft, unmerged** and therefore not an effective main-branch control.
5. <https://github.com/yusuf38bcs-oss/yusuf38bcs-oss.github.io/pull/479> adds static Worker readiness for every main PR; it is **unmerged** and not a proved mandatory required check.
6. Pages has both GitHub-driven and ad-hoc production publishing. A single source SHA does **not** prove single deployment authority.
7. Read-only Cloudflare queries returned no Workers Builds triggers for two named scripts, but alternate publish mechanisms, dashboard privileges, manual Wrangler, Pages and GitHub required rulesets remain **UNVERIFIED**.

## First executable assurance increment

- `.github/scripts/yesaf-production-authority-audit.mjs` checks that the Worker deploy workflow is disabled during static-only mode, or demands authenticated live preflight before active production deployment; rejects credential fallback, unprotected environment, missing deploy job and unsafe per-SHA concurrency.
- `.github/scripts/test-yesaf-production-authority-audit.mjs` provides ten adversarial positive/negative tests. Independent GitHub-hosted proof at `865ae870994f5d1dc8494a3d57f27794a8c7c132`: **10/10 PASS**.
- `.github/workflows/yesaf-production-authority-audit.yml` checks exact candidate SHA and runs those tests plus the static audit using `contents: read` and **no Cloudflare credentials or deployment rights**.
- The original `main@eb4e33c...` intentionally failed this audit; M1.B subsequently merged the protective workflow. On all subsequent heads, the gate must independently re-run and any FAIL must be investigated, not waived.
- A future static-gate PASS still outputs `production_cutover=HOLD`. It cannot certify live runtime, production writer exclusivity, rulesets or rollback.

## Dependency-ordered follow-up

**M1.A (this draft):** Independent exact-head code review, tests and baseline ledger. No production writes.

**M1.B:** DONE for the narrow protected Worker workflow path: PR #484 merged as `main@a4e926e8d99aeeb3b35c0d901af4a4924a0130e4`, deploy job `if: ${{ false }}`, designated token, serialized production runs. Live Worker version unchanged; wider writer audit remains OPEN.

**M1.C:** Reconcile PR #479 required-check enforcement, authenticated Worker preflight capability, scopes/expiration of designated Cloudflare deploy credential, `production` environment reviewers, and all manual/ad-hoc production writers.

**M1.D:** Authorize a separate controlled canary and parity/rollback rehearsal tied to exact SHA, active Worker UUID, Pages deployment ID and observability evidence.

**GO criterion:** exactly one enforceable production writer per service, independent reviewed release checks, current runtime identity proof, explicit action-bound owner authorization and rehearsed rollback. Otherwise **HOLD**.

## M1.A release reconciliation (14 Oct 2026)

- Protected `main` after M1.B: `a4e926e8d99aeeb3b35c0d901af4a4924a0130e4`.
- PR #483 reconciled using an exact two-parent merge, with the **effective diff limited to four files**: authority audit script, ten-test suite, GitHub Action, and this evidence document. No Worker application/configuration deploy behavior altered by M1.A.
- The GH PR base identity was explicitly refreshed to the same `main` branch after a stale-base webhook generated intentional exact-base CI failures. Those failures are evidence of fail-closed behavior, not an approved exception.
- Required-check rollout is **not yet in force**. Main ruleset currently requires `validate`, `Cloudflare Pages`, `LBFL Trusted Release Governance`, and `LBFL Worker Static Preflight`; introduce `YESAF M1 read-only authority gate` only **after** M1.A has merged, an exact current-main green check exists, and the ruleset edit is independently confirmed.
- M1.A audit PASS is a **static configuration assertion**, not permission to deploy the Socratic Worker or declare global single-writer success.

## M1.C — authenticated Pages writer attribution (14 Oct 2026)

The three production writes associated with M1.B's merge `a4e926e8d99aeeb3b35c0d901af4a4924a0130e4` are distinct:

| Deployment | Source | Evidence-bound attribution |
|---|---|---|
| `d742afa8-4759-4c63-a001-d20dfdee92b8` | Cloudflare GitHub-connected Pages `github:push` | Automatic Pages project integration |
| `36508de8-b35e-4d70-940f-710e20e0f438` | Cloudflare `ad_hoc`, 08:59:26Z | R101 Field Report parity workflow GitHub run `38538865302`: matching `wrangler pages deploy _site --branch main --commit-hash $TARGET_SHA`; successful deploy step |
| `602010ea-f4c7-404c-bea2-757afd814c40` | Cloudflare `ad_hoc`, 08:59:29Z | R91 Zooplankton parity workflow GitHub run `38538865389`: matching `wrangler pages deploy _site --branch main --commit-hash $TARGET_SHA`; successful deploy step |

Cloudflare **audit-log v2** independently records two successful `POST /accounts/.../pages/projects/yusuf38bcs-oss-github-io/deployments` at the corresponding times, actor context `api_token`, token name `LBFL GitHub Pages Production`, user-agent `wrangler/4.147.0`. GitHub workflow source and production job steps independently establish the matching R101 and R91 writers.

**Root cause:** Two specialised *certification* workflows still carry Cloudflare production credentials and actively publish to the shared Pages project on every `main` push. This duplicates the canonical GitHub-connected Pages writer and can move the canonical deployment even when all SHA annotations match. The evidence identifies the writers; it does not certify Pages as a single-writer system or authorize revoking tokens.

**M1.C remediation to prepare separately, no mutation authorized by M1.A:** decouple the R101 and R91 parity jobs from publication; consume an already-successful, exact-main, canonical Pages deployment in read-only mode; require deployed SHA and deployment UUID before DOM/browser tests; test missing/stale deployment, live channel mismatch, concurrent pushes, timeout, negative credentials; preserve independent rollback and verified live parity. Ensure no other Pages writers remain before enforcing exclusive production authority. Retain `PRODUCTION_CUTOVER=HOLD` until those checks and release governance pass.
