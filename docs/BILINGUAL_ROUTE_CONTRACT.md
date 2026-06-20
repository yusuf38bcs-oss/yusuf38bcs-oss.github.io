# Bilingual Route Contract — Polyglot Branch

This document governs the experimental native English–Bangla architecture on `feature/bilingual-polyglot`.

## Scope

This branch is not production. It exists to test native bilingual routing without affecting `main`.

## Language Contract

| Language | Code | Route Behavior |
|---|---:|---|
| English | `en` | Default language, no language prefix |
| Bangla | `bn` | Localized route prefix `/bn/` |

## Canonical Route Pairs

| Content Area | English Canonical | Bangla Target |
|---|---|---|
| Home | `/` | `/bn/` |
| About | `/about/` | `/bn/about/` |
| Biology Hub | `/biology/` | `/bn/biology/` |
| MCQ Arena | `/mcq-arena/` | `/bn/mcq-arena/` |
| Socratic Hub | `/socratic/` | `/bn/socratic/` |
| Multiple Intelligences | `/socratic/multiple-intelligences/` | `/bn/socratic/multiple-intelligences/` |
| Cognitive Audit | `/life-practices/cognitive-audit/` | `/bn/life-practices/cognitive-audit/` |
| Matrix MI Legacy/Reference | `/matrix/multiple-intelligences/` | `/bn/matrix/multiple-intelligences/` |

## Front Matter Standard

Every native translated page should use explicit language metadata.

```yaml
lang: en
page_id: about
permalink: /about/
```

```yaml
lang: bn
page_id: about
permalink: /about/
```

`page_id` must remain stable across translations.

## Asset Rule

The following must not be localized or duplicated:

- `assets/`
- `css/`
- `images/`
- `javascript/`
- `js/`
- `worker/`
- `.github/`
- `scripts/`

## Merge Rule

Do not merge this branch into `main` until all of these pass:

1. `bundle install`
2. `bundle exec jekyll clean`
3. `bundle exec jekyll build`
4. English canonical route audit
5. Bangla route audit
6. hreflang/canonical audit
7. OMEGA bilingual guardrail update

## Temporary Production Bridge

The Google Translate widget on `main` is a temporary accessibility bridge. It must not be treated as final academic translation.

Native Bangla pages should be manually translated, reviewed, and connected through this Polyglot architecture.
