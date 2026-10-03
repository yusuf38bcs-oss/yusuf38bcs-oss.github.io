# CONV-04F-03 — Animal Diversity Authorization

**Status:** AUTHORIZED — implementation not yet applied
**Exact base:** `8330368a1c4bc8b7083d1528a3c50118217e258a`
**Branch:** `conv-04f-03-animal-diversity-gateway-20261003`

## Scope

Converge only the existing Animal Diversity gateway and course index into Academic-v1:

- `_biology/higher-zoology-tree/animal-diversity/index.md`
- `_biology/higher-zoology-tree/animal-diversity/course-index.md`

The custom layout `_layouts/animal-diversity-course.html` may receive a **conditional** Academic-v1 wrapper/boundary change that activates only when a page opts into `academic_system: v1`.

## Preservation

The ten-lecture course sequence, lecture routes, headings, scientific prose, language wording, course identity and course contract must remain unchanged.

No lecture source is authorized for mutation in F-03.

## Target metadata

Both target surfaces may add:

```yaml
academic_system: v1
academic_role: academic_gateway
learning_guide: canonical
```

Existing `lang: en` and `language: en` remain.

Each source may render exactly one canonical Learning Guide CTA.

## Route ownership

F-03 may register both Animal Diversity routes in the Academic Route Ledger as strict, debt-free Academic-v1 surfaces, with layout-owned educational boundary and MCQ Arena assessment ownership.

## Next gate

Implement the exact structural transform, then certify source preservation, route ownership, retained A–F-02 contracts, production Jekyll and browser/Axe/reflow/no-JS behavior.
