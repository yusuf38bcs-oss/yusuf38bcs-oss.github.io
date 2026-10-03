# CONV-04F-05 — Genetics Course Authorization

**Status:** AUTHORIZED — learner mutation not yet performed
**Exact base:** `cbd6de2cc95f3a573fdd784e29fc045e6448cbda`
**Branch:** `conv-04f-05-genetics-course-20261003`

## Target

F-05 converges exactly two existing Higher Zoology Genetics surfaces:

- `_biology/higher-zoology-tree/genetics/index.md`
- `_biology/higher-zoology-tree/genetics/course-index.md`

Routes:

- `/biology/higher-zoology-tree/genetics/`
- `/biology/higher-zoology-tree/genetics/course-index/`

The governed course contract already defines exactly **17 modules**. That contract and all 17 lecture sources are protected byte-for-byte.

## Current live baseline

Both default public routes currently render in English, with one layout-owned educational boundary, but neither is Academic-v1 and neither owns the canonical Learning Guide CTA.

The course-index source contains stale `language: bn` metadata even though its authored content and default rendered route are English. F-05 may correct that legacy key to `language: en` while adding canonical `lang: en`.

## Authorized structural convergence

Both surfaces may add:

```yaml
academic_system: v1
academic_role: academic_gateway
lang: en
learning_guide: canonical
```

The gateway may retain its existing `language: en`.

The course index may correct `language: bn` → `language: en`.

The legacy `education/framework-links.html` include may be replaced by exactly one canonical `education/learning-guide-cta.html` include on each target.

The existing 17-row Markdown course table may be wrapped in the already-certified `lbfl-academic-table-wrap` primitive to prevent the same legacy table-header contrast inheritance previously exposed during F-03/F-04. This does not authorize shared CSS or table-content changes.

No scientific prose, 17-lecture sequence, lecture route, genetics problem content, or responsible-genetics boundary may be rewritten.

## Assessment and safety boundary

MCQ Arena remains the canonical complete assessment-bank owner.

The existing **Responsible Genetics Boundary** must remain intact: educational inheritance examples do not become medical diagnosis, family-risk prediction, genetic counselling, treatment advice, or institutional certification.

## Localization boundary

Polyglot currently exposes generated `/bn/...` Genetics fallbacks without a distinct reviewed Bangla Genetics source. F-05 does not authorize a translation or a new Bangla Genetics course.

Exact-head review established that adding `lang: en` would remove the two existing public fallback URLs before CONV-04H. A narrow route-preservation correction is therefore authorized inside F-05: two `lang: bn`, `noindex` compatibility route owners may preserve the existing gateway and course-index `/bn/` URLs while pointing to the canonical English surfaces. This does not authorize Bangla Genetics teaching content. Hreflang and fallback-metadata cleanup remain CONV-04H.

## Promotion gate

F-05 must ship its own bootstrap + retained validator, exact-head workflow, production Jekyll, two-route browser/Axe/keyboard/reflow/text-spacing/reduced-motion/no-JS certification, CodeQL, zero unresolved review threads, exact-head Pages and Trusted Governance.
