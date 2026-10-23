# YESAF E4 — Controlled R91/R101 Successor-Governance Migration

**2026-10-23. Scope:** engineering candidate, **not production or merge authorization**. The solo maintainer requested progression beyond PR #498's verified bridge to a controlled, testable successor-governance migration.

## Verified immutable-policy deadlock (not a missing approval label)

The *currently executed trusted base* versions of:
- `.github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml` (blob `1142d9c341f34d5926a5855cfc06c54a46a82d13`)
- `.github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml` (blob `e92f4f9bec9d4e2db51bcbeb65da958cfa3a1114`)

reject any PR whose changed-file inventory touches **either their respective production-parity workflow or the guard itself**. Both the retirement workflow files and self-guard files are in their own protected path allowlists. Source-retirement PR #497 necessarily modifies precisely those protected publisher files; so its current guard failures are **substantive expected denials**, not a request to add an approval label. The familiar solo-maintainer marker controls promotion authority in the separately trusted governance checks; it cannot change what the predecessor immutability checks enforce.

## Implemented: independently checkable retirement proposal

The pure `yesaf-e4-successor-migration.mjs` evaluator validates that:
1. The **full read-only E4 bridge** (PR #498) first proves exactly nine publishers administratively disabled and no requested, queued, pending, waiting or in-progress run under those nine workflow IDs, while both PR #496 and #497 are still Draft, unmerged, and pinned to main `3164d2537b4f19381c52bbfb5c9e1b7ee7d15846`.
2. The **two files** proposed by PR #497 are *exact* pre-reviewed Git blobs: Zooplankton `305b555b153c30719fedcc88164947a2c85fe5f9`; Field Report `9c5facafde56309951db4e768f7040582c0aa96c`; both are nonpublishing read-only retirement notices.
3. Both original predecessor guard identities remain immutable, and old predecessor guard denial is reported accurately rather than overwritten.
4. A fake production release, claimed guard exception, changed guard, forged SHA, altered YAML, active legacy workflow or surprise PR file **fails closed**.

The only positive verdict is `CONTROLLED_SUCCESSOR_MIGRATION_CANDIDATE_VERIFIED` **with** `eligible_for_merge=false`, `authorized_guard_exception=false`, and `production_release=HOLD`. The evaluator does not post statuses, dispatch workflows, modify GitHub settings, run Wrangler or access production secrets. This candidate is testable but **does not solve the one-time base-policy deadlock**.

## Required controlled migration, not an unauthorized bypass

A safe permanent retirement requires a separately approved and **technically independently attested one-time governance policy transition** that authorizes replacing the protected workflow/guard under a strictly enumerated exact SHA. Under the present predecessor checks, there is *no ordinary PR that both changes one of these protected files and passes the predecessor guard*; treating the red check as green would be misleading. Do not merge existing #497 as-is or disable the old guard as an unreviewed workaround.

Prior to any owner-approved control-plane transition:
- Preserve active `LBFL-main-highest-protection` ruleset, the five required exact-head contexts, zero bypass actors and zero unresolved review threads.
- Obtain an exact-main, immutable SHA-bound attestation of all nine disabled publisher workflows, no live publisher runs, and the complete alternative-worker/token inventory; recheck immediately before and after any protected-main change.
- Prove that the replacement enforces R91/R101 content and scientific/certification immutability for unrelated PRs while only the **exact two reviewed retirement blobs** may be treated as retired. No wildcard guard relaxation.
- Obtain a separately recorded owner authorization identifying the one-time **predecessor policy exception**, actual GitHub control-plane action required, approver, exact target SHA, rollback and scope. A general request to progress an architecture does not silently authorize overriding the predecessor guard.
- Verify independently that the alternative attestation has equivalent or stronger trust/provenance; only after this may the old guard be superseded through a documented authorized transition. If the platform cannot carry this out while enforcing the active policy, remain HOLD and make the incompatibility explicit rather than silently treating a failed guard as success.

## Dependency-safe sequence

**Read-only prep:** PR #498 bridge → this exact two-file #497 proposal attestation → nine disabled state live certificate → inspect remaining Cloudflare/GitHub Pages/Worker writer paths and least-privilege credentials → new successor governance policy tests. Then **separately owner-authorized control-plane migration** at its exact HEAD. Only after the migration is proven can PR #497's two sources and PR #496's six sources be retired permanently, with first-main-push containment, new five-status validation and rollback checkpoint after each approved change. Do not infer a merge order from PR numbers.

**Final YESAF E7 GO still requires:** verified environment protections under the established solo-maintainer model; exact current Pages deployment ID/SHA, Worker version and provenance, custom domain DNS/TLS and canonical health, independently verifiable rollback, and separate production promotion authorization. Cloudflare preview success is not production GO.

**No unauthorized mutations:** do not merge, deploy production, dispatch a writer, change secrets/environments/rulesets, force a workflow check, or claim predecessor guard PASS based on these test fixtures.
