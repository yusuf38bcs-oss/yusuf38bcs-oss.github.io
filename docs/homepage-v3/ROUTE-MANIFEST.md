# Route Manifest — Homepage V3.5 Production Release

Canonical production route: `/`

Production properties:
- `robots: index,follow`
- canonical learner-facing homepage
- V3.5 layout owns the single page `<main>`
- production SEO / AdSense boundary / analytics-consent / GDPR runtime preserved

Design laboratory route: `/labs/homepage-v3/`

Lab properties:
- `sitemap: false`
- `robots: noindex,nofollow`
- no independent release authority

Primary learner destinations are read from the existing authoritative `_data/homepage.yml` where possible.
