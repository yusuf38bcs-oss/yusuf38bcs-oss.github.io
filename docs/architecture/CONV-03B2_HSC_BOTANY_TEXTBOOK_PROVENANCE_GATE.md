# CONV-03B.2 — HSC Botany Chapter-01 Textbook Provenance & Page-Custody Gate

**Authorized base:** `8f306f14f0570df5bc46d65f91702984c3c4d692`  
**Parent pathway:** `hsc-botany`  
**Mode:** evidence-first / provenance correction / fail-closed / no lesson authoring

## Objective

CONV-03B.2 was opened to execute the next gate after the NCTB curriculum map: acquire an applicable HSC Biology 1st Paper textbook, bind the eleven remaining Chapter-01 gaps to exact textbook pages, consolidate those gaps into a final lesson architecture, and only then authorize missing-lesson authoring.

The source audit reached a material provenance correction before page mapping could be completed.

## Provenance correction

The current NCTB XI–XII textbook page does not expose a centrally published Biology textbook download alongside the board-published common higher-secondary books.

Official current textbook page:

`https://nctb.gov.bd/pages/static-pages/6922e145933eb65569e2b37b`

NCTB also publishes approval/re-approval registers for XI–XII subject textbooks. Those registers describe the approved books as privately published and identify subject, paper, author, publisher and approved price.

Official NCTB register:

`https://nctb.gov.bd/pages/files/6922da5f933eb65569e040f1`

Official historical attachment used to authenticate the model:

`https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-nctb/2024/12/849ea804187344b4a7dd84cf0e10cd34.pdf`

That attachment includes multiple **Biology 1st Paper** editions among NCTB-approved/re-approved privately published XI–XII textbooks. It establishes the approval model; because it is historical, it does **not** establish that any particular edition is the currently applicable 2026 edition.

Therefore the precise custody target is not “a single centrally published NCTB Biology textbook.” The target is:

> a current applicable **NCTB-approved HSC Biology 1st Paper textbook edition**, with exact edition identity, approval provenance, inspected bytes, SHA-256, Chapter-01 page range, and page-level claim mapping.

## False lead rejected

A candidate URL surfaced during browser discovery:

`https://nctb.gov.bd/publication/20252026/science/xi_xii/biology_xi_v2_20240313.pdf`

A subsequent direct read-only retrieval and browser check returned 404 and could not locate the artifact through the NCTB publication pages. It is therefore **not** recorded as source custody and must not be used for page-level evidence.

## Current custody state

The contract now records:

- NCTB curriculum custody: **acquired**;
- NCTB-approved private-textbook model: **authenticated**;
- current applicable Biology 1st Paper edition selected: **no**;
- current NCTB approval of a selected edition verified: **no**;
- selected textbook bytes acquired: **no**;
- SHA-256: **not available**;
- Chapter-01 textbook page range: **not available**;
- eleven gap-to-textbook-page bindings: **pending**;
- final lesson count: **not authorized**;
- deterministic missing-lesson sequence: **not authorized**;
- missing-lesson authoring: **not authorized**.

## Eleven gap buckets remain explicit

1. `gap-01-cell-wall`
2. `gap-02-chloroplast`
3. `gap-03-vacuole`
4. `gap-04-centriole-microtubule`
5. `gap-05-nuclear-components`
6. `gap-06-cell-chemical-components`
7. `gap-07-prokaryotic-eukaryotic-comparison`
8. `gap-08-cell-size-shape-inclusions`
9. `gap-09-cell-discovery-history`
10. `gap-10-microscopy-mounting-drawing`
11. `gap-11-chapter-practical-integration`

Every gap now has a textbook-page binding record with the explicit state:

`pending-current-approved-edition-custody`

No page number is invented.

## Current public-market candidates are not custody evidence

Current commercial/catalog records can demonstrate that HSC Biology 1st Paper editions continue to exist, but a retailer, blog, scan mirror or download site does not prove current NCTB approval or primary custody.

Accordingly, such sources may assist discovery only. They cannot set:

- `current_nctb_approval_verified = true`;
- `textbook_bytes_obtained = true`;
- a SHA-256;
- Chapter-01 page labels;
- verified gap mappings;
- authoring authority.

## Promotion / authoring gate

Before CONV-03B.2 may authorize lesson architecture, all of the following must be true for one selected edition:

1. exact book title and Biology paper identity are recorded;
2. author(s), publisher and edition/year are verified;
3. current NCTB approval/applicability is verified from primary or sufficiently authoritative evidence;
4. the exact textbook artifact is in reproducible custody;
5. SHA-256 is computed from the exact inspected bytes;
6. Chapter 01 is located with exact PDF and/or printed page labels;
7. all eleven gap buckets are mapped to exact textbook pages or explicitly documented as absent;
8. gap buckets are then consolidated into existing-lesson expansions versus new lessons;
9. a deterministic final lesson sequence is approved;
10. only then may `missing_lesson_authoring_authorized` become true.

## Validator behavior

The CONV-03B.2 validator fails closed if:

- the base SHA changes silently;
- the HSC Botany parent is promoted prematurely;
- the NCTB curriculum custody record drifts;
- the textbook provenance model is rewritten as a centrally published NCTB Biology book without evidence;
- the official NCTB textbook-page or approval-register provenance disappears;
- a current edition is falsely marked selected/approved;
- byte custody, SHA-256 or page range is claimed without source evidence;
- any of the eleven gap-page binding rows disappears;
- a pending gap is assigned invented page labels;
- final lesson count or deterministic sequence is authorized;
- existing-lesson expansion or new-lesson creation is authorized;
- missing-lesson authoring or strict Chapter-01 promotion is enabled.

## Disposition

**CONV-03B.2 SOURCE GATE: HOLD**

This is an evidence HOLD, not a technical CI failure.

The repository may merge the provenance correction and fail-closed guardrail without representing CONV-03B.2 content acquisition as complete. The actual textbook-page acquisition sub-gate remains open until a current applicable NCTB-approved Biology 1st Paper edition is authenticated and its Chapter-01 bytes/pages are inspected.

## Non-authority

This change does not:

- select a textbook edition;
- promote a commercial scan or mirror to primary authority;
- assign textbook page numbers;
- consolidate the eleven gaps into final lessons;
- write Lecture 07 or any other missing lesson;
- rewrite the six published lesson bodies;
- promote Chapter 01 to strict;
- promote `hsc-botany` to strict;
- modify Worker, Cloudflare, DNS, AdSense or production runtime;
- modify Admission PR #356.
