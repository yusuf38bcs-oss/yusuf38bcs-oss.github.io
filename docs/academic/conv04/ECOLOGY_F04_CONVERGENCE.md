# CONV-04F-04 — Ecology Academic-v1 Convergence

**Exact authorized base:** `27ed06453ae6ee9398d06c52a1b44a442004774b`

## Implemented route ownership

The legacy unprefixed Ecology root remains a compatibility landing owned by the static file. Its canonical target is now the governed course index and it explicitly links to the reviewed English and Bangla gateways.

The strict Academic-v1 surfaces are:

- `/biology/higher-zoology-tree/ecology/course-index/`
- `/en/biology/higher-zoology-tree/ecology/`
- `/bn/biology/higher-zoology-tree/ecology/`

Each Jekyll surface declares `academic_system: v1`, `academic_role: academic_gateway`, canonical Learning Guide ownership and exactly one canonical Learning Guide CTA.

## Layout correction

The shared single layout no longer suppresses the educational boundary merely because a page belongs to Ecology. The exception is now conditional:

- legacy Ecology surface without Academic-v1 → historical suppression preserved;
- Ecology surface with `academic_system: v1` → exactly one shared layout-owned educational boundary.

This does not activate Academic-v1 or a boundary on the 20 Ecology lecture pages.

## Protected scientific/course state

The strict Ecology course contract remains byte-identical. The ten-module `eco-01 … eco-10` sequence and all 20 bilingual lecture sources are outside F-04 mutation authority.

## Certification target

Certification must prove the real rendered ownership model, all three strict Academic-v1 surfaces, the compatibility root, existing Ecology 10-lecture certification, retained A-F-03 contracts, Jekyll, Axe, keyboard/focus, 320px reflow, text spacing, reduced motion and no-JS.


## Exact-head table contrast remediation

The first F-04 rendered Axe run isolated one defect to the canonical course index: the unchanged Markdown table header inherited legacy dark-table background `#353845` while Academic-v1 supplied foreground `#172033`, producing approximately **1.39:1** contrast.

The remediation does not modify shared CSS or the ten-lecture course content. The existing table is wrapped in the already certified Academic-v1 table primitive:

`lbfl-academic-table-wrap`

with `tabindex="0"`, `role="region"`, and `aria-label="Ecology lecture sequence"`. This gives the table the Academic-v1 header color ownership and a keyboard-focusable horizontal-scroll region on narrow screens.

## Polyglot route-owner remediation

The static compatibility owner is now excluded from Polyglot localization by exact path. This prevents the English static root from overwriting the rendered Bangla gateway under `/bn/biology/higher-zoology-tree/ecology/` while leaving the unprefixed compatibility route intact.

The remediation changes only `_config.yml` localization ownership for that exact static file; it does not alter lecture content, shared CSS, assessment ownership, course sequence, or other multilingual routes.
