# CONV-04F-05 — Genetics Academic-v1 Convergence

**Authorized base:** `cbd6de2cc95f3a573fdd784e29fc045e6448cbda`

## Scope

F-05 converges only the existing Genetics Matrix gateway and governed 17-lecture Genetics Course Index. No lecture source, course-contract module, genetics problem, scientific statement, or assessment bank is rewritten.

## Structural convergence

Both target surfaces now declare Academic-v1, `academic_gateway`, `lang: en`, and canonical Learning Guide ownership. The course index corrects stale `language: bn` metadata to `language: en`, matching its English authored content and default public route.

The legacy framework include is replaced by exactly one canonical Learning Guide CTA on each target. The unchanged 17-row course map is wrapped in the existing `lbfl-academic-table-wrap` primitive for contrast/reflow safety.

## Preservation

The `higher-zoology-genetics` course contract and all 17 module sources remain byte-identical. The complete lecture route sequence remains 01 → 17. The Responsible Genetics Boundary remains verbatim.

## Localization boundary

F-05 does not create or certify a Bangla Genetics translation. Exact-head review tested the concern that adding explicit `lang: en` might remove the historical `/bn/` fallback URLs. The production Jekyll candidate continued to render both URLs as HTTP 200 English Academic-v1 Polyglot fallbacks. F-05 therefore certifies that route continuity directly rather than adding a duplicate route owner.

The two retained compatibility URLs are:

- `/bn/biology/higher-zoology-tree/genetics/`;
- `/bn/biology/higher-zoology-tree/genetics/course-index/`.

They are not reviewed Bangla Genetics content. Hreflang/fallback metadata cleanup remains deferred to CONV-04H.

## Promotion

Require exact source reconstruction, protected course identity, strict route-ledger ownership, retained A–F-04 contracts, Jekyll, browser/Axe/keyboard/320px reflow/text-spacing/reduced-motion/no-JS, CodeQL, exact-head Pages, zero unresolved threads and Trusted Governance.
