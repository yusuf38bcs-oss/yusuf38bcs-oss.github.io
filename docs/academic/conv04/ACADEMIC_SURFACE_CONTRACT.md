# CONV-04A — LBFL Academic Surface Contract

**Contract:** `lbfl-academic-surface-contract-v1`
**Version:** `CONV-04A-1.0.0`
**Authorized base:** `b5368a947221d332c4ede1f57f6a41dcb47c6a9f`
**Purpose:** establish one machine-verifiable experience contract before broad academic redesign or learner-content migration.

## 1. Relationship to existing governance

This contract extends, rather than replaces:

- `docs/architecture/CONV-00B_ACADEMIC_COURSE_CONTRACT.md`
- `_data/academic/course_contract_v1.json`
- `.github/ops/CONTENT_PUBLISHING_RULES.md`
- `docs/BILINGUAL_ROUTE_CONTRACT.md`
- `_data/socratic/instruments.yml`

CONV-00B owns academic pathway identity, gateway identity, module ordering, prerequisites, and course-level enforcement.

CONV-04 owns learner-surface role, language metadata, reusable presentation ownership, learning-method placement, assessment placement, scientific/reflective boundary presentation, and responsive-accessibility behavior.

Where the older publishing rules say LOLO/LALA or MCQs should appear “where appropriate,” CONV-04 defines appropriateness by page role. The rule does not require a repeated learning-method panel or a full MCQ bank on every lecture.

## 2. Canonical page roles

Every migrated academic surface must declare exactly one `academic_role`.

| Role | Owns | Must not become |
|---|---|---|
| `platform_home` | platform identity, pathway entry, current learning journey | hard-coded course ledger |
| `academic_gateway` | syllabus/course orientation, chapter/course entry, progress | full lesson body |
| `chapter_index` | ordered chapter lessons, outcomes, assessment links | duplicate lecture content |
| `lecture` | concept explanation, figures, examples, concise retrieval checks, references | full assessment bank or generic learning-method essay |
| `assessment_gateway` | assessment discovery and ownership | duplicate lesson body |
| `assessment` | MCQ/CQ/short-answer bank, feedback, source-return loop | canonical theory lesson |
| `practical` | procedure, material/specimen, observation, safety, record/calculation | generic theory overload |
| `revision` | high-yield map, recall, synthesis | replacement for canonical course |
| `reflection_gateway` | reflective framework entry and scientific boundary | psychological diagnosis |
| `reflection` | metacognition, MI-informed reflection, personality-pattern reflection | intelligence/personality test claims |
| `application` | optional Synaptic/real-life/interdisciplinary extension | replacement for academic evidence |

## 3. Front-matter authority

Strict migrated surfaces must declare:

```yaml
academic_system: v1
academic_role: lecture
lang: bn
```

Additional keys are role-dependent:

```yaml
course_id: hsc-botany
chapter_id: botany-ch01
lesson_id: bot-07
learning_guide: canonical
boundary: academic
assessment_ref: botany-ch01-cell-wall-vacuole
```

### Language

- `lang` is the canonical document-language authority because `_layouts/default.html` consumes `page.lang`.
- Historical `language` may remain during migration but must not disagree with `lang`.
- A strict surface must not rely on `language` alone.
- Native Bangla routes require human academic review; automatic translation is not final academic content.

## 4. Component ownership

### 4.1 Brand and shell

One shared LBFL identity/header system must ultimately serve homepage and academic surfaces. Page-local brand implementations are migration debt.

### 4.2 Hero

Hero height is page-role-owned. Generic academic pages must not inherit a forced viewport-height hero. A strict academic surface may use a compact or feature hero only when the role requires it.

### 4.3 Educational boundary

The role-aware boundary component owns generic educational/clinical boundary presentation.

A strict lecture must not repeat the same generic boundary inside its lesson body. Topic-specific limitations, curriculum provenance, or scientific uncertainty may still be expressed as evidence/source notes when they add non-duplicative academic information.

### 4.4 Learning method

CONV-04C will create one canonical “How to Learn with LBFL” guide.

Gateways may link to it. Lectures express the method through structure and concise prompts. Repeated LOLO/LALA, DOT-LINE-CIRCLE, study-method, or framework essays are not mandatory lecture boilerplate.

### 4.5 Assessment

MCQ Arena / assessment surfaces are the canonical owner of full assessment banks.

After migration, a lecture may retain:
- 2–3 retrieval questions;
- pause-and-predict;
- one misconception check;
- one transfer/application prompt;
- CTA to the canonical assessment.

Full 10-question interactive banks with scoring belong to assessment surfaces unless a later contract explicitly authorizes an exception.

Every canonical assessment should support:
`lesson → attempt → feedback → misconception/source return → reattempt`.

### 4.6 Reflection

The scientific boundary in `_data/socratic/instruments.yml` is binding.

Personality Pattern Reflection and MI-Informed Learning Reflection are:
- educational;
- reflective;
- non-clinical;
- non-diagnostic;
- non-psychometric;
- not intelligence measurement;
- not learning-style prescription;
- not fixed identity assignment.

## 5. Visual information rules

Choose the component according to the information structure:

