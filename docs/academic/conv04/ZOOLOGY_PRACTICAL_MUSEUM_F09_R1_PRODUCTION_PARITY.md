# CONV-04F-09-R1 — Museum Production Parity Remediation

**Mode:** certification-only remediation
**Authorized base:** `787a680b543e8b80823125342a51683342f49b6f`
**Learner mutation authority:** **NONE**

## Authenticated facts

PR #425 merged F-09 into `main@787a680b543e8b80823125342a51683342f49b6f`.

The GitHub Pages push run `37167619097` produced artifact `11290461288` with digest:

`sha256:930bf073b57458e1e6eeec199afe8f06f502d14163f2650941a5108fc8f05cb3`

Direct inspection of the generated canonical Museum HTML in that exact artifact confirms:

- `data-lbfl-academic-surface="v1"` — present once;
- `data-lbfl-academic-role="practical"` — present once;
- `data-lbfl-learning-guide="canonical"` — present once;
- `.museum-verified-figure[data-specimen]` — 15;
- `.museum-verified-image` — 15;
- `.museum-verified-image[style]` — 0;
- numbered specimen H2 headings — 48;
- `.educational-boundary` — 1;
- `[data-zoology-learning-cycle]` — 0;
- `/assets/css/zoology-practical-museum-f09.css` — present.

The immutable Cloudflare preview for PR #425 also reports all 15 verified figures and 48 numbered specimens, but external browser-agent extraction returned contradictory hidden-attribute/class results. Those contradictory probes are diagnostic only and are not authority to rewrite learner content.

## Root cause classification

**Learner source defect: NOT AUTHENTICATED.**

The exact generated artifact contains the intended F-09 DOM contract. The remaining gap is therefore the post-merge production certification/deployment path.

## Exact R1 scope

R1 may change only:

1. `.github/scripts/conv04f-zoology-practical-museum-browser-certification.mjs`
   - allow the explicitly requested base hostname while continuing to block third-party hosts;
2. `.github/scripts/validate-conv04f-zoology-practical-museum.rb`
   - recognize this one exact R1 maintenance transition and protect the new certification artifacts in later phases;
3. `.github/workflows/conv04f-zoology-practical-museum-production-parity.yml`
   - after merge to main, build the exact main SHA, deploy that exact SHA to the Cloudflare Pages production branch, resolve the canonical successful deployment, and run the native F-09 browser contract against both immutable deployment and canonical LBFL;
4. `docs/academic/conv04/CONV04_STATE.md`;
5. this authorization document.

The Museum learner source, route CSS, 48/48 curriculum corpus, 15 verified / 33 pending figure custody, nomenclature flags, shared Practical CSS/JS, Practical course contract, assessment runtime and all other learner surfaces are protected and unchanged.

## Promotion rule

`prac-02` remains blocked until:

1. R1 exact-head retained certification passes;
2. R1 is Ready with exact SOLO authority and Trusted Governance PASS;
3. R1 merges unchanged;
4. the new main push production-parity workflow passes for the exact merge SHA;
5. canonical LBFL and the exact Cloudflare deployment both satisfy the native F-09 browser contract.
