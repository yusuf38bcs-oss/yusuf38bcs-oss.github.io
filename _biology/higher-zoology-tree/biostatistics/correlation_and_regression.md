---
layout: biostatistics-lecture
author_profile: true
author: "MD. Yusuf"

sidebar:
  nav: "synaptic_nav"

title: "Correlation and Regression: সহসম্বন্ধ ও রিগ্রেশন"
excerpt: "দুটি চলকের পারস্পরিক সম্পর্কের গভীরতা এবং একটি স্বাধীন চলকের সাপেক্ষে অন্যটির গাণিতিক পূর্বাভাস দেওয়ার বায়োস্ট্যাটিস্টিক্যাল মেকানিজম।"

date: 2026-04-05T20:55:00.000Z
last_modified_at: 2026-06-09T04:13:27.000Z

permalink: /biology/higher-zoology-tree/biostatistics/correlation_and_regression/

categories:
  - Biology
  - Higher Zoology
  - Biostatistics

tags:
  - Biostatistics
  - Correlation
  - Regression
  - Zoology
  - Research-Methodology

# AI Knowledge Graph & Neural Routing
node_id: zoology-biostatistics-correlation_and_regression
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
curriculum_tracks:
  - HSC Zoology
  - IB Biology
  - Research Methods
neet_alignment: "Biology data interpretation, correlation, and regression"
ib_theme: "Not Applicable"
ib_subtopic: "Correlation and regression"
hsc_alignment: "Higher Zoology: correlation, regression, and biological relationship analysis"
concept_level: "Advanced"
page_id: biostatistics-09
course_id: biostatistics-09
course_role: lecture
lecture_number: 9
translation_status: single-source-unpaired
previous: /biology/higher-zoology-tree/biostatistics/chi_square_test/
course_index: /biology/higher-zoology-tree/biostatistics/
next: null
status: "Active"
---

## Concept Overview

**Correlation** describes the direction and strength of a relationship; **regression** models how an outcome changes with one or more predictors. Neither method, by itself, establishes causation.

## Pearson Correlation

Pearson's correlation coefficient measures **linear** association:

```text
−1 ≤ r ≤ +1
```

- r > 0: positive linear association
- r < 0: negative linear association
- r near 0: little or no **linear** association

A crucial qualification: **r = 0 does not imply statistical independence.** A strong nonlinear relationship can have zero Pearson correlation.

## Scatterplots First

Before calculating r, inspect a scatterplot for curvature, clusters, outliers, range restriction and other structure. The same r can arise from very different data patterns.

## Linear Regression

A simple linear regression can be written:

```text
Y = a + bX + ε
```

where ε represents residual variation not captured by the fitted line.

A fitted value is an estimate, not certainty. Prediction should be accompanied by uncertainty, and extrapolation beyond the observed X range is especially risky.

## Worked Pearson Example

For five observations:

| X | Y | X² | Y² | XY |
|---:|---:|---:|---:|---:|
| 150 | 50 | 22500 | 2500 | 7500 |
| 160 | 60 | 25600 | 3600 | 9600 |
| 170 | 70 | 28900 | 4900 | 11900 |
| 180 | 80 | 32400 | 6400 | 14400 |
| 190 | 90 | 36100 | 8100 | 17100 |
| **Σ** | **350** | **145500** | **25500** | **60500** |

```text
ΣX = 850
ΣY = 350
r = 1.00
```

For **this constructed dataset**, the five points fall exactly on a straight increasing line. That establishes perfect linear correlation in these observations; it does **not** establish that human height and weight are perfectly related in the population.

## R²

In simple linear regression with an intercept, R² equals r². It summarizes the fraction of sample outcome variation accounted for by the fitted linear model. It is not the percentage “caused” by X.

## Correlation Is Not Causation

Association may reflect reverse causation, confounding, selection, measurement processes or coincidence. Causal claims require an appropriate study design and assumptions beyond correlation/regression calculations.

## Common Errors

- saying r = 0 means independent;
- treating high |r| as proof of causation;
- promising exact prediction from a regression line;
- interpreting R² as percent causal contribution;
- ignoring outliers or nonlinear structure.

## Self-check

1. Give an example of dependence with near-zero Pearson r.
2. What does ε represent in a regression model?
3. Why is prediction outside the observed X range hazardous?
4. Why does r = 1 in the five-row example not generalize to all people?
