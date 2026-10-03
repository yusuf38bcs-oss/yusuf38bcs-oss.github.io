# CONV-04F-06 — HSC Digestive System Gateway Authorization

**Status:** IMPLEMENTED CANDIDATE — certification pending
**Exact base:** `55fd04f004f3f352cf90d4e026702d6714096072`
**Branch:** `conv-04f-06-digestive-gateway-authorization-20261003`

## Authenticated route owner

Canonical route:

`/biology/hsc-corner/zoology/digestive-system/`

is owned by:

`_biology/hsc-corner/zoology/digestive-system/index.md`

No competing static route owner was found. The page uses `layout: single`; Academic-v1 therefore retains the layout-owned educational boundary. No shared-layout mutation is authorized or applied.

## Protected governed course

The course contract is already **governed / strict** with exact module order `dig-01 → dig-14`.

The authorization manifest binds:

- gateway baseline blob `5adb6967bbe53351dac265bd1a443a120927da8e`;
- course-contract blob `a02365ea6743c44a1eddaf84ad05f66d670ade6b`;
- all fourteen lecture-source blobs.

The course contract and all fourteen lecture files remain byte-identical in F-06.

## Implemented learner mutation

Exactly one learner-facing source is changed:

`_biology/hsc-corner/zoology/digestive-system/index.md`

Added metadata:

```yaml
academic_system: v1
academic_role: academic_gateway
lang: bn
learning_guide: canonical
```

The agreeing legacy `language: bn` is preserved.

Exactly one canonical Learning Guide CTA is added.

The page-local styling layer is removed and existing presentation structure is mapped onto already-owned Academic-v1 primitives:

```text
digestive-course-hero   → lbfl-academic-callout
digestive-lecture-grid  → lbfl-academic-grid
digestive-lecture-card  → lbfl-academic-card
```

No shared CSS or shared layout is changed.

All fourteen lecture links, their order, learner-facing scientific descriptions, and the Editorial and Exam Alignment text are preserved from the authenticated base.

## Route ledger target

The route is registered as:

```text
id: hsc-digestive-system-course-index
academic_role: academic_gateway
language: bn
boundary_owner: layout
learning_guide_owner: canonical
assessment_owner: mcq-arena
enforcement: strict
source_debt: []
live_debt: []
```

## Explicit exclusions

No lecture rewrite, course-contract mutation, assessment-bank/runtime mutation, Higher Zoology, Botany, Socratic, Practical, Admission/#356, Worker, Cloudflare, shared CSS, or shared layout mutation is part of F-06.

## Promotion gate

Draft until the unchanged head passes F-06 source preservation, retained A–E/F-01…F-05/D-04…D-06, production Jekyll, browser/Axe, keyboard/focus, 320px reflow, text spacing, reduced motion, no-JS, CodeQL, review convergence, required Pages and Trusted Governance.

## Role reconciliation

The advance-preparation draft used `academic_role: course_index`. Exact contract recheck showed that `course_index` is not part of the Academic Surface Contract role vocabulary. F-06 therefore uses the valid structural role `academic_gateway`; the fact that this route is the governed 14-lecture course index remains represented by the course contract, route ID, canonical route, and learner content. No scientific/content scope is changed by this correction.
