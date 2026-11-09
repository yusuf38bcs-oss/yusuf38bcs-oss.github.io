# YESAF E5 — Immutable-Guard Versus Policy-Amendment Contradiction
## Engineering Decision Record v1.1 | 29 October 2026 | REVIEW ONLY

**Decision:** `CONTRADICTION_CONFIRMED; NO EXECUTABLE AMENDMENT UNDER LITERAL_V1_ALL_PASS; E5=HOLD; PRODUCTION=HOLD_NO_GO`.

**Authority boundary:** This is an engineering design record, NOT a GitHub change, issuer certificate, owner integration authorization, status, or production GO. No deployment, merge, ruleset change or workflow dispatch is authorized by it.

## A. Verified, SHA-bound inputs

- Website historical protected main (GitHub PR base): `3164d2537b4f19381c52bbfb5c9e1b7ee7d15846`.
- PR #521 trusted-bridge Draft HEAD: `a15afa8eb537df973494f7888af85fd02eec52c8`.
- PR #520 eight-publisher retirement Draft HEAD: `ab762c7d9ab82f397e37244014753c913f4eb966`.
- PR #520 historical science/browser run: `40806678033`, all nine job conclusions `success`. Historical run provenance **does not transfer** automatically to a future HEAD.
- Original R91 guard: `.github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml`, original Git blob `1142d9c341f34d5926a5855cfc06c54a46a82d13`.
- Original R101 guard: `.github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml`, original Git blob `e92f4f9bec9d4e2db51bcbeb65da958cfa3a1114`.
- Both original guards use `pull_request_target`, enumerate all changed PR filenames (including rename sources), and fail if the guard YAML itself or corresponding publisher YAML changes.
- The R91 Ruby validator also demands `push-to-main`/Wrangler-era publisher properties; the R101 Ruby validator likewise asserts legacy producer source structure. These are **publication-infrastructure assertions mixed into academic validation**, not evidence that science content is incorrect.
- The #521 additive bridge explicitly returns `policyActivated:false`; it is not an authoritative replacement or an issued certificate.
- Both PRs still Draft, with `LBFL Trusted Release Governance` and `YESAF M1 Trusted Static Authority` exact-head statuses `failure` (read-only authenticated connector recheck).
- Issue #495 reports five strict required contexts: `validate`, `Cloudflare Pages`, `LBFL Trusted Release Governance`, `LBFL Worker Static Preflight`, `YESAF M1 Trusted Static Authority`; independent live confirmation of **all effective repository/organization rulesets and required workflow rules** is still required.

**Primary source:** https://github.com/yusuf38bcs-oss/yusuf38bcs-oss.github.io/pull/521 ; https://github.com/yusuf38bcs-oss/yusuf38bcs-oss.github.io/pull/520 ; https://github.com/yusuf38bcs-oss/yusuf38bcs-oss.github.io/actions/runs/40806678033 ; https://github.com/yusuf38bcs-oss/yusuf38bcs-oss.github.io/issues/495

## B. Formal impossibility proof for literal v1 obligations

Let `G91(P)` and `G101(P)` denote the trusted existing guards on PR `P`.

- `G91(P)=PASS` requires **no touched path** in its immutable set `S91`.
- `G101(P)=PASS` requires **no touched path** in its immutable set `S101`.
- The zooplankton publisher path belongs to `S91`; the R91 guard's own path also belongs to `S91`.
- The field-report publisher path belongs to `S101`; the R101 guard's own path also belongs to `S101`.
- The desired migration requires touching **both publisher paths**; the desired in-place policy amendment requires touching **both guard paths**.

Therefore `Migration(P) => G91(P)=FAIL and G101(P)=FAIL` under unchanged guard source. Likewise `InPlaceAmendment(P) => G91(P)=FAIL and G101(P)=FAIL`. If both original guards are required to PASS with no formally authorized supersession, **no such PR can satisfy the joint obligations**. An additive workflow cannot change this logical result.

This proof does not establish GitHub's merge blocking status by itself: GitHub ruleset-required contexts, other rulesets, and YESAF's own additional governance obligations are distinct and must be inspected. A non-required red check may be technically mergeable, but must not be quietly ignored in YESAF.

