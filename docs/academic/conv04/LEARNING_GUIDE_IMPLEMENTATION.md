# CONV-04C-02 — Canonical Learning Guide Implementation

Implementation: lbfl-learning-guide-implementation-v1
Version: CONV-04C-02-1.0.0
Authorized base: 66ee179e5f9b72338e50cf87aeec8307e27f344c

## Purpose

C-02 implements the learner-facing How to Learn with LBFL route that C-01 reserved. It creates the replacement before any later phase removes repeated learning-method explanation from existing gateways or lessons.

## Route contract

- Source: _pages/utility/learn.md
- Permalink: /learn/
- Layout: single
- Academic system: v1
- Academic role: academic_gateway
- Language: en
- Learning-guide ownership: canonical
- Academic Surface Contract enforcement: strict

The route owns the platform-wide learning method:

Understand → Retrieve → Explain → Apply → Reflect → Repair

## Specialist references

C-02 links to, but does not reproduce, the detailed framework pages:

- LOLO / LALA
- Bloom Taxonomy
- CQ Studio
- Assessment Rubric
- Practical Learning Framework

The homepage Observe → Question → Connect → Explain loop remains a critical-thinking mechanism. The existing Attempt → Feedback → Repair → Reattempt loop remains the assessment-repair mechanism. Neither becomes a competing global learning guide.

## Gateway-safe CTA

_includes/education/learning-guide-cta.html provides a concise semantic entry point to /learn/.

C-02 deliberately creates the include without injecting it into legacy gateways. This keeps the implementation isolated. Later convergence work may add the CTA while removing duplicated method explanation in the same route-specific migration.

## Accessibility and browser contract

The exact-head browser certification must prove:

- HTTP 200 for /learn/
- exactly one H1
- lang=en
- Academic v1 HTML/body/article activation
- academic role academic_gateway
- all six stages in canonical order
- all five specialist reference links
- keyboard-focusable primary actions with visible focus
- no unnecessary horizontal overflow at 320, 390, 768, 1280, and 1440 CSS px
- no content loss with JavaScript disabled
- no overflow under WCAG-oriented text-spacing overrides
- zero serious/critical Axe WCAG 2 A/AA violations

## CONV-04C-02-R1 contrast remediation

The first exact-head browser run proved that the route structure itself was sound but exposed a shared Academic-v1 contrast ownership defect. The legacy neural cascade forces the primary reading wrappers transparent with priority declarations; Academic v1 now explicitly reclaims its light paper canvas at the owned design-system layer. Anchor-based Academic buttons now receive the same explicit foreground/background/border ownership used for semantic button controls.

The remediation is deliberately not placed in `production-hotfix.css`. The Academic design-system validator pins the exact priority selectors and values, and the browser certification retains the unchanged requirement of zero serious/critical Axe WCAG 2 A/AA violations. Failure reports now also capture computed lead/button/body/content styles and Axe failure summaries.

## Protected boundary

C-02 does not modify or remove learning-method content from Botany, Zoology, Higher Zoology, MCQ Arena, Socratic / MI / Personality, Practical, or existing framework reference pages.

It also does not authorize BOT-08, Admission / PR #356, Worker, or Cloudflare configuration changes.

## Next phase

After C-02 is merged and production is verified, later CONV-04C migration work may add the canonical CTA to selected gateways and remove duplicated method explanations route by route. Replacement must exist before removal.