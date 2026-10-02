# CONV-04D-02 — Academic MCQ Gateway Repair

**Route:** `/mcq-arena/academic/`
**Authorized base:** `ee7a10d419a1ee970a1a18b8eda98ffce7b32923`
**Learner mutation:** exactly `_mcq-arena/academic/index.md`

## Purpose

D-02 turns the Academic MCQ gateway into the canonical discovery and repair entry point for the six existing academic MCQ sets without changing any assessment bank or runtime.

## Repaired defects

1. Replace the false post-category query with the authoritative `mcq-arena` Jekyll collection.
2. Remove the false empty state when the six collection assessments exist.
3. Replace diagnostic/neural/cognitive-model framing with educational assessment language.
4. Opt the route into Academic v1 as `assessment_gateway`.
5. Remove the page-specific inline style layer and use the Core Academic Design System.
6. Make the D-01 loop visible at the gateway: **Attempt → Feedback → Repair → Reattempt**.
7. Give every module a stable source-return path using the HSC Botany or HSC Zoology hub.

## Deliberate non-goals

D-02 does not:

- rewrite any of the six MCQ banks;
- consolidate `assets/js/learning/mcq-engine.js` with the inline `mcq-arena.html` runtime;
- claim every assessment page already implements a complete programmatic reattempt controller;
- change model tests;
- change Biology lessons;
- change Socratic or Practical;
- authorize BOT-08;
- touch Admission/#356;
- touch Worker or Cloudflare configuration.

## Certification target

The built route must:

- return HTTP 200;
- expose Academic v1 and role `assessment_gateway`;
- render exactly six assessment modules;
- link to all six expected assessment routes;
- give all six cards a source-review link;
- expose exactly the canonical repair loop;
- contain no old diagnostic/neural wording;
- contain no raw Liquid;
- remain usable with JavaScript disabled;
- pass text-spacing checks;
- have no more than 2 px horizontal overflow;
- have zero serious/critical Axe violations.
