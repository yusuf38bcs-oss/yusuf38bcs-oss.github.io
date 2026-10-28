# YESAF E4 — Predecessor successor-guard v2 controlled migration candidate

**Scope:** isolated successor-guard code preparation and offline tests, not protected-main merge or production rollout. The predecessor R91/R101 `pull_request_target` checks on current protected main intentionally deny edits to **their own guard workflow files and their publisher workflow files**. This branch cannot be merged as a normal green predecessor-guard change. Never call a failed predecessor check SUCCESS.

## Proposed stronger durable successor, after a specifically approved one-time policy transition

Candidate replacements:
- `.github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml`
- `.github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml`
- Shared *trusted-main-only* `.github/scripts/yesaf-e4-successor-v2-policy.mjs`
- Offline adversarial suite `.github/scripts/test-yesaf-e4-successor-v2-policy.mjs`

The replacement uses the same trusted `pull_request_target` workflow origin but checks out **only** `github.sha` from default protected main; it NEVER executes candidate branch code. GitHub's default-branch `pull_request_target` behavior must remain true during bootstrap. It has `actions: read`, `contents: read`, and `pull-requests: read` only, no permissions to publish releases or write commit statuses.

For unrelated PRs, both scientific content-integrity and guard self-immutability remain enforced. When a PR proposes changing the retired R91/R101 publisher path, the successor guard allows only the **exact reviewed Git blob** for that publisher (`305b555b153c30719fedcc88164947a2c85fe5f9` for R91 or `9c5facafde56309951db4e768f7040582c0aa96c` for R101), as a `modified` file (not a deletion or rename). It requires owner-origin identity, Ready PR, single exact-head solo-exception+approval markers, no other protected R91/R101 science/certification/shared-script/guard change, all ten tracked legacy workflows `disabled_manually`, and no requested, queued, in-progress, waiting or pending run from any of those ten workflow IDs. Mutable PR/main, workflow state, and run inventories are observed twice; drift fails closed. No production write secret or release authority exists in the new guard.

**Key caveat:** This guard v2 code is tested and staged on a candidate branch but **cannot become the trusted running guard until protected main is changed**. The old trusted guard will report an expected failure for this very candidate because its guard file is self-protected. An explicit owner-authorized governance exception, replacement-policy equivalence review, exact PR-head checks and rollback must be agreed **separately before any merge**. Merely passing an offline candidate guard suite or the five normally required contexts is *not* approval to ignore the predecessor's explicit denial.

## Controlled-transition preflight requirements

1. Review the exact legacy guard / replacement guard diffs, the blob-pinned retirement notices, the new shared script and the complete negative test report. Preserve current main ruleset and five trusted required contexts unchanged.
2. Authenticate the owner exception under the existing permanent solo-maintainer model, with the one-time predecessor-policy exception separately acknowledged for this exact migration PR. Reconfirm no unresolved PR threads, protected current base, credible independent static reviewer and no forged status.
3. Confirm ten tracked workflow disablements, no live publishing run, and Cloudflare Pages production UUID remains unchanged. Remove or contain the legacy repository-level Cloudflare *write* credential only after separately approved scope migration and rollback proof; no access or secret change is authorized by this proposal.
4. Only after one-time owner approval and review of possible policy-exception mechanisms may the project migrate the actual base guard. If the platform cannot perform the transition without bypassing a configured required rule, STOP; do not exploit absence of the predecessor guard in the five required contexts as a loophole.
5. Re-run newly installed *trusted-main* v2 guard from its protected revision against PR #497 source-retirement candidate, then revalidate six independent #496 retirements, exact release checks and post-merge provider identity. No merge, deploy or manual dispatch is authorized now.

## Evidence

This candidate's Node.js positive/negative tests verify exact retirement SHA, solo approval identity, all ten tracked workflow disabled states, five run states, protected scientific/guard paths, and TOCTOU. A PASS is **candidate code correctness only**; it is not a production attestation or release authority.

## Verified R91/R101 migration conflict at current Draft head

**Observation:** `#499@6cb7966336ca286a04b25e235eb3ed608e0631a6` is still Draft and has never acquired release authority.

- R91 certification run `40746750948`, failed in the protected *Authenticate exact head, live base, and R91 scope* step. The R91 validator (immutable source) rejects mutations to protected enforcement artifacts and requires the existing push-to-main parity, `push.before` provenance, pinned Wrangler lock, isolated npm installation and browser provenance. These requirements must not be removed merely to turn CI green.
- R101 certification run `40746748856`, failed in the equivalent protected R101 preservation/scope step. Its validator rejects changes to the R101 parity and successor-guard files and requires the original push-to-main provenance, resolver, exact Pages URL and pinned Wrangler lock.
- Other candidate CI passing cannot overrule those red checks. Both Draft trusted status contexts remain failure; keep production HOLD.
- The replacement policy now inventories **ten** registrations: eight Practical production-parity workflows, Museum certification workflow and GitHub Pages publisher. The corresponding test fixture imports `TEN_WORKFLOWS`; a ten-registration census is still NOT proof that no direct Cloudflare or other out-of-band production writer exists.
- A safe transition requires an independently reviewed, owner-authorized one-time *protected policy migration procedure*. Existing required checks must remain effective or the transition stops. No automatic bypass, unconditional guard disable, token/permission change, merge or production dispatch is justified by this handoff.

**Next acceptance evidence (not yet established):** protected successor policy equivalence review; authenticated complete live workflow inventory and write-time lease; explicit one-time migration authority; source-level and actual read-only adversarial tests; a safe rollback path; fresh exact-head statuses on the resulting new protected main.
