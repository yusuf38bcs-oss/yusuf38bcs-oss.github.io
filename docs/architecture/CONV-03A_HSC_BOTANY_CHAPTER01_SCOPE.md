# CONV-03A — HSC Botany Chapter-01 Completion & Route Integrity

**Authorized base:** `a6b5eed429c5b77f8242ce30a98993c08021c3fa`  
**Parent pathway:** `hsc-botany`  
**Mode:** evidence-first / fail-closed / no missing-lesson authoring

## Objective

CONV-03A does not promote HSC Botany to strict governance. It establishes a truthful Chapter-01 scope record, repairs two internal route-integrity defects, verifies assessment coverage of the six published lessons, and blocks missing-lesson authoring until primary textbook/page evidence is in custody.

## Repository finding

The current Chapter-01 gateway publishes six Bengali lessons:

1. Cell, Protoplasm and Cell Theory
2. Plasma Membrane and Fluid Mosaic Model
3. Cytoplasm and Ribosome
4. Endoplasmic Reticulum
5. Golgi Body, Lysosome and Peroxisome
6. Mitochondria

All six currently expose both MCQ and CQ assessment surfaces.

The gateway previously contained two non-existent `/bn/...` synaptic links for Lecture 01 and Lecture 06. CONV-03A repairs those references to the actual canonical Bengali routes under `/biology/hsc-corner/botany/...`.

## Scope authentication

Independent curriculum evidence shows that Chapter 01 extends beyond the six published lessons.

Government Teachers Portal records place Plastid/Chloroplast and Nucleus inside Class XI Biology 1st Paper, Chapter 01. An independent HSC syllabus map additionally lists cell wall, chloroplast, centriole, nucleus, chromosome, DNA/RNA structure, DNA replication, transcription, translation, gene and genetic code within the same chapter.

Therefore:

- planned Lecture 07 (Plastid/Chloroplast) is required;
- planned Lecture 08 (Nucleus/Chromosome) is required;
- Lecture 07–08 alone are not sufficient to certify Chapter 01 complete;
- cell wall, centriole and hereditary-material/gene-expression coverage remain unresolved;
- Chapter-01 strict promotion is not authorized.

## Source-authority boundary

This run has government-platform corroboration and an independent syllabus map, but it does **not** claim direct NCTB primary textbook/page custody for the missing topics.

Accordingly:

`missing_lesson_authoring_authorized = false`

No missing lesson is to be authored from secondary summaries alone. Primary textbook/page evidence must be acquired and mapped before learner-content authoring begins.

## Assessment audit

The six currently published lessons were checked for the existing assessment surfaces used by LBFL:

- MCQ: 6/6
- CQ: 6/6

This proves assessment presence for the current published subset only. It does not prove Chapter-01 completion or authorize a chapter-completion assessment.

## Contract behavior

`_data/academic/hsc_botany_chapter01_scope_v1.json` records:

- exact authorized base;
- current canonical chapter route;
- six published lessons and routes;
- required coverage units and current status;
- source-evidence classes;
- primary-text custody state;
- assessment coverage;
- strict-promotion and missing-authoring authority.

`scripts/academic/validate_botany_chapter01_scope.py` fails closed if:

- HSC Botany is no longer progressive during CONV-03A;
- the chapter gateway or lesson files disappear;
- lesson permalinks no longer match the evidence contract;
- MCQ/CQ evidence changes unexpectedly;
- the repaired canonical routes regress;
- the forbidden `/bn/biology/hsc-corner/botany/` prefix returns to the chapter gateway;
- the authenticated coverage-unit set changes silently;
- incomplete scope is falsely marked strict;
- missing-lesson authoring is enabled without primary-text custody;
- source-evidence classes are removed.

## Promotion boundary

CONV-03A may pass while Chapter 01 remains incomplete. That is intentional: the gate certifies that the incompleteness is explicitly represented and cannot be silently promoted.

Strict child-pathway promotion requires a later, separately authorized change after:

1. primary textbook/page custody is obtained;
2. all required Chapter-01 coverage units are mapped;
3. missing lessons are authored and academically reviewed;
4. each new lesson has assessment evidence;
5. canonical route and previous/next sequence are deterministic;
6. the parent `hsc-botany` gateway remains progressive until later chapters are governed.

## Non-authority

CONV-03A does not:

- write Lecture 07 or Lecture 08;
- invent a final chapter lesson count;
- declare Chapter 01 complete;
- promote `hsc-botany` to strict;
- modify Worker, Cloudflare, DNS, AdSense or production deployment;
- modify Admission PR #356;
- rewrite the six existing lesson bodies.
