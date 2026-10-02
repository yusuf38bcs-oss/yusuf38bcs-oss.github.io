# CONV-04C-03 — Controlled Gateway Convergence

**Pilot route:** `/biology/hsc-corner/zoology/`
**Authorized base:** `fd06e558c22decd32daa69373cdd6c236a1bbca4`

## Purpose

C-03 begins route-by-route migration to the canonical **How to Learn with LBFL** guide only after `/learn/` has been implemented, accessibility-certified, and merged.

The pilot deliberately uses one existing academic gateway before broader Biology, Higher Zoology, or Socratic convergence.

## Authenticated pre-migration duplication

The HSC Zoology gateway currently receives learning-method explanation from two independent sources:

1. the learner-facing `education/framework-links.html` panel, which exposes five specialist method references; and
2. the layout-injected `zoology/learning-cycle.html` LOLO → LALA cycle.

Those are method explanations, not HSC Zoology subject content. The gateway's **Core Learning Route**, **Available Zoology Logs**, **Extended Zoology Pathways**, **Study Sequence**, **Responsible Learning Boundary**, and connected nodes remain route-owned content.

## Pilot migration

The HSC Zoology gateway will:

- declare `learning_guide: canonical`;
- render `education/learning-guide-cta.html`;
- stop rendering the legacy five-framework panel;
- stop receiving the layout-injected LOLO/LALA learning cycle;
- preserve its topic-specific study sequence and assessment-return wording.

The single layout uses the generic `learning_guide: canonical` ownership flag rather than a hard-coded HSC Zoology URL. This creates a route-by-route opt-in path for later C-phase migrations.

CONV-04D remains not started; assessment ownership is unchanged in this phase.

## Protected boundary

C-03 does **not**:

- migrate HSC Botany;
- migrate Higher Zoology;
- migrate Socratic or MI;
- change MCQ Arena or assessment ownership;
- remove topic-specific learning objectives/outcomes;
- alter the five specialist framework reference pages;
- authorize BOT-08;
- touch Admission / PR #356;
- touch Worker or Cloudflare configuration.

## Certification

The pilot must prove from exact-head Jekyll output that:

- the HSC Zoology route renders exactly one Learning Guide CTA;
- the CTA links to `/learn/`;
- the legacy framework panel is absent;
- the injected LOLO/LALA cycle is absent only on the canonical-guide route;
- the topic-specific route sections remain present;
- the existing Zoology whole-route browser/Axe certification recognizes canonical-guide ownership, runs full-page Axe on the migrated gateway at all three viewports, and remains green.

Only after this pilot is merged should the same ownership rule be considered for the next gateway.
