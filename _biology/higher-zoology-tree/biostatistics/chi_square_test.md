---
layout: biostatistics-lecture
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
page_id: biostatistics-08
course_id: biostatistics-09
course_role: lecture
lecture_number: 8
translation_status: single-source-unpaired
previous: /biology/higher-zoology-tree/biostatistics/t-test-significant-difference-between-means/
course_index: /biology/higher-zoology-tree/biostatistics/
next: /biology/higher-zoology-tree/biostatistics/correlation_and_regression/
---

## Concept Overview

The **chi-square (χ²) family of tests** analyzes categorical counts. Two common applications are:

1. **goodness of fit** — do observed counts agree with specified expected proportions?
2. **test of independence** — are two categorical variables associated?

```text
χ² = Σ (O − E)² / E
```

## Goodness-of-fit Example

Suppose 400 pea plants are observed as 300 tall and 100 dwarf, with a fully specified Mendelian expectation of 3:1.

```text
Expected tall  = 400 × 3/4 = 300
Expected dwarf = 400 × 1/4 = 100
χ² = 0
```

The observations exactly match those specified expected counts, so these data provide no evidence against the 3:1 model.

For a goodness-of-fit test with **k fully specified categories and no parameters estimated from these data**:

```text
df = k − 1
```

If parameters are estimated from the same data, the degrees of freedom must be reduced accordingly; therefore “number of categories − 1” is not a universal rule.

## Test of Independence

For an r × c contingency table:

```text
Expected count = (row total × column total) / grand total
df = (r − 1)(c − 1)
```

## Conditions

- use counts, not percentages alone;
- observations must be independent under the sampling design;
- categories should be mutually exclusive;
- very small expected counts can make the usual χ² approximation unreliable and may require an exact or alternative method.

## Interpretation

A small p-value indicates that the observed count pattern is difficult to reconcile with H₀ under the test assumptions. It does not measure the strength or practical importance of association and does not prove causation.

## Common Errors

- using χ² directly for continuous measurements;
- forgetting how expected counts were obtained;
- treating failure to reject H₀ as proof that the model is true;
- applying df = k−1 after fitting parameters without adjustment;
- ignoring sparse expected cells.

## Self-check

1. Why is the 3:1 example a goodness-of-fit test?
2. When does df = k−1 require modification?
3. How are expected counts calculated in a contingency table?
4. Why can sparse expected counts be a problem?
