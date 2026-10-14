# YESAF M1.C-R2 — Canonical Pages Read-only Identity and Publisher Quarantine

**Prepared:** 2026-10-14. **Baseline:** main@45ce766eddb88582714aade5bd41b939c5e7db23.
**Status:** ISOLATED SHADOW IMPLEMENTATION; **PRODUCTION_CUTOVER=HOLD**.

## Problem and controlled safety intervention

The production Pages project yusuf38bcs-oss-github-io was published by:
1. Cloudflare's first-party GitHub:push integration (canonical intended production writer);
2. R101 Field Report `.github/workflows/conv04f-zoology-practical-field-report-production-parity.yml`;
3. R91 Zooplankton `.github/workflows/conv04f-zoology-practical-zooplankton-production-parity.yml`.

Provider audit logs and exact GitHub production job logs correlated the two ad_hoc writes to R101/R91. These two workflows are triggered on **every** push to main. Six other practical parity workflows have conditional production-write capabilities depending on changed paths. This does not prove that no extra direct API/dashboard publisher exists.

**2026-10-14 controlled GitHub Actions settings quarantine:**
- R101 Field Report Production Parity: manually DISABLED in Actions UI; reload displayed "This workflow was disabled manually" and "Enable workflow".
- R91 Zooplankton Production Parity: manually DISABLED in Actions UI; same independently reloaded visible state.
- Browser run: https://agent.tinyfish.ai/runs/802e02c4-aa9d-4858-9718-cb4dd411059a.
- This operation did **not** alter protected workflow source, branch rulesets, credentials, or Cloudflare settings. The source-level writer code still exists on main and workflows could be re-enabled. Check those two settings again before and immediately after any proposed main merge. **This is a temporary safety quarantine, not an immutable exclusive-writer certification.**
- No new main push or Worker/Pages deployment was triggered by the settings intervention.

## R2 contract

The independent checker `.github/scripts/yesaf-pages-readonly-verifier.mjs` uses exactly two Cloudflare GET requests: Pages project metadata and canonical deployment's matching UUID details.

Fail closed unless all conditions hold:
- Explicit full SHA matches current protected-main workflow SHA and runtime GitHub repository/ref.
- Exact Cloudflare account/project, GitHub repo owner/name, and production branch main.
- Project has an enabled GitHub-connected production source.
- Canonical production deployment and deployment-details UUID agree.
- Both sources show environment=production, successful deployment, GitHub github:push trigger, branch=main, same exact 40-character main SHA, clean source and canonical site alias.
- Provider GET is authenticated by a **separately scoped Pages READ-only** API token. No legacy deploy credential is reused or read. A missing token is a hard FAIL.
- Repo main has not moved between initial authentication and final evidence capture.

Evidence only: provider Pages deployment UUID, exact SHA, source and project, provider timestamp, public alias. Token is never written to evidence or echoed.

**Explicit nonclaims:** Not proof of an exclusive publisher, content SHA beacon, independent live-browser parity, custom-domain DNS, Worker version, rollback, or authorization to deploy. A green R2 fixture/check means production_cutover=HOLD.

## GitHub workflows and segregation

- pull_request: unprivileged offline tests ONLY. No Cloudflare credential and no write permission.
- workflow_dispatch from protected main with explicit exact SHA: authenticated provider GET-only evidence. Cannot run from feature branch.
- No producer uses Wrangler Pages publishing, Cloudflare Pages POST, environment deploy job, GitHub commit-status write, or repository protection exception.
- Provider evidence cannot be run from this Draft candidate; first source certification and separate authorized main bootstrap are required.

## Necessary staged migration

1. Close security gate M1.A #486 with exact-head authorization and no incidental Pages multi-publish (R91/R101 currently manually disabled; independently verify before merge). Preserve original four required contexts and use exact-head lease.
2. After M1.A merge, prove new main-controlled trusted static-status runtime against harmless Ready PR; require that status only after proof.
3. Certify this read-only verifier, provision a least-privilege CLOUDFLARE_PAGES_READ_TOKEN in GitHub Secrets through a separately governed operation, run from current main, preserve SHA+UUID evidence.
4. Implement **separately authorized** controlled migration of eight immutable F-09 parity workflows. Do NOT amend legacy validators, guards, or protected workflow set in an ordinary PR: all eight Ruby validators have touched.empty? prohibition; R91/R101 have additional trusted pull_request_target guards. Existing #489 quarantine fails these on purpose. Prior narrow seven-validator migration preflight is NOT a waiver or applicable eight-writer authority.
5. Replace legacy deploy-and-test jobs with read-only parity against **already-successful** Cloudflare canonical deployment, independent browser checks and rollback proof. Remove legacy credentials and any temporary GitHub UI disable exception when final successor policy is active.
6. Verify no direct API/dashboard/unaccounted manual writers; rehearse a controlled rollback; then and only then declare single_writer_certified=true in a separate trusted release authority, never in static R2 checker.

## Negative tests

Ad-hoc writer accepted as canonical; stale SHA/UUID; failed preview deployment; wrong GitHub repo/branch; wrong alias; dirty build; missing credential; unauthorized account; provider GET error; evidence credential leak; candidate dispatch to non-main; stale event SHA; and repeated evidence-file overwrite must all fail closed.

**GitHub Actions quarantine rollback:** A repository administrator can use each workflow's Actions page to choose "Enable workflow". This is recovery of the old publishing path, **not** normal release rollback, and must not happen without reassessing exclusive-writer controls.

**Decision:** R2 prepares read-only certification without weakening F-09 guards. M1.A merge, mandatory status, M1.C eight-writer retirement and all production cutovers remain separately gated.
