---

layout: biostatistics-lecture
author_profile: true
author: "MD. Yusuf"

sidebar:
  nav: "synaptic_nav"

title: "Hypothesis Testing (নাস্তিক ও বিকল্প কল্পনা)"
excerpt: "জীবপরিসংখ্যান (Biostatistics) গবেষণায় প্রাপ্ত ফলাফলের সত্যতা ও গ্রহণযোগ্যতা যাচাইকরণের বৈজ্ঞানিক, গাণিতিক ও যৌক্তিক পদ্ধতি।"

date: 2026-04-05T20:12:00.000Z
last_modified_at: 2026-06-09T04:13:27.000Z

permalink: /biology/higher-zoology-tree/biostatistics/hypothesis_testing/
page_id: biostatistics-05
course_id: biostatistics-09
course_role: lecture
lecture_number: 5

categories:
  - Biology
  - Higher Zoology
  - Biostatistics

tags:
  - Biostatistics
  - Hypothesis-Testing
  - Null-Hypothesis
  - Alternative-Hypothesis
  - P-Value

# AI Knowledge Graph & Neural Routing
node_id: zoology-biostatistics-hypothesis_testing
parent_node: biostatistics
network:
  - higher-zoology-tree
  - hsc-corner
  - mcq-arena

# Synaptic Connections (Explicit Relational Mapping)
related: true
synaptic_links:
  - /biology/higher-zoology-tree/biostatistics/
  - /life-practices/human-behaviour/
  - /socratic/mcq-arena/biostatistics/

toc: true
toc_sticky: true
classes: wide

header:
  overlay_image: /assets/images/biology/biostatistics-banner.webp
language: bn
translation_status: single-source-unpaired
curriculum_tracks:
  - HSC Zoology
  - IB Biology
  - Research Methods
neet_alignment: "Biology data interpretation and hypothesis testing"
ib_theme: "Not Applicable"
ib_subtopic: "Hypothesis testing"
hsc_alignment: "Higher Zoology: null hypothesis, alternative hypothesis, and significance testing"
concept_level: "Advanced"
previous: /biology/higher-zoology-tree/biostatistics/measures-of-dispersion/
course_index: /biology/higher-zoology-tree/biostatistics/
next: /biology/higher-zoology-tree/biostatistics/z_test_problem_solving/
---
## Concept Overview

A statistical hypothesis test asks whether an observed pattern would be sufficiently unusual under a specified **null hypothesis (H₀)**. The procedure does not prove a hypothesis true or false; it quantifies how compatible the data are with a model under stated assumptions.

## Null and Alternative Hypotheses

**Null hypothesis — H₀:** a precisely stated reference claim, often representing no difference, no association, or a specified parameter value.

**Alternative hypothesis — H₁ / Hₐ:** the competing claim considered by the test.

Example:

```text
H₀: μ₁ = μ₂
Hₐ: μ₁ ≠ μ₂
```

For a prespecified directional question:

```text
H₀: μ ≤ μ₀
Hₐ: μ > μ₀
```

The direction must be justified before inspecting the result; it should not be chosen afterward to obtain significance.

## Significance Level

The significance level **α** is a decision threshold chosen before the test. A common value is 0.05, but it is not a universal boundary between truth and falsehood.

## p-value

The p-value is the probability, **assuming H₀ and the test model are correct**, of obtaining a test statistic at least as incompatible with H₀ as the one observed.

It is **not**:

- the probability that H₀ is true;
- the probability that the result occurred “by chance”;
- a measure of effect size;
- proof of biological importance.

## Decision Language

If `p ≤ α`, the conventional decision is:

**Reject H₀ at the chosen significance level.**

If `p > α`:

**Fail to reject H₀.**

“Fail to reject” does not mean “prove H₀.” A study may be underpowered or imprecise.

## One-tailed and Two-tailed Tests

A one-tailed test is appropriate only when a scientifically justified directional alternative was specified in advance. A two-tailed test evaluates departures in either direction.

## Type I and Type II Errors

| Error | Meaning |
|---|---|
| Type I (α) | Reject H₀ when H₀ is true |
| Type II (β) | Fail to reject H₀ when the relevant alternative is true |

Power is `1 − β` for a specified effect and design.

## Confidence Intervals and Effect Size

A p-value should be interpreted with effect size and uncertainty. Confidence intervals show a range of parameter values compatible with the data and model and help distinguish statistical evidence from biological importance.

## Biological Interpretation

A statistically significant difference does not establish causation. Causal interpretation depends on study design, measurement validity, confounding control, bias, and biological mechanism.

## Self-check

1. Why is “accept H₀” usually weaker language than “fail to reject H₀”?
2. What does a p-value condition on?
3. Why should a one-tailed alternative be specified before seeing the data?
4. How do effect size and confidence intervals complement a p-value?
5. Why is p < 0.05 not automatically biologically important?

## References

- American Statistical Association, statement on statistical significance and p-values.
- NIST/SEMATECH Engineering Statistics Handbook.
- Zar, *Biostatistical Analysis*.
