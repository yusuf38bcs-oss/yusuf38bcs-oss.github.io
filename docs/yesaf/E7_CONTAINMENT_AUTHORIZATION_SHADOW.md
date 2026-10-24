# YESAF E7 — Isolated Containment and Independent Authorization Shadow Prototype

**DRAFT / NO MERGE / NO PRODUCTION DEPLOYMENT / NO STATUS BYPASS.**
Trusted protected base: 3164d2537b4f19381c52bbfb5c9e1b7ee7d15846.

## Why this gate exists
- M1.C reader credential identity GET probe run 40077849106 succeeded on PR #493 exact SHA fdedc8d09732fdbed9b4a1959d5844ca2d3bae5e; this does not prove no-Write privilege.
- R91/R101 protected-main workflows still declare main push publication jobs using CLOUDFLARE_API_TOKEN and Wrangler. One merge may trigger them.
- #499 has an unresolved P1: a successful PR status can become stale if workflow enablement or active-run state changes before merge.
- Cloudflare Pages Git-linked automatic production publishing is disabled, but that does not contain GitHub Actions Wrangler or other API writers.

## This candidate changes only five additive files
- Shadow evaluator: exact base, ten named workflow registrations, two captured observations, all writer states disabled_manually, and zero requested/queued/in_progress/waiting/pending run counts per registered workflow ID; fail closed on stale, missing, enabled, or drifting evidence.
- Negative tests: adversarial drift, duplication, stale time, missing statuses, workflow activation and queued/live runs.
- Local authenticated GET-only collector: run node .github/scripts/yesaf-e7-readonly-collector.mjs --live after gh auth login. It reads API metadata only, contains no network write method, and prints no tokens. It stops on any nonzero active-run count without relying on the 1000-result API search cap.
- Candidate pull_request-only CI: contents read, no secrets, no environment, no deployment, no trusted commit status write.
- This description. No predecessor protected workflow, R91/R101 guard, protected-main policy, production setting or credential changed.

## Independent attestation is a separate real-world security boundary
Author, publisher and independent attestor must be distinct, authenticated roles with verified permissions and trustworthy code provenance. The existing lbfl-release-attestor-yusuf38bcs GitHub App may be evaluated but cannot be called independent based solely on its name. An owner-supplied JSON claim or solo approval marker cannot supply independent attestation. Even a valid programmatic report is NOT merge authority.

The production writer must be denied or approved **at deployment time** through an enforceable environment/secret policy with exact SHA validation immediately before writing, no legacy token fallback, single-writer serialization, and authenticated cross-service version evidence. A static PR check cannot close the #499 time-of-check/time-of-use P1. GitHub environment protections: https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments

## Follow-through / evidence gaps
1. Live owner-side workflow registry inventory for these 10 known paths, PLUS discover any other writer (Workers Builds, Pages direct/API, other GitHub apps, GitHub Pages, manual operations). No complete inventory yet.
2. Cloudflare reader no-Write token policy attestation and audit of all privileged writer secrets/environment scopes. No permission escalation.
3. Proven distinct attestor issuer, review provenance, and independently enforced production environment approval.
4. Controlled predecessor R91/R101 governance migration without ignoring failure checks, and repair #499 unresolved P1 at the effective write boundary.
5. Tested rollback/failover, version UUID/SHA matching, explicit RTO/RPO targets and first-main-push deployment containment.
6. Only then separately authorize an exact coordinated release. This prototype never issues APPROVED or GO.

**Verdict even after all fixtures PASS: SHADOW EVIDENCE ONLY / RELEASE HOLD.**


## Additive protected-main publisher source discovery (2026-10-24)
The read-only `source-inventory` job checks out the immutable protected-main SHA independently of candidate bytes, scans every `.github/workflows/*.yml` for Cloudflare writer credentials, Wrangler/Page deploy actions, Pages write permissions, and related indicators, and emits an **advisory** exact-source JSON inventory. Lexical detection can generate false positives and miss indirect deployment scripts; no scan can certify absence of writers. This job never uses write credentials, and its successful status remains `production_release=HOLD`. A reviewer must reconcile flagged and unflagged paths against GitHub's actual workflow registry, environment and Cloudflare permissions before any release.
