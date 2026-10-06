# CONV-04F-10-R1 — Ecology BN 01–10 Implementation Evidence

**Authorized base:** `79cc028eb581411fce6a29b92de2e25552118e86`
**Branch:** `conv-04f-10-r1-ecology-bn-implementation-20261006`
**Scope:** isolated Bangla Ecology learner convergence, Lectures 01–10
**Protected:** English Ecology, shared Academic-v1 runtime/CSS/JS, MCQ Arena ownership, Practical-I, HSC Botany/Zoology, Socratic, Admission, Homepage, Worker/Cloudflare/DNS.

## 1. Gate activation

PR #447 merged the F-10A authorization to exact main `79cc028eb581411fce6a29b92de2e25552118e86`.

Before mutation, all ten authorized source blobs were re-authenticated against:

`_data/academic/conv04f10a_ecology_bn_authorization_v1.json`

Result: **10/10 exact blob matches**.

The implementation state was then advanced to `CONV-04F-10-R1` and the learner mutation allowlist was populated with exactly the ten authorized Bangla Ecology lecture sources.

## 2. Controlled learner convergence implemented

Each of the ten Bangla Ecology lectures now declares exactly once:

```yaml
academic_system: v1
academic_role: lecture
learning_guide: canonical
```

Each lecture also now contains one shared **LBFL Guided Learning** block that applies the canonical six-stage cycle:

1. Understand
2. Retrieve
3. Explain
4. Apply
5. Reflect
6. Repair

The block explicitly links back to the canonical `/learn/` owner and does not create a competing local learning cycle.

Each lecture receives a content-specific visual reasoning target while preserving its existing scientific content, diagrams/flows, calculations, Bangladesh applications, misconceptions, exam preparation and references.

## 3. Source-level convergence census

| Lecture | Academic-v1 | Role | Canonical guide | Guided block | Existing syllabus block |
|---|---|---|---|---|---|
| 01 | 1 | 1 | 1 | 1 | retained |
| 02 | 1 | 1 | 1 | 1 | retained |
| 03 | 1 | 1 | 1 | 1 | retained |
| 04 | 1 | 1 | 1 | 1 | retained |
| 05 | 1 | 1 | 1 | 1 | retained |
| 06 | 1 | 1 | 1 | 1 | retained |
| 07 | 1 | 1 | 1 | 1 | retained |
| 08 | 1 | 1 | 1 | 1 | retained |
| 09 | 1 | 1 | 1 | 1 | retained |
| 10 | 1 | 1 | 1 | 1 | retained |

## 4A. Accessibility remediation

The first exact-head browser certification exposed a serious table-header contrast failure after the Ecology lectures entered Academic-v1. The shared runtime itself remains protected. The remediation therefore stays inside the authorized learner files: every existing Markdown table in Lectures 01–10 is wrapped in the existing `lbfl-academic-table-wrap` keyboard-focusable named-region primitive already used by certified CONV-04 surfaces.

Resulting wrapper census:

- Lecture 01: 4 tables
- Lecture 02: 2 tables
- Lecture 03: 2 tables
- Lecture 04: 2 tables
- Lecture 05: 3 tables
- Lecture 06: 2 tables
- Lecture 07: 2 tables
- Lecture 08: 2 tables
- Lecture 09: 3 tables
- Lecture 10: 2 tables

No table cell content, scientific claim, equation or shared CSS/JS was changed by this remediation.

## 4. Scientific/content-preservation status

This R1 pass is deliberately **convergent, not destructive**.

Preserved:

- lecture identity and order 01–10;
- canonical routes and Bangla/English pairing;
- Ecology definitions, mechanisms, equations and units;
- Liebig/Shelford treatment;
- abiotic/biotic factor logic;
- Sundarbans/Bangladesh case material;
- population density/dispersion/demography;
- life-table/survivorship/growth-model content;
- current concept diagrams, graph-reading sections, worked examples and references;
- full MCQ-bank ownership outside the lecture pages.

No English Ecology learner file was modified.

## 5. Required next certification

This implementation candidate is not merge-authorized until the exact head passes:

- source and mutation-scope audit;
- Jekyll build;
- retained Ecology route-ownership certification;
- Ecology 10-Lecture certification;
- browser/mobile/desktop rendering;
- keyboard/reflow/text-spacing/reduced-motion/no-JS checks where applicable;
- Axe serious/critical audit;
- retained F-09 and earlier CONV-04 checks;
- fresh review with zero unresolved threads;
- SOLO authority bound to the unchanged exact head;
- Trusted Governance PASS.

F-10B English synchronization and F-11 Whole-F certification remain unauthorized.
