# YESAF E4 Academic–Publisher Separation — candidate policy v1.0
**State: DRAFT / technical migration contract / production HOLD**  
**Immutable protected main:** `3164d2537b4f19381c52bbfb5c9e1b7ee7d15846`  
**Parent exact HEAD:** PR #510 at `6bbb8e6074c9b249b24815157fc53d39ea44e2e4`

## Problem and root cause
The eight retained Zoology Practical subject validators predate the YESAF single-writer cutover. Their source-scope and structural tests require the corresponding legacy Cloudflare Pages publishing workflow to remain unchanged, and R91/R101 additionally require its push-to-main / locked Wrangler semantics. YESAF properly removes precisely that writer capability. Consequently, the old validators flag the proposed retirement as protected-artifact drift. These failures are genuine hold evidence; do not dismiss or fake green checks.

## Policy proposal: separate educational truth from publishing authority
**Science custody lane (must never be weakened):** Original eight Ruby validators, eight Playwright/Axe browser-certification scripts and eight legacy academic certification workflow source Git blobs are pinned to historical main. Source, manifests, route ledger, curriculum, Practical figures, learning guides, shared CSS/JS and Academic evidence subtrees are byte-identical between protected main and candidate. Any change, rename or deletion fails closed; instructional upgrades must use a separately recertified branch.

**Writer retirement lane:** All eight legacy `*-production-parity.yml` workflow blobs must exactly equal reviewed #496/#499 retirement blobs; no one may silently re-enable or edit a publisher. The unprivileged five-subject successor plus Museum successor source blobs remain pinned separately.

**Runtime lane:** Existing five-subject Jekyll/Playwright/Axe jobs are retained. Museum F-09 is NOT certified by source pinning alone: its prior candidate certificate fails the legacy protected-publisher artifact assertion. An independently reviewed science/browser verifier that does not reintroduce publishing must be tested. R91/R101 original academic science assertions and field/zooplankton live parity must be demonstrated independently after cutover.

**Governance lane:** This PR creates only candidate code, adversarial negative tests and a `contents:read` PR workflow. The original protected validators, required GitHub check contexts and trusted predecessor source files are not edited. No existing failed required check is waived by a new green one. Before a controlled cutover, an independently authenticated app/principal must attest approved migration `candidate SHA + protected baseline + eight retirement blobs + CI run IDs + owner-approved path scope`; a separately authorized ruleset/guard transition must preserve or supersede all academic protection at equal or stronger strength.

## Evidence needed before final GO
1. All original science/education source contract blobs identical and full eight-domain academic parity verified (five browser jobs alone do not prove eight).
2. #499 P1 stale-approval TOCTOU resolved **at actual write time**, including complete workflow-ID pagination and current disablement. Historical census run #40203524188 is only a snapshot.
3. Confirm all Cloudflare token permission groups and resource policies using secure administrative read-only evidence; connected Cloudflare OAuth lacks access to `/user/tokens` and `/accounts/{account_id}/tokens`.
4. Dedicated canonical single production writer and exact protected-main SHA, independent attestor, owner approval, environment protection and rollback evidence. Retire all old source writers without losing academic science.
5. Compare #494 promotion workflow with #506 no-write reader-token migration. Run all E1–E7 and required trusted contexts at a fresh release exact HEAD; no bypass, no unverified independent sign-off.

**DO NOT MERGE / DEPLOY / DISPATCH / CHANGE SECRETS / ADJUST RULESETS** under this proposal. Prior PASS evidence remains historical and SHA-bound. Release HOLD / NO-GO.
