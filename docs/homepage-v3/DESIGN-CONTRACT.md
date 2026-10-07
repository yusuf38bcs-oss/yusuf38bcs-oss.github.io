# Homepage V3 — CONV-04I-02 Shared-System Convergence Contract

**Authorized base:** `2ef87d24d73d733d541fcc624474836d72486b30`  
**Candidate branch:** `conv04-i02-homepage-shared-system`  
**State:** isolated implementation / exact-head certification required

## Purpose

CONV-04I-02 does **not** redesign Homepage V3. It converges the existing production Homepage V3 with the certified LBFL shared platform system while preserving the learner narrative:

`Identity → Choice → Experience → Method → Feedback/Repair → Evidence → Action`.

## Preserved design and narrative

- Scientific editorial visual direction.
- Current hero message, pathway model, Synaptic Bridge, repair loop, evidence section and continue section.
- Four main pathways.
- Current first-party navigation destinations, including Admission, IELTS, Socratic, Editorial and About.
- English/Bangla access.
- Reduced-motion and Save-Data behavior.
- Existing Homepage V3 JS behavior unless a separately authorized defect requires mutation.

## I-02 convergence requirements

1. Production root declares `academic_system: v1`, `academic_role: platform_home`, `lang: en`, and `page_id: home`.
2. Homepage identity consumes the canonical `brand/lbfl-identity.html` include backed by `site.logo` and `site.title`.
3. Homepage V3 consumes G-R1 platform shell/font/focus hooks without globally recoloring or rewriting the V3 narrative.
4. Existing shared site search is exposed through the standard search toggle/form/runtime.
5. Existing canonical Brevo newsletter surface is reused; I-02 does not create a second newsletter implementation.
6. Existing canonical legal footer is reused.
7. The curated “Inside the Cell” journey reflects the eight already-published Chapter-01 lessons, without modifying any Biology learner source.
8. English root metadata participates in the established EN/BN `hreflang` pairing.
9. Old V2/staging-only Homepage governance is superseded by this exact-base contract.

## Mutation boundary

Only the I-02 allowlist recorded in `docs/academic/conv04/CONV04_STATE.md` may change.

Explicitly protected:
- `_config.yml`;
- Biology learner sources;
- Admission / PR #356;
- Socratic and assessment runtime;
- shared consent and AdSense implementation;
- redirects;
- Worker, Cloudflare and DNS configuration;
- shared platform source components themselves.

I-02 may **consume** shared components but must not rewrite their source.

## Promotion gate

The PR remains HOLD until the unchanged exact head has:
- I-02 allowlist validator PASS;
- Academic Surface Contract PASS;
- Academic Design System PASS;
- Platform Visual System retained PASS;
- production Jekyll build PASS;
- dedicated Homepage integration browser PASS;
- retained Homepage responsive browser PASS;
- AdSense/CMP exact-head browser PASS;
- fresh review with no material findings;
- zero unresolved review threads;
- SHA-bound solo authority / Trusted Governance PASS.

Merge must use the certified unchanged PR head. CONV-04J remains blocked until the merged exact main passes production parity and CONV-04I is formally closed.
