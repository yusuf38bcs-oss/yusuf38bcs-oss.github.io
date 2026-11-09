# YESAF M1.C-R1 — Eight Pages production publisher quarantine

**Prepared 2026-10-14. Baseline: 45ce766eddb88582714aade5bd41b939c5e7db23.**
**Status: DRAFT SHADOW PATCH — NOT MERGED; PRODUCTION_CUTOVER=HOLD.**

This is a minimal fail-closed source quarantine of eight legacy **GitHub Actions ad-hoc Pages publishers**, not a final read-only parity implementation. The intended sole Pages publisher is the existing GitHub-connected Cloudflare Pages integration, subject to independent provenance and Cloudflare permission review.

## Changes
| Domain | Job disabled | Result |
|---|---|---|
| appendages | `production` | explicit `if: ${{ false }}` |
| dissection | `production` | explicit `if: ${{ false }}` |
| field-report | `production` | explicit `if: ${{ false }}` |
| museum | `deploy-and-certify` | explicit `if: ${{ false }}` |
| permanent-slides | `production` | explicit `if: ${{ false }}` |
| temporary-mounts | `production` | explicit `if: ${{ false }}` |
| whole-mounts | `production` | explicit `if: ${{ false }}` |
| zooplankton | `production` | explicit `if: ${{ false }}` |

### Preserved behavior
- Existing R91 Zooplankton and R101 Field Report unprivileged `build_site` jobs remain eligible to execute.
- Museum `contract` candidate validation stays active independently.
- All eight production jobs retain their previous source as historical reference but **cannot run while guarded**. The temporary quarantine intentionally skips their previous live browser-parity jobs until a separately certified replacement exists.
- Existing academic certifier workflows outside these eight files are untouched.
- No DNS, Worker, Pages, GitHub ruleset, secrets, or production deployment was changed by preparing this Draft patch.

### Known HOLD conditions
1. **Not equivalent to publishing-authority retirement:** old Wrangler commands and secret references remain in disabled jobs. They must be removed, not merely disabled, during M1.C-R2.
2. The GitHub-connected Pages deployment's canonical UUID, exact commit SHA, successful status, immutable URL, and public canonical behavior must be read independently. No fallback to any `ad_hoc` deployment is permitted.
3. Existing browser-parity checks must be reconstructed as **read-only** jobs bound to that successful canonical SHA. Test missing/stale/racing commits, failed/deleted deployments, wrong branch, preview targeting production, and stale domain caches. If proof is unavailable, fail/HOLD rather than falsely green.
4. Audit Cloudflare permissions and unrelated writer paths (including dashboard/external API and the Museum preview deploy token). The eight job guards cannot prove provider-side single-writer exclusivity.
5. Require separate owner authorization, exact-head CI, independent security review, Trusted Governance PASS, production regression evidence and explicit rollback plan before any merge.
6. Evaluate each job's historical deployment-dependent evidence and artifact consumers before allowing replacement. A skipped production job is not equivalent to a certified practical route.

**Release interpretation:** Until R2 and independent live verification, `M1.C=PARTIAL`, `SINGLE_WRITER=UNPROVEN`, `CUTOVER=HOLD`. Worker production deployment remains disabled by the separate M1.B gate.
