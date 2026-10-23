# YESAF E4 — Exact-HEAD Read-Only Successor Bridge

**Design state:** isolated PR #498 Ready for Technical Review; not approved for merge or production release. **Authorization:** on 2026-10-23 the owner authorized isolated implementation, offline negative tests, exact-head evidence, and subsequently authorized pushing this isolated branch and creating a Draft PR, including *automatic nonproduction Cloudflare preview deployment* if triggered. **Production deployment, merges, manual workflow dispatches, secrets, environments and rulesets MUST NOT be changed.**

## Decision: TWO distinct release phases (avoid #496/#497 circular deadlock)

1. **Interim administrative quarantine:** Verified `disabled_manually` in the GitHub Actions registry for all eight Practical publishers **and** `.github/workflows/jekyll-gh-pages.yml`, with no requested/queued/running/waiting/pending workflow run belonging to any of these nine registrations. Do not conflate source `on: push: main` with execution; runtime disablement and source code are separate evidence. Historical queued runs `26596572982` and `37655524953` are other workflow IDs and cannot be treated as live publishing activity without matching a publisher.
2. **#496 separate six-file retirement:** the six non-guarded replacement workflow files are pinned by Git blob identity, statically nonpublishing and match the exact six-file changed-file allowlist. After runtime quarantine and all normal protected-main checks, #496 becomes a **candidate for a later separately authorized merge**. No checks or policy are waived. Re-verify disabled state immediately before and after any approved protected-main update. The proof is invalid after a main SHA, file blob, PR head or registry state changes.
3. **#497 remains explicitly blocked:** the trusted R91 and R101 `pull_request_target` successor checks presently forbid modifications or renames of their respective `*-production-parity.yml` files. Since they also guard their own guard files, the present policy admits no ordinary PR-based source retirement. **Do not merge #497 as-is; do not change a guard, ruleset, status or fail condition as a workaround.** Retain both legacy workflows disabled as interim containment, not permanent source retirement. A separately owner-authorized and technically reviewed governance migration is needed before final source retirement.
4. **Full architecture GO remains blocked:** this bridge is deliberately *not* an independent trusted status writer and cannot authorize a merge. The live current-main Worker deploy job has `if: false` but still needs whole-system writer inventory. `github-pages` environment review, scoped deployment identity, rollback, five required checks, domain/TLS verification and post-cutover certification are separate gates.

## Pinned evidence

- Protected main: `3164d2537b4f19381c52bbfb5c9e1b7ee7d15846`.
- PR #496 exact head: `18c8527fdc17b92cb2a2da43f4ccf66c8dc09191`, Draft, six files.
- PR #497 exact head: `1040b87c747d37b09c6602e3c72b9c3c40c23927`, Draft, two guarded files.
- R91 guard blob: `1142d9c341f34d5926a5855cfc06c54a46a82d13`.
- R101 guard blob: `e92f4f9bec9d4e2db51bcbeb65da958cfa3a1114`.
- R91 legacy source blob: `5b113398e59bc0dde9dfba6827aa4b88ccd6bed4`.
- R101 legacy source blob: `3919de0d39b2e316cd8511e283b6d15fcf5197dd`.
- GitHub Pages Jekyll legacy publisher source blob: `2a2871af738167cd9c2a196c5ffc599fc41a5ad2`.
- Six #496 retirement workflow blob IDs are explicitly pinned in the JS policy. A different blob requires a newly approved/reviewed policy version and re-run of all tests.

## Implementation

`./.github/scripts/yesaf-e4-bridge.mjs` uses Node 22+ standard library and is compatible with Node 24. It is **GET-only** (`GitHub REST GET`; no GitHub write endpoints, no secrets printed, no dispatch). It collects exact protected-main, both Draft PRs, every registered workflow (paginated), all 9 runtime states, pinned candidate and guard blobs, and all requested/requested/queued/in-progress/waiting/pending workflow runs (paginated). Any missing, duplicated, stale or inconsistent element is a failure. Any legacy publisher with an active/queued/waiting/pending run is a failure. Snapshot evaluation never executes candidate YAML.

Run offline negative tests:

```powershell
node --test .github/scripts/test-yesaf-e4-bridge.mjs
```

Read current live state **only when needed**, from a clean authenticated terminal. Do not display, paste, save or send `GH_TOKEN` or `GITHUB_TOKEN` values:

