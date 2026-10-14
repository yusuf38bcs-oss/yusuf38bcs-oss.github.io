# YESAF M1.C — Pages Production Writer Authority Investigation

**Observed (authenticated):** 14 October 2026. **Decision:** READ-ONLY INVENTORY / MULTI-WRITER CONFIRMED / PRODUCTION AUTHORITY CONVERGENCE HOLD.

## Executive finding

The Cloudflare Pages project \`yusuf38bcs-oss-github-io\` is GitHub-connected with production branch \`main\`. Its GitHub integration is one publishing path. In addition, eight production-parity workflows in the Web repository contain an executable \`wrangler pages deploy _site --branch main\` call and a Cloudflare token reference. These are **capabilities**; only the R101 Field Report and R91 Zooplankton paths are tied to actual 14-Oct-2026 \`ad_hoc\` writes by independent runtime evidence.

Every push to \`main\` can make three separate production deployments when both unfiltered R101/R91 workflows run, even when all three claim the same exact Git commit. The most recent occurrence was the approved M1.B merge \`a4e926e8d99aeeb3b35c0d901af4a4924a0130e4\`.

## Grounded provider correlation

| Cloudflare production deployment UUID | UTC timestamp | Provider trigger | Independent writer attribution |
|---|---|---|---|
| \`d742afa8-4759-4c63-a001-d20dfdee92b8\` | 08:57:45 | \`github:push\` | GitHub-connected Pages project, built from \`main\` |
| \`36508de8-b35e-4d70-940f-710e20e0f438\` | 08:59:26 | \`ad_hoc\` | [Field Report parity](https://github.com/yusuf38bcs-oss/yusuf38bcs-oss.github.io/actions/runs/38538865302), credential-bearing Wrangler step |
| \`602010ea-f4c7-404c-bea2-757afd814c40\` | 08:59:30 | \`ad_hoc\` | [Zooplankton parity](https://github.com/yusuf38bcs-oss/yusuf38bcs-oss.github.io/actions/runs/38538865389), credential-bearing Wrangler step |

**Cloudflare audit-log v2:** \`GET /accounts/{account_id}/logs/audit\` scoped to product \`pages\`, 08:50–09:05Z, returned successful \`POST /accounts/.../pages/projects/yusuf38bcs-oss-github-io/deployments\` at 08:59:26.210Z and 08:59:29.701Z. Both events record API token name \`LBFL GitHub Pages Production\` and user-agent \`wrangler/4.147.0\`. The corresponding repository workflows contain \`wrangler pages deploy\`, are triggered on \`main\` push, and their GitHub jobs' production deployment steps succeeded. This cross-correlation is strong, but an identical credential label alone does not prove which GitHub run invoked any arbitrary future write.

**Cloudflare canonical state:** at the observed point, \`602010ea-f4c7-404c-bea2-757afd814c40\` was reported as the successful canonical deployment. Therefore the final publish was **not** solely the GitHub-integrated \`github:push\` path.

## Capability inventory — eight production publish workflows

All eight are in \`.github/workflows/\` and contain a Pages production deployment instruction. Path filters, if present, limit trigger scope; they do **not** eliminate production publish authority.

| Surface | Workflow file suffix | Declared action | Observation |
|---|---|---|---|
| Museum | \`museum-production-parity.yml\` | \`wrangler pages deploy --branch main\` | Potential writer; path/event dependent |
| Dissection | \`dissection-production-parity.yml\` | \`wrangler pages deploy --branch main\` | Potential writer; path/event dependent |
| Appendages | \`appendages-production-parity.yml\` | \`wrangler pages deploy --branch main\` | Potential writer; path/event dependent |
| Whole Mounts | \`whole-mounts-production-parity.yml\` | \`wrangler pages deploy --branch main\` | Potential writer; path/event dependent |
| Field Report | \`field-report-production-parity.yml\` | \`wrangler pages deploy --branch main\` | **Confirmed live writer 14 Oct** |
| Permanent Slides | \`permanent-slides-production-parity.yml\` | \`wrangler pages deploy --branch main\` | Potential writer; path/event dependent |
| Temporary Mounts | \`temporary-mounts-production-parity.yml\` | \`wrangler pages deploy --branch main\` | Potential writer; path/event dependent |
| Zooplankton | \`zooplankton-production-parity.yml\` | \`wrangler pages deploy --branch main\` | **Confirmed live writer 14 Oct** |

Another workflow, \`conv04f-zoology-practical-museum-certification.yml\`, invokes Wrangler with a **dynamic preview branch**; it is a separate preview isolation review item, not proven as direct \`main\` publisher. The GitHub Pages workflow \`jekyll-gh-pages.yml\` deploys to **GitHub Pages**, a distinct platform, and is not the Cloudflare Pages \`ad_hoc\` writer.

## Read-only assurance increment

- \`.github/scripts/yesaf-pages-writer-inventory.mjs\`: static workflow capability census; produces machine-readable \`schema=yesaf.m1c.pages-writers.v1\`, writer count, and \`authority_decision=HOLD\`.
- \`.github/scripts/test-yesaf-pages-writer-inventory.mjs\`: six fixtures including main writer, dynamic preview, comments, GitHub Pages distinction, multiple writers, zero-writers-never-certifies.
- \`.github/workflows/yesaf-pages-writer-inventory.yml\`: unprivileged PR evidence artifact; **diagnostic only**, not a required release check and not runtime attribution.

Static scan PASS means the *inventory ran*, not that single-writer enforcement passed. No Cloudflare secrets are read and no deployment is performed by this proposal.

## Next controlled remediation gates

1. **M1.C0 — inventory closure:** enumerate all manual API tokens, dashboard writers, deploy hooks, GitHub Actions, Cloudflare Pages integration and any residual scripts; correlate each authenticated \`pages.deployments.create\` audit event to a source and role. Unknown actors ⇒ HOLD.
2. **M1.C1 — preserve evidence without publishing:** modify **all eight** parity workflows to resolve an already-successful, exact-current-main Cloudflare Pages deployment via **read-only token** and verify immutable deploy UUID, canonical production SHA, expected path/browser outputs, staleness, error states and rollback evidence; remove \`wrangler pages deploy\` actions from parity jobs.
3. **M1.C2 — negative tests:** missing Pages publication; delayed Pages success; duplicate SHA with different UUID; canonical drift while browser test runs; merge moved; API 401/403; unauthorized token or preview. Fail closed. Credentials need minimum read scope and no publishing fallback.
4. **M1.C3 — independent release:** exact-head review and GitHub-required checks; preserve existing GitHub Pages and Cloudflare Pages deployment behavior until the cutover is certified; staged M1.C merge under a separate owner-approved gate.
5. **M1.C4 — independent production certification:** prove a single authorized Cloudflare Pages publisher across GitHub+Cloudflare settings and audit logs, exact SHA and UUID consistency, zero additional \`ad_hoc\` writes during the controlled test, browser regression and rollback. Only then consider writer-token revocation or deploy hook retirement as separately authorized tasks.

**Non-authority boundary:** This report does not approve reducing existing checks, changing Pages settings, deleting tokens, merging remediation, or claiming that the site is already single-writer.

