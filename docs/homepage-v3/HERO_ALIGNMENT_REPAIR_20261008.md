# Homepage hero alignment and deployment validation repair — 2026-10-08

Status: DRAFT / exact-head hosted certification required
Authorized base: `75fb1ea12959b6dcc795cfe5fda5362e22fa074c`
Authority: user-requested narrow repair of the hero alignment and redundant caption note, plus the observed running deployment failure.
Branch: `fix/homepage-hero-alignment-20261008`

## Observed causes and resulting behavior

- The specimen occupied both the copy and controls grid rows and centered itself across their combined height. It now occupies the copy row and aligns at its top; controls keep their own row.
- A narrow text column combined with viewport-scaled heading typography produced excessive wrapping. The text column is wider, the gutter is smaller, and the desktop preferred heading size is capped at 72px. Relative minimum/maximum sizes still accommodate user font settings.
- The redundant specimen-note node is removed; the specimen label, image and descriptive alt text remain.
- GitHub Pages rejected the valid body class list `lbfl-home-v3 lbfl-academic-v1-active` because it searched for an exact one-class attribute. An HTML parser now checks for the exact `lbfl-home-v3` token on the body element.
- Homepage integration regression now watches the hero include as a dependency.
- CSS revision and each CSS/JS URL are rebound independently to `css-c4e3ef0aff2a-js-844729453546`; the JavaScript blob remains unchanged.

## Exact mutation allowlist

- `assets/css/homepage-v3.css`
- `_includes/home-v3/hero.html`
- `_data/homepage-v3.yml`
- `_layouts/homepage-v3.html`
- `.github/scripts/homepage-responsive-layout-certification.cjs`
- `.github/workflows/conv04-i02-homepage-integration-certification.yml`
- `docs/homepage-v3/VISUAL-REGRESSION-MANIFEST.md`
- `.github/workflows/jekyll-gh-pages.yml`
- `docs/homepage-v3/HERO_ALIGNMENT_REPAIR_20261008.md`

## Verification performed

- Node syntax and diff whitespace: PASS.
- Pages body-root parser: PASS for two valid class orders and three invalid inputs (wrong body class, prefix-only token, and non-body marker).
- Focused Chromium source-overlay testing reproduced the original lower-positioned specimen and excessive heading wrapping. Remote font loading was intermittent; this is not whole-site certification.
- A separate isolated hero fixture uses the actual Manrope 700/800 font files and existing cell image, with controlled root typography. It measures 320, 360, 390, 412, 480, 700, 701, 768, 980, 1024, 1025, 1120, 1200, 1280, 1366, 1440 and 1920px.
- Hosted retained certification adds 980px and 1366px to its existing matrix and explicitly enforces caption-note absence, top alignment within 2px, and normal-layout title budgets (four lines below 1024px, three from 1024px).
- Existing search, Brevo focus/blur, Escape viewport preservation, legal focus and consent checks remain unchanged.

## Release gate and relationship to #457

No production merge or final closure is asserted by this document. Require unchanged-head Jekyll build, retained browser/accessibility/security checks, fresh review, zero unresolved threads and exact-head Trusted Governance before merge. Re-authenticate resulting main and live production afterward.

PR #457 remains an independent closure/authorization candidate. Its four outstanding review threads and production evidence must be re-authenticated after any repair merge; do not execute J from the old base.
The Cloudflare Appendages deployment error remains separate from the Pages class-token defect and is not declared repaired by this patch.