- sequence → stepper/flow;
- small comparison → responsive comparison cards;
- essential data matrix → semantic table with controlled horizontal overflow when necessary;
- cause/effect → flow;
- anatomy → labelled image/SVG;
- process → numbered pathway;
- definitions → compact term cards;
- deep optional detail → native `<details>`;
- related information → accessible progressive-enhancement tabs;
- misconception → misconception card;
- references/provenance → evidence panel.

Important content must remain available without JavaScript.

## 6. Responsive and accessibility contract

Strict surfaces are certified as a matrix rather than “mobile vs desktop.”

Representative widths:
- 320, 360;
- 390, 412;
- 768, 820;
- 1024;
- 1280, 1366;
- 1440, 1920;
- 2560;
- equivalent 320 CSS px reflow / 1280 at 400% zoom.

Minimum requirements:
- WCAG 2.2 AA-oriented reflow without unnecessary two-dimensional scrolling, except genuinely two-dimensional content;
- ordinary text contrast target at least 4.5:1;
- no content/function loss under WCAG text-spacing overrides;
- keyboard-operable interactive controls with visible focus;
- pointer targets at least the WCAG minimum, while LBFL should normally retain practical ~40–44 px controls;
- no global word-breaking rule that fragments ordinary words in prose/table cells;
- tables must use semantic markup and deliberate responsive behavior;
- reduced-motion preferences must be respected where motion exists.

## 7. Inline style policy

Inline/page-local design is migration debt.

Strict migrated surfaces must use shared Academic Design System components. Inline style is permitted only for a documented exceptional rendering need that cannot be represented by an owned component; such an exception must be explicit in the ledger and separately reviewed.

No CONV-04 phase may solve systemic problems by adding another broad “hotfix” stylesheet.

## 8. Academic vs reflective extension

Academic Biology must be complete on curriculum/scientific evidence alone.

Optional reflective material is routed or labelled separately:
`Academic Biology → optional Synaptic/Application → optional Socratic Reflection`.

Reflective interpretation must not be presented as laboratory evidence.

## 9. Enforcement states

### inventory

Used for initial discovery only.

Required:
- route ID;
- canonical route;
- source file;
- page role;
- expected language;
- source existence.

Detected debt is reported as warning. Inventory does not authorize promotion.

### progressive

Used during active migration.

Required:
- all inventory requirements;
- declared `source_debt`;
- declared `live_debt` when rendered evidence is still outstanding;
- no undeclared source-level contract violation.

The progressive validator compares detected source debt to declared source debt. New hidden debt fails closed. When a source defect is fixed, its declaration must be removed in the same change.

### strict

Used only after route migration and certification.

Required:
- required front matter is present and matches the ledger;
- `source_debt: []`;
- `live_debt: []`;
- no detected prohibited source pattern;
- exact-head build/browser/live gates as applicable.

Strict promotion is a deliberate PR event. Visual similarity alone cannot promote a route.

## 10. Debt codes

The initial machine-detectable source-debt vocabulary is:

- `missing_academic_role`
- `missing_academic_system`
- `missing_lang`
- `legacy_language_key`
- `lang_mismatch`
- `role_mismatch`
- `academic_system_mismatch`
- `inline_style`
- `escaped_source_comment`
- `embedded_full_mcq`
- `local_boundary_block`
- `category_collection_mismatch`
- `stale_homepage_course_count`

Initial live-only debt may include:
- `rendered_boundary_duplication`
- `rendered_language_mismatch`
- `rendered_empty_assessment_state`
- `rendered_word_fragmentation`
- `rendered_blank_hero_space`
- `rendered_low_contrast`

Initial system debt:
- `global_hero_85vh`
- `global_overflow_anywhere`
- `multi_layer_override_stack`
- `late_lesson_design_stylesheet`

## 11. Current progressive baseline

`ACADEMIC_ROUTE_LEDGER.json` registers ten live-canary surfaces.

The ledger is an explicit baseline, not a declaration that those surfaces are already clean. Its purpose is to make current debt visible and prevent new undeclared debt while migration proceeds.

## 12. Validator boundary

`.github/scripts/validate-academic-surface-contract.rb` verifies:
- ledger/schema integrity;
- unique route IDs and canonical routes;
- source/support file existence;
- allowed roles/states/debt codes;
- front-matter authority;
- selected prohibited source patterns;
- progressive debt equality;
- strict zero-debt behavior;
- selected active global system debt.

It does **not** claim computed-style, browser interaction, rendered duplication, contrast, keyboard, or production truth. Those remain browser/TinyFish/exact-preview certification responsibilities.

## 13. Promotion sequence

For any route or component:

`inventory → progressive → local/build certification → exact-head preview → live/render certification → strict`.

For the overall programme:

`CONV-04A contract → 04B design system → 04C learning architecture → 04D assessment ownership → 04E Botany → 04F Zoology/Higher Zoology → 04G Socratic → 04H metadata/routes → 04I homepage → 04J whole-platform certification`.

## 14. Protected boundaries

CONV-04 does not authorize:
- Admission / PR #356 mutation;
- Worker or Cloudflare production mutation unless a later Worker-specific scope is explicitly opened;
- learner-content authoring before the architecture gates permit it;
- BOT-08 during CONV-04A–D;
- Draft → Ready transition without exact-head governance evidence;
- merge without unchanged-head certification.
