# YESAF M1.C — Cloudflare Pages Production Writer Forensic Inventory

Observed: 2026-10-14 UTC. Exact repository baseline: `main@45ce766eddb88582714aade5bd41b939c5e7db23`.
Status: **INVESTIGATION CONFIRMED / PRODUCTION_CUTOVER HOLD**.
This is a shadow forensic inventory. **Do not treat it as mutation authority, a permissions proof, or release GO.**

## 1. M1.A prerequisite verification

M1.A PR #483 is already merged at `45ce766eddb88582714aade5bd41b939c5e7db23`; its job context is `YESAF M1 read-only authority gate`.
The active `LBFL-main-highest-protection` ruleset, ID `20910862`, was independently read through the GitHub repository API and a separate public API fetch. Both returned **four** required contexts only:
`validate`; `Cloudflare Pages`; `LBFL Trusted Release Governance`; `LBFL Worker Static Preflight`.
Two authenticated browser automations reported adding a fifth `YESAF M1 read-only authority gate` and saving, but no updated `updated_at` or fifth check appeared on independent API rereads. **Enforcement NOT CERTIFIED**. Do not accept a UI agent's save report as proof. Reconcile using an administrator-authorized ruleset edit and an independently observed GET response containing all five, with unchanged bypass/protection rules.

## 2. Direct provider evidence of duplicate writes

Cloudflare Pages project `yusuf38bcs-oss-github-io` uses the GitHub repository `yusuf38bcs-oss.github.io`, production branch `main`. Provider deployments for the merge `45ce766...`:

| Cloudflare UUID | Type | UTC | Cloudflare commit message / provenance |
| --- | --- | --- | --- |
| `b0431eca-9c3b-44e8-b707-fbad295c9f6b` | `github:push` | 09:55:52 | Built the GitHub merge commit |
| `70271311-f706-46f8-b4b0-5787e467a214` | `ad_hoc` | 09:57:28 | `LBFL F-09 R101 production parity 45ce766...` |
| `15f2d54f-f4cf-46f4-bd85-ed318041bfb5` | `ad_hoc` | 09:57:32 | `LBFL F-09 R91 production parity 45ce766...` |

The identical pattern occurred for prior `a4e926e...` and earlier merges. Cloudflare deployment GET responses establish UUID, source trigger, SHA and exact commit messages. The ad-hoc deployments show a deploy success but no full build/clone stages, distinguishing them from the GitHub-connected builder.

## 3. Authenticated repository source census

All eight below retain a `wrangler pages deploy _site --branch main` (or equivalent) step carrying `secrets.CLOUDFLARE_API_TOKEN`. The first two have unfiltered `push: main` triggers. Remaining workflows have path-scoped `push: main` triggers and some also allow manual dispatch. Unfiltered or path-scoped, each remains a possible producer of a production write.

| Direct Pages publisher | Main push | Additional workflow dispatch | Recent ad-hoc execution attribution |
| --- | --- | --- | --- |
| `conv04f-zoology-practical-field-report-production-parity.yml` (R101) | all pushes | no | **Confirmed**: Cloudflare `70271311...`, identical SHA and explicit commit message; GitHub workflow run `38538865302` |
| `conv04f-zoology-practical-zooplankton-production-parity.yml` (R91) | all pushes | no | **Confirmed**: Cloudflare `15f2d54f...`, identical SHA and explicit commit message; matching earlier run `38538865389` |
| `conv04f-zoology-practical-museum-production-parity.yml` | selected paths | yes | Capability confirmed; no recent event conclusively attributed here |
| `conv04f-zoology-practical-permanent-slides-production-parity.yml` | selected paths | yes | Capability confirmed; no recent event conclusively attributed here |
| `conv04f-zoology-practical-whole-mounts-production-parity.yml` | selected paths | yes | Capability confirmed; no recent event conclusively attributed here |
| `conv04f-zoology-practical-dissection-production-parity.yml` | selected paths | no | Capability confirmed; no recent event conclusively attributed here |
| `conv04f-zoology-practical-temporary-mounts-production-parity.yml` | selected paths | no | Capability confirmed; no recent event conclusively attributed here |
| `conv04f-zoology-practical-appendages-production-parity.yml` | selected paths | no | Capability confirmed; no recent event conclusively attributed here |

The baseline `docs/governance/YESAF-M1-P00-AUTHORITY-BASELINE-2026-10-14.md` independently reports Cloudflare audit-log v2 write events using token name `LBFL GitHub Pages Production`, `wrangler/4.147.0`. That claim is preserved as provenance, not a fresh re-read of the underlying logs in this investigation.

## 4. Root cause and production risk

Production has **GitHub-connected Cloudflare Pages publishing PLUS eight repository workflow paths that can publish to the same Pages production branch**. R91/R101 demonstrably publish after the automatic GitHub push. This is a **multi-writer deployment design**, even when all writers label the same full SHA. It violates the desired exclusive production writer and makes the last ad-hoc publish capable of becoming canonical. It also invalidates treating `staging.learningbiologyforlife.org` as isolated staging: provider metadata shows both staging and root aliases on the same Pages project.

## 5. Non-authorizing shadow guard

- `.github/scripts/yesaf-pages-writer-inventory.mjs` statically inventories obvious direct Pages publishers and prints `production_cutover: HOLD` regardless of the candidate count.
- `.github/scripts/test-yesaf-pages-writer-inventory.mjs` exercises positive and false-positive cases.
- `.github/workflows/yesaf-pages-writer-shadow.yml` runs on PR and manual dispatch using `contents: read` only. No Cloudflare credentials, remote writes or privileges.
- Limitations: dynamic shell commands, indirect scripts, other repositories, Cloudflare dashboard/manual publishing, token scope/revocation and hosted Pages actual runtime are **not** certified by a source inventory.

## 6. Next separately governed remediation

1. Certify a sole Pages deployment authority (prefer the existing GitHub-connected Pages build for this site); bind protected `main`, preview isolation, exact SHA and independent check.
2. On an isolated repair branch, replace all eight direct publish steps with **read-only consumption** of the existing successful canonical GitHub Pages deployment. Use a dedicated Pages metadata read token, not the old production write token; authenticate `current main == tested SHA` and `canonical deployed SHA == expected SHA` before browser parity.
3. Preserve exact deployment UUID, immutable URL, canonical URL and Jekyll/DOM checks; explicitly test missing, stale, delayed, racing and mismatched deployments. A read-only source lookup must never silently fall back to an ad-hoc deployment.
4. Independently audit non-workflow Pages publishers, external API access and Cloudflare token scopes before claiming sole authority. Plan rollback using a separately authorized publish action.
5. Perform exact-head CI, independent review, Trusted Governance PASS, current required checks and owner-specific merge approval. Verify zero new ad-hoc Pages deployments on a controlled subsequent push.
6. Only after M1.C and runtime/rollback gates pass consider promoting production release authority. Until then: **P00 PARTIAL; PRODUCTION_CUTOVER HOLD**.

No settings, secrets, Workers, DNS, Page aliases, or production workflow publishing steps were changed by this shadow investigation.
