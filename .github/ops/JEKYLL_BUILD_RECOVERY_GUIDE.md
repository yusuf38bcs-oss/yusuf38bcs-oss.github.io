# Jekyll Build Recovery Guide

Use this guide when local build, GitHub Actions build, or GitHub Pages deployment fails.

## 1. First Rule: Identify the Failure Layer

Do not guess. Identify the layer first:

```text
Source file error
YAML front matter error
Liquid template error
Markdown rendering error
SCSS/CSS error
JavaScript asset error
Collection/permalink error
GitHub Actions build error
GitHub Pages deploy skipped
Cloudflare cache stale
```

## 2. Local Build Command

From the repository folder:

```powershell
bundle exec jekyll clean
bundle exec jekyll build --trace
```

If local Ruby/Bundler is broken, use GitHub Actions as the source of truth, but never ignore repeated local errors.

## 3. YAML Front Matter Rules

Every Jekyll page must keep front matter valid:

```yaml
---
layout: single
title: "Example Title"
permalink: /example/
---
```

Common errors:

- Missing closing `---`.
- Unquoted colon in title.
- Tab indentation.
- BOM or invalid encoding before front matter.
- Duplicate permalink across multiple files.

## 4. Markdown and HTML Mixing Rule

If a Markdown file wraps large content inside raw HTML, Markdown may not render.

Avoid this pattern:

```html
<div>
## Markdown heading
**bold**
| table |
</div>
```

Safe options:

1. Use pure Markdown outside HTML wrappers.
2. Use pure HTML for complex designed pages.
3. Use `markdown="1"` only where the theme/Jekyll renderer supports it reliably.

If live output shows `##`, `**`, table pipes, or Mermaid fences as plain text, fix the Markdown/HTML structure immediately.

## 5. Collection Route Rule

Check collection permalink rules in `_config.yml` before creating pages.

Current major collections:

```text
_biology → /biology/:path/
_synaptic-bridge → /synaptic-bridge/:path/
_life-practices → /life-practices/:path/
_socratic → /socratic/:path/
_mcq-arena → /mcq-arena/:path/
```

Do not create duplicate public routes for the same concept.

## 6. Required Build Guardrails

The GitHub Actions workflow must validate:

- Homepage exists.
- Biology hub exists.
- Legal pages exist.
- `ads.txt` exists.
- `sitemap.xml` exists.
- GDPR banner renders exactly once.
- MCQ Arena exists.
- Socratic safety disclaimer exists.
- Bangla `/bn/` routes do not show stale `.github.io` fallback.
- Worker/source-only files do not leak into `_site`.

## 7. Deployment Skipped Rule

If GitHub Actions shows build success but deployment skipped:

1. Inspect the `deploy` job condition.
2. Confirm the run is on `refs/heads/main`.
3. Confirm the event is allowed: `push` or `workflow_dispatch`.
4. Re-run from `main` after fixing the condition.

Required deploy condition:

```yaml
if: github.ref == 'refs/heads/main' && (github.event_name == 'push' || github.event_name == 'workflow_dispatch')
```

## 8. Stale Live Site Rule

If repo is updated but live site is old:

1. Confirm GitHub Actions `deploy` succeeded.
2. Wait a short propagation interval.
3. Purge Cloudflare cache.
4. Test in an incognito/private browser.
5. Test the exact changed URL.

Do not keep editing source files until deployment/cache status is known.

## 9. Emergency Minimal Fix Rule

When production breaks, prefer the smallest permanent fix.

Do not rewrite architecture unless necessary.

Correct priority:

```text
Fix broken route → restore build → restore deploy → purge cache → verify live
```

## 10. Files That Need Extra Care

High-risk files:

```text
_config.yml
.github/workflows/jekyll-gh-pages.yml
_layouts/default.html
_includes/head/custom.html
_includes/navigation/language-switcher.html
_includes/footer/legal-links.html
assets/css/main.scss
assets/js/core/ai-core.js
assets/js/learning/mcq-engine.js
```

Never edit these without a clear rollback plan.
