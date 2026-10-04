# CONV-04F-09-R50 — prac-03 Whole Mounts Authorization

status: AUTHORIZED CANDIDATE — authorization-only
phase: CONV-04F-09-R50
authorized_base: 1efc9e8176e8408a509ccca8fc82f9fbbc981c22
selected_module: prac-03
learner_mutation_performed: NO

## Production prerequisite

prac-02 Permanent Slides production parity is closed before this authorization:

- PR #431 merged to `main@c545062d5b0cb8f2d49030108ab2915acfae2016`.
- R41 repair PR #432 merged to `main@1efc9e8176e8408a509ccca8fc82f9fbbc981c22`.
- Permanent Slides production workflow run `37221975731`: **SUCCESS**.
- Exact-main authentication: **PASS**.
- Direct Cloudflare Pages production deployment: **PASS**.
- Exact successful deployment resolution: **PASS**.
- Immutable Permanent Slides browser certification: **PASS**.
- Canonical `learningbiologyforlife.org` Permanent Slides browser certification: **PASS**.
- Final exact-main re-authentication: **PASS**.
- Museum production parity, GitHub Pages, Sovereign Site Audit v4, CodeQL, and Ecology live-production certification on the same main: **PASS**.

## Exact prac-03 baseline

- Source: `_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md`
- Blob SHA: `904933f7b29a301f72b7d370582d605364b906e6`
- Route: `/biology/higher-zoology-tree/practical/whole-mounts/`
- `page_id`: `zoology-practical-whole-mounts`
- `course_id`: `zoology-practical-213106`
- `course_role`: `practical-lecture`
- Language: `bn` / locale `bn-BD`
- Published status: `Draft-Ready`
- `time_min`: `120`

## Authenticated content census

The learner source contains exactly:

- **1 H1** — `Preparation and Study of Whole Mounts`;
- **6 H2 sections**:
  1. Core Workflow
  2. Suggested Whole-mount Set
  3. Temporary Whole Mount
  4. Permanent Whole Mount
  5. Quality-control Checklist
  6. Drawing Rule
- **1 H3** — Safety note;
- **1 Markdown reference table with 10 preparation rows**;
- Core Workflow: **9 sequential stages** from specimen selection through label/observe/draw;
- Permanent Whole Mount general logic: **6 numbered stages**;
- Quality-control Checklist: **8 protected checks**;
- Drawing Rule: **5 protected scientific-drawing rules**.

### Ten protected suggested preparations

1. Hydra whole mount
2. Planarian whole mount
3. Rotifer whole mount
4. *Daphnia* whole mount
5. *Cyclops* whole mount
6. Mosquito larva
7. Mosquito pupa
8. Cockroach mouthparts
9. Prawn appendage
10. Nematode small specimen

Additional protected teaching elements:

- purpose statement: whole specimen/organ viewed without sectioning to preserve overall organization;
- Temporary Whole Mount guidance on water/saline/suitable medium and avoiding coverslip crushing;
- Permanent preparation principle that exact fixative, stain, dehydration, clearing agent and mounting resin follow **departmental SOP**;
- Safety note covering ethanol, formalin/formaldehyde, xylene/clearing agents, permanent mountants, ventilation/fume hood, PPE and approved waste stream;
- no new chemical recipe, concentration, exposure time or unsafe protocol is authorized.

## Course-contract custody

Current course-contract blob:

`a02365ea6743c44a1eddaf84ad05f66d670ade6b`

Authenticated module entry:

- module: `prac-03`
- order: `3`
- title: `Whole Mounts`
- source: `_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md`
- route: `/biology/higher-zoology-tree/practical/whole-mounts/`
- previous: `prac-02`
- next: `prac-04`

Coverage-ledger blob:

`ab66ddafc1346b65337bc52236d1029a77cf5792`

Authenticated coverage:

`complete-core-protocol — general preparation + 10 suggested whole mounts`

## Protected Practical baselines

- Practical gateway → `d45ae49889c5e6d02445776ca5120f5fcedda65e`
- prac-01 Museum → `bf14db772daaa5bbf1d7386d7f146b7d9a730799`
- prac-02 Permanent Slides → `0594b755e3cf2301de48e04e60324be3a404531a`
- prac-04 Dissection → `0bca70d74c04305fd2399f54fbb5c650f0b158c3`
- prac-05 Temporary Mounts → `b01e88d0bfe9441e984ac2a10f3a0ee761379850`
- prac-06 Appendages → `36e36c4dd8cfffb99f1669033b4a21bc0e45d939`
- prac-07 Zooplankton → `c120863ca31d85a33f1476b3f5bab59d571950cf`
- prac-08 Field Report → `6398c601c3a1b3cd891e8ea945d704d5d94b9711`
- shared Practical CSS → `0962ae71cd1e424e27949b409f5284493f722dd3`
- shared Practical JS → `207684413ad7925686334cafc3748861a439f206`
- Academic CSS → `e461a46d9defd592bb098adfa12472543dacd41b`
- canonical Learning Guide CTA include → `701c02c2e9faa5e63db71cc8a16cb4ba8c87e233`
- Academic Route Ledger → `3b7e8c109fe5b540ce14c999d57b5d8807d12196`

The current Academic Route Ledger contains **no prac-03 Whole Mounts row**.

## Deterministic Practical sequencing

- `R40–R49`: prac-02 — closed after production parity.
- `R50–R59`: prac-03 Whole Mounts.
- `R60–R69`: prac-04.
- `R70–R79`: prac-05.
- `R80–R89`: prac-06.
- `R90–R99`: prac-07.
- `R100–R109`: prac-08.
- `CONV-04F-10` remains reserved for Ecology.

R50 is authorization-only. The first prac-03 implementation slot is **R51**.

## Authorization for later R51 implementation

After R50 merges, an isolated R51 implementation may mutate exactly:

`_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md`

and the minimum route/certification artifacts strictly required to register and certify that single route.

Authorized learner-facing purpose:

1. add `academic_system: v1`;
2. add `academic_role: practical`;
3. add `learning_guide: canonical`;
4. inject exactly one `{% include education/learning-guide-cta.html %}` immediately after the existing H1;
5. wrap the single unchanged 10-row Markdown table with the existing Academic-v1 / Practical keyboard-focusable scroll-region primitive if required by certification;
6. register exactly one strict Academic Route Ledger row for the canonical Whole Mounts route.

## Protected content and surfaces

R51 must preserve the 10-preparation table, all labels, the 9-stage core workflow, Temporary Whole Mount guidance, six-step permanent logic, Safety note, eight QC checks, five Drawing Rules, route, course identity and module order.

Scientific, taxonomic, curriculum, chemical-protocol or safety rewriting is **not authorized**.

The following remain protected unless a later exact-scope authorization explicitly changes them:

- Practical gateway;
- prac-01 and prac-02;
- prac-04 through prac-08;
- course contract;
- coverage ledger;
- shared Practical CSS/JS;
- Academic CSS;
- canonical Learning Guide include;
- navigation;
- assessment runtime;
- Admission;
- Socratic surfaces;
- Worker/Cloudflare configuration.

## Gate

```text
authenticate main@1efc9e8176e8408a509ccca8fc82f9fbbc981c22
        ↓
prac-02 exact-main production parity PASS
        ↓
authenticate prac-03 blob + content census
        ↓
R50 authorization-only exact head
        ↓
technical certification + zero unresolved threads
        ↓
SOLO exact-head authority + Trusted Governance
        ↓
merge R50
        ↓
new isolated R51 prac-03 implementation branch
```
