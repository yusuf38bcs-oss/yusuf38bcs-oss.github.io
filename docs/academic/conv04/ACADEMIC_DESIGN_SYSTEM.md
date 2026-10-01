# CONV-04B — Core Academic Design System

**System:** `lbfl-academic-design-system-v1`
**Version:** `CONV-04B-1.0.0`
**Authorized base:** `9f20bfa7398db8c2e5f1dbdd3db61c43eef3e5bf`
**Activation:** explicit front matter only: `academic_system: v1`.

## Purpose

CONV-04B establishes the reusable visual and interaction layer required by the Academic Surface Contract. It does not migrate learner content. Existing legacy routes remain visually unchanged until a later phase deliberately opts them into `academic_system: v1`.

## Architecture

The system has five owned layers:

1. `_data/academic/design_system_v1.json` — machine-readable manifest.
2. `assets/css/academic-design-system.css` — scoped tokens and components.
3. `_layouts/default.html` and `_layouts/homepage-v3.html` — add opt-in document activation for ordinary and platform-home surfaces.
4. `_layouts/single.html` — exposes the academic surface and role as explicit DOM metadata.
5. `_includes/head/custom.html` — prevents the legacy Zoology stylesheet from loading after a route explicitly opts into Academic v1.

The stylesheet is conditionally loaded from `_includes/head/head.html` after the current production compatibility layers. It is not a global hotfix: no legacy route receives it without explicit academic-system opt-in. When a Zoology route opts in, the legacy `zoology-academic.css` layer is intentionally withheld so its priority link rules cannot override Academic v1 components.

## Activation contract

A future migrated route uses:

```yaml
academic_system: v1
academic_role: lecture
lang: bn
```

The resulting document exposes:

```html
<html class="... lbfl-academic-v1">
<body class="... lbfl-academic-v1-active">
<article
  class="page lbfl-academic-surface lbfl-academic-role--lecture"
  data-lbfl-academic-surface="v1"
  data-lbfl-academic-role="lecture">
```

The page role remains governed by CONV-04A. CONV-04B only supplies the presentation system. Homepage V3 uses the same opt-in HTML/body/surface metadata path so a future `platform_home` migration does not bypass the design system.

## Token policy

All new design tokens are namespaced `--lbfl-academic-*`.

Core token groups:
- reading surfaces: paper, surface, soft;
- typography: ink, muted, heading, link;
- interaction: accent, focus;
- geometry: border, radius, shadow, measure, space.

No course-specific token such as Botany/Zoology color naming belongs in the core system.

## Component vocabulary

The initial reusable classes are:

- `.lbfl-academic-lead`
- `.lbfl-academic-grid`
- `.lbfl-academic-card`
- `.lbfl-academic-stepper`
- `.lbfl-academic-comparison`
- `.lbfl-academic-flow`
- `.lbfl-academic-term`
- `.lbfl-academic-misconception`
- `.lbfl-academic-evidence`
- `.lbfl-academic-table-wrap`
- `.lbfl-academic-callout`
- `.lbfl-academic-actions`
- `.lbfl-academic-button`
- `details.lbfl-academic-details`

These implement the information-structure mapping already locked in the Academic Surface Contract.

## Accessibility and responsive rules

The system is designed for:
- reflow to 320 CSS px;
- keyboard-visible focus;
- semantic table wrappers for genuinely two-dimensional content;
- minimum 40 CSS px practical control height in core buttons/details;
- no forced ordinary-word fragmentation;
- reduced-motion support;
- content availability without JavaScript.

Browser certification remains required before any route becomes strict.

## Legacy bridge

Two authenticated global defects currently use `!important` outside this system:

- viewport-height hero forcing;
- ordinary-content word fragmentation.

Therefore CONV-04B contains a deliberately small, opt-in bridge that neutralizes only:
- `min-height` / `height` on academic v1 heroes;
- `overflow-wrap` / `word-break` on academic v1 reading content.

No other `!important` property is permitted in the core stylesheet. This bridge is temporary debt containment, not permanent cascade strategy.

## Non-goals

CONV-04B does not:
- alter Biology, MCQ, Socratic, Practical, Admission, or homepage learner content;
- move assessment ownership;
- create the canonical learning guide;
- remove legacy CSS files globally;
- modify Worker/Cloudflare configuration;
- authorize BOT-08;
- make any current route strict.

## Promotion gate

CONV-04B can merge only after:
- the design-system validator passes at exact head;
- production Jekyll build passes;
- CodeQL/site audit required checks pass;
- zero unresolved review threads;
- exact-head governance authority is valid.

CONV-04C begins only from the merged CONV-04B main baseline.
