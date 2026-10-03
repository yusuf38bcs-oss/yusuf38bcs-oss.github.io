# CONV-04F-03 — Animal Diversity Gateway/Course Convergence

**Authorized base:** `8330368a1c4bc8b7083d1528a3c50118217e258a`

## Implemented scope

Two learner-facing sources opt into Academic-v1:

- `/biology/animal-diversity/`
- `/biology/animal-diversity/course/`

Both retain the existing English content and course links, add `academic_system: v1`, `academic_role: academic_gateway`, `learning_guide: canonical`, and exactly one canonical Learning Guide CTA.

## Layout support

The existing `animal-diversity-course` layout now exposes Academic-v1 article attributes and exactly one educational boundary **only when** the page explicitly opts into Academic-v1. Existing lecture pages that have not opted in keep their prior rendering behavior.

## Preservation

The governed ten-lecture sequence and `_data/academic/course_contract_v1.json` remain unchanged. F-03 does not authorize lecture scientific-content rewriting.

## Route ledger

Both gateway/course-index routes are registered strict with zero source/live debt, layout-owned boundary, canonical Learning Guide ownership and MCQ Arena assessment ownership.

## Promotion rule

Require exact-head source/layout preservation, retained A–F-02 certification, production Jekyll, browser/Axe/keyboard/320px reflow/text-spacing/reduced-motion/no-JS, CodeQL, zero unresolved threads, exact-head Pages and Trusted Governance.


## Exact-head table remediation

The first exact-head browser/Axe pass exposed inherited legacy Animal Diversity table-header colors on the Academic-v1 course index. The remediation stays inside the already-authorized course-index learner source and uses the existing `.lbfl-academic-table-wrap` primitive with keyboard-focusable region semantics.

No table wording, lecture title, lecture order, lecture route, scientific content, shared stylesheet, or lecture source is changed.
