# CONV-04F-09-R3 — Resolver-Only Production Parity Repair

**Mode:** certification-only production-deployment repair
**Authorized base:** `9a09a8975018b035935685820958bd6d968f4b4d`
**Learner mutation authority:** **NONE**

## Authenticated failure

PR #427 merged R2 successfully and the production-parity workflow parsed and started.

Run:
- workflow run: `37171383126`
- main SHA: `9a09a8975018b035935685820958bd6d968f4b4d`
- job: `111345092477`

The contract job passed. The production job then failed only at the direct Wrangler Pages upload step:

- endpoint: Cloudflare Pages project upload-token request;
- result: authentication error, code `10000`;
- no exact-deployment resolver/browser parity stage was reached.

This does **not** authenticate a learner-source, Jekyll-build, F-09 DOM, or route-CSS defect.

## Root cause and repair model

The repository already has a Git-connected Cloudflare Pages production deployment path for `main`, and the existing production certification design resolves the canonical exact-SHA Pages deployment rather than forcing a second production upload.

R3 therefore removes the redundant direct production write operation and changes the F-09 production-parity workflow to:

1. build the exact immutable main SHA locally;
2. poll Cloudflare read APIs for the successful canonical `main` production deployment matching that SHA;
3. authenticate deployment ID, branch, environment, status and deployed SHA;
4. run the native F-09 browser contract against the immutable exact deployment URL;
5. run the same native browser contract against `https://learningbiologyforlife.org`;
6. re-authenticate that `main` did not move during certification.

## Exact R3 scope

1. `.github/workflows/conv04f-zoology-practical-museum-production-parity.yml`
   - remove the redundant direct Wrangler production upload;
   - use resolver-only exact-SHA production discovery;
   - trigger on R3 authority changes;
2. `.github/workflows/conv04f-zoology-practical-museum-certification.yml`
   - trigger retained Museum certification when the R3 authority artifact changes;
3. `.github/scripts/validate-conv04f-zoology-practical-museum.rb`
   - authorize this one exact R3 maintenance transition and protect the R3 artifact in successors;
4. `docs/academic/conv04/CONV04_STATE.md`;
5. this R3 authorization document.

## Protected

Unchanged:
- prac-01 learner source;
- Museum route CSS;
- 48/48 curriculum corpus;
- 15 verified / 33 pending figure custody;
- seven nomenclature flags;
- Practical course contract and module order;
- shared Practical CSS/JS;
- native F-09 browser assertions;
- assessment runtime and all other learner surfaces.

## Promotion rule

After exact-head R3 retained checks, review convergence, Ready, exact SOLO authority and Trusted Governance, merge unchanged.

The post-merge push must then PASS resolver-only exact-main production parity against both immutable Cloudflare deployment and canonical LBFL before `prac-02` is authorized.
