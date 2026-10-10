# CONV-04F Validator Migration — Evidence and Authorization Proposal

status: PROPOSED / NOT AUTHORIZED / NO MERGE
date: 2026-10-10
source_pr: 468
source_candidate_sha: 25ef8edbf08e32dca9964456a602cd3c49865dbf
authenticated_comparison_base: 81950a9f4602f1d9be34f2d53d4585831926bffa
target_release_pr: 460
scope: seven retained Practical Ruby validator scripts only

## Verified exact file identities

The following original and candidate Git blob SHAs were read directly from GitHub at the comparison-base and candidate commit. **These identities are evidence, not authorization.**

| Relative path | Original blob SHA | Candidate blob SHA |
|---|---|---|
| `.github/scripts/validate-conv04f-zoology-practical-museum.rb` | `43aa1d96c71e524f0af4eca954766e51e9c423f5` | `431bef9bed725350b9f40608551cc2d74bf38820` |
| `.github/scripts/validate-conv04f-zoology-practical-whole-mounts.rb` | `fc9b9f07164676798b4f98fe7802053dddd0f929` | `2531802368b29395c99aab789796baa3ef079f1d` |
| `.github/scripts/validate-conv04f-zoology-practical-field-report.rb` | `cef2b7aca4f5a388421d89e39213947016341e43` | `e0e0f8c977536413c45e7223f8f84a88e455a809` |
| `.github/scripts/validate-conv04f-zoology-practical-temporary-mounts.rb` | `4e588a411174b23225a8bb5d796e77f48af573ac` | `56176cb05a1c726e0edae624d7f4e5d6e57008a2` |
| `.github/scripts/validate-conv04f-zoology-practical-permanent-slides.rb` | `7efc49f9a063385e18dda50221f30bfb865f2cdb` | `a9f60816663ca059c2b01af2bf8c3a9d5c4fb274` |
| `.github/scripts/validate-conv04f-zoology-practical-appendages.rb` | `e0b25189300804447108bcc201e97653330e0e87` | `0a0a481e7d3020fa37c4f586cb55c73db10d9eb4` |
| `.github/scripts/validate-conv04f-zoology-practical-dissection.rb` | `7318e8c3215838093b68978760746e9c4240fb72` | `ecef2631129666f9a6d64dc085027cb397b5c96d` |

## Problem and permitted design

The candidate adds a narrow `j_governance_only` predicate meant to permit the two-file CONV-04J-R1 governance transition without falsely requiring a new Practical successor phase. Existing protected-script self-preservation rejects the candidate scripts before this behavior can be certified. R101 protected formula literals were restored in the source candidate above and their prior corpus-mismatch messages are absent from the new Field Report log. Eight Practical workflows remain failed on the source candidate.

**No blanket bypass is authorized.** A separately reviewed migration policy must authenticate the seven *exact original and candidate blob pairs*, require an exact migration branch/base/head binding, reject all other script/content mutations, and retain legacy learner-source/route/contract/asset checks. The policy must not treat a GitHub PR comment or this proposal as approval.

## Required regression tests before any merge

| Test | Input | Expected |
|---|---|---|
| P01 | Exact authorized base, seven exact proposed script blobs, no unrelated changes | PASS only after independent authorization |
| P02 | PR #460 changes exactly the two named governance files, phase CONV-04J-R1, valid ancestor implementation base | PASS after migration |
| P03 | R101 protected formula literals retained | PASS |
| N01 | Change one byte in any proposed validator script | FAIL |
| N02 | Add eighth protected validator or unrelated file mutation | FAIL |
| N03 | Mutate learner source / route / contract / asset | FAIL |
| N04 | Use invented or non-ancestor J implementation base | FAIL |
| N05 | Use another phase or extra state mutation | FAIL |
| N06 | Run without exact-head SOLO/governance authorization | FAIL |
| N07 | Change protected R101 formula literal | FAIL |
| N08 | Reuse migration authority for subsequent PR or commit | FAIL |

## CI and governance gates

1. Review original preserved checks and compare complete diffs for every proposed script.
2. Establish **independent**, fail-closed enforcement for the one-time validator migration, with the exact file/blob allowlist above. Do not edit the existing protected-script check solely to accept itself.
3. Implement and run the positive and negative regression fixtures and record command, environment, exit status, and exact SHA.
4. Re-run all eight Practical workflows on the new exact head. Jekyll / Sovereign Site Audit successes alone are insufficient.
5. Obtain fresh review, zero unresolved review threads, SOLO exact-head authority, and Trusted Release Governance PASS before considering PR #468 merge.
6. After a certified repair reaches main, re-base and re-certify PR #460 (nine Practical workflows, including Zooplankton separately), exact-head governance, and final unchanged-head audit.
7. After any approved PR #460 merge, prove exact-main production parity before formal closure.

## Current disposition

This document stages file-level evidence and acceptance criteria in an isolated branch. It does **not** introduce an executable migration exemption, certify a repair, modify learner sources, or permit merge/deployment. Existing release gate remains fail-closed.

## Existing canonical solo-maintainer authorization route (audit update)

The canonical `docs/production/RELEASE_GOVERNANCE.md` supports either a qualified non-author reviewer or the permanent solo-maintainer exact-head path. Therefore an external second reviewer is **not** unconditionally required. Under the solo path, the PR must be non-Draft, based on the current protected target, carry passing applicable CI at its exact head, have zero unresolved review threads, and include precisely these two lines in the PR body after testing:

- `SOLO-MAINTAINER-EXCEPTION: LBFL-PERMANENT-SOLO-MAINTAINER`
- `SOLO-MAINTAINER-APPROVAL: <exact-current-40-character-PR-head-SHA>`

The trusted workflow loaded from `main` governs PRs targeting `main` or `staging`, not this evidence PR targeting the repair branch. No marker is added to this proposal/draft as a substitute for owner authorization. Solo authority does not override failed Practical CI or supply the separate explicit merge decision. Independent one-time migration enforcement is still required to prevent validator self-authorization.
