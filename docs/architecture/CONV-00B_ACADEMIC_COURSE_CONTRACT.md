# CONV-00B — Academic Course Contract

**Status:** architecture foundation  
**Authorized base:** `3bb09212cbd3dbf1ec0440d4ca31821a02ae8475`  
**Release intent:** establish a machine-verifiable academic pathway contract before learner-facing convergence.

## Purpose

CONV-00B changes the unit of governance from an individual page to an academic pathway. It does not rewrite lessons, redesign the site, merge Admission R2, or migrate public routes.

Every governed pathway now has a stable identity, academic level, canonical route, gateway source, authority label, assessment boundary, prerequisite set, legacy-route declaration, and enforcement state.

## Enforcement model

- **strict** — the gateway and complete ordered module sequence are release-blocking. Module source files, unique routes, contiguous numbering, and previous/next links must remain coherent.
- **progressive** — the gateway identity is release-blocking, but module-level convergence is explicitly pending. Each such pathway carries a convergence wave and target. Promotion to strict is a deliberate later PR.

The validator also discovers current academic gateway files. A newly introduced gateway cannot silently bypass the registry.

## Initial strict pathways

1. Animal Diversity — 10 lectures.
2. Ecology — 10 lectures.
3. Genetics — 17 lectures.
4. HSC Zoology Digestive System — 14 lectures.
5. Zoology Practical-I (213106) — 8 modules.

These five sequences are represented explicitly in the registry and are checked as deterministic chains.

## Progressive convergence queue

| Wave | Pathway | Required convergence |
|---:|---|---|
| 1 | Human Physiology | **CONV-01 implemented:** integration gateway owns no duplicate lessons; circulation, respiration, and digestion point to their canonical course owners and form a strict 3-module integration sequence. |
| 2 | Biostatistics | Normalize duplicate topic files, order the quantitative course, bind worked assessments. |
| 3 | HSC Botany | Promote chapter-by-chapter with canonical chapter identity, lesson sequence, authority and assessment. |
| 4 | HSC Zoology | Split the mixed gateway into governed course families while preserving return-to-source links. |
| 5 | Physiology | Reconcile Higher Zoology, Human Physiology and HSC system-course ownership. |
| 6 | Human Behaviour | Separate academic mechanism from reflective enrichment and preserve assessment boundaries. |
| 7 | Research Methodology | Define deterministic sequence and bind statistical prerequisites, evidence handling and integrity. |

## Fail-closed invariants

The certification fails for duplicate course IDs, duplicate canonical routes, missing gateways, unregistered discovered gateways, missing strict module files, non-contiguous module numbering, broken previous/next chains, duplicate module routes, unknown prerequisites, prerequisite cycles, or invalid enforcement/status combinations.

## Admission boundary

PR #356 and Admission R2 remain a separate evidence-acquisition stream. CONV-00B does not change, rebase, promote, merge, publish, or otherwise authorize that stream.

## Next architecture gates

After CONV-00B is certified:

1. **CONV-01 — Human Physiology ownership and course map**
2. **CONV-02 — Biostatistics deterministic course sequence**
3. **CONV-03 — HSC Botany chapter contract**
4. **CONV-04 — HSC Zoology family decomposition**
5. Later waves continue until every progressive pathway can be promoted to strict.

No pathway should be promoted by visual similarity alone. Promotion requires an explicit source/gateway identity, stable canonical route, deterministic module sequence where applicable, and an assessment boundary.


## CONV-01 execution note

Human Physiology is promoted from `progressive` to `strict` by CONV-01. The gateway is explicitly an integration layer, while course ownership remains with the existing circulation, respiration and digestion sources. Systems without a certified canonical owner remain outside the governed module count.
