# CONV-04F-09-R90 — prac-07 Zooplankton Authorization

status: AUTHORIZED CANDIDATE — authorization-only
phase: CONV-04F-09-R90
authorized_base: e6b5a203c36b6d59b06d943430217d866dee623e
selected_module: prac-07
learner_mutation_performed: NO

## Production prerequisite

prac-06 Appendages is production-closed before this authorization:

- R81 PR #440 merged to `main@e6b5a203c36b6d59b06d943430217d866dee623e`.
- Appendages production workflow run `37255912963`: **SUCCESS**.
- Exact-main authentication: **PASS**.
- Reviewed/pinned Wrangler `4.147.0` install before token-bearing deploy: **PASS**.
- Cloudflare Pages exact production deployment: **PASS**.
- Exact production deployment resolution: **PASS**.
- Immutable Appendages browser certification: **PASS**.
- Canonical `learningbiologyforlife.org` Appendages browser certification: **PASS**.
- Final exact-main re-authentication: **PASS**.
- Same-main Museum, Permanent Slides, Whole Mounts, Dissection and Temporary Mounts production parity: **PASS**.
- Same-main GitHub Pages, Sovereign Site Audit v4 and CodeQL: **PASS**.

## Exact prac-07 baseline

- Source: `_biology/higher-zoology-tree/practical/07-zooplankton.bn.md`
- Blob SHA: `c120863ca31d85a33f1476b3f5bab59d571950cf`
- Route: `/biology/higher-zoology-tree/practical/zooplankton/`
- `page_id`: `zoology-practical-zooplankton`
- `course_id`: `zoology-practical-213106`
- `course_role`: `practical-lecture`
- Language: `bn` / locale `bn-BD`
- Published status: `Draft-Ready`
- `math: true`
- `time_min`: `180`

## Authenticated content census

Structural baseline:
- **1 H1**
- **13 H2**
- **3 H3**
- **3 Markdown tables**
- **33 Markdown table lines**
- **11 numbered list items total** = 6 Sampling Logic steps + 5 Discussion Questions
- **13 bullet items total** = 7 Minimum Design + 6 Results Presentation

### Research and sampling custody

Protected Research Question:
- compare zooplankton abundance and diversity across **three water bodies**.

Minimum Design contains exactly **7 protected bullets**:
1. 3 different water bodies;
2. same/specified sampling volume;
3. consistent sampling time-window where possible;
4. replicate subsamples;
5. same taxonomic resolution;
6. hemocytometer/counting-chamber based counts;
7. Simpson + Shannon comparison.

Suggested Metadata table:
- exactly **11 data rows**;
- Site ID, locality/GPS, date/time, water-body type, temperature, pH, transparency/turbidity, sampling volume, net mesh size, concentrated final volume, replicate number.

Sampling Logic:
- exactly **6 numbered steps**;
- representative sampling;
- filtered-volume record when plankton net is used;
- known concentrate volume;
- homogeneous subsample;
- bubble avoidance;
- consistent grid/counting rule.

The existing *Daphnia* / hemocytometer caution and departmental-equipment boundary are protected verbatim in meaning and must not be silently expanded into a new laboratory protocol.

## Quantification and formula custody

Protected formulas/concepts:
- concentrate density = total individuals counted / total chamber volume examined × dilution factor;
- original-water density = concentrate density × V_concentrate / V_filtered;
- examined volume `V = A × d`;
- replicate mean `x̄ = (x₁ + x₂ + … + xᵣ)/r`;
- relative abundance `pᵢ = nᵢ/N`;
- Shannon diversity `H' = -Σ pᵢ ln pᵢ`;
- Simpson dominance `D = Σnᵢ(nᵢ−1) / N(N−1)`;
- Simpson diversity `1-D`;
- warning not to compare papers using different Simpson conventions.

No mathematical, statistical, ecological, sampling-method, equipment, safety, or curriculum rewrite is authorized in R90/R91.

## Data/result custody

Example Data Table:
- exactly **6 data rows**: Rotifera, *Daphnia*, *Cyclops*/copepods, Other cladocerans, Nauplii, Total N.

Worked Example:
- protected counts: **40, 30, 20, 10; N = 100**;
- formula, substitution, answer and ecological interpretation remain distinct expectations.

Results Presentation contains exactly **6 bullets**:
- abundance table;
- taxa richness S;
- Shannon H';
- Simpson D and/or 1-D;
- one abundance bar chart;
- one diversity-comparison chart if required.

## 20-mark report custody

The syllabus report table contains exactly **10 rows including Total**:
- Experiment — 6
- Title — 1
- Abstract — 2
- Introduction — 2
- Materials and Methods — 2
- Results — 3
- Discussion — 2
- Acknowledgement — 1
- List of Books / References — 1
- Total — 20

Discussion Questions: exactly **5**.

## Course-contract custody

Course-contract blob:
`a02365ea6743c44a1eddaf84ad05f66d670ade6b`

