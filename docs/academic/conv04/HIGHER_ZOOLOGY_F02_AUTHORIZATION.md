# CONV-04F-02 — Higher Zoology Gateway Authorization

**Status:** AUTHORIZED — implementation not yet applied
**Exact base:** `571e73b7b17023487cf40660f307e6d11091b919`
**Branch:** `conv-04f-02-higher-zoology-gateway-20261003`

## Scope

F-02 converges the bilingual Higher Zoology gateway surfaces only:

- `_biology/higher-zoology-tree/index.md`
- `_biology/higher-zoology-tree/index.bn.md`

Public routes:

- English: `/biology/higher-zoology-tree/`
- বাংলা: `/bn/biology/higher-zoology-tree/`

## Authenticated baseline

English source blob: `0fcfcec117f11074eb239ed82689bbaf2243b487`
Bangla source blob: `8d607aa5422c2c3b4a52955732ff0563a6142b28`

The English live route is currently not Academic-v1, loads the legacy Zoology cycle, and renders the legacy Educational Framework panel. It already has one layout-owned educational boundary and the correct canonical URL.

## Authorized structural migration

English:
```yaml
academic_system: v1
academic_role: academic_gateway
lang: en
learning_guide: canonical
```

Bangla:
```yaml
academic_system: v1
academic_role: academic_gateway
learning_guide: canonical
```

The Bangla source already has `lang: bn` and `language: bn`; both remain.

On each source, replace exactly one legacy:

```
{% include education/framework-links.html %}
```

with exactly one:

```
{% include education/learning-guide-cta.html %}
```

No scientific prose, branch card, heading, branch route or recommended-learning sequence may be rewritten in this gate.

## Ledger authority

Promote the current `higher-zoology-gateway` row to strict/zero-debt and add a strict Bangla surface at `/bn/biology/higher-zoology-tree/`.

## Retained boundary

F-01/F-01-R1 and all A-E/D assessment contracts must remain green. No downstream course surface is authorized by this gate.
