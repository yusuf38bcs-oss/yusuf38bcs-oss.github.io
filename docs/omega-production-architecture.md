# Learning Biology For Life — Omega Production Architecture

## Status

This document defines the production architecture for Learning Biology For Life: a Jekyll + Minimal Mistakes static learning platform, delivered through Cloudflare edge infrastructure, with Socratic AI handled through a Cloudflare Worker and a strict JSON contract.

Certification is conditional. The system is Omega-production-ready only when local build, route verification, Worker deployment, AI response validation, and runtime checks pass.

## Architecture

```text
GitHub Repository
  -> Jekyll Static Site Generator
  -> Minimal Mistakes Theme
  -> Pre-rendered HTML/CSS/JS
  -> Cloudflare DNS/CDN/Proxy
  -> Cloudflare Worker AI Gateway
  -> Gemini JSON Evaluation
  -> Browser localStorage Myelination State
```

## Core Layers

1. Static presentation layer: Jekyll, Minimal Mistakes, SCSS, Liquid includes.
2. Edge delivery layer: Cloudflare DNS, TLS, proxy, CDN, cache rules.
3. AI gateway layer: Cloudflare Worker, Gemini API, strict JSON response schema.
4. Cognitive state layer: browser localStorage using `lbfl_myelinated_nodes`.
5. Audit layer: `scripts/omega-production-audit.ps1`.

## Collection URL Policy

Nested source directories are allowed, but public URLs must remain clean. The recommended production permalink for the biology collection is:

```yaml
collections:
  biology:
    output: true
    permalink: /biology/:name/
```

Use explicit front matter `permalink:` when a page needs a canonical route.

## Socratic Reflex Arc

```text
Student hypothesis
  -> assets/js/socratic-component.js
  -> Cloudflare Worker POST
  -> Gemini JSON evaluation
  -> UI feedback
  -> lbfl:node-myelinated event
  -> assets/js/myelination-tracker.js
  -> localStorage persistence
```

## Required Runtime Files

- `assets/js/socratic-component.js`
- `assets/js/myelination-tracker.js`
- `_includes/socratic/socratic-node.html`
- `_sass/components/_socratic.scss`
- `worker/src/index.ts`
- `worker/wrangler.toml`
- `worker/package.json`
- `scripts/omega-production-audit.ps1`

## Certification Criteria

- Jekyll build succeeds.
- No BOM exists in `assets/css/main.scss`.
- No corrupted `[span_*]` artifacts exist.
- Socratic frontend sends a valid JSON payload.
- Worker validates payload before calling Gemini.
- Worker returns safe fallback JSON during failure.
- No API key appears in frontend source.
- Mastery state restores from localStorage.
- Mobile layout remains stable.

## Final Declaration

Learning Biology For Life is an edge-native cognitive education system where biology concepts operate as learning nodes, Socratic AI performs guided reasoning, and mastered nodes persist as local myelination state.
