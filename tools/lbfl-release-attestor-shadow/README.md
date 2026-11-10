# LBFL Release Attestor — isolated shadow authentication

**STATUS: NON-AUTHORIZING. No approvals, no merges, no production deployment.**

This isolated Cloudflare Worker is an authentication-only preflight for the installed GitHub App `lbfl-release-attestor-yusuf38bcs` (App ID 5266418). It deliberately has no HTTP access, webhook, cron trigger, PR review endpoint, or merge capability. `fetch()` always returns 404. `scheduled()` is intentionally unreachable until a separate, explicitly authorized schedule is added after binding validation.

## Immutable scope

- Repository: `yusuf38bcs-oss/yusuf38bcs-oss.github.io` only.
- Target runtime: `lbfl-release-attestor-shadow`. Never reuse `lbfl-socratic-ai` or `synapticai-proxy`.
- Cloudflare Secrets Store ID: `cf398e43d6224506a286e0719d19401b` (owner-supplied; account presence not yet verified).
- Binding and secret name: `LBFL_RELEASE_ATTESTOR_PRIVATE_KEY`.
- No GitHub App key, token, or API secret in source, logs, actions, or PR comments.

## Local validation

Run `npm test` under Node.js >=22. Tests use a disposable RSA key and mocked GitHub API, never the real key.

Before any live deployment, independently verify the real Secrets Store secret and `workers` scope, exact Cloudflare account and authority to bind it. `wrangler deploy --dry-run --config wrangler.toml` is required but **does not verify remote bindings or live GitHub credentials**. Deploy only with explicit shadow authorization, no custom domain/route, no workers.dev endpoint and no schedule. After deployment, separately authorize a one-shot probe and attest the live App ID, installation ID, and **exactly one repository**.

## Release governance

Protected isolated branch rule ID 24850735 applies only to `governance/pr-review-pilot-20261010`.
Shadow PRs #474 and #475 intentionally share `4f10c0e330643f1720018fe58c8436d17ff69565` and must not be merged.

Never assume the App account's key is an independent reviewer by itself: the authorization decision must be external to the PR author and key operator and preserve PR-specific identity, exact head/base SHA, decision nonce, expiry, non-replay, revocation, and audit evidence. The existing required commit status is SHA-scoped and must not be treated as a PR-specific authorization. Do not enable PR approval until reviewers and required approval counting are certified on the isolated pilot. Production main/staging rulesets remain unchanged.

**Bootstrap decision:** source-only DRAFT until live authentication and PR review pilot have independent PASS evidence.
