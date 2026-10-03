# CONV-04F-09 — Practical Museum Specimens Module Convergence

**Status:** AUTHORIZED IMPLEMENTATION CANDIDATE  
**Exact authorized base:** `f04ac472ee261fa19dc17de6052bde02b75e99c4`  
**Selected module:** `prac-01 — Museum Specimens`  
**Target source:** `_biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md`  
**Target route:** `/biology/higher-zoology-tree/practical/museum-specimens/`  
**Baseline blob:** `26e1711cf9c6bace8ddd8419797c38511987420c`

## Authenticated content-preservation baseline

The exact base records:

- 49 printed syllabus entries;
- 48 unique labels;
- 48/48 unique labels covered;
- duplicated printed label: `Echinus`;
- exactly 48 numbered specimen sections;
- exactly 48 classification tables plus one high-yield comparison table;
- every specimen section retains identifying characters and practical identification;
- 15 provenance-bound verified images rendered publicly;
- 33 image slots remain `pending-verified-image` and must not render publicly;
- the strict `nu-zoology-practical-213106` course contract and eight-module order are unchanged.

Evidence custody:

- Museum source blob: `26e1711cf9c6bace8ddd8419797c38511987420c`
- Coverage ledger blob: `ab66ddafc1346b65337bc52236d1029a77cf5792`
- Figure-evidence manifest blob: `9529da79d51bfff15c56128bfcf56a88a6735869`
- Course-contract blob: `a02365ea6743c44a1eddaf84ad05f66d670ade6b`
- Shared Practical CSS blob: `0962ae71cd1e424e27949b409f5284493f722dd3`
- Shared Practical JS blob: `207684413ad7925686334cafc3748861a439f206`

The seven existing nomenclature cautions remain evidence-bearing content and are not rewritten in F-09.

## Exact learner mutation allowlist

F-09 may mutate exactly one learner-facing source:

`_biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md`

Authorized source transformation is limited to:

1. add `academic_system: v1`;
2. add `academic_role: practical`;
3. add `learning_guide: canonical`;
4. inject exactly one canonical Learning Guide CTA immediately after the source H1;
5. link one new route-owned stylesheet: `/assets/css/zoology-practical-museum-f09.css`;
6. remove exactly the 15 inline sprite-coordinate style attributes and reproduce the same coordinates in that route-owned stylesheet.

No scientific, taxonomic, classification, diagnostic-character, nomenclature, curriculum, assessment, or spotting-template wording may change.

## Route-owned presentation authority

F-09 may create:

`assets/css/zoology-practical-museum-f09.css`

This stylesheet may only:

- reproduce the 15 existing sprite coordinates using the existing `data-specimen` identities;
- provide Museum-route Academic-v1 table contrast/reflow ownership;
- provide responsive and reduced-motion behavior for that route.

Shared `assets/css/zoology-practical.css`, `assets/js/zoology-practical.js`, and `assets/css/academic-design-system.css` are protected.

## Academic Surface target

Register one strict route:

- id: `higher-zoology-practical-museum-specimens`
- role: `practical`
- language: `bn`
- boundary owner: `layout`
- Learning Guide owner: `canonical`
- assessment owner: `mcq-arena`
- enforcement: `strict`
- source debt: none
- live debt: none

## Protected boundary

F-09 must not mutate:

- Practical gateway;
- prac-02 through prac-08 learner sources;
- Practical coverage ledger;
- Museum figure-evidence manifest;
- strict Practical course contract;
- shared Practical CSS or JS;
- shared Academic-v1 CSS;
- assessment runtime;
- Socratic;
- Admission/#356;
- Worker or Cloudflare configuration.

## Promotion gate

Draft until exact-head source transformation, content/evidence preservation, native Practical 213106 certification, retained F-08/A–F contracts, production Jekyll, Museum browser/Axe/keyboard/reflow/text-spacing/reduced-motion/no-JS, exact Cloudflare preview, CodeQL/review convergence where triggered, zero unresolved threads, Pages requirements and Trusted Governance pass.

A Ready transition requires an exact solo-maintainer approval marker bound to the unchanged candidate head.
