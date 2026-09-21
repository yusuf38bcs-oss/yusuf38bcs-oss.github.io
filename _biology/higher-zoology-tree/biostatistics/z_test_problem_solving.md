---
layout: biostatistics-lecture
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
page_id: biostatistics-06
course_id: biostatistics-09
course_role: lecture
lecture_number: 6
translation_status: single-source-unpaired
previous: /biology/higher-zoology-tree/biostatistics/hypothesis_testing/
course_index: /biology/higher-zoology-tree/biostatistics/
next: /biology/higher-zoology-tree/biostatistics/t-test-significant-difference-between-means/
---

## Concept Overview

A **one-sample z-test for a mean** compares a sample mean with a hypothesized population mean when the population standard deviation, σ, is known and the sampling distribution of the mean can reasonably be treated as normal.

```text
Z = (X̄ − μ₀) / (σ / √n)
```

A large sample by itself does not magically make every z-test appropriate; the test design, independence of observations, and the relevant distributional conditions still matter.

## Worked Example: Pangas Fish Weight

A farm asks whether mean fish weight is greater than 1.50 kg.

| Quantity | Symbol | Value |
|---|---:|---:|
| Hypothesized mean | μ₀ | 1.50 kg |
| Sample mean | X̄ | 1.56 kg |
| Known population SD | σ | 0.20 kg |
| Sample size | n | 100 |
| Significance level | α | 0.05 |

### Step 1 — hypotheses

```text
H₀: μ = 1.50 kg
Hₐ: μ > 1.50 kg
```

### Step 2 — standard error

```text
SE = σ / √n
   = 0.20 / √100
   = 0.02 kg
```

### Step 3 — test statistic

```text
Z = (1.56 − 1.50) / 0.02
  = 3.00
```

### Step 4 — decision

For a prespecified right-tailed test at α = 0.05, the critical value is approximately 1.645.

```text
3.00 > 1.645
→ reject H₀
```

The data provide statistical evidence that the population mean exceeds 1.50 kg under the stated model. This does not identify the biological cause of the difference.

## Z-test and t-test

When σ is unknown, a t procedure is usually the principled mean-testing framework because it accounts for estimating variability from the sample. With large samples the t distribution approaches the normal distribution, but reporting the actual method remains important.

## Common Errors

- substituting sample SD into a “known σ” z formula without explaining the approximation;
- choosing a one-tailed test after looking at the result;
- interpreting rejection of H₀ as proof of a causal mechanism;
- reporting only Z without the hypothesis, assumptions, effect estimate and uncertainty.

## Self-check

1. Why does this example qualify as a right-tailed test?
2. What assumption is represented by using σ = 0.20 kg?
3. What would change if σ were unknown?
4. Why does Z = 3.00 not prove a feed or management cause?
