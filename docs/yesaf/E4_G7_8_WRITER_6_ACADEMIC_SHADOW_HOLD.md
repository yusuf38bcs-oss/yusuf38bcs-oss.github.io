# YESAF E4/G7 — Eight-writer retirement + six-academic successor integrated SHADOW

Prepared 2026-10-25 as a new isolated branch based on #496 HEAD `18c8527fdc17b92cb2a2da43f4ccf66c8dc09191`; protected-main base `3164d2537b4f19381c52bbfb5c9e1b7ee7d15846`.

## Exact source custody

* #496 — six retired Practical parity source files, unchanged Git blobs.
* #499 — four modified R91/R101 publisher/guard files and three additive policy/test/doc files at its CURRENT exact HEAD `5d2a38cab2afc32a8618909744aaf927a1a86e50`.
* #500 — four additive Museum read-only scientific/browser successor files at `9def444720ac5bac6ca1fa169bea9bd6a40c0c2f`.
* #507 — two additive five-subject browser-science successor files at `05a30a5671eff3cd1d0d2bed0565241fc9550972`.
* New self-contained PR-only eight-writer/six-academic shadow tests and this ledger. Content and facts above are source ancestry, not end-to-end production certification.

## Static boundary and academic coverage

The eight known Practical Cloudflare Pages writers proposed for retirement are Appendages, Dissection, Museum parity, Permanent Slides, Temporary Mounts, Whole Mounts, Field Report R101 and Zooplankton R91. The retirement YAMLs have no main-push trigger, Pages write credentials or Wrangler deploy commands. Their historical evidence at original SHAs is preserved unchanged.

The six successor academic lanes are five original Playwright/Axe Practical subject scripts (Appendages, Dissection, Permanent Slides, Temporary Mounts, Whole Mounts) plus the F-09 Museum read-only Jekyll/science/browser certification. Both successor workflows have `contents: read`. PR CI will execute them on this new exact HEAD and results must be verified independently. A local Jekyll build does not prove live Cloudflare canonical deployment parity.

## KNOWN RELEASE BLOCKERS — NO MERGE / NO DEPLOY

1. #499 has two unresolved P1 review findings: (a) green pre-merge workflow disablement evidence can become stale before production write — a TOCTOU write-time authority defect; (b) GitHub's status-filtered workflow-run API 1,000-result cap may mask active legacy runs. The second requires per-workflow-ID enumeration or a rigorously fail-closed cap mechanism; the first requires a credential/environment gate at write-time, not a static green PR check.
2. Current protected-main R91 and R101 predecessor immutability guards intentionally reject modifications to protected publisher and successor guard files. This candidate does not and MUST NOT bypass the trusted gate. A policy migration requires exact-head independent authorization and a non-bypass bootstrap plan before integration.
3. The Museum certification's original credentialed preview workflow remains a separate source surface even though earlier GitHub runtime census showed it disabled. GitHub Pages publication and Cloudflare native Git integration / external manual/API/Worker writer paths must be independently re-inventoried at write-time. Counting just eight retired Practical YAMLs is not whole-platform writer certification.
4. #506 credential isolation and #494 owner-bound GitHub Pages publisher have an overlap in `ops-verify-pages-artifact.yml`; reconcile on a separate exact-head candidate. A successful metadata GET does NOT prove reader token has no Write grants. Keep Pages and Worker credentials separate and verify actual policy permission groups and resource IDs.
5. A solo-maintainer owner marker cannot serve as an independent attestor. Separate verified principal, key custody, installation restrictions, same-PR SHA isolation, decision freshness and revoke behavior must be demonstrated.
6. Rollback production Pages deployment UUID and Worker version must be pinned, with an authorized isolated rollback/failover rehearsal and DNS/TLS/health proof. Preview and source-only checks are NOT production evidence.

No branch protection, secret, credential, Cloudflare deployment, DNS, workflow enablement, main merge or production dispatch is authorized by this isolated engineering candidate. Final seven gates E1–E7, five required exact HEAD status contexts, zero unresolved review threads and separate owner GO are REQUIRED.

**Technical candidate state: SOURCE SHADOW / REVIEW ONLY. Production decision: HOLD.**
