# YESAF E4–E7 — Narrow protected-academic transition: evidence and HOLD

**Prepared:** 2026-10-25
**Immutable trusted base:** `3164d2537b4f19381c52bbfb5c9e1b7ee7d15846`
**Candidate parent:** #509, `38d655b557e6fab1b59011406fe8cd2c4d71d9b9`

## Root cause, confirmed by original live source and #508/#509 red job logs

Existing R81, R71, Museum, R91 and R101 subject validators embed retired
`*-production-parity.yml` paths as *protected academic evidence*. These were
correct protection invariants for the original Practical release programme.
However, YESAF M1.C requires removing legacy production write authority.

The issue is more than a simple changed-file allowlist:

- **R81 Appendages**: successor validator's `protected_artifacts` includes
  `PROD_WORKFLOW_REL`.
- **Museum F-09**: immutable successor artifacts include the old Museum parity workflow;
  candidate science task stops at protected-artifact scope.
- **R91 Zooplankton**: successor protected artifacts include both parity publisher AND
  guard, plus resolver/lock. Separate structural assertions currently require the old
  push-to-main guarded publisher, an unprivileged build, and pinned Wrangler details.
- **R101 Field Report**: successor protected artifacts include parity publisher and
  guard. Additional late structural assertions explicitly **require** the original
  push-to-main publisher, `resolve-cloudflare-targets.py`, Pages URL and Wrangler lock.
- Other subject validators must be inspected and individually mapped before a
  migration candidate may be treated as complete.

Therefore changing only the changed-file allowlist, or making the old validators skip,
would either still FAIL or silently weaken the trusted science/publishing boundary.

## Evidence-only repair implemented in this candidate

This PR adds a purely read-only academic custody witness. It pins:

1. The eight original subject validator Git blobs to protected main.
2. The eight proposed retirement workflow blobs (from #496/#499), one per subject.
3. The five-subject and Museum no-writer successor YAML blobs (#507/#500).
4. A set of negative fixtures that fail on changed validator, altered retirement
   source, missing successor, stale SHA, incomplete inventory or duplicate paths.
5. A strictly PR-scoped, `contents:read`, no-secrets, no-deploy GitHub Actions job.

A PASS means only that old science validators **have not been modified**, and
their proposed replacement writers are exactly the source blobs reviewed for this
candidate. It **does not** mean the old validators' downstream structural requirements
are satisfied. Existing red preservation checks remain red.

## Requirements for a future separately authorized controlled bootstrap

1. Owner-authorized, exact-SHA and path-bound scientific custody statement with
   all eight approved retirement Git blobs and independent proof that every subject
   browser/science assertion is still executed. Frozen historical PASS proof stays
   on the old HEAD.
2. Independent authenticated principal must approve the *specific* migration.
   An owner marker, an unrelated CI status, and an unprivileged PR job cannot act
   as independent authorization.
3. Make a **new science/publishing separation contract** in a separately reviewed
   isolated branch, preserving original teacher-approved specimen/course/corpus
   checks. Never retroactively weaken original validators or reuse their green status.
4. At deploy time use a credential-fenced *single* authorized publisher; before
   any write: exact protected main and manifest SHA, current environment approval,
   complete per-workflow-ID active-run census and disabled writer states, scoped
   credential identity/provenance, and independent fresh authorization. Any stale,
   missing or inconsistent input **halts without write**.
5. Full negative tests for race after PR green, workflow re-enable, active queued
   run, 1,000-result API cap, identity mismatch, SHA drift, hidden auto Git writer,
   emergency fallback and unsafe rollback.
6. Controlled cutover with cold rollback evidence for Cloudflare Pages UUID
   `f611cf1d-9a84-4b27-8317-d23446c99fcd` and Worker version
   `dc2d049b-4334-4e06-9bcf-b9ac3dd031f2`.
7. Verify all E1–E7 gates and required protected status contexts on the **new**
   exact release HEAD; only a distinct owner GO may authorize the coordinated
   protected-main merge and production promotion.

**NO MERGE / NO DEPLOY / NO DISPATCH / NO SECRET CHANGE / NO RULESET MUTATION.**

This document is not an instruction for GitHub to waive required checks. It
preserves the existing failed checks as authentic HOLD evidence.
