# CONV-04E-01 — HSC Botany Gateway + Chapter-01 Authorization

**Status:** AUTHORIZED — learner-facing implementation not yet performed
**Authorized base:** `b07beb8119c4ee001d542a357f38c0e27e5017ba`
**Authorization branch:** `conv-04e-01-botany-gateway-authorization-20261002`

## Purpose

Begin the Botany convergence lane with the two existing navigation/index surfaces only:

- `_biology/hsc-corner/botany/index.md`
- `_biology/hsc-corner/botany/chapter-01-cell-and-its-structure.md`

This is a structural Academic-v1 migration. It is **not** a scientific-content rewrite and does not authorize any new Botany lesson.

## Authenticated baseline

### HSC Botany gateway

- blob: `8f738991298d33bdc63977400891c66aecccb05a`
- route: `/biology/hsc-corner/botany/`
- language key: `language: bn`
- Academic-v1 metadata: absent
- canonical Learning Guide CTA: absent
- existing links: 8
- existing article cards: 9

### Chapter-01 index

- blob: `d404800ba32f0384efddd469e71c3f6fc45122d1`
- route: `/biology/hsc-corner/botany/chapter-01-cell-and-its-structure/`
- `contract_state: convergence-pending`
- `chapter_completion: not-certified`
- source scope: `NCTB curriculum 2012 pp.31-33`
- canonical Learning Guide CTA: absent
- existing links: 8
- existing article cards: 7

The Chapter-01 scope contract remains at blob `f2a45806a80d6fe59b4a6d74373cbdac32bfe1f5` and still contains 1 remaining curriculum gaps. No completion claim is authorized.

## Exact learner mutation authority

Only these learner-facing files may change in E-01:

```
_biology/hsc-corner/botany/index.md
_biology/hsc-corner/botany/chapter-01-cell-and-its-structure.md
```

The seven existing Chapter-01 lecture files are protected byte-for-byte by their authenticated blob identities in the authorization manifest.

## Authorized implementation

For the Botany gateway add:

```yaml
academic_system: v1
academic_role: academic_gateway
lang: bn
learning_guide: canonical
```

For the Chapter-01 index add:

```yaml
academic_system: v1
academic_role: chapter_index
lang: bn
learning_guide: canonical
```

The legacy `language: bn` key may remain while it agrees with `lang: bn`.

Inject exactly one canonical Learning Guide CTA into each surface. Preserve all existing learner links, headings, cards and curriculum-status statements.

The Academic Route Ledger may promote the Botany gateway to strict and register the Chapter-01 index as a strict **surface** only after exact-head source/rendered certification. Surface strictness must not be interpreted as Chapter-01 curriculum completion.

## Curriculum boundary

E-01 must preserve:

```
contract_state: convergence-pending
chapter_completion: not-certified
```

and the existing remaining curriculum-gap set. BOT-08 and all other future Botany authoring remain outside this gate.

## Retained D-04/D-05/D-06 boundary

D-06 has already merged with bootstrap + retained certification semantics. E-01 must use D-06 in retained mode and must not edit any D-06 protected artifact.

D-06 is reopened only if an actual retained-contract regression is detected.

## Future-phase compatibility

E-01 implementation must itself ship with the same permanent model:

**bootstrap contract + retained contract + monotonic successor state + self-protection**

so later F/G phases do not require a routine E-01-R1 merely for compatibility.

## Promotion rule

Implementation is not authorized to merge until:

- exact source/content-preservation validation;
- retained A-D/D-06 certification;
- production Jekyll;
- route-ledger rendering;
- browser/Axe;
- keyboard/focus;
- 320px reflow and text spacing;
- reduced-motion/no-JS where applicable;
- CodeQL;
- zero unresolved review threads;
- exact-head solo authority;
- required Pages;
- Trusted Governance.
