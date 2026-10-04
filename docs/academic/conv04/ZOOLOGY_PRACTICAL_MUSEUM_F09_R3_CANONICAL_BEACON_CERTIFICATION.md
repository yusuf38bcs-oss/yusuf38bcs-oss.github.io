# CONV-04F-09-R3 — Canonical Cloudflare Beacon Certification Hardening

status: AUTHORIZED — certification-only
phase: CONV-04F-09-R3
authorized_base: 9a09a8975018b035935685820958bd6d968f4b4d
branch: conv-04f-09-r3-canonical-beacon-certification-20261004
learner_mutation: NONE
production_run: 37171383126
production_attempt: 3

## Authenticated evidence

- The refreshed `CLOUDFLARE_API_TOKEN` removed the prior Cloudflare authentication blocker.
- Exact-main Jekyll build passed for `9a09a8975018b035935685820958bd6d968f4b4d`.
- Wrangler Pages upload passed and created `https://0e2a2fca.yusuf38bcs-oss-github-io.pages.dev`.
- The production resolver passed the exact-SHA contract: target/deployed SHA matched `9a09a8975018b035935685820958bd6d968f4b4d`; `exact_head=true`; `canonical=true`; branch `main`; environment `production`; status `success`.
- Immutable Cloudflare Museum browser certification passed all 11 checks.
- Canonical `https://learningbiologyforlife.org` rendered the governed Museum DOM correctly: Academic-v1 attributes, canonical Learning Guide, 48 numbered specimens, 15 verified figures/images, governed sprite coordinates, zero legacy learning cycle, keyboard/reflow/reduced-motion checks and zero serious/critical Axe violations.

## Root cause

The canonical host is Cloudflare-proxied and injects `https://static.cloudflareinsights.com/beacon.min.js/...` with a Subresource Integrity attribute. The certification harness intentionally replaces all non-allowed third-party requests with an empty HTTP 204 response. Chromium then reports an SRI digest mismatch for that intentionally empty response. The immutable Pages hostname does not produce this canonical-only diagnostic.

This is a certification-harness false positive, not learner-source, route-CSS, accessibility, curriculum, or deployment drift.

## Authorized mutation scope

Only these files may change in R3:

- `.github/scripts/conv04f-zoology-practical-museum-browser-certification.mjs`
- `.github/scripts/validate-conv04f-zoology-practical-museum.rb`
- `.github/workflows/conv04f-zoology-practical-museum-production-parity.yml`
- `docs/academic/conv04/CONV04_STATE.md`
- `docs/academic/conv04/ZOOLOGY_PRACTICAL_MUSEUM_F09_R3_CANONICAL_BEACON_CERTIFICATION.md`

No learner-facing source or CSS mutation is authorized.

## Fail-closed requirement

R3 may classify as non-blocking only a console error that simultaneously contains:

1. `Failed to find a valid digest in the 'integrity' attribute`; and
2. `https://static.cloudflareinsights.com/beacon.min.js/`.

The diagnostic must remain preserved in the browser report as `externalConsoleWarnings`. Any other console error, page error, local HTTP error, Axe serious/critical violation, DOM mismatch, content mismatch, overflow, keyboard-focus failure, reduced-motion failure or exact-head mismatch must still fail certification.

## Promotion rule

prac-02 remains blocked until:

```text
R3 exact-head technical gates
        ↓
Ready + zero unresolved review threads
        ↓
SOLO exact-head authority + Trusted Governance
        ↓
merge
        ↓
exact-main Cloudflare upload/resolver
        ↓
immutable Museum certification PASS
        ↓
canonical Museum certification PASS
        ↓
main unchanged
        ↓
F-09 PRODUCTION PARITY PASS
```
