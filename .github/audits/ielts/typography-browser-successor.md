# IELTS Typography / Global-Browser Successor

Status: **DRAFT / HOLD — non-authorizing evidence successor**

Parent: PR #340 @ `a36e92de18b900bb335f7f29ea7ecbc1b897871d`

## Preserved evidence

PR #340 already has exact-head course-wide color-contrast PASS across seven IELTS routes at 390, 768, and 1440 px. This successor does not alter those color tokens or replay contrast remediation without evidence.

## Why the old broader browser failure is not treated as an IELTS contrast failure

The generic AdSense Exact-Head Browser Certification for #340 reported:

- layout FAIL at all six viewports;
- Axe 0;
- keyboard PASS;
- consent PASS;
- reduced-motion FAIL;
- Save-Data FAIL.

Its captured layout probes are homepage-specific: hero image, homepage CTA, homepage heading, logo/search/menu expectations. Those checks do not establish an IELTS-route typography or layout defect.

Therefore this successor adds an IELTS-scoped exact-preview contract instead of changing IELTS CSS in response to a mismatched homepage contract.

## New exact-preview contract

The successor checks all seven IELTS routes at 390, 768, and 1440 px for:

- exact Cloudflare deployment identity bound to the full candidate SHA;
- rendered IELTS root + visible H1;
- no horizontal overflow;
- computed font family/size/line-height/weight/letter-spacing samples;
- sans-serif-family integrity with no accidental serif/monospace fallback;
- route-level font-family stability across viewports;
- LBFL IELTS paragraph guard: >=15px and computed line-height >=1.4x;
- WCAG 1.4.12 text-spacing stress without route/root overflow;
- reduced-motion state with no visible IELTS animation/transition >0.1s;
- Save-Data environment observed by the page;
- no console/page errors.

The contract records whether Inter/Open Sans are available after `document.fonts.ready`, but it does not invent a mandatory font-family switch. Any actual font-family mutation must be justified by exact-preview evidence.

## Non-authority

This packet does not authorize:

- Ready/merge;
- broad global CSS changes;
- production deployment;
- Cloudflare/Worker/DNS/AdSense mutation;
- a WCAG 2.2 AA conformance claim.

If the new contract fails, the next step is the narrowest IELTS-scoped correction supported by the report.