```powershell
$env:GH_TOKEN = (gh auth token)
try {
    node .github/scripts/yesaf-e4-bridge.mjs --live
} finally {
    Remove-Item Env:\GH_TOKEN -ErrorAction SilentlyContinue
}
```

A successful execution prints `INTERIM_QUARANTINE_EVIDENCE_PASS` **together with** `production_release: HOLD` and `eligible_for_merge: false`. Those fields are intentional. An offline fixture PASS is **not** live verification. A live PASS is point-in-time E4 evidence **only for nine enumerated workflows**, not whole-system single-writer certification.

## Offline test coverage

46 `node:test` cases: valid baselines and fail-closed adversarial mutations including wrong repository, stale main/PR refs, changed-file drift, R91/R101 protected file touches, enabled workflow, missing or duplicate registry data, requested/queued/in-progress/waiting/pending publishers, guard/source blob changes, writer secrets/commands/triggers in retirement notices, and false declarations of guard migration success.

## Explicit preview-only authorization and side effects

Cloudflare Pages project `yusuf38bcs-oss-github-io` has `preview_deployment_setting=all` (read-only provider metadata confirmed October 23). A branch push or new Draft PR may automatically initiate a **nonproduction Cloudflare preview deployment**. The owner subsequently explicitly authorized the branch push, Draft PR, and that possible automatic preview side effect. This DOES NOT grant production deployment authority, workflow dispatch, merge, override of required statuses, credential changes, environment/ruleset edits, or permission elevation. The preview must be monitored for unexpected production writes; if any are observed, STOP and return HOLD. PR #498 was separately owner-authorized for promotion to Ready for Technical Review at its exact SHA. This DOES NOT grant merge or production promotion authority; any new head SHA requires a fresh exact-head marker and review.

## Acceptance / stop criteria

- **Implementer PASS (offline):** exact three-file isolated candidate; 46/46 positive and negative tests successful; no modified protected policy or production workflow source.
- **Interim E4 live candidate PASS:** every item described in live snapshot is true at the same main/PR SHAs; zero publisher runs active; disabled state rechecked for intended first main push.
- **Successor migration unresolved:** R91/R101 guarded source may not be modified under current guard. Independently review a narrowly scoped owner-approved policy transition before permanent source retirement. This is not a reason to bypass the guard.
- **Release NO-GO:** no source merge, Cloudflare/GitHub Pages/Worker deployment, status override, reviewer bypass, ruleset mutation or token scope change is authorized here. The five required status contexts, zero unresolved threads, independent technical certification, first-main-push proof and rollback are mandatory later.

**Authorized transport:** owner has now explicitly permitted pushing this isolated bridge branch and creating a Draft PR, with only automatic nonproduction preview side effects. Any subsequent release, protected-main update or permission change still requires separate authorization and the corresponding exact-head gates.

## Owner-safe local staging

For a local Git branch based on the frozen main, refer to `PREPARE_LOCAL_BRANCH_POWERSHELL.md` in the downloadable bundle. Keep the branch local. A remote PR is intentionally not opened under the no-deployment constraint.

## 2026-10-23 security review: three verified corrections

Codex review on PR #498 identified three genuine defects and they are addressed in this exact branch revision:

- **P1 — requested status:** a legacy writer `requested` run is now rejected, in collection and evaluation.
- **P1 — mutable-state race:** after all data reads, the collector fetches main, PR #496/#497 identities and timestamps, all nine workflow states/IDs/timestamps, and the five run-state inventories again; any observed discrepancy fails closed. This is a bounded point-in-time consistency check, not an atomic GitHub snapshot or final production attestation.
- **P2 — blob-content binding:** all six retirement YAML contents must match their pinned, Git-formatted blob SHA-1 (`blob <UTF8 byte length>\0` + bytes). Offline fixtures use exact PR #496 source contents, not synthetic documents with asserted hashes.

All changes are confined to `.github/scripts/yesaf-e4-bridge.mjs`, `.github/scripts/test-yesaf-e4-bridge.mjs`, and this document; protected workflow/guard files are unchanged. All revised tests passed locally. Any PR metadata marker bound to an older candidate commit must be updated only after the new exact HEAD is verified. The RELEASE HOLD remains.
