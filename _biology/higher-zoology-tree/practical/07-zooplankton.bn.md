---
layout: single
author_profile: true
author: "MD. Yusuf"
sidebar:
  nav: "zoology_practical_213106"
title: "Practical 07 — Zooplankton Quantification & Diversity"
excerpt: "Quantify zooplankton from three water bodies and compare diversity using Simpson and Shannon indices."
permalink: /biology/higher-zoology-tree/practical/zooplankton/
categories:
  - Biology
  - Higher Zoology
  - Zoology Practical
  - NU Honours Zoology
tags:
  - Zoology Practical-I
  - NU Honours 1st Year
course_id: zoology-practical-213106
course_role: practical-lecture
page_id: zoology-practical-zooplankton
language: bn
lang: bn
locale: bn_BD
toc: true
toc_sticky: true
classes: wide
related: true
status: Draft-Ready
published: true
last_modified_at: "2026-09-22"
curriculum_tracks:
  - NU Honours Zoology
nu_alignment: "National University B.Sc. Honours 1st Year Zoology — Zoology Practical-I (213106)"
concept_level: Practical / Laboratory
difficulty: Intermediate
time_min: 180
---

# Quantify Zooplankton in Three Water Bodies

## Research Question

তিনটি water body-তে zooplankton abundance ও diversity কি একই, নাকি habitat conditions অনুযায়ী ভিন্ন?

## Minimum Design

- **3 different water bodies**
- same/specified sampling volume
- consistent sampling time-window where possible
- replicate subsamples
- zooplankton identification at the same taxonomic resolution
- hemocytometer/counting chamber based counts
- Simpson + Shannon diversity comparison

## Suggested Metadata

| Field | Record |
|---|---|
| Site ID | A / B / C |
| GPS / locality | as permitted |
| Date & time | |
| Water-body type | pond/canal/lake etc. |
| Water temperature | |
| pH | if available |
| Transparency/turbidity | method stated |
| Sampling volume | |
| Net mesh size | if plankton net used |
| Concentrated final volume | |
| Replicate number | |

## Sampling Logic

1. Water-body থেকে representative sample collect।
2. Plankton net ব্যবহার করলে filtered volume estimate/record করো।
3. Concentrate sample to known volume।
4. Gentle mixing করে homogeneous subsample নাও।
5. Chamber load করার আগে bubbles avoid করো।
6. Consistent grid/counting rule apply করো।

> **Important:** Large *Daphnia* standard hemocytometer grid-এর জন্য oversized হতে পারে। NU syllabus hemocytometer উল্লেখ করে; departmental equipment অনুযায়ী large zooplankton-এর জন্য suitable counting chamber/Sedgwick–Rafter type chamber ব্যবহার করা হলে method-এ তা explicitly report করবে।

## Hemocytometer Calculation — Universal Volume Method

A fixed “magic factor” মুখস্থ করার বদলে counted volume ব্যবহার করো:

\[
\text{Density (individuals/mL)}
=
\frac{\text{Total individuals counted}}
{\text{Total chamber volume examined (mL)}}
\times \text{Dilution factor}
\]

If grid area and chamber depth are known:

\[
V = A \times d
\]

where \(V\) = examined volume, \(A\) = counted grid area, \(d\) = chamber depth.

### Replicate Mean

\[
\bar{x} = \frac{x_1+x_2+\cdots+x_r}{r}
\]

Report mean density and, if taught, SD/SE.

## Example Data Table

| Taxon | Site A | Site B | Site C |
|---|---:|---:|---:|
| Rotifera | | | |
| *Daphnia* | | | |
| *Cyclops* / copepods | | | |
| Other cladocerans | | | |
| Nauplii | | | |
| Total \(N\) | | | |

## Relative Abundance

\[
p_i = \frac{n_i}{N}
\]

where \(n_i\) = individuals of taxon \(i\); \(N\) = total individuals.

## Shannon Diversity Index

\[
H' = -\sum p_i \ln p_i
\]

Interpretation: higher \(H'\) generally reflects more even/rich assemblage, but values depend on sampling effort, taxonomic resolution and community composition।

## Simpson Index — State the Convention

“Simpson's index” multiple forms-এ reported হয়। LBFL report-এ formula লিখে convention declare করবে।

### Dominance form

\[
D = \frac{\sum n_i(n_i-1)}{N(N-1)}
\]

Higher \(D\) = greater dominance / lower diversity.

### Simpson diversity

\[
1-D
\]

Higher \(1-D\) = greater diversity.

**Do not compare papers unless they use the same convention.**

## Worked Example

Suppose counts are 40, 30, 20, 10; \(N=100\).

\[
p=(0.4,0.3,0.2,0.1)
\]

Shannon:
\[
H'=-\sum p_i\ln p_i
\]

Simpson dominance:
\[
D=\frac{40(39)+30(29)+20(19)+10(9)}{100(99)}
\]

The report should show formula, substitution, answer and ecological interpretation separately।

## Results Presentation

Recommended:
- abundance table;
- taxa richness \(S\);
- Shannon \(H'\);
- Simpson \(D\) and/or \(1-D\);
- one bar chart for abundance;
- one diversity-comparison chart if required.

## 20-mark Report Structure from Syllabus

| Component | Marks |
|---|---:|
| Experiment | 6 |
| Title | 1 |
| Abstract | 2 |
| Introduction | 2 |
| Materials and Methods | 2 |
| Results | 3 |
| Discussion | 2 |
| Acknowledgement | 1 |
| List of Books / References | 1 |
| **Total** | **20** |

## Discussion Questions

1. Highest abundance site কি highest diversity site-ও?
2. One dominant taxon Shannon ও Simpson-কে কীভাবে বদলায়?
3. Sampling volume unequal হলে direct count comparison কেন ভুল?
4. Rare taxa miss হলে diversity estimate কোন দিকে biased হতে পারে?
5. Water-body environmental differences result explain করতে পারে কি, নাকি causation claim-এর জন্য additional evidence প্রয়োজন?