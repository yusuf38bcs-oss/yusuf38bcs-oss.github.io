# CONV-04F-09-R80 — prac-06 Appendages Authorization

status: AUTHORIZED CANDIDATE — authorization-only
phase: CONV-04F-09-R80
authorized_base: ada44ce7f965aa5ec962662f3fe6ff2e499d4c29
selected_module: prac-06
learner_mutation_performed: NO

## Production prerequisite

prac-05 Temporary Mounts is production-closed before this authorization:

- R71 PR #438 merged to `main@ada44ce7f965aa5ec962662f3fe6ff2e499d4c29`.
- Temporary Mounts production workflow run `37229580006`: **SUCCESS**.
- Exact-main authentication: **PASS**.
- Cloudflare Pages exact production deployment resolution: **PASS**.
- Immutable Temporary Mounts browser certification: **PASS**.
- Canonical `learningbiologyforlife.org` Temporary Mounts browser certification: **PASS**.
- Final exact-main re-authentication: **PASS**.
- Museum, Permanent Slides, Whole Mounts and Dissection production parity, GitHub Pages, Sovereign Site Audit v4, CodeQL, and Ecology live production on the same main: **PASS**.

## Exact prac-06 baseline

- Source: `_biology/higher-zoology-tree/practical/06-appendages.bn.md`
- Blob SHA: `36e36c4dd8cfffb99f1669033b4a21bc0e45d939`
- Route: `/biology/higher-zoology-tree/practical/appendages/`
- `page_id`: `zoology-practical-appendages`
- `course_id`: `zoology-practical-213106`
- `course_role`: `practical-lecture`
- Language: `bn` / locale `bn-BD`
- Published status: `Draft-Ready`
- `time_min`: `120`

## Authenticated content census

Structural baseline:
- **1 H1**
- **5 H2**
- **6 H3**
- **2 Markdown tables**
- **19 Markdown table lines**
- **5 cockroach mouth-part rows**
- **10 prawn appendage rows**
- **5 functional-grouping bullets**
- **6 course-sheet placement rules**
- **5 self-check bullets**
- total source bullet items: **10**

### Cockroach custody

Mouth-parts table:
- Labrum — upper lip / holds food;
- Mandibles — biting/crushing;
- Maxillae — food manipulation;
- Labium — lower lip / manipulation;
- Hypopharynx — tongue-like, salivary-opening relation.

Protected statements:
- mouth-part type: **biting and chewing**;
- thoracic legs: coxa → trochanter → femur → tibia → tarsus → pretarsal claws/arolium;
- cockroach legs are **cursorial/running**, not grasshopper-like saltatorial legs;
- antennae are primarily sensory and must not be falsely classified as true prehensile organs;
- paired cerci support air-current/vibration sensing and rapid escape;
- male phallomeres and female gonapophyses retain their existing reproductive/coupling framing.

### Prawn custody

Protected appendage plan:
`protopod (coxa + basis) + endopod + exopod`, with reduction/modification depending on appendage.

Prawn table contains exactly **10 rows**:
1. Antennule
2. Antenna
3. Mandible
4. Maxillula / Maxilla
5. Maxillipeds
6. Pereiopods
7. Chelipeds
8. Pleopods
9. Male modified pleopod
10. Uropods

Protected functional details include:
- antennular statocyst + biramous flagella;
- antennal scaphocerite;
- gnathal mandible;
- five pairs of pereiopods;
- chelipeds as claw-forming prehensile/offensive-defensive pereiopods;
- pleopods for swimming;
- sex-specific modified pleopod;
- uropods with telson in the tail fan.

### Functional Grouping Required by Syllabus

Exactly **5 protected groups**:
- Locomotory
- Prehensile
- Food capture
- Copulatory
- Defensive/offensive

The existing caution that cockroach antennae must not be forced into “prehensile” remains protected.

### Placement and self-check

Exactly **6 placement rules**:
1. anterior-to-posterior order;
2. left/right consistency;
3. proximal end toward same direction;
4. number each item;
5. draw beside specimen, not over it;
6. label homologous segments consistently.

Exactly **5 self-checks**:
- correct appendage detached;
- intact proximal and distal ends;
- proper sequence;
- proportional drawing;
- readable labels.

## Course-contract custody

Course-contract blob:
`a02365ea6743c44a1eddaf84ad05f66d670ade6b`

Authenticated module:
- module: `prac-06`
- order: `6`
- title: `Appendages`
- source: `_biology/higher-zoology-tree/practical/06-appendages.bn.md`
- route: `/biology/higher-zoology-tree/practical/appendages/`
- previous: `prac-05`
- next: `prac-07`

