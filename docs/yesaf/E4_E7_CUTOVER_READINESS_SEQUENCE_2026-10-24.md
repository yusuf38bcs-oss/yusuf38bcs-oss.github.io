# YESAF E4/E7 — Controlled single-writer release plan (evidence-bound)

Baseline protected main: `3164d2537b4f19381c52bbfb5c9e1b7ee7d15846`. This document is **review-only engineering evidence**; no merge, deploy, privileged workflow dispatch, secret change, GitHub ruleset/environment mutation or DNS cutover is authorized by committing it.

## Execution topology

- Canonical publication: Cloudflare Pages project `yusuf38bcs-oss-github-io`, production branch `main`. Git-linked automatic production deployments presently disabled. Existing prod deployed SHA `3164d2537b4f19381c52bbfb5c9e1b7ee7d15846`, deployment ID `f611cf1d-9a84-4b27-8317-d23446c99fcd`.
- GitHub Pages: `pages.learningbiologyforlife.org` independent HTTPS cold fallback; user verified custom domain, `https_enforced=true`, status `built`, strict TLS exit=0, HTTP→HTTPS final=200. Existing GitHub Pages publisher workflow administratively disabled. Cold standby is not continuous synchronization or automated failover.
- Protected main requires five exact SHA contexts: `validate`, `Cloudflare Pages`, `LBFL Trusted Release Governance`, `LBFL Worker Static Preflight`, `YESAF M1 Trusted Static Authority`, with zero bypass actors.
- GitHub Actions registry has 108 workflows, but only 75 YAML paths exist at protected-main tree. Historical/orphan workflow records must not be presumed to be active code or safely inert without cross-checking their possible entry points.

## Newly discovered critical containment defect and this candidate

The **active** `.github/workflows/conv04f-zoology-practical-museum-certification.yml` has an existing `pull_request` preview job that consumes `CLOUDFLARE_PAGES_DEPLOY_TOKEN` while checking out/building candidate content, and executes `wrangler pages deploy`. This is a separate credentialed publisher outside the nine disabled legacy Practical parity workflows. In this candidate only, remove that deployment job entirely while **preserving** existing read-only Museum academic/Jekyll/browser certification, manual `expected_main_sha` authenticated certification and artifacts. It must not deploy any Cloudflare Pages preview from inside Museum certification. Nonproduction preview, if needed, requires its own later reviewed credential-isolated preview authority.

The exact museum script/academic contracts, R91/R101 protected files and required five protected ruleset contexts are left unchanged. This migration candidate is **not** permission to merge.

## Release dependency sequence — mandatory fail-closed gates

1. **Museum extra writer containment**: inspect this candidate exact-head patch; run full Node 24 negative fixtures, YAML and exact-head academic/browser certification. Confirm it removes the active Museum `CLOUDFLARE_PAGES_DEPLOY_TOKEN` writer path. Check the GitHub workflow registry and other live writer routes again. Never call local static tests runtime certification.
2. **Credential and cross-app authority**: inventory all repository, environment, organization and Cloudflare write-capable credentials/consumers. PR #493 removes read-only certifier fallbacks to write tokens but remains Draft. Need owner-scoped credential isolation and independent effective permission validation before the first protected-main merge. Public source cannot prove token absence or Cloudflare role scopes.
3. **R91/R101 predecessor policy**: PR #499 guard-v2 attempts to change both immutable predecessor guards and their protected publisher paths; existing trusted-main predecessor guards intentionally reject the change. A normal green-path merge is impossible under that predecessor policy. Never suppress or forge failure. Require a separate, exact-HEAD, owner-authorized documented *one-time policy transition* with independently reviewed replacement, tested rollback, and named platform mechanism before modifying protected guard paths. If no legitimate, auditable policy-transition mechanism exists without forbidden bypass, STOP and escalate. No one-time exception is granted by this document.
4. **Mutable workflow state at merge time**: PR #499's remaining P1 cannot be eliminated by a one-time PR status. GitHub Actions administrative workflow enablement/run state may change after any PR check. Depend on an enforceable production credential/runtime boundary **and** a fresh bounded pre-merge read-only snapshot, not just green `pull_request_target` checks. Implement and certify invariant *at each privileged deploy call* or production environment approval; a polling check alone is not atomic. Keep review thread unresolved until verified.
5. **Legacy source retirement**: nine known parity/GitHub Pages publishers currently `disabled_manually`. PR #496 six retired notices cannot merge independently of R91/R101 and complete credential containment. PR #497 source changes are Draft; PR #499 is Draft; #494 is Ready but its manual Github Pages publication must not be confused with the canonical Cloudflare Pages writer. No merge order may cause the first-main-push side effects. Recheck five required exact-head contexts/zero unresolved threads before each release step.
6. **Release and rollback certification**: after an explicit owner GO for each step, verify first-main-push run IDs for all production-capable publishers and their registered states, Cloudflare Pages immutable deployment ID/SHA, Worker deployed UUID/traffic percentage, canonical apex/www DNS/TLS/health, independent GitHub Pages fallback freshness, manual release approval, rapid rollback and recovery RTO/RPO. Only then sign YESAF E4/E7. A successful GitHub Pages HTTPS probe is not a live failover drill.

## No-change controls

- Never alter a protected branch ruleset, mark a failed trusted status as successful, self-approve security findings, or merge an expected-red guard without a separately documented and explicitly authorized platform governance mechanism.
- Do not enable GitHub Pages publisher or deploy it now; fallback is a manual emergency option.
- Do not trigger privileged workflows, rotate tokens, perform cache purges, modify Cloudflare DNS/Workers/Pages production or merge from this Draft.
- Maintain exact-head evidence and branch-name-specific regressions; hold if protected main advances.

**Current program disposition**: G1 HTTPS cold fallback PASS; Museum preview-writer repair candidate prepared; credential boundary HOLD; R91/R101 successor transition HOLD; #499 dynamic merge-time P1 OPEN; coordinated protected-main release **NO-GO**.
