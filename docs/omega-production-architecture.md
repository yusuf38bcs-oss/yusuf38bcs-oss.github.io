# Learning Biology For Life — Omega Production Architecture

## Status

This document defines the production architecture for Learning Biology For Life: a Jekyll + Minimal Mistakes static learning platform, delivered through Cloudflare edge infrastructure, with Socratic AI handled through the dedicated `lbfl-socratic-ai` Cloudflare Worker and a strict JSON contract.

Production API hostname: `https://api.learningbiologyforlife.org`.

Certification is conditional. The system is Omega-production-ready only when local build, route verification, Worker deployment, AI response validation, CORS checks, exact Worker-version checks, and runtime checks pass.

## Architecture

```text
GitHub Repository
  -> Jekyll Static Site Generator
  -> Minimal Mistakes Theme
  -> Pre-rendered HTML/CSS/JS
  -> Cloudflare DNS/CDN/Proxy
  -> lbfl-socratic-ai Cloudflare Worker
  -> OpenAI Responses API + strict Structured Outputs
  -> Browser localStorage Myelination State
```

## Core Layers

1. Static presentation layer: Jekyll, Minimal Mistakes, SCSS, Liquid includes.
2. Edge delivery layer: Cloudflare DNS, TLS, proxy, CDN, custom domain.
3. AI gateway layer: `lbfl-socratic-ai`, OpenAI Responses API, strict JSON Schema, safe fallback.
4. Cognitive state layer: browser localStorage using `lbfl_myelinated_nodes`.
5. Audit layer: `scripts/omega-production-audit.ps1` and exact-head GitHub Actions certification.

## AI Provider Contract

The public frontend contract is provider-independent. The Worker currently uses OpenAI and defaults to `gpt-5.6-terra` for the Socratic evaluator.

The Worker must expose health metadata identifying the active provider/model and must never expose API credentials. Provider requests use `store: false` and strict Structured Outputs. The browser never receives `OPENAI_API_KEY`.

The public Socratic response shape remains:

```json
{
  "mastery_achieved": false,
  "feedback_text": "...",
  "next_vector": "/biology/",
  "strike_count": 1
}
```

Only verified `next_vector` routes may be returned. Provider errors, refusals, malformed output, or unavailable credentials resolve to the deterministic safe fallback rather than leaking upstream errors to the browser.

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
  -> https://api.learningbiologyforlife.org/api/socratic
  -> lbfl-socratic-ai
  -> OpenAI Responses API / strict JSON Schema
  -> normalized Socratic JSON
  -> UI feedback
  -> lbfl:node-myelinated event
  -> assets/js/myelination-tracker.js
  -> localStorage persistence
```

The legacy `/api/gemini` Worker route is retained only as a compatibility alias for existing clients. It does not imply Gemini is the active provider. New integrations should use `/api/socratic`.

## Required Runtime Files

- `assets/js/socratic-component.js`
- `assets/js/myelination-tracker.js`
- `_includes/socratic/socratic-node.html`
- `_sass/components/_socratic.scss`
- `worker/src/index.ts`
- `wrangler.jsonc`
- `worker/package.json`
- `scripts/omega-production-audit.ps1`

## Worker Deployment Policy

`api.learningbiologyforlife.org` is owned by the dedicated `lbfl-socratic-ai` Worker. Provider migrations must not detach, replace, or redeploy the custom-domain trigger.

Production Worker code changes use Cloudflare Versions:

```text
wrangler versions upload
        -> capture immutable candidate version ID
        -> wrangler versions deploy <candidate>@100%
        -> health/version/CORS/Socratic verification
        -> rollback previous version on failure
```

Do not use a plain `wrangler deploy` for provider-only production changes when the custom-domain trigger is managed remotely; it can overwrite remote trigger configuration.

## Certification Criteria

- Jekyll build succeeds.
- No BOM exists in `assets/css/main.scss`.
- No corrupted `[span_*]` artifacts exist.
- Socratic frontend sends a valid JSON payload.
- Worker validates payload before calling OpenAI.
- Direct OpenAI credential/model/Structured Outputs preflight succeeds before production mutation.
- Worker health identifies `provider: openai`, the expected model, and a configured OpenAI secret.
- Worker returns the strict four-key Socratic contract and does not return the deterministic fallback during genuine execution proof.
- CORS allows the canonical LBFL browser origin and no unapproved origin.
- Worker body/header version IDs match the exact deployed candidate.
- `api.learningbiologyforlife.org` remains owned by `lbfl-socratic-ai` after deployment.
- Worker returns safe fallback JSON during provider failure.
- No API key appears in frontend source, Git history, logs, artifacts, or summaries.
- Mastery state restores from localStorage.
- Mobile layout remains stable.

## Final Declaration

Learning Biology For Life is an edge-native cognitive education system where biology concepts operate as learning nodes, OpenAI-backed Socratic evaluation performs guided reasoning behind a stable provider-independent contract, and mastered nodes persist as local myelination state.
