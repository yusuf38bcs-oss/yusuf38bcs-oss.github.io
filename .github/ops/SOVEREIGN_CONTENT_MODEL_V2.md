# Sovereign Content Model v2

This model defines the safer, more secure, and more error-resistant operating architecture for `learningbiologyforlife.org`.

It is designed for a Jekyll + GitHub Pages + Cloudflare + AdSense educational platform where Bengali and English content must remain academically accurate, native-sounding, technically valid, and policy-safe.

## 1. Core Principle

The site must not be treated as a collection of isolated Markdown files. It must be treated as a structured educational operating system.

```text
Source file → Front matter → Collection route → Layout → Includes → Assets → Build output → Cloudflare cache → Live URL → Search/AdSense review
```

A change is complete only when the live URL is correct.

## 2. Sovereign Content Equation

```text
Biology = Academic Theory
Life = Practical Application
Learning = The Bridge
```

Every major educational page should strengthen at least one of these layers:

- Academic concept clarity.
- Practical life application.
- Critical thinking.
- Responsible health or behavioural literacy.
- Assessment value through explanation and validity logic.

## 3. Content Types

| Type | Purpose | Required Structure |
|---|---|---|
| Hub page | Navigation and learning map | Concept overview, pathways, internal links, quality explanation |
| Lecture page | Full guided learning | LOLO, LALA, diagrams, tables, Synaptic Bridge, critical questions, references |
| MCQ/quiz page | Assessment and feedback | Answer explanation, validity logic, correction pathway |
| Reflection/Socratic page | Self-awareness and critical thinking | Non-clinical boundary, privacy boundary, self-tracking only |
| Legal/policy page | Trust, consent and compliance | Clear scope, Google/analytics/ad disclosure, user controls |
| Gateway page | Language or category entry | Safe routing, no placeholder/fallback content |

## 4. Stability Rule

A file is not safe just because it builds.

A file is safe only if:

1. Front matter is valid.
2. Permalink is correct.
3. Layout renders properly.
4. Language metadata is correct.
5. Internal links are correct.
6. Page is readable on mobile.
7. It has original educational value.
8. It does not expose raw Markdown artifacts.
9. It does not leak stale `.github.io`, README, or placeholder text.
10. It appears correctly on the live canonical domain.

## 5. Bilingual Rule

English and Bangla are not interchangeable skins. They are reviewed educational versions.

A bilingual page is valid only when:

- The source language is identified.
- The target version has a reviewed route.
- The language switcher maps directly between the pair.
- Scientific terms are preserved or translated consistently.
- Medical/health disclaimers are preserved.
- Liquid tags, Markdown tables, code fences and internal links are preserved.
- Native Bangla does not become awkward hybrid Bangla-English.
- English mirrors are not thin auto-translations.

## 6. Translation Publication Rule

Translation output must pass through three states:

```text
Draft → Reviewed → Published
```

Never publish a translation directly from an automatic process unless it passes review guardrails.

## 7. Route Model

Recommended bilingual route structure:

| Language | Route style |
|---|---|
| Bangla canonical / default educational page | `/biology/.../page/` or `/bn/.../` only where intentionally native gateway route exists |
| English mirror | `/en/biology/.../page/` |
| Safe Bangla gateway | `/bn/` |

For unfinished translations, the switcher must route to a safe gateway, not a guessed page.

## 8. Security Rule

No operational file, public page, issue, wiki page or screenshot may expose:

- Cloudflare API tokens.
- OpenAI or Gemini API keys.
- Google OAuth secrets.
- Form endpoint secrets.
- Email admin credentials.
- Private learner records.
- Raw MI/personality/cognitive graph responses.

## 9. AdSense Safety Rule

During active AdSense review, avoid major public design, navigation, consent, ads, analytics or legal-policy changes unless fixing critical defects.

Allowed changes:

- Broken page fixes.
- Translation correction.
- Accessibility improvement.
- Content depth improvement.
- MCQ explanation improvement.
- Safety disclaimer improvement.
- Build/deployment guardrails.

## 10. Health and Behaviour Rule

Any page involving disease, treatment, personality, depression, behaviour, Multiple Intelligences, cognitive graph, physiology or health decision-making must preserve a clear educational boundary.

Minimum boundary:

```text
This content is for educational understanding only. It is not medical, psychological, diagnostic, or treatment advice.
```

Bangla equivalent:

```text
এই লেখা শিক্ষামূলক বোঝাপড়ার জন্য; এটি চিকিৎসা, মানসিক স্বাস্থ্য, রোগনির্ণয় বা ব্যক্তিগত চিকিৎসা-পরামর্শ নয়।
```

## 11. Implementation Ladder

The model must be implemented step by step:

1. Inventory and audit engine.
2. Route and bilingual-pair registry.
3. Translation glossary and quality guardrails.
4. Draft-only translation generator.
5. Manual review protocol.
6. Safe publishing protocol.
7. CI/build guardrails.
8. Live URL verification.
9. Cloudflare purge and cache validation.

## 12. Non-Negotiable Output Standard

Every major lecture should be strong enough that a learner can study it independently without needing immediate further guidance.

That requires:

- Concept explanation.
- Correct sequence.
- Diagram or flowchart.
- Table where comparison is useful.
- LOLO.
- LALA.
- Constructive alignment.
- Synaptic Bridge.
- Critical-thinking questions.
- References.
- Safety boundary where needed.
