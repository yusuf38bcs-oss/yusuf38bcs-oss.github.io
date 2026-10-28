# YESAF E7 — Pages metadata-reader credential-scope repair (SHADOW)

**DRAFT / NO MERGE / NO PRODUCTION DEPLOY / NO SECRET OR RULESET CHANGE.**

Protected main baseline: 3164d2537b4f19381c52bbfb5c9e1b7ee7d15846.

Six browser-only certification workflows unnecessarily injected the legacy write-capable CLOUDFLARE_API_TOKEN into the Pages metadata resolver. This candidate changes exactly one secrets mapping line in each of AdSense, IELTS Reading, IELTS Speaking, IELTS Typography, IELTS Writing, and Zoology Practical, to the already verified GitHub repository secret CLOUDFLARE_PAGES_READ_TOKEN. No token value is written or exposed. The environment variable name CLOUDFLARE_API_TOKEN is retained solely for backward compatibility with the existing GET-only Python resolver. It does not imply Write permission on the bound credential.

All six call the resolver for Pages metadata without an explicitly configured Worker script. Original job behavior, commands, triggers, and permissions otherwise remain unchanged. A new pull-request-only unprivileged Node regression suite checks exact Pages reader mapping, no fallback to writer secrets, and absence of Pages publisher commands.

This is one isolated engineering improvement only, NOT full YESAF cutover. An authenticated Cloudflare token policy audit must still independently prove absence of Write grants; GET success alone cannot. The remaining active Ecology, LBFL CI, production-certification and optional cache purge workflows require separate scope reviews. PR #493 handles the separate mixed Pages/Worker reader contract but remains Draft/HOLD.

Release cannot proceed until production writer-time environment enforcement, certified distinct technical attestor, PR #499 P1, first-main-push containment, and tested rollback are established. This candidate makes no production changes.

Verdict: CANDIDATE ONLY / RELEASE HOLD.

## 29 October candidate pagination repair

The six metadata consumers now use an additive preview-reader adapter. It requests explicit pages of 25 records, stops only on a fully qualified exact-SHA successful clean preview or exhausted results, and fails closed on repeated pages or the 100-page limit. Production canonical lookup and Worker calls are delegated unchanged. The protected legacy resolver is byte-for-byte unchanged. Five adapter fixtures, twelve predecessor resolver fixtures and seven reader-boundary tests passed locally; fresh exact-head CI remains required. Cloudflare Access member login still independently blocks deployed preview browser assertions. No Access policy, token, production source or required status was changed.
