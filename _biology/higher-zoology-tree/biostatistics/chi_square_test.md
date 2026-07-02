---
layout: single
author_profile: true
author: "MD. Yusuf"
sidebar:
  nav: "synaptic_nav"
title: "Chi-square Test: কাই-বর্গ পরীক্ষা"
excerpt: "Chi-square goodness of fit, test of independence, observed-expected frequency, degrees of freedom, assumptions and biological interpretation নিয়ে পরিচ্ছন্ন Biostatistics formula lecture."
description: "A clean Biostatistics lesson on chi-square test, goodness of fit, contingency table, degrees of freedom, formula, worked example, assumptions and interpretation."
date: 2026-04-11T09:53:00.007Z
last_modified_at: 2026-07-02T00:00:00.000Z
permalink: /biology/higher-zoology-tree/biostatistics/chi_square_test/
categories:
  - Biology
  - Higher Zoology
  - Biostatistics
tags:
  - Biostatistics
  - Chi-square Test
  - Goodness of Fit
  - Test of Independence
  - Contingency Table
  - Genetics Data
node_id: zoology-biostatistics-chi_square_test
parent_node: biostatistics
network:
  - higher-zoology-tree
  - hsc-corner
  - mcq-arena
related: true
synaptic_links:
  - /biology/higher-zoology-tree/biostatistics/
  - /biology/higher-zoology-tree/biostatistics/basic_concepts_of_biostatistics/
  - /biology/higher-zoology-tree/biostatistics/t-test-significant-difference-between-means/
  - /mcq-arena/
toc: true
toc_sticky: true
classes: wide
header:
  overlay_image: /assets/images/biology/biostatistics-banner.webp
language: bn
curriculum_tracks:
  - HSC Zoology
  - IB Biology
  - Research Methods
neet_alignment: "Biology data interpretation and chi-square analysis"
ib_theme: "Not Applicable"
ib_subtopic: "Chi-square test"
hsc_alignment: "Higher Zoology: chi-square test, goodness of fit, contingency table and biological data analysis"
concept_level: "Advanced"
difficulty: "Intermediate"
xp: 750
time_min: 60
status: "Active"
---

# Chi-square Test: কাই-বর্গ পরীক্ষা

## Concept Overview

**Chi-square test** বা **কাই-বর্গ পরীক্ষা** হলো categorical frequency data বিশ্লেষণের একটি inferential statistical test। এটি observed frequency এবং expected frequency-এর মধ্যে পার্থক্য random variation দিয়ে ব্যাখ্যা করা যায় কি না তা যাচাই করে।

Biology-তে chi-square test বিশেষভাবে useful যখন data count বা category আকারে থাকে: যেমন tall vs dwarf plants, male vs female, diseased vs healthy, present vs absent, survived vs died.

## Why This Matters

Biological data সবসময় mean-based নয়। অনেক সময় researcher frequency বা category count নিয়ে কাজ করেন। Mendelian genetics-এ 3:1 ratio, ecology-তে species presence/absence, public-health data-তে disease frequency, behaviour study-তে response category—এসব ক্ষেত্রে chi-square thinking দরকার।

{% include education/framework-links.html %}

## Chi-square Learning Focus

এই lecture central LBFL framework-কে categorical-data hypothesis testing-এ প্রয়োগ করে। Learner-এর focus হবে observed frequency, expected frequency, goodness of fit, contingency table, degrees of freedom, assumptions, chi-square formula, and cautious biological interpretation.

## Main Formula

```text
χ² = Σ[(O − E)² / E]
```

Where:

- O = observed frequency
- E = expected frequency
- Σ = sum over all categories

## Type 1: Goodness of Fit

Goodness of fit test checks whether observed data fit a theoretical ratio or expected distribution.

Example question:

```text
Do observed plant counts fit Mendelian 3:1 ratio?
```

## Worked Example: Mendelian 3:1 Ratio

Problem: 400 pea plants show 300 tall and 100 dwarf plants. Does this fit the expected 3:1 ratio?

Expected values:

```text
Total plants = 400
Expected tall  = 3/4 × 400 = 300
Expected dwarf = 1/4 × 400 = 100
```

Calculation table:

| Category | O | E | O − E | (O − E)² / E |
|---|---:|---:|---:|---:|
| Tall | 300 | 300 | 0 | 0 |
| Dwarf | 100 | 100 | 0 | 0 |
| **Total** | 400 | 400 |  | **χ² = 0** |

