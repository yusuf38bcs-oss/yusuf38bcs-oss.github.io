---
layout: single
author_profile: true
author: "MD. Yusuf"
sidebar:
  nav: "synaptic_nav"
title: "Z-Test: Problem Solving"
excerpt: "Large-sample z-test, hypothesis setup, standard error, z-value calculation, critical value comparison and biological interpretation নিয়ে পরিচ্ছন্ন Biostatistics formula lecture."
date: 2026-04-05T19:06:00.005Z
last_modified_at: 2026-07-02T00:00:00.000Z
permalink: /biology/higher-zoology-tree/biostatistics/z_test_problem_solving/
categories:
  - Biology
  - Higher Zoology
  - Biostatistics
tags:
  - Biostatistics
  - Z Test
  - Hypothesis Testing
  - Problem Solving
  - Biological Data
node_id: zoology-biostatistics-z_test_problem_solving
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
neet_alignment: "Biology data interpretation and z-test problem solving"
ib_theme: "Not Applicable"
ib_subtopic: "Z-test problem solving"
hsc_alignment: "Higher Zoology: z-test numerical problem solving"
concept_level: "Problem Solving"
difficulty: "Intermediate"
xp: 750
time_min: 55
status: "Active"
---

# Z-Test: Problem Solving

## Concept Overview

**Z-test** হলো hypothesis testing-এর একটি method, যা সাধারণত large sample অথবা known population standard deviation context-এ ব্যবহৃত হয়। এটি sample mean এবং hypothesized population mean-এর difference standard error-এর তুলনায় কত বড়—তা z-score আকারে প্রকাশ করে।

Core formula:

```text
Z = (X̄ − μ) / (σ / √n)
```

Where:

- X̄ = sample mean
- μ = hypothesized population mean
- σ = population standard deviation
- n = sample size
- σ / √n = standard error of mean

## Why This Matters

Biological research-এ অনেক সময় জানতে হয় sample result কি expected population value থেকে সত্যিই আলাদা, নাকি sampling variation-এর কারণে আলাদা দেখাচ্ছে। Z-test এই difference-কে standardized form-এ দেখায়, যাতে critical value বা p-value দিয়ে decision নেওয়া যায়।

{% include education/framework-links.html %}

## Z-test Learning Focus

এই lecture central LBFL framework-কে formula problem solving-এ প্রয়োগ করে। Learner-এর focus হবে hypothesis setup, one-tailed vs two-tailed logic, standard error, z-value calculation, critical value comparison, decision statement, and cautious biological interpretation.

## When to Use Z-test

<div class="lbfl-info-grid">
  <section class="lbfl-info-card"><h3>Large sample context</h3><p>Sample size sufficiently large হলে z-approximation practical হতে পারে।</p></section>
  <section class="lbfl-info-card"><h3>Known σ</h3><p>Population standard deviation known থাকলে one-sample z-test appropriate হতে পারে।</p></section>
  <section class="lbfl-info-card"><h3>Mean comparison</h3><p>Sample mean একটি hypothesized population mean থেকে আলাদা কি না তা test করা যায়।</p></section>
  <section class="lbfl-info-card"><h3>Standardized decision</h3><p>Raw difference-কে standard error unit-এ convert করে decision নেওয়া হয়।</p></section>
</div>

## Worked Example: Pangas Fish Weight

Research question: একটি খামারের পাঙ্গাশ মাছের গড় ওজন সাধারণ গড় 1.5 kg-এর চেয়ে বেশি কি?

Given data:

| Quantity | Symbol | Value |
|---|---:|---:|
| Hypothesized population mean | μ | 1.50 kg |
| Sample mean | X̄ | 1.56 kg |
| Population standard deviation | σ | 0.20 kg |
| Sample size | n | 100 |
| Significance level | α | 0.05 |

## Step 1: Hypothesis

```text
H₀: μ = 1.50 kg
H₁: μ > 1.50 kg
```

This is a right-tailed test because the research question asks whether the mean is greater than 1.50 kg.