## C. Corrected protection model

Maintain two different records with different semantics:

1. `HISTORICAL_V1_EVIDENCE_REGISTER` — immutable snapshot of all original 41 protected blob identities, eight academic trees, original guard code, and historical science/browser run. **Never rewrite history, revoke a real previous failure, or relabel it PASS.**
2. `VERSIONED_CURRENT_POLICY_REGISTER` — new *prospective* trusted policy, with exact policy hash, effective-after protected-main SHA, explicit allowed amendment paths and approved replacement blobs, independent authenticated policy-transition decision, and independently verified negative cases. It may be activated **only through a previously authorized governance transition that satisfies the effective protection rules**.

The register must separate immutable academic *content and scientific claims* from changeable **control-plane/source infrastructure**. The eight old Ruby files mix both: do not treat a newly adjusted validator as byte-identical to its historical version. Any proposed v2 replacement needs an exact scope review and semantic regression matrix showing all preserved academic assertions, and fresh tests for changed source. An archived v1 test against a frozen legacy publisher is valid *historical evidence*, not a v2 candidate PASS.

### v2 state machine (DESIGN ONLY)

- `V1_FROZEN`: original guards and v1 results retain their recorded meaning.
- `POLICY_TRANSITION_PROPOSED`: candidate proposal only; no new authority.
- `POLICY_TRANSITION_CERTIFIED`: independent issuer authenticates owner approval, current head/base, exact changed policy-source list, proposed v2 policy hash, academic invariants, genuine current required checks, writer containment, and adverse cases. Still no production write.
- `V2_INSTALLED`: **only after a separately authorized protected-main integration through an executable and permitted protection path**; then trusted main executes v2 for later PRs. Do not mark this state merely because a local reviewer or PR-only workflow passes.
- `AUTHORIZED_SOURCE_MIGRATION`: independent current-v2 decision on a **newly authenticated candidate PR #520 exact head/base**. Migration-only, never production release.

**Nonnegotiable:** v2 supersession is prospective, never retroactive. No original failed run is relabeled success; no status or check issuer is forged. The same five GitHub required contexts, or formally changed requirements only after separate authorized governance action, remain binding.

## D. Genuine policy feasibility decision — two exhaustive cases

**Case 1: Existing guards are non-ruleset checks, and YESAF has an explicitly authorized, enforceable policy-amendment process.** A separately documented governance decision can replace specific historical *future acceptance obligations* with a versioned v2 trusted-main policy while preserving v1 failures as historical results. Before attempting any merge, prove the five required contexts and all effective rulesets can pass, no production writer would execute on `main` push, issuer independence, owner scope and authorized supersession are authenticated. The old v1 guard will still fail for protected paths until it is legitimately superseded; that failure must remain visible and cannot be described as PASS. If YESAF's constitution forbids this supersession, Case 1 is NOT available.

**Case 2: Original v1 R91/R101 PASS remains a mandatory unsupersedable condition.** Then literal source-level retirement/amendment is **IMPOSSIBLE UNDER CURRENT RULES**. Do not attempt more bootstrap PRs, bypass checks, or invent policy activation. Request a distinct owner-controlled decision to revise that rule, or retain old source immutable and pursue *operational* writer exclusion (workflow disabling, credential revocation, exclusive publisher identity, runtime fencing) as a **separate, limited fallback**. Operational exclusion alone does not prove source retirement or close E4 as presently defined.

## E. Minimum scope for an approved v2 candidate (NOT YET AUTHORIZED)

