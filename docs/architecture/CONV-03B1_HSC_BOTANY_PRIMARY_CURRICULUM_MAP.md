# CONV-03B.1 — HSC Botany Chapter-01 Primary Curriculum Custody & Topic-to-Lesson Map

**Authorized base:** `3626353584608434123ee71c32e368c078f5d3b0`  
**Parent pathway:** `hsc-botany`  
**Mode:** primary-curriculum evidence / fail-closed / no missing-lesson authoring

## Objective

CONV-03B.1 replaces the active secondary-syllabus assumptions introduced during the earlier forensic stage with the official NCTB Biology curriculum source for HSC Chapter 01, then maps every acquired curriculum topic to either an existing LBFL lesson or an explicit unresolved coverage gap.

This change does **not** write new lessons and does **not** promote Chapter 01 or the parent HSC Botany pathway to strict governance.

## Primary NCTB custody

Official source index:

`https://nctb.gov.bd/pages/files/6922dbc6933eb65569e0c702`

Official Biology curriculum PDF:

`https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-nctb/2024/12/ca39e59575134a74b26a35b760d193eb.pdf`

Document identity:

**জাতীয় শিক্ষাক্রম ২০১২ — জীববিজ্ঞান (একাদশ ও দ্বাদশ শ্রেণি)**

Chapter:

**প্রথম অধ্যায়: কোষ ও এর গঠন**

Authenticated chapter range:

**PDF pages 31–33**

Allocated time:

**25 periods**

This establishes **primary curriculum custody**. It does not establish full NCTB textbook-chapter/page custody.

## Secondary assumptions retired

The previous active evidence contract used a secondary syllabus index to assert the following as required Chapter-01 topics:

- DNA/RNA structure
- DNA replication
- transcription/translation
- gene/genetic code

Those assertions are now removed from the active required-topic map because the acquired NCTB curriculum pages 31–33, as reviewed in CONV-03B.1, do not establish them as part of this authenticated scope.

This is not a claim that those concepts never occur elsewhere in HSC Biology. It is only a provenance decision: CONV-03B.1 will not require them for Chapter-01 completion unless a primary source establishes them.

## Exact topic → existing lesson → gap map

| NCTB topic / subtopic | Current LBFL evidence | Status | Explicit gap |
|---|---|---:|---|
| Cell wall | no dedicated current lesson | Missing | `gap-01-cell-wall` |
| Plasmalemma / plasma membrane | `bot-02` | Covered | — |
| Cytoplasm | `bot-03` | Covered | — |
| Ribosome | `bot-03` | Covered | — |
| Endoplasmic reticulum (RER/SER) | `bot-04` | Covered | — |
| Golgi apparatus | `bot-05` | Covered | — |
| Mitochondrion | `bot-06` | Covered | — |
| Chloroplast | no dedicated current lesson | Missing | `gap-02-chloroplast` |
| Lysosome | `bot-05` | Covered | — |
| Vacuole | no adequate current lesson | Missing | `gap-03-vacuole` |
| Centriole / microtubule structures | no adequate current lesson | Missing | `gap-04-centriole-microtubule` |
| Nucleus, nucleolus, chromatin/chromosome | nucleus is introduced in `bot-01`, detailed scope absent | Partial | `gap-05-nuclear-components` |
| Chemical components of cell | no curriculum-level dedicated coverage | Missing | `gap-06-cell-chemical-components` |
| Prokaryotic vs eukaryotic comparison | scattered comparisons in `bot-03`, `bot-04`, `bot-06` | Partial | `gap-07-prokaryotic-eukaryotic-comparison` |
| Unicellular vs multicellular organization | `bot-01` | Covered | — |
| Cell size, shape and inclusions | no adequate current lesson | Missing | `gap-08-cell-size-shape-inclusions` |
| Cell theory + brief history of discovery | cell theory in `bot-01`; history not adequately covered | Partial | `gap-09-cell-discovery-history` |
| Microscopy, preparation, mounting and drawing | limited observation context in `bot-01`; practical method incomplete | Partial | `gap-10-microscopy-mounting-drawing` |
| Organelle structure–function relationships | distributed across `bot-02`–`bot-06` | Covered | — |
| Practical/applied observations and exercises | activities exist across current lessons; chapter-level practical integration incomplete | Partial | `gap-11-chapter-practical-integration` |

## Existing lesson identity

- `bot-01` — Cell, Protoplasm and Cell Theory
- `bot-02` — Plasma Membrane and Fluid Mosaic Model
- `bot-03` — Cytoplasm and Ribosome
- `bot-04` — Endoplasmic Reticulum
- `bot-05` — Golgi Body, Lysosome and Peroxisome
- `bot-06` — Mitochondria

All six retain their existing canonical routes and MCQ/CQ assessment evidence.

## Missing-lesson architecture boundary

The eleven gap IDs are **provisional coverage buckets**, not final lesson titles or final lesson count.

They may later be combined or split after full NCTB textbook-chapter/page custody is acquired. Therefore:

`missing_lesson_authoring_authorized = false`

and:

`strict_child_authorized = false`

No lesson 07/08/future numbering is certified by this change.

## Validator behavior

The updated validator fails closed if:

- the exact CONV-03B.1 authorized base drifts;
- HSC Botany is promoted from progressive during this stage;
- Chapter 01 is falsely marked complete;
- the official NCTB source URLs or page range 31–33 change;
- the 25-period curriculum allocation changes;
- secondary-syllabus evidence returns as active authority;
- retired secondary assumptions return to the active topic map;
- any of the 20 NCTB-derived topic-map entries disappears or duplicates;
- existing lesson route/MCQ/CQ evidence changes silently;
- an incomplete topic lacks an explicit gap bucket;
- a covered topic incorrectly keeps a gap;
- textbook-chapter custody is falsely claimed;
- missing-lesson authoring or strict promotion is enabled.

## Non-authority

CONV-03B.1 does not:

- claim possession of the full NCTB textbook Chapter 01;
- author missing lessons;
- choose a final lesson count;
- promote Chapter 01 to strict;
- promote `hsc-botany` to strict;
- rewrite the six published lesson bodies;
- modify Worker, Cloudflare, DNS, AdSense or production runtime;
- modify Admission PR #356.

## Next gate after merge

After CONV-03B.1 is merged and certified, the next academic gate is:

**CONV-03B.2 — NCTB textbook Chapter-01 page custody + gap-bucket consolidation into an authorized lesson architecture.**

Only that later gate may decide which gaps become dedicated lessons, which are merged into existing lessons, and what the final sequence should be.
