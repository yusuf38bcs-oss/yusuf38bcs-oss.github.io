# YESAF E4/E5 — Protected predecessor policy transition bridge

**29 October 2026. Owner-authorized code design; NOT a production or protected-main merge authorization.**

## Root issue and required migration

Legacy R91/R101 trusted predecessor guard workflows protect the old publisher YAMLs and their own workflow source bytes, while eight subject Ruby validators also require the old production-publisher structure. PR #520 intentionally changes only the eight publisher files to exact previously reviewed retirement blobs; the original checks therefore correctly fail and cannot be turned green by renaming or skipping their jobs.

**This bridge repairs a missing independent review mechanism** by adding a read-only trusted-main inspection path without editing the old guards, Ruby science validators, required five status contexts, secrets or ruleset. The bridge is a *predecessor transition component*, not a replacement for the final guarded bootstrap itself.

## Exact immutable evidence required

- Protected baseline `main@3164d2537b4f19381c52bbfb5c9e1b7ee7d15846`.
- Migration PR #520, exact head `ab762c7d9ab82f397e37244014753c913f4eb966`, open and based on that exact main.
- Original evidence run #40806678033, attempt 1, completed SUCCESS, authenticated Actions workflow identity and all nine named jobs SUCCESS, including all eight real Ruby and browser subject tests.
- Exact eight reviewed retirement Git blobs, original 33 other immutable protected file blobs, eight academic tree identities and exact complete 25-path PR diff. No other modified or renamed source.
- All API operations GET-only and all workflow permissions read-only. The `pull_request_target` path checks out and runs only authenticated protected-main code, never candidate head code, and emits no statuses or App release certificates.
- Missing/changed/ambiguous evidence, base drift or incomplete API returns fail closed.

## Explicit transition dependencies

1. Candidate-only unit CI for the bridge must pass without requiring an unrelated science/browser rerun.
2. Review this bridge's source independently; it is not trusted until separately approved and integrated under the *existing* five protected required checks. Any such integration advances main, so the baseline-bound inspection **must fail closed** until exact-head evidence is deliberately reconciled.
3. Following controlled bridge bootstrap, independently authorize a narrow upgrade of the original R91/R101 guards and eight inherited science-source contracts so that they recognize **only** the approved publisher retirement identities while retaining all original science assertions. Original red results must remain visible until that transition is genuinely executed.
4. Enforce E1 environment protection, E2 positive independent App-issued exact-run certificate, E4/E6 credential and complete active-writer fencing, E7 rollback and final action-bound GO separately. No production migration is implied by source success.

**Do not mark original predecessor FAIL as PASS. Do not merge #520 as-is, bypass required rulesets, deploy, re-enable writers, change credentials, modify Cloudflare/Google settings or fabricate a certificate. Current release = HOLD / NO-GO.**
