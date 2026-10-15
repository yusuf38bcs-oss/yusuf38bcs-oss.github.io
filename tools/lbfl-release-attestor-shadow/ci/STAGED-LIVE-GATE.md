# LBFL PR #476 — isolated F-01 and CI preparation

STATUS: SOURCE-ONLY / HOLD. No live authentication or credential access is enabled.

## Scope
- Base: frozen PR #476 HEAD `0df178d625e278e629e864077c0963f09b2a9660`.
- Isolated branch: `security/pr476-f01-ci-prep-20261011`.
- The original PR #476 branch remains Draft and unchanged.
- No Cloudflare credentials, environment protections, routes, cron triggers, public endpoints, or production rulesets are created or changed by these commits.

## F-01 token issuance
The installation token request now specifies BOTH:
- `repositories: [EXPECTED.repo]` (one repository, `yusuf38bcs-oss.github.io`).
- `permissions: { contents: 'read', pull_requests: 'read' }`.

Existing checks on actual returned permissions, expiry, identity and the token-visible repository list remain mandatory. This prevents unintentionally broad issuance if the installation gains another repository. Tests assert the exact POST body.

## Manual protected CI workflow — deliberately dormant live stage
`.github/workflows/lbfl-shadow-app-auth-manual-gate.yml` has:
- `workflow_dispatch` ONLY; no PR or cron trigger and no automatic live authentication.
- A credential-free, checkout-free preflight checking dispatch from `main`, PR #476 Draft/owner/base/exact unchanged HEAD, and four existing successful PR-triggered GitHub Actions runs for that exact SHA via read-only GitHub API calls. It does NOT check out or execute PR-controlled source, install dependencies, or run tests. Its artifact explicitly reports `live_authentication: NOT_RUN`.
- A `live-authentication` job with the literal `if: ${{ false }}` and an unconditional `exit 1`. It cannot authenticate with GitHub or access Cloudflare in this version.
- A designated future environment name, `lbfl-shadow-app-auth-protected`, which is NOT provisioned or verified; declaring the name is not protection.

The GitHub Actions token receives only `contents:read`, `pull-requests:read` and `actions:read` permissions for this dormant CI verification, not Cloudflare credentials. The checked CI runs are evidence, not authorization.\n\nGitHub can automatically create referenced environments without required reviewers. NEVER unlock the live job merely because the workflow names an environment. Before enabling any live run, independently verify existing environment protections and access controls.

## Required separate authorization before live execution
1. Obtain independent review and passing checks for the NEW exact isolated-branch HEAD.
2. Establish trusted workflow content on a protected default branch without running PR-supplied code with credentials. Verify owner authorization independent of a text input.
3. Verify a GitHub environment with required reviewers, self-review restrictions where available, approved-branch restrictions and appropriately scoped secrets/permissions. No new token may be created without explicit authorization.
4. Prepare and review a one-shot live harness using only the existing Cloudflare Secrets Store binding, nonce-bound independent KV receipt, sanitized durable artifact, and cleanup evidence. Do not add public routes/cron/PR authorization capability.
5. Record exact SHA, authorization record, GitHub App ID 5266418, verified installation ID, exactly one repository, token permissions and expiration, nonce, UTC outcome and cleanup result. Never log JWT, PEM key, installation token, preview URLs or raw debug logs.
6. Require a distinct execution authorization after reviewing the completed mechanism. On failure, retain HOLD and do not automatically retry.
7. Maintain PR #476 Draft / unmerged and keep PR-specific attestation, main/staging rulesets and shadow pilot PRs #474/#475 outside this change.

This branch is preparation, NOT evidence of real GitHub App authentication.
