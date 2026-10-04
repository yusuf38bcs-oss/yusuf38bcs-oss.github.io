# CONV-04F-09-R60 — prac-04 Dissection Authorization

status: AUTHORIZED CANDIDATE — authorization-only
phase: CONV-04F-09-R60
authorized_base: 6122cbc6b2924c8963232c0ae258ff6c98d7415f
selected_module: prac-04
learner_mutation_performed: NO

## Production prerequisite

prac-03 Whole Mounts production parity is closed before this authorization:

- R51 PR #434 merged to `main@6122cbc6b2924c8963232c0ae258ff6c98d7415f`.
- Whole Mounts production workflow run `37224014861`: **SUCCESS**.
- Exact-main authentication: **PASS**.
- Cloudflare Pages production deployment + exact deployment resolution: **PASS**.
- Immutable Whole Mounts browser certification: **PASS**.
- Canonical `learningbiologyforlife.org` Whole Mounts browser certification: **PASS**.
- Final exact-main re-authentication: **PASS**.
- Permanent Slides parity, Museum parity, GitHub Pages, Sovereign Site Audit v4, CodeQL, and Ecology live production on the same main: **PASS**.

## Exact prac-04 baseline

- Source: `_biology/higher-zoology-tree/practical/04-dissection.bn.md`
- Blob SHA: `0bca70d74c04305fd2399f54fbb5c650f0b158c3`
- Route: `/biology/higher-zoology-tree/practical/dissection/`
- `page_id`: `zoology-practical-dissection`
- `course_id`: `zoology-practical-213106`
- `course_role`: `practical-lecture`
- Language: `bn` / locale `bn-BD`
- Published status: `Draft-Ready`
- `time_min`: `300`

## Authenticated content census

Structural baseline:
- **6 H1**
- **22 H2**
- **29 H3**
- **0 Markdown tables**
- **7 General Dissection Rules**
- **5 External Morphology taxa**
- **11 Major Dissections**
- **6 Minor Dissections**
- **7 Drawing Template rules**
- **6 Practical Viva questions**

Syllabus-map custody:
- Major circulatory: **2** — earthworm, prawn
- Major nervous: **5** — cockroach, grasshopper, prawn, *Pila*, *Lamellidens*
- Major reproductive: **4** — earthworm, cockroach, grasshopper, prawn
- Major total: **11**
- Minor digestive: **3** — prawn, *Pila*, *Lamellidens*
- Minor nervous: **3** — cockroach, grasshopper, prawn
- Minor total: **6**

External morphology custody:
- Earthworm
- Cockroach
- Prawn
- *Pila*
- *Lamellidens*

Protected teaching boundaries include orientation, shallow cutting, pinning, organ-preservation, wet-specimen handling, display logic, labels, common-error notes, male/female comparisons, drawing rules, and viva questions.

No new preservative, anaesthetic, fixative, stain, clearing-agent, dose/concentration, exposure-time, incision-depth prescription, or unsafe laboratory procedure is authorized.

## Course-contract custody

Current course-contract blob:
`a02365ea6743c44a1eddaf84ad05f66d670ade6b`

Authenticated module:
- module: `prac-04`
- order: `4`
- title: `Dissection`
- source: `_biology/higher-zoology-tree/practical/04-dissection.bn.md`
- route: `/biology/higher-zoology-tree/practical/dissection/`
- previous: `prac-03`
- next: `prac-05`

Coverage-ledger blob:
`ab66ddafc1346b65337bc52236d1029a77cf5792`

Authenticated coverage:
`complete-syllabus-map — all listed major/minor systems + external morphology`

## Protected baselines

- Practical gateway → `d45ae49889c5e6d02445776ca5120f5fcedda65e`
- prac-01 Museum → `bf14db772daaa5bbf1d7386d7f146b7d9a730799`
- prac-02 Permanent Slides → `0594b755e3cf2301de48e04e60324be3a404531a`
- prac-03 Whole Mounts → `e308b42266dbbf5963cd7c9b89c12a6fb2427424`
- prac-05 Temporary Mounts → `b01e88d0bfe9441e984ac2a10f3a0ee761379850`
- prac-06 Appendages → `36e36c4dd8cfffb99f1669033b4a21bc0e45d939`
- prac-07 Zooplankton → `c120863ca31d85a33f1476b3f5bab59d571950cf`
- prac-08 Field Report → `6398c601c3a1b3cd891e8ea945d704d5d94b9711`
- shared Practical CSS → `0962ae71cd1e424e27949b409f5284493f722dd3`
- shared Practical JS → `207684413ad7925686334cafc3748861a439f206`
- Academic CSS → `e461a46d9defd592bb098adfa12472543dacd41b`
- canonical Learning Guide CTA include → `701c02c2e9faa5e63db71cc8a16cb4ba8c87e233`
- Academic Route Ledger baseline → `881f9c6542edf69168b5202b358936390c19c523`

The Academic Route Ledger currently contains **no prac-04 Dissection row**.

## Deterministic Practical sequencing

- `R40–R49`: prac-02 — production closed.
- `R50–R59`: prac-03 — production closed.
- `R60–R69`: prac-04 Dissection.
- `R70–R79`: prac-05.
- `R80–R89`: prac-06.
- `R90–R99`: prac-07.
- `R100–R109`: prac-08.
- `CONV-04F-10` remains reserved for Ecology.

R60 is authorization-only. The first prac-04 implementation slot is **R61**.

## Authorization for later R61 implementation

After R60 merges, an isolated R61 implementation may mutate exactly:

`_biology/higher-zoology-tree/practical/04-dissection.bn.md`

and the minimum strict route/certification artifacts required for that single route.

Authorized learner-facing purpose:
1. add `academic_system: v1`;
2. add `academic_role: practical`;
3. add `learning_guide: canonical`;
4. inject exactly one canonical Learning Guide CTA immediately after the first existing H1;
5. register exactly one strict Academic Route Ledger row for the canonical Dissection route.

There is no baseline Markdown table, so no table wrapper is authorized by default.

The existing 6-H1 / 22-H2 / 29-H3 hierarchy is protected as baseline. Heading normalization is **not authorized** in R61 unless an exact-head accessibility/design failure demonstrates a concrete need and a separately authenticated remediation explicitly scopes that change.

Scientific, anatomical, curriculum, dissection-protocol and safety rewriting is **not authorized**.

## Gate

```text
authenticate main@6122cbc6b2924c8963232c0ae258ff6c98d7415f
        ↓
prac-03 exact-main production parity PASS
        ↓
authenticate prac-04 blob + syllabus/content census
        ↓
R60 authorization-only exact head
        ↓
technical certification + zero unresolved threads
        ↓
SOLO exact-head authority + Trusted Governance
        ↓
merge R60
        ↓
new isolated R61 prac-04 implementation branch
```
