# CONV-04F-10-R2 — Ecology English 01–10 Synchronization Evidence

**Programme label:** F-10B
**Machine phase:** `CONV-04F-10-R2`
**Authorized base:** `e92f1a8dfcfb55ac673110a8a38e65d77cfaa840`
**Branch:** `conv-04f-10-r2-ecology-en-sync-20261006`

## Gate basis

The Bangla Ecology R1 implementation was merged via PR #448 and exact-main production-certified on the authorized base before this successor began.

All ten English counterpart sources were authenticated before mutation and frozen in:

`_data/academic/conv04f10b_ecology_en_sync_v1.json`

## Mutation scope

Exactly ten English Ecology lecture files were authorized.

Across all ten lectures this synchronization:

- adds `academic_system: v1`;
- adds `academic_role: lecture`;
- binds `learning_guide: canonical`;
- adds one English canonical Guided Learning block using Understand → Retrieve → Explain → Apply → Reflect → Repair;
- wraps every existing Markdown table with the existing named, keyboard-focusable `lbfl-academic-table-wrap` primitive from the first implementation pass.

No Bangla lecture, shared CSS/JS, layout, MCQ Arena, Practical, Socratic, Homepage, Admission, Worker, Cloudflare or DNS artifact is mutated.

## Table wrapper census

| Lecture | Existing tables wrapped |
|---|---:|
| EN 01 | 4 |
| EN 02 | 2 |
| EN 03 | 2 |
| EN 04 | 2 |
| EN 05 | 3 |
| EN 06 | 2 |
| EN 07 | 2 |
| EN 08 | 2 |
| EN 09 | 3 |
| EN 10 | 2 |

## Preservation contract

The synchronization preserves:

- existing scientific prose and references;
- route/permalink identity;
- English document language;
- lecture ordering and Bangla/English pairing;
- equations, units and graph-reading content;
- Liebig/Shelford treatment;
- Bangladesh/Sundarbans examples;
- population/demography/survivorship/growth-model content;
- existing MCQ/self-check material pending later assessment-ownership work;
- all shared runtime and styling.

## Certification gate

Merge is prohibited until the unchanged exact head has:

- zero unexpected changed files;
- Jekyll PASS;
- Ecology route certification PASS;
- Ecology 10-Lecture exact-head PASS;
- browser/Axe serious-critical PASS;
- retained F-09 and earlier CONV-04 checks PASS;
- zero unresolved review threads;
- SHA-bound SOLO authority;
- Trusted Governance PASS.

F-11 Whole-F certification remains blocked until F-10B is merged and exact-main production-certified.

## Review remediation

Fresh review detected that normalization had removed intentional Markdown hard-break spaces in the English MCQ self-check blocks. Rather than restoring fragile trailing spaces, the five A–D choice sets in each of the ten English lectures were converted to semantic Markdown bullet lists with explicit paragraph separation before each answer.

Result: 200 choices converted across 50 retained questions. Question wording, choices and answer keys are unchanged.
