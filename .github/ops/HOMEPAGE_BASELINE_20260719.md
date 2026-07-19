# LBFL Homepage v2 — Baseline and Evidence Contract

Date: 2026-07-19
Owner: MD. Yusuf
Repository: `yusuf38bcs-oss/yusuf38bcs-oss.github.io`
Target base branch: `staging`
Certified production baseline: `e74c6d5a99b066e134ddc0441720e6fc5b0a9d62`
Worker: `lbfl-ai-deploy-orchestrator`

## Purpose

Establish the H1 homepage content, route, deployment and rollback contract before any homepage implementation. This record does not authorize visual changes, production deployment, DNS changes, Worker code changes, analytics changes, AdSense loader changes or direct writes to `main`.

## Current homepage composition

- `index.html`
- `_includes/home/neural-hero.html`
- `_includes/home/academic-sections.html`
- `_includes/home/author-profile.html`
- `_includes/home/recent-posts.html`

## Current learner routes

| Route | Purpose | Required result |
|---|---|---|
| `/biology/hsc-corner/` | HSC Biology | Resolve without homepage fallback |
| `/biology/higher-zoology-tree/` | Higher Zoology | Resolve without homepage fallback |
| `/mcq-arena/` | MCQ practice | Resolve to learner-facing assessment gateway |
| `/socratic/` | Socratic learning | Resolve to learner-facing reflection gateway |
| `/biology/hsc-corner/botany/chapter-01-cell-and-its-structure/` | Featured Chapter 01 route | Resolve with six active lessons |
| `/biology/hsc-corner/botany/lecture-01-cell-protoplasm-cell-theory/` | Featured start route | Resolve without redirect loop |
| `/about/` | Author and editorial trust | Remain accessible |
| `/contact/` | Contact | Remain accessible |

## Baseline findings

1. The homepage already has a clear H1 and four core learning pathways.
2. Hero actions and pathway cards do not use exactly the same priority model.
3. The hero occupies most of the first mobile viewport.
4. Major homepage includes carry separate inline style systems instead of shared design tokens.
5. Recent content is selected from a broad `site.posts + site.documents` pool instead of an editorially curated contract.
6. Hero, pathways, author profile and recent logs use similar dark card treatments, limiting section hierarchy.
7. Newsletter and AI Mentor should remain secondary to the academic start journey.

## Homepage v2 content contract

The source of truth is `_data/homepage.yml`. During H1 it must remain non-rendering with:

```yaml
status: baseline-only
render_enabled: false
```

No template may consume the new data file until an approved H2/H3 implementation PR.

## Worker safety contract

The Worker may be used for homepage work only after its homepage mode is separately certified.

Required behavior:

- `dry_run` must be the default.
- Base branch must be `staging`.
- Every request must provide an exact expected base SHA.
- The Worker may create a feature branch and PR only after an authorized second request.
- The Worker must never merge.
- The Worker must never write directly to `main`.
- Any path outside the allowlist must abort the operation.
- Any change to the base SHA after planning must abort the operation.
- An idempotency key must prevent duplicate branches or commits.

## Allowed homepage scope

- `index.html`
- `_includes/home/**`
- `_data/homepage.yml`
- `_sass/pages/_homepage-v2.scss`
- `assets/js/home/homepage-v2.js`
- `assets/images/home/**`
- `.github/ops/HOMEPAGE_*.md`

## Forbidden scope

- `_config.yml`
- `.github/workflows/**`
- `Gemfile*`
- `package*.json`
- `wrangler.toml`
- Worker source and Worker secrets
- `CNAME`
- `_redirects`
- DNS
- analytics
- consent system
- AdSense loader
- legal pages

## Required release gates

1. Exact-head Jekyll validation.
2. Sovereign Site Audit v4.
3. Cloudflare branch preview.
4. 320, 360, 390, 430, 768, 1024, 1366 and 1440px visual checks.
5. Keyboard and focus review.
6. Reduced-motion and reduced-data behavior.
7. Route, canonical and homepage-fallback smoke tests.
8. AdSense-safe placement review.
9. No unresolved P0/P1 review thread.
10. Expected-head guarded promotion to `main`.

## Acceptance targets

- Exactly one visible homepage H1.
- Four core pathways resolve correctly.
- Primary academic actions visible within the first mobile viewport or immediately below it.
- No horizontal overflow at supported widths.
- WCAG AA text/control contrast.
- No internal operational wording in public content.
- Curated learner content only in the latest-learning section.
- No manual ad unit inside hero, pathway cards or primary navigation zones.
- No performance regression against the certified baseline.
- Internal CLS target: `<= 0.10`.
- Internal laboratory LCP target: `<= 2.5s`.

## Rollback triggers

- Homepage fallback or redirect loop.
- Broken pathway route.
- Missing or duplicate H1.
- Wrong canonical.
- Legal or consent access failure.
- Mobile overflow or hidden primary action.
- AI Mentor obstructing navigation.
- Major LCP, CLS or request-budget regression.

## Recovery sequence

1. Revert the specific homepage PR.
2. Redeploy the previous certified commit.
3. Purge only `/` and changed homepage assets.
4. Re-run route, legal, consent and device smoke tests.
5. Record cause and preventive test.
6. Resume only after technical and executive approval.

## H1 exit decision

H1 passes only when:

- this evidence record is reviewed;
- `_data/homepage.yml` is accepted as the content contract;
- the PR changes no rendered homepage file;
- Jekyll validation passes;
- the Worker remains unauthorized for write mode until H0 live endpoint certification is completed.
