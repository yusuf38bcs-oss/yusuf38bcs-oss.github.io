# YESAF E4/E7 — Single-writer governance execution ledger

**Protected base:** `3164d2537b4f19381c52bbfb5c9e1b7ee7d15846`. **Design gate:** HOLD until separately signed-off exact-head owner release. This additive candidate creates no publisher and makes no change to protected Museum, R91 or R101 artifact bytes.

## Museum protected-guard finding / corrected approach

During the initial PR #500 candidate, the new security fixtures passed (14/14), but its edited **original Museum certification workflow** was rightly rejected by the protected F-09 Ruby validator with `Successor changed protected F-09 artifacts`. This is a real immutability requirement; do not disable or bypass the validator. The Worker Static Preflight on the same candidate also suffered unrelated `npm ci ECONNRESET` and its actual Worker deploy job was skipped.

**Revised additive approach in this exact PR HEAD**:
- Original workflow `.github/workflows/conv04f-zoology-practical-museum-certification.yml` remains *byte-for-byte pinned* Git blob `3d13e59f5401aaf42a3459e997399014924a9b5a`.
- Add `.github/workflows/yesaf-museum-readonly-certification.yml` containing the original F-09 `certify` scientific/academic/Jekyll/browser job but **no** `CLOUDFLARE_PAGES_DEPLOY_TOKEN`, `wrangler pages deploy` or untrusted-cloudflare preview. It runs under read-only GitHub contents permission and checks immutable candidate/main identity.
- Add Node 24 adversarial tests with Git blob binding for original and checks on successor; unprivileged PR-only runner. No protected security-policy sources, academic content, DNS, credentials, settings, or production workflow changed.
- **Original credentialed Museum workflow remains active until separately owner-authorized administrative DISABLE**. An additive candidate workflow does not contain that old runtime publisher by itself; DO NOT mark the runtime E4 gate green.

## Cross-project current authority inventory

- GitHub registry: 108 registered workflows; protected-main tree has 75 workflow YAMLs. Nine known legacy Practical parity/GitHub Pages publishers currently `disabled_manually` in registry.
- Additional **active** Museum certification workflow id **374252032** publishes nonproduction preview through `CLOUDFLARE_PAGES_DEPLOY_TOKEN` and Wrangler. Its PR target branch comes from a candidate; if operationally retaining no writer is mandatory, do not rely solely on static branch name checks. Build+deploy shared job mixes untrusted candidate content with privileged secret, so preserve a separate credential-free successor.
- Worker production workflow has actual deploy job `if: false`; yet repository source and credential visibility alone cannot prove Cloudflare effective writer authority.
- Cloudflare Pages canonical production project branch `main`, Git-linked production auto deployments disabled; last production ID `f611cf1d-9a84-4b27-8317-d23446c99fcd` at `3164d2537b4f19381c52bbfb5c9e1b7ee7d15846`. GitHub Pages `pages.learningbiologyforlife.org` cold fallback has owner verified `https_enforced=true`, 200/TLS=0/redirect and content smoke PASS, but *not* a tested rapid failover/rollback.

## Fail-closed migration / coordinated merge order

1. Certify additive Museum successor via exact-head runner, existing local F-09 scientific validator, CodeQL/static review, matching main, zero unresolved review threads. No live Cloudflare deployment allowed from new successor.
2. After separately owner-authorized workflow-state change, disable original Museum certification workflow id `374252032` administratively and prove it remains disabled, while the independent read-only Museum successor retains scientific certification. Never rename/touch old protected source or forge its retained check. Re-evaluate candidate PR status effects of disablement.
3. Fix/merge PR #493 reader-token boundary only through its certified path; inventory all write-capable Cloudflare project, Worker, repository/environment/org credentials and effective permissions. Protect production writer by explicit environment approval *at each write*, not only once on PR.
4. For R91/R101, PR #499 v2 attempts to edit self-protected trusted predecessor guard and publisher source; old main guards reject it by design. No ordinary clean-path merge exists for that patch. No owner/governance exception has been granted by this document. Options: additive independently certified read-only successor + administrator-disabled retired workflows as long-lived frozen source, OR a later separately authorized documented one-time predecessor-policy exception after effective credential/runtime fencing. If no legitimate audited platform mechanism exists without forbidden bypass, HOLD.
5. PR #499 P1 merge-time mutable workflow-state race is unclosed by one-off PR status: a registered workflow may be enabled or run after any check. The real invariant must be enforced at privileged deployment time (scoped credentials/environment/owner approval) plus immediate bounded API pre-merge verification; a polling or PR check alone cannot make this atomic. Keep security thread open until enforcement certified.
6. Do not merge #494, #496, #497, #498, #499, or this candidate solely on static fixture PASS. Before any merge, prove exact current protected five checks, 0 unresolved threads, zero privileged publication on first main push, owner approval for this exact merge, and an independently tested rollback/Recovery Plan. Then validate Cloudflare Pages deployment ID/SHA, Worker deployed version/traffic, canonical apex/www DNS/TLS, GitHub fallback freshness, actual failover and recovery RTO/RPO.

**Disposition:** Museum additive successor STAGED FOR REVIEW, old Museum writer ACTIVE / DISABLE PENDING; R91/R101 bootstrap HOLD; PR #499 mutable state P1 HOLD; G1 TLS fallback PASS; full single-writer production certification NO-GO.
