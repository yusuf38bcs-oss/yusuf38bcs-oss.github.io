# CONV-04F-09-R4 — prac-02 Permanent Slides Authorization

status: AUTHORIZED CANDIDATE — authorization-only
phase: CONV-04F-09-R4
authorized_base: 230f04374e82e5590b4f5bf9ade1535b0a1f3669
selected_module: prac-02
learner_mutation_performed: NO

## Production prerequisite

prac-01 production parity is closed before this authorization:

- PR #429 merged to `main@230f04374e82e5590b4f5bf9ade1535b0a1f3669`.
- Production workflow run `37191548645`: **SUCCESS**.
- Direct Wrangler Pages upload: **PASS**.
- Exact production deployment resolution: **PASS**.
- Immutable Museum browser certification: **PASS / 11 checks**.
- Canonical Museum browser certification: **PASS / 11 checks**.
- Final exact-main re-authentication: **PASS**.
- GitHub Pages, Sovereign Site Audit v4 and CodeQL on the merged main: **PASS**.

## Exact prac-02 baseline

- Source: `_biology/higher-zoology-tree/practical/02-permanent-slides.bn.md`
- Blob SHA: `50825b1a7178d062c437cf10b2a1d8ef8c1780f8`
- Route: `/biology/higher-zoology-tree/practical/permanent-slides/`
- `page_id`: `zoology-practical-permanent-slides`
- `course_id`: `zoology-practical-213106`
- `course_role`: `practical-lecture`
- Language: `bn` / locale `bn-BD`
- Published status: `Draft-Ready`

## Authenticated content census

The source contains a **43-preparation teaching bank**:

| Section | Authenticated count |
|---|---:|
| A. Whole Animals — Protozoans, Rotifers & Arthropods | 8 |
| B. Mouth Parts of Arthropods | 6 |
| C. Parasites — Nematodes & Platyhelminths | 11 |
| D. Larval Forms of Invertebrates | 10 |
| E. Histological Slides of Invertebrates | 8 |
| **Total** | **43** |

Additional protected teaching elements:

- syllabus minimum: **at least 20 slides / ≥20**;
- modern terminology note distinguishing traditional “protozoans” teaching terminology from modern taxonomy;
- mouthpart slide-answer rule;
- Permanent-slide Spotting Template;
- microscope workflow: **6 steps**.

## Course-contract custody

Current course-contract blob:

`a02365ea6743c44a1eddaf84ad05f66d670ade6b`

Authenticated module entry:

- module: `prac-02`
- order: `2`
- title: `Permanent Slides`
- source: `_biology/higher-zoology-tree/practical/02-permanent-slides.bn.md`
- route: `/biology/higher-zoology-tree/practical/permanent-slides/`
- previous: `prac-01`
- next: `prac-03`

Shared Practical baselines remain:

- `assets/css/zoology-practical.css` → `0962ae71cd1e424e27949b409f5284493f722dd3`
- `assets/js/zoology-practical.js` → `207684413ad7925686334cafc3748861a439f206`

## Authorization

After this authorization merges, the isolated prac-02 implementation may mutate exactly:

`_biology/higher-zoology-tree/practical/02-permanent-slides.bn.md`

Authorized purpose:

1. bind the page to Academic-v1 with role `practical`;
2. bind canonical Learning Guide ownership and inject exactly one canonical Learning Guide CTA;
3. apply only existing Academic-v1/Practical accessibility or presentation primitives if exact-head certification proves they are required.

## Protected content and surfaces

The implementation must preserve the 43-preparation corpus, ≥20 syllabus rule, all diagnostic cues, taxonomy/terminology note, spotting template, six-step microscope workflow, route, course identity and module order.

Scientific, taxonomic or curriculum rewriting is **not authorized**.

The following remain protected unless a later exact-scope authorization says otherwise:

- Practical gateway;
- prac-01 Museum Specimens;
- prac-03 through prac-08;
- course contract;
- shared Practical CSS/JS;
- navigation;
- assessment runtime;
- Admission work;
- Socratic surfaces;
- Worker/Cloudflare configuration.

## Gate

```text
authenticate main@230f04374e82e5590b4f5bf9ade1535b0a1f3669
        ↓
prac-01 production parity PASS
        ↓
authenticate prac-02 blob + 43-item census
        ↓
R4 authorization-only exact head
        ↓
technical certification + zero unresolved threads
        ↓
SOLO exact-head authority + Trusted Governance
        ↓
merge authorization
        ↓
new isolated prac-02 implementation branch
```