## Step 2: Standard Error

```text
SE = σ / √n
   = 0.20 / √100
   = 0.20 / 10
   = 0.02
```

## Step 3: Z-value Calculation

```text
Z = (X̄ − μ) / SE
  = (1.56 − 1.50) / 0.02
  = 0.06 / 0.02
  = 3.00
```

Calculated value:

```text
Z = 3.00
```

## Step 4: Critical Value Comparison

For a right-tailed test at α = 0.05, a common critical z-value is:

```text
Zcritical = 1.645
```

Decision comparison:

```text
Zcalculated = 3.00
Zcritical   = 1.645

Since 3.00 > 1.645, reject H₀.
```

## Step 5: Biological Interpretation

There is statistical evidence at the 5% significance level that the mean weight in this sample context is greater than 1.50 kg.

Important caution: this result does not automatically prove the cause. To claim that feed, culture method, water quality or management caused the difference, the study design must control confounding variables.

## Decision Flowchart

```text
State biological question
  ↓
Set H₀ and H₁
  ↓
Identify μ, X̄, σ and n
  ↓
Calculate SE = σ / √n
  ↓
Calculate Z
  ↓
Compare with critical value or p-value
  ↓
Reject or fail to reject H₀
  ↓
Interpret cautiously in biological context
```

## One-Tailed vs Two-Tailed Z-test

| Test type | Alternative hypothesis | Use case |
|---|---|---|
| Right-tailed | μ > μ₀ | sample mean is greater than expected value |
| Left-tailed | μ < μ₀ | sample mean is less than expected value |
| Two-tailed | μ ≠ μ₀ | sample mean is different in either direction |

## Z-test vs t-test

| Feature | Z-test | t-test |
|---|---|---|
| Typical use | large sample or known σ | small sample or unknown σ |
| Spread used | population SD σ | sample SD s |
| Distribution | normal distribution | t-distribution |
| Example | known σ fish-weight test | small sample plant-height test |

## Common Mistakes to Avoid

<div class="lbfl-info-grid">
  <section class="lbfl-info-card"><h3>Mistake 1</h3><p>Using z-test when population SD is unknown and sample is small.</p></section>
  <section class="lbfl-info-card"><h3>Mistake 2</h3><p>Choosing two-tailed test when the research hypothesis is clearly one-directional.</p></section>
  <section class="lbfl-info-card"><h3>Mistake 3</h3><p>Rejecting H₀ and then making unsupported causal claims.</p></section>
  <section class="lbfl-info-card"><h3>Mistake 4</h3><p>Reporting only final Z without showing hypothesis, SE and decision rule.</p></section>
</div>

## Synaptic Bridge

Z-test teaches disciplined comparison. A small difference may be meaningful if variation is low and sample size is large; a visible difference may still be weak if uncertainty is high. The biological lesson is clear: decisions should be made after measuring both difference and uncertainty.

## Critical Thinking Questions

1. Why is the standard error important in Z-test calculation?
2. Why is this example a right-tailed test?
3. What does it mean to reject H₀?
4. Why does statistical evidence not automatically prove biological cause?
5. When would t-test be preferred over z-test?

## Related Learning Paths

- [Biostatistics Hub]({{ '/biology/higher-zoology-tree/biostatistics/' | relative_url }})
- [Basic Concepts of Biostatistics]({{ '/biology/higher-zoology-tree/biostatistics/basic_concepts_of_biostatistics/' | relative_url }})
- [T-test: Significant Difference Between Means]({{ '/biology/higher-zoology-tree/biostatistics/t-test-significant-difference-between-means/' | relative_url }})
- [Measures of Dispersion]({{ '/biology/higher-zoology-tree/biostatistics/measures-of-dispersion/' | relative_url }})
- [MCQ Arena]({{ '/mcq-arena/' | relative_url }})

## References

- Standard HSC Zoology Biostatistics notes.
- General biostatistics references on z-test, standard error, critical value and hypothesis testing.
