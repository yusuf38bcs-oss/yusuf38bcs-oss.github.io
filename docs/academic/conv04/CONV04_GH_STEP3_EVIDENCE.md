# CONV-04 Step 3 — G + H Socratic / Metadata Convergence

**Authorized base:** `778be327b028eae71e72d7d0629b7ac9700123a9`  
**Branch:** `conv-04gh-socratic-metadata-convergence-20261006`

## G — Socratic convergence

Canonical surfaces promoted to the shared platform/Academic-v1 system:

- `/socratic/` → `reflection_gateway`
- `/socratic/multiple-intelligences/` → `reflection`
- `/socratic/personality-archetypes/` → `reflection`
- `/life-practices/cognitive-audit/` → `reflection`

A shared `_includes/socratic/reflection-boundary.html` now states the binding educational/non-clinical boundary. The canonical Socratic pages consume shared platform cards/matrix primitives rather than maintaining separate hero CSS.

MI remains an exploratory learning-engagement reflection; Personality Pattern Reflection remains an LBFL-created reflective lens system. Neither is an intelligence test, clinical assessment, psychometric instrument, learning-style prescription, or fixed personality classification.

Legacy Socratic compatibility routes remain readable but are removed from canonical sitemap ownership.

## H — metadata and route truth

`docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json` now records strict canonical ownership for the Socratic gateway, MI reflection, Personality Pattern Reflection, Cognitive Audit, the Biostatistics gateway, and the nine canonical Biostatistics modules.

Historical Biostatistics aliases remain compatibility routes and are marked `sitemap: false` instead of being deleted.

No false hreflang relationship is emitted where no governed language counterpart exists.

## Shared-system migration of known visual defects

### Higher Zoology matrix

The Higher Zoology gateway now consumes `lbfl-platform-matrix` and `lbfl-platform-card` rather than the older page-local information-grid primitive.

### Biostatistics leading/top gap

Canonical Biostatistics pages are promoted to Academic-v1 metadata and legacy `header.overlay_image` metadata is removed. This removes the blank legacy overlay-hero region at the layout level rather than adding a page-specific spacing override.

The Biostatistics gateway sequence table is wrapped with the shared keyboard-scrollable `lbfl-platform-table-wrap` primitive.

## Protected boundaries

- Homepage V3 content remains untouched until Step 4 / I.
- Worker, Cloudflare, DNS and deployment credentials remain untouched.
- MCQ Arena remains assessment owner.
- Socratic instrument schemas and answer interpretation logic are not mathematically fused.
- No scientific Biostatistics prose, equations, answer keys or statistical claims are rewritten in this step.

## Certification requirements

The candidate must pass:

- Platform Visual System retained certification;
- Academic Design System and Academic Surface Contract;
- Jekyll build;
- route and browser checks;
- whole-Zoology certification;
- CodeQL and Sovereign Site Audit;
- fresh review with zero unresolved threads;
- Trusted Governance on the unchanged exact head.
