# LBFL Homepage V4.6 — Candidate execution and release hold

## Authority and status

- Candidate: `feat/lbfl-homepage-v46-learning-first-20261025`, based on protected `main@3164d2537b4f19381c52bbfb5c9e1b7ee7d15846`.
- State: **IMPLEMENTATION CANDIDATE — HOLD / NO MERGE / NO PRODUCTION DEPLOY**.
- Research basis: *LBFL Homepage Expert Code-and-Design Review* (33 pages), especially pages 1–12 and 22–32. The report reviews a V4.5.1 standalone prototype; this implementation intentionally builds on the different existing V3 Jekyll production foundation.
- No Worker, DNS, Cloudflare, ads, consent, secrets, protection rules, science-course sources or shared-platform files are modified.

## Learner-first information architecture

Hero → Four primary pathways → Observe/Predict/Inspect/Revise challenge → Eight-lesson connected journey → Attempt/Feedback/Repair/Reattempt → Six curated source lessons → DOT/LINE/CIRCLE method → Editorial accountability → Continue.

The homepage now asks for a learner decision and a prediction before explaining its philosophy. HSC Biology, Higher Zoology, MCQ Arena and Socratic 4.0 are the four dominant routes; Admission, IELTS and Bangla remain discoverable secondary routes.

## Scientific and editorial safeguards

- The plant-cell salt challenge explicitly states its assumptions. Its model is **not** represented as experimental measurements. The answer is net water movement out of the cell under the stated water-potential gradient; sufficient water loss may cause plasmolysis.
- Linked source lessons: published HSC Botany membrane and cell wall/vacuole lessons.
- Six spotlight cards are curated from the existing Chapter-01 learning data. They **do not** claim to be the latest or to have a review certification not recorded in metadata. Their named canonical lesson routes must be verified against built `_site`.
- Prediction and reflection text is processed locally; no telemetry, cookies, storage, user ID or network calls are introduced by V4.6.

## Progressive enhancement

- Pathways, journey links, spotlight cards and editorial content are rendered by Jekyll and usable with JavaScript disabled.
- The prediction explanation is native `<details>` and available without JavaScript; answer-specific feedback and reset are enhancements.
- Motion is nonessential; pause, reduced-motion, Save-Data, page-hidden and offscreen controls are independent of learning actions.
- English page marks Bangla snippets with `lang="bn"`. The existing `/bn/` entry has a Bangla explanation and source route.

## Acceptance and release gates (not yet certified)

1. Exact-head pinned Ruby/Jekyll production build passes.
2. Original V3 responsive, shared-search, newsletter, legal and editorial contracts pass without relaxing existing protections.
3. V4.6 contract passes: four pathways, early discovery, science prompt, feedback/reset, eight journey links, six real source URLs, JS-off availability.
4. 320/390/768/1440 reflow, 200% text, 400% zoom, keyboard, native dialog, focus return, screen-reader and Bangla shaping are checked on the built artifact.
5. Contrast, forced colors, reduced motion and Save-Data are manually and automatically checked where appropriate; no WCAG 2.2 AA claim until the full audit is complete.
6. PR is reviewed on its exact head; independent governance, provenance and any release-attestor requirements remain binding.
7. Merge and production deployment require a **new explicit authorization**. Draft PR checks and local candidate work are not production authorization.

## Interpretation

This candidate implements the reviewed architecture but does **not** assert improved learning outcomes without evaluation. Track meaningful pathway starts, prediction-to-evidence continuation, misconception repair and connected-lesson continuation; avoid optimizing for clicks alone. No analytics are activated in this candidate.

## Canonical-language route correction

The eight curated Chapter-01 source lessons declare `lang: bn` in their Jekyll front matter. The public unprefixed route redirects to `/bn/biology/...`; V4.6 now links directly to `/bn/biology/...` and marks the destination with `hreflang="bn"`. The read-only browser gate requires the canonical `/bn/` files in the generated `_site`. This corrects an observed build-route mismatch without changing lesson sources or the shared Polyglot configuration.
