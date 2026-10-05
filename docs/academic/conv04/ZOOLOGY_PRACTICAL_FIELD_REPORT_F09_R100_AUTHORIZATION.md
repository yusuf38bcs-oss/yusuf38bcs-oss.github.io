# CONV-04F-09-R100 — prac-08 Field Report Authorization

status: AUTHORIZED CANDIDATE — authorization-only; no learner mutation
phase: CONV-04F-09-R100
authorized_base: `9bdc80ca7ceff9dd33773514c3c6e41447ee95fe`
selected_module: prac-08
next_implementation_slot: R101
source: `_biology/higher-zoology-tree/practical/08-field-report.bn.md`
baseline_blob: `6398c601c3a1b3cd891e8ea945d704d5d94b9711`
canonical_route: `/biology/higher-zoology-tree/practical/field-report/`
course_contract_blob: `a02365ea6743c44a1eddaf84ad05f66d670ade6b`
coverage_ledger_blob: `ab66ddafc1346b65337bc52236d1029a77cf5792`
production_predecessor: prac-07 Zooplankton exact-main immutable + canonical production parity PASS on `9bdc80ca7ceff9dd33773514c3c6e41447ee95fe`

## Authorization-only boundary

R100 changes only this authorization record and `CONV04_STATE.md`. It does not modify the Field Report learner source, route ledger, shared runtime, CSS/JS, Academic CSS, Learning Guide include, navigation, assessment runtime, Admission, Socratic, Worker/Cloudflare configuration, any sibling Practical module, or the reserved F-10 Ecology programme.

R101 may start only after R100 exact-head CI, review, governance and merge all PASS on an unchanged head/base.

## Authenticated learner corpus

The exact R100 baseline is:

- **1 H1** — `Field Visit, Collection & Scientific Report`
- **11 H2**
- **11 H3**
- **2 Markdown tables / 14 table lines**
- Results table: **2 data rows**
- 17-mark report table: **8 data rows including Total**
- **50 body bullets**
- **5 numbered Socratic Review questions**
- Sample Label block: **10 minimum fields**
- syllabus requirement: field/farm observation, **at least 10 samples**, preservation/label/submission/report, quadrat density and Shannon–Wiener
- ethical collection rule: minimum necessary collection; protected/threatened/legally restricted organisms excluded; permission and habitat/non-target safeguards retained
- Field Notebook evidence fields retained
- Results/Discussion/References reporting structure retained

## Formula and quantitative custody

R101 must preserve exactly the existing quantitative meaning and notation:

- population density = total individuals / total quadrat area sampled
- total area = q × a
- mean count per quadrat = Σxᵢ / q
- frequency (%) = occupied quadrats / total quadrats × 100
- density and frequency remain explicitly distinct ecological metrics
- pᵢ = nᵢ / N
- Shannon–Wiener H′ = −Σpᵢ ln pᵢ
- natural-log recommendation, taxonomic resolution, sample size and pooling disclosure remain unchanged

The exact 17-mark distribution is protected:

- ≥10 preserved sample submission — 7
- Title + Abstract — 2
- Introduction — 2
- Materials and Methods — 1
- Results — 2
- Discussion — 2
- Acknowledgement + References — 1
- **Total — 17**

## R101 learner-mutation authority

R101 is authorized to perform only the following structural convergence:

1. add `academic_system: v1`;
2. add `academic_role: practical`;
3. add `learning_guide: canonical`;
4. inject exactly one canonical Learning Guide CTA immediately after the existing H1;
5. wrap the existing Results Table and 17-mark Report table with the existing Academic-v1 / Practical keyboard-focusable named scroll-region primitive if required by the shared contract;
6. register exactly one strict Academic Route Ledger row for the canonical Field Report route;
7. add dedicated R101 manifest, implementation evidence, fail-closed preservation/scope validator, browser/Axe certification, exact-head certification workflow, push-to-main production parity workflow, and trusted successor protection as required;
8. reuse the already-reviewed Wrangler dependency lock on main; R101 has no authority to rewrite that lock.

Suggested wrapper labels:

- `Field Report results table`
- `Field Report 17-mark distribution table`

## Explicit prohibitions

R101 may not:

- rewrite scientific/ecological/statistical/ethical/reporting prose;
- change formulas or notation;
- change sample-count requirement or collection ethics;
- change table cells, marks or Total=17;
- add or remove report sections;
- change the five Socratic Review questions;
- normalize the 1/11/11 heading hierarchy;
- add a new stylesheet or script import to the learner source;
- mutate prac-01 through prac-07;
- mutate F-10 Ecology;
- mutate assessment ownership, Admission, Socratic, Worker or Cloudflare configuration.

## Preservation proof required

The R101 validator must construct or normalize the candidate so that after removing only:

- the three authorized Academic-v1 metadata fields;
- exactly one correctly H1-anchored Learning Guide CTA;
- exactly two directly-bound accessible table wrappers;

the learner source equals the exact R100 baseline byte-for-byte.

The route ledger must equal the authenticated R100 base plus exactly one Field Report row. Course-contract order must remain `prac-07 → prac-08`, with `next: null`. Coverage must remain exactly `>=10 samples + quadrat + Shannon + 17-mark report`.

## Browser certification contract

At minimum:

- mobile 320 / 390, tablet 768, desktop 1280, wide 1440;
- Axe WCAG 2 A/AA/2.1 A/AA/2.2 AA serious/critical = zero;
- keyboard-reachable canonical CTA;
- both table wrappers keyboard reachable and correctly named;
- source headings remain 1 H1 / 11 H2 / 11 H3;
- rendered H2 accounts for the canonical Learning Guide contribution without treating it as source drift;
- table row counts remain 2 + 8;
- text-spacing/reflow checks include table cells;
- reduced-motion and no-JS variants;
- console/page/local HTTP failures fail closed.

## Promotion and closure boundary

R101 merge is not enough. After merge, exact-main Cloudflare deployment, immutable deployment browser certification, canonical `learningbiologyforlife.org` certification and final main re-authentication must all PASS.

Only then may an explicit **F-09 Practical closure gate** be authorized. F-10 Ecology remains blocked until that closure gate merges.

## Deterministic namespace

- R90–R99: prac-07 Zooplankton — production closed
- R100–R109: prac-08 Field Report
- CONV-04F-10: reserved refined Ecology programme

R100 is authorization-only. The first Field Report implementation slot is **R101**.