Authenticated module:
- module: `prac-07`
- order: `7`
- title: `Zooplankton`
- source: `_biology/higher-zoology-tree/practical/07-zooplankton.bn.md`
- route: `/biology/higher-zoology-tree/practical/zooplankton/`
- previous: `prac-06`
- next: `prac-08`

Coverage-ledger blob:
`ab66ddafc1346b65337bc52236d1029a77cf5792`

Authenticated coverage:
`complete — 3 water bodies + counting + Simpson + Shannon + 20-mark report`

## Protected baselines

- Practical gateway → `d45ae49889c5e6d02445776ca5120f5fcedda65e`
- prac-01 Museum → `bf14db772daaa5bbf1d7386d7f146b7d9a730799`
- prac-02 Permanent Slides → `0594b755e3cf2301de48e04e60324be3a404531a`
- prac-03 Whole Mounts → `e308b42266dbbf5963cd7c9b89c12a6fb2427424`
- prac-04 Dissection → `13b112f04ebf484d74cbca8e98fd39ab70430e3c`
- prac-05 Temporary Mounts → `c91e0bbbd8b10f5503aef0aa262864523949c97a`
- prac-06 Appendages → `5ba59f589effd233770e120487430fde5b983204`
- prac-07 Zooplankton → `c120863ca31d85a33f1476b3f5bab59d571950cf`
- prac-08 Field Report → `6398c601c3a1b3cd891e8ea945d704d5d94b9711`
- course contract → `a02365ea6743c44a1eddaf84ad05f66d670ade6b`
- coverage ledger → `ab66ddafc1346b65337bc52236d1029a77cf5792`
- shared Practical CSS → `0962ae71cd1e424e27949b409f5284493f722dd3`
- shared Practical JS → `207684413ad7925686334cafc3748861a439f206`
- Academic CSS → `e461a46d9defd592bb098adfa12472543dacd41b`
- canonical Learning Guide CTA include → `701c02c2e9faa5e63db71cc8a16cb4ba8c87e233`
- Academic Route Ledger baseline → `c77bc6a3353a82d1c3980ae7c43e84980be6a67f`

The Academic Route Ledger currently contains **no prac-07 Zooplankton row**.

## Deterministic Practical sequencing

- `R80–R89`: prac-06 — production closed.
- `R90–R99`: prac-07 Zooplankton.
- `R100–R109`: prac-08 Field Report.
- `CONV-04F-10` remains reserved for Ecology.

R90 is authorization-only. The first prac-07 implementation slot is **R91**.

## Authorization for later R91 implementation

After R90 merges, an isolated R91 implementation may mutate only:

1. learner source:
   - `_biology/higher-zoology-tree/practical/07-zooplankton.bn.md`
2. route ownership:
   - `docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json` — exactly one Zooplankton row only
3. phase evidence:
   - `docs/academic/conv04/CONV04_STATE.md`
   - one new R91 implementation record under `docs/academic/conv04/`
   - one new R91 implementation manifest under `_data/academic/`
4. dedicated R91 certification only:
   - one new Zooplankton preservation validator under `.github/scripts/`
   - one new Zooplankton browser certification under `.github/scripts/`
   - one new Zooplankton exact-head certification workflow under `.github/workflows/`
   - one new Zooplankton push-to-main production-parity workflow under `.github/workflows/`

R91 is **not** authorized to modify any pre-existing shared/retained workflow or validator, shared CSS/JS/runtime, Academic CSS, Learning Guide include, navigation, course/coverage contracts, sibling Practical modules, assessment runtime, Admission, Socratic, or Worker/Cloudflare configuration.

Authorized learner-facing purpose only:
1. add `academic_system: v1`;
2. add `academic_role: practical`;
3. add `learning_guide: canonical`;
4. inject exactly one canonical Learning Guide CTA immediately after the existing H1;
5. wrap each of the **three existing Markdown tables** using the existing Academic-v1 / Practical keyboard-focusable named scroll-region primitive if required by the shared contract;
6. register exactly one strict Academic Route Ledger row for the canonical Zooplankton route.

The existing **1 H1 / 13 H2 / 3 H3** source hierarchy is protected. Heading normalization is **not authorized in R91**. Any later heading change requires a separately merged exact-scope authorization.

All formulas, sampling rules, statistical conventions, ecological interpretations, table cells/rows, worked-example values, report marks, and discussion questions remain protected.

## Gate

```text
authenticate main@e6b5a203c36b6d59b06d943430217d866dee623e
        ↓
prac-06 exact-main production parity PASS
        ↓
authenticate prac-07 blob + structural/content/formula census
        ↓
R90 authorization-only exact head
        ↓
technical certification + fresh Codex review + zero unresolved threads
        ↓
SOLO exact-head authority + Trusted Governance
        ↓
merge R90
        ↓
new isolated R91 prac-07 implementation branch
```
