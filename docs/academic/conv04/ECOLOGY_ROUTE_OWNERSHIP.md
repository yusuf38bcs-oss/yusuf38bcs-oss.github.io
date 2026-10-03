# CONV-04F-04 — Ecology Route Ownership Correction

**Status:** AUTHORIZED / NOT YET IMPLEMENTED  
**Exact base:** `27ed06453ae6ee9398d06c52a1b44a442004774b`  
**Branch:** `conv-04f-04-ecology-route-ownership-r1-20261003`

## Root cause

The original three-source F-04 authorization was structurally incomplete.

The public default route `/biology/higher-zoology-tree/ecology/` is physically served by:

`biology/higher-zoology-tree/ecology/index.html`

—not by the Bangla Jekyll source that also declares the unprefixed permalink. The Bangla source is rendered by the multilingual pipeline under the `/bn/` public route.

At the same time, `_layouts/single.html` suppresses the educational-boundary include for all Ecology surfaces. Therefore adding Academic-v1 metadata to only the three Markdown sources could produce apparently green source checks while leaving the real compatibility root unchanged and the Jekyll academic surfaces without their required layout-owned boundary.

## Correct route model

| Public route | Owner | Contract |
|---|---|---|
| `/biology/higher-zoology-tree/ecology/` | `biology/higher-zoology-tree/ecology/index.html` | legacy compatibility landing |
| `/biology/higher-zoology-tree/ecology/course-index/` | `_biology/.../ecology/course-index.md` | canonical governed Ecology course |
| `/en/biology/higher-zoology-tree/ecology/` | `_biology/.../ecology/en/index.md` | English Academic-v1 gateway |
| `/bn/biology/higher-zoology-tree/ecology/` | `_pages/ecology-v2-gateway.bn.md` through multilingual rendering | Bangla Academic-v1 gateway |

The existing course contract already defines the course-index route as canonical and the unprefixed root as a legacy route. The course contract itself is therefore protected and unchanged.

## Authorized correction

Four learner-facing owners are authorized: the static compatibility root plus the Bangla gateway, English gateway and canonical course index.

`_layouts/single.html` receives one narrow conditional rule: legacy Ecology pages continue to suppress the shared educational boundary, but an Ecology page explicitly opting into `academic_system: v1` receives exactly one layout-owned educational boundary.

No shared CSS or Ecology lecture content is authorized.

## Promotion requirements

F-04 must certify the real rendered routes, not just front matter:

- root compatibility ownership/canonical target/language links;
- English, Bangla and course-index Academic-v1 ownership;
- exactly one canonical Learning Guide CTA;
- exactly one educational boundary on Academic-v1 Ecology surfaces;
- 10/10 Ecology module sequence unchanged;
- existing 20 bilingual lecture pages retained;
- Jekyll, Axe, keyboard/focus, 320px reflow, text spacing, reduced motion and no-JS;
- retained A-E and F-01/F-02/F-03 contracts;
- exact-head security, Pages and governance.
