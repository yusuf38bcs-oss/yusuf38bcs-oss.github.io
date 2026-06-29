# Bilingual Translation Control Model

This document defines the safe model for translating English pages to native Bangla and Bangla pages to clean English across `learningbiologyforlife.org`.

## 1. Translation Philosophy

The goal is not word-for-word translation. The goal is faithful educational equivalence.

A good translation must preserve:

- Scientific accuracy.
- Educational sequence.
- LOLO and LALA alignment.
- Synaptic Bridge meaning.
- Safety disclaimer.
- Internal route logic.
- Native readability.
- AdSense-safe content quality.

## 2. No Blind Translation Rule

Do not translate the entire repository blindly. A normal machine translator may damage:

- YAML front matter.
- Permalinks.
- Liquid tags.
- Markdown tables.
- Code blocks.
- Internal links.
- Medical boundaries.
- Scientific terminology.
- AdSense policy wording.

## 3. Translation States

| State | Meaning | Public? |
|---|---|---|
| Source | Original reviewed page | Yes |
| Draft translation | Generated or manually drafted translation | No |
| Reviewed translation | Human/AI-reviewed, glossary-compliant, route-safe | Ready |
| Published translation | Committed with language switcher route pair | Yes |

## 4. Protected Text Blocks

A translation engine must not modify these blindly:

```text
--- YAML front matter delimiters
layout:
permalink:
categories:
tags:
node_id:
parent_node:
synaptic_links:
{% Liquid tags %}
{{ Liquid variables }}
HTML attributes
Code fences
Script blocks
Style blocks
ads.txt content
robots.txt content
GTM/GA4/AdSense IDs
```

## 5. Glossary Rule

Use consistent terms.

| English | Bangla standard |
|---|---|
| Learning Objectives and Learning Outcomes | শিখন উদ্দেশ্য ও শিখনফল |
| LOLO | LOLO |
| Learning Activities and Learning Applications | শিখন কার্যক্রম ও শিখন প্রয়োগ |
| LALA | LALA |
| Synaptic Bridge | সিন্যাপটিক ব্রিজ |
| MCQ Arena | এমসিকিউ অ্যারেনা |
| Socratic 4.0 | Socratic 4.0 |
| Cognitive Graph | জ্ঞানীয় মানচিত্র |
| Multiple Intelligences | বহুমুখী বুদ্ধিমত্তা |
| RBC | লোহিত রক্তকণিকা / RBC |
| WBC | শ্বেত রক্তকণিকা / WBC |
| Platelet | অনুচক্রিকা / Platelet |
| Systole | সংকোচন দশা / Systole |
| Diastole | প্রসারণ দশা / Diastole |
| Alveoli | অ্যালভিওলাই |
| Surfactant | সারফ্যাক্ট্যান্ট |
| Hemoglobin | হিমোগ্লোবিন |
| Myogenic | মায়োজেনিক |
| Pulmonary circulation | ফুসফুসীয় সঞ্চালন |
| Systemic circulation | দেহীয় সঞ্চালন |
| Angioplasty | অ্যাঞ্জিওপ্লাস্টি |
| Coronary artery bypass grafting | করোনারি আর্টারি বাইপাস গ্রাফটিং / CABG |
| Open-heart surgery | ওপেন-হার্ট সার্জারি |

## 6. Native Bangla Rule

Bangla pages should be Bengali-first, not awkward hybrid text.

Acceptable pattern:

```text
জীববিজ্ঞান হলো একাডেমিক তত্ত্ব, জীবন হলো তার বাস্তব প্রয়োগ, আর শেখা হলো এই দুইয়ের মধ্যে সেতুবন্ধন।
```

Avoid pattern:

```text
Native Bangla Gateway gives structured academic hub and learning framework.
```

Scientific English terms may remain when they are necessary for exams or medical terminology, but the explanatory sentence should be natural Bangla.

## 7. Clean English Rule

English mirror pages must not be literal Bangla-to-English output. They must read as clear academic English and preserve the same learning sequence.

## 8. Medical and Health Boundary Rule

Any translated health page must preserve safety language.

English:

```text
This content is for educational understanding only. It is not medical diagnosis, prescription, treatment advice, or emergency instruction.
```

Bangla:

```text
এই লেখা শিক্ষামূলক বোঝাপড়ার জন্য। এটি রোগনির্ণয়, প্রেসক্রিপশন, চিকিৎসা-পরামর্শ বা জরুরি চিকিৎসা-নির্দেশনা নয়।
```

## 9. Route Pair Rule

A page pair is valid only if both routes exist and the language switcher maps directly.

Example:

```text
Bangla:  /biology/higher-zoology-tree/physiology/blood-circulation/
English: /en/biology/higher-zoology-tree/physiology/blood-circulation/
```

Unfinished translation:

```text
Bangla button → /bn/ safe gateway
```

## 10. Translation Quality Failures

Reject translation if it contains:

- Raw Markdown artifacts visible in rendered page.
- Bad mixed-language fragments.
- Untranslated placeholders.
- Broken tables.
- Broken Liquid tags.
- Translated URLs.
- Missing safety disclaimer.
- Removed references.
- Overconfident medical advice.
- Public diagnosis language.
- `.github.io` fallback text.

## 11. Implementation Plan

1. Run the audit engine.
2. Generate page inventory.
3. Identify language pairs.
4. Detect missing mirrors.
5. Generate draft translations only.
6. Review using glossary and health boundary checks.
7. Commit reviewed translations.
8. Update language switcher route pairs.
9. Run build and audit guardrails.
10. Deploy and verify live URLs.

## 12. Publishing Rule

Only reviewed translations may be committed to public routes.

Draft translation output should go to:

```text
_translation_drafts/
```

or another excluded/non-public workflow area until reviewed.
