# YESAF E7 — Immutable achievement ledger and regression locks

**Recorded 2026-10-24.** This is a non-authorizing historical record attached to an additive Draft PR. A new source SHA requires new exact-head checks. No historical PASS or FAIL may be silently rewritten or promoted to release authority.

| SHA | GitHub proof | Meaning |
|---|---|---|
| `65a8215b4924437df66da541f483915fc325029b` | Run 40080292017 / run 40080291925 | Candidate tests passed, trusted promotion FAIL (Draft); final authority NOT certified. |
| Same SHA | Run 40080292097 | Event-scoped shadow audit PASS, unrelated to promotion authorization. |
| `fdedc8d09732fdbed9b4a1959d5844ca2d3bae5e` | Run 40077849106 | GitHub-bound reader token identities and allowed GET checks PASS; no no-Write policy proof. |
| `54ae60857441d7586ab15ea25316a30a5810515b` | Run 40082201205 | 10 known publishers disabled_manually, zero active runs at the observation window. |
| `6233ae517a227b4764a8464fa1cd34a9c27f0872` | Run 40082932647 | 75-workflow source scan: 26 heuristic indicators, 21 stronger patterns; not all are writers. |
| `4ff587721f2e79bd13cc0efa4202e3d5c7610bb3` | Run 40083968969 | 26-source expanded inventory success; 16 active registered workflows, verification scope not automatically publication. |
| `3164d2537b4f19381c52bbfb5c9e1b7ee7d15846` | protected main | Main baseline frozen at creation; all old protected security contracts apply. |

## Fail-closed invariants

1. Never treat static test PASS or shadow PASS as trusted promotion, independent approval, or deploy-time authorization.
2. No fallback from read-only Pages/Worker readers to legacy write-capable credentials; link with existing candidate PR #493, do not duplicate or merge around it.
3. Never re-enable R91/R101 or other publishers without owner-approved, credential-fenced deploy-time control and independently witnessed zero-active-run census.
4. Maintain the unresolved P1 on PR #499 until the TOCTOU condition is technically eliminated at *write time*, with exact HEAD and guard tests.
5. Never self-certify the `lbfl-release-attestor-yusuf38bcs` App as independent without authenticated principal, installation and key-control evidence.
6. Preserve the approved Cloudflare Pages production UUID and Worker version as rollback references, never claim rehearsal until actually tested.
7. Keep CSS design and Admission test workflow in separate isolated branches; release holds do not imply permission to bypass instructional or accessibility gates.

## This PR's exact safety purpose

`.github/workflows/ops-verify-pages-artifact.yml` previously imported three potentially write-capable Cloudflare tokens and optionally posted to `zones/{id}/purge_cache`. This candidate removes these legacy token references and mutation logic and fails explicitly on `purge_cache=true`, while preserving normal verification. Cache mutations, if later needed, require a separately certified single writer, not a fallback inside a verification lane.

**Production remains HOLD.** This candidate does not change Cloudflare policies, repository/environment secrets, protected main, publisher workflow administrative state, or production deployment.