- Keep all v1 hashes and original 9/9 run frozen in the evidence ledger.
- Inventory every validator/source/gate with a publisher-dependent assertion, not just R91/R101; include Museum, all eight subject certifiers, and other predecessor-custody jobs.
- Produce an exact, exhaustive allowlist for *policy source edits*, separate from exact eight allowed retirement blobs. Include both original guard YAMLs **only if** the approved transition explicitly permits changing them. Evaluate whether the eight old Ruby validators must be versioned because they mix pedagogy with publisher checks. Any other changes FAIL.
- Verify v2 retains scientific/curricular/browser requirements. All eight academic trees and required science predicates remain protected; newly modified validators need proof of academic-logic parity, not an assertion of unchanged bytes.
- Require a deterministic machine-verifiable owner authorization representation: repository/PR identity, exact head/base, version, policy blob, permitted paths, issuer identity, intended action, expiry/replay controls. Existing exact-head solo PR-body marker is an identity/authorization policy input, **not a cryptographic signature**.
- Keep candidate PR code unprivileged and non-signing. Trusted-main evaluates inert PR contents; independent App or designated trusted issuer signs/attests exact decision only after all checks.
- Preserve required status contexts; never mint synthetic statuses under protected names. A distinct migration certificate/status is supplemental, not a replacement.
- On base advancement, compare relevant academic/science/browser source blobs and tree identities with historic run and current candidate; only reuse unchanged-input historical evidence without shifting its provenance; test invalidated inputs anew.

## F. Before ANY main integration: prove main-push containment

`.github/workflows/jekyll-gh-pages.yml` on historical main includes a push-main GitHub Pages deployment route (`pages: write`, `id-token: write`). Whether enabled currently is **unverified** by the available connector. Obtain a read-only enabled/disabled workflow census, branch/environment protections and producer/credential map, including any external Cloudflare writers. An otherwise source-only main merge is **not safe** without this proof. No production secrets, environments or rulesets are changed by this record.

## G. Narrow immediate engineering acceptance gate

A review-only feasibility record can change `CONTRADICTION_CONFIRMED` to `FEASIBLE_CONDITIONALLY` only with verified answers to ALL questions:

1. Are R91/R101/Museum and any publisher-coupled checks required by **effective GitHub rulesets, required workflows or another binding policy**? Show actual configuration, not assumption.
2. What exact valid governance instrument allows v1 historical immutable obligations to be *prospectively* superseded without declaring their failing results successful?
3. Which versioned policy source paths (including academic Ruby mixed-logic files) must change? Are the scientific assertions independently traceable and preserved?
4. Can an exact-head, non-Draft proposed amendment genuinely satisfy current five required contexts without changing the status producers or their source bindings?
5. Can protected main advance without a live publisher or any unauthorized production side effect?
6. Will an independent trusted issuer genuinely bind the future policy transition and subsequent separate migration decision to exact head/base/policy/owner approval?

If any answer is NO or unsupported, the result is `POLICY_TRANSITION_HOLD`. **No PR merge, production dispatch or source retirement should follow.**

## H. Next owner-level decision (not presumed)

The owner must explicitly decide whether to authorize replacing *specific prospective v1 immutable publisher-policy obligations* with an independently certified versioned v2 governance mechanism, **without altering historical evidence, academic science/browser requirements, current required-check results, or production-write constraints**. Merely authorizing source-preserving retirement does NOT implicitly authorize changing this higher-level governance rule. If owner declines, use Case 2 (HOLD or separate operational quarantine scope).

## I. Status

- Formal contradiction of literal v1 simultaneous-PASS: **PROVEN FROM SOURCE STRUCTURE**.
- Versioned policy design: **SPECIFIED; NOT INSTALLED; FEASIBILITY NOT YET ESTABLISHED**.
- Current trusted-migration activation and issuer certificate: **MISSING**.
- E5: **HOLD**. E4 source retirement: **NOT MERGED**. E2/E6/E7: **SEPARATE AND INCOMPLETE**. Production: **HOLD / NO-GO**.

## References

- GitHub original R91 guard: https://github.com/yusuf38bcs-oss/yusuf38bcs-oss.github.io/blob/3164d2537b4f19381c52bbfb5c9e1b7ee7d15846/.github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml
- GitHub original R101 guard: https://github.com/yusuf38bcs-oss/yusuf38bcs-oss.github.io/blob/3164d2537b4f19381c52bbfb5c9e1b7ee7d15846/.github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml
- GitHub official required checks: https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks
- GitHub official protected branches: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- GitHub recent Actions event protection: https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/