Interpretation:

```text
χ²calculated = 0
```

In this exact dataset, observed frequency matches expected frequency. Therefore, there is no statistical evidence against the 3:1 model from these data.

## Degrees of Freedom for Goodness of Fit

For a simple goodness-of-fit test:

```text
df = number of categories − 1
```

For tall/dwarf categories:

```text
df = 2 − 1 = 1
```

## Type 2: Test of Independence

A chi-square test of independence checks whether two categorical variables are associated.

Example questions:

```text
Is habitat type associated with species presence?
Is smoking status associated with disease category?
Is sex associated with response category?
```

## Contingency Table Logic

In a contingency table, expected frequency is calculated from row total, column total and grand total.

```text
Expected frequency = (Row total × Column total) / Grand total
```

Degrees of freedom:

```text
df = (r − 1)(c − 1)
```

Where:

- r = number of rows
- c = number of columns

## Decision Logic

```text
State H₀ and H₁
  ↓
Calculate expected frequencies
  ↓
Calculate χ²
  ↓
Find df
  ↓
Compare with critical value or p-value
  ↓
Reject or fail to reject H₀
  ↓
Interpret in biological context
```

## Assumptions and Conditions

<div class="lbfl-info-grid">
  <section class="lbfl-info-card"><h3>Categorical data</h3><p>Data should be frequency counts, not continuous measurements.</p></section>
  <section class="lbfl-info-card"><h3>Independent observations</h3><p>One observation should not be counted repeatedly or improperly linked.</p></section>
  <section class="lbfl-info-card"><h3>Expected frequency</h3><p>Expected counts should not be too small; very small expected counts can weaken the test.</p></section>
  <section class="lbfl-info-card"><h3>Clear categories</h3><p>Categories should be mutually exclusive and biologically meaningful.</p></section>
</div>

## Chi-square vs t-test

| Feature | Chi-square test | t-test |
|---|---|---|
| Data type | categorical frequency | continuous measurement |
| Main comparison | observed vs expected counts | means |
| Example | 3:1 genetic ratio | mean plant height |
| Output | χ² value | t value |
| Key concern | expected frequency and categories | mean, SD, sample size |

## Common Mistakes to Avoid

<div class="lbfl-info-grid">
  <section class="lbfl-info-card"><h3>Mistake 1</h3><p>Using chi-square test for continuous data such as weight or height without categorization.</p></section>
  <section class="lbfl-info-card"><h3>Mistake 2</h3><p>Forgetting to calculate expected frequency before using the formula.</p></section>
  <section class="lbfl-info-card"><h3>Mistake 3</h3><p>Interpreting failure to reject H₀ as proof that H₀ is absolutely true.</p></section>
  <section class="lbfl-info-card"><h3>Mistake 4</h3><p>Ignoring biological design, sample source, and category validity.</p></section>
</div>

## Synaptic Bridge

Chi-square test teaches that categories also carry evidence. A biological pattern may look acceptable or suspicious, but scientific thinking asks: how far are observed counts from expected counts, and is that difference larger than random variation would usually allow?

## Critical Thinking Questions

1. Why is chi-square test suitable for Mendelian ratio data?
2. What is the difference between goodness of fit and test of independence?
3. Why must expected frequencies be calculated before χ²?
4. Why does failure to reject H₀ not prove the expected model absolutely true?
5. When would t-test be more appropriate than chi-square test?

## Related Learning Paths

- [Biostatistics Hub]({{ '/biology/higher-zoology-tree/biostatistics/' | relative_url }})
- [Basic Concepts of Biostatistics]({{ '/biology/higher-zoology-tree/biostatistics/basic_concepts_of_biostatistics/' | relative_url }})
- [T-test: Significant Difference Between Means]({{ '/biology/higher-zoology-tree/biostatistics/t-test-significant-difference-between-means/' | relative_url }})
- [Measures of Dispersion]({{ '/biology/higher-zoology-tree/biostatistics/measures-of-dispersion/' | relative_url }})
- [MCQ Arena]({{ '/mcq-arena/' | relative_url }})

## References

- Standard HSC Zoology Biostatistics notes.
- General biostatistics references on chi-square goodness of fit, contingency table and categorical data analysis.