Coverage-ledger blob:
`ab66ddafc1346b65337bc52236d1029a77cf5792`

Authenticated coverage:
`complete — cockroach + prawn functional categories`

## Protected baselines

- Practical gateway → `d45ae49889c5e6d02445776ca5120f5fcedda65e`
- prac-01 Museum → `bf14db772daaa5bbf1d7386d7f146b7d9a730799`
- prac-02 Permanent Slides → `0594b755e3cf2301de48e04e60324be3a404531a`
- prac-03 Whole Mounts → `e308b42266dbbf5963cd7c9b89c12a6fb2427424`
- prac-04 Dissection → `13b112f04ebf484d74cbca8e98fd39ab70430e3c`
- prac-05 Temporary Mounts → `c91e0bbbd8b10f5503aef0aa262864523949c97a`
- prac-07 Zooplankton → `c120863ca31d85a33f1476b3f5bab59d571950cf`
- prac-08 Field Report → `6398c601c3a1b3cd891e8ea945d704d5d94b9711`
- shared Practical CSS → `0962ae71cd1e424e27949b409f5284493f722dd3`
- shared Practical JS → `207684413ad7925686334cafc3748861a439f206`
- Academic CSS → `e461a46d9defd592bb098adfa12472543dacd41b`
- canonical Learning Guide CTA include → `701c02c2e9faa5e63db71cc8a16cb4ba8c87e233`
- Academic Route Ledger baseline → `626570000de690b8235668e89f4b0d0924e644c0`

The Academic Route Ledger currently contains **no prac-06 Appendages row**.

## Deterministic Practical sequencing

- `R40–R49`: prac-02 — production closed.
- `R50–R59`: prac-03 — production closed.
- `R60–R69`: prac-04 — production closed.
- `R70–R79`: prac-05 — production closed.
- `R80–R89`: prac-06 Appendages.
- `R90–R99`: prac-07.
- `R100–R109`: prac-08.
- `CONV-04F-10` remains reserved for Ecology.

R80 is authorization-only. The first prac-06 implementation slot is **R81**.

## Authorization for later R81 implementation

After R80 merges, an isolated R81 implementation may mutate only the following categories:

1. learner source:
   - `_biology/higher-zoology-tree/practical/06-appendages.bn.md`
2. route ownership:
   - `docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json` — exactly one Appendages row only
3. phase evidence:
   - `docs/academic/conv04/CONV04_STATE.md`
   - one new R81 implementation record under `docs/academic/conv04/`
   - one new R81 implementation manifest under `_data/academic/`
4. dedicated R81 certification only:
   - one new Appendages preservation validator under `.github/scripts/`
   - one new Appendages browser certification under `.github/scripts/`
   - one new Appendages exact-head certification workflow under `.github/workflows/`
   - one new Appendages push-to-main production-parity workflow under `.github/workflows/`

R81 is **not** authorized to modify any pre-existing shared or retained certification workflow/validator, shared CSS/JS/runtime, Academic CSS, Learning Guide include, navigation, assessment runtime, course contract, coverage ledger, Practical gateway, sibling Practical module, Admission, Socratic, or Worker/Cloudflare configuration.

Authorized learner-facing purpose:
1. add `academic_system: v1`;
2. add `academic_role: practical`;
3. add `learning_guide: canonical`;
4. inject exactly one canonical Learning Guide CTA immediately after the existing H1;
5. wrap each of the **two existing Markdown tables** using the existing Academic-v1 / Practical keyboard-focusable named scroll-region accessibility primitive if required by the shared contract;
6. register exactly one strict Academic Route Ledger row for the canonical Appendages route.

The existing 1-H1 / 5-H2 / 6-H3 hierarchy is protected. **R81 may not normalize or otherwise change this heading hierarchy.** If exact-head evidence later demonstrates a concrete accessibility/design need, heading changes require a **new, separately merged exact-scope authorization phase** before any learner-source heading mutation.

Scientific, anatomical, taxonomic, curriculum and appendage-function rewriting is **not authorized**.

## Gate

```text
authenticate main@ada44ce7f965aa5ec962662f3fe6ff2e499d4c29
        ↓
prac-05 exact-main production parity PASS
        ↓
authenticate prac-06 blob + content/functional census
        ↓
R80 authorization-only exact head
        ↓
technical certification + fresh Codex review + zero unresolved threads
        ↓
SOLO exact-head authority + Trusted Governance
        ↓
merge R80
        ↓
new isolated R81 prac-06 implementation branch
```
