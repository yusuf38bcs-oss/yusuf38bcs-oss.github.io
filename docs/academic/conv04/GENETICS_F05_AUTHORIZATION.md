# CONV-04F-05 — Genetics Gateway + Course Index Authorization

**Status:** AUTHORIZED / NOT YET IMPLEMENTED  
**Exact base:** `cbd6de2cc95f3a573fdd784e29fc045e6448cbda`  
**Branch:** `conv-04f-05-genetics-gateway-course-20261003`

## Authenticated target

Two existing learner-facing sources are authorized:

- `_biology/higher-zoology-tree/genetics/index.md`
- `_biology/higher-zoology-tree/genetics/course-index.md`

The strict Genetics course contract already defines a **17-module** route sequence and is protected from mutation.

## Root findings

1. Both public routes render English content but do not yet opt into Academic-v1.
2. The Genetics gateway still owns the legacy `education/framework-links.html` panel.
3. The course-index source declares `language: bn` even though its canonical/default public route and visible content are English.
4. The shared single layout already treats Genetics as course-owned; no layout mutation is needed.

## Authorized convergence

- Academic-v1 / `academic_gateway`
- `lang: en`
- course-index legacy `language` corrected to `en`
- canonical Learning Guide ownership
- exactly one canonical Learning Guide CTA per surface
- existing 17-row lecture table retained, optionally wrapped only with the existing Academic-v1 accessible table primitive
- strict route-ledger registration for gateway + course index

## Protected

No Genetics lecture content, route sequence, course contract, shared layout/CSS, assessment runtime, Admission, Worker or Cloudflare mutation is authorized.
