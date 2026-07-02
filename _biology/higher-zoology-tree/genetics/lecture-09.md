---
layout: single
author_profile: true
author: "MD. Yusuf"
sidebar:
  nav: "synaptic_nav"
title: "Genetics Lecture 09: Gene Mapping"
excerpt: "Gene mapping, recombination frequency, map unit, centiMorgan, linked genes, crossing over and chromosome distance নিয়ে পরিচ্ছন্ন Genetics lecture."
description: "A clean Genetics lecture on gene mapping, recombination frequency, map unit, centiMorgan, linked genes, crossing over, gene distance and basic linkage-map construction."
date: 2026-06-13T13:15:00.000Z
last_modified_at: 2026-07-02T00:00:00.000Z
permalink: /biology/higher-zoology-tree/genetics/gene-mapping/
categories:
  - Biology
  - Higher Zoology
  - Genetics
tags:
  - Genetics
  - Gene Mapping
  - Recombination Frequency
  - Linkage Map
  - CentiMorgan
node_id: genetics-lecture-09-gene-mapping
parent_node: genetics
network:
  - higher-zoology-tree
  - hsc-corner
  - mcq-arena
related: true
synaptic_links:
  - /biology/higher-zoology-tree/genetics/
  - /biology/higher-zoology-tree/genetics/course-index/
  - /biology/higher-zoology-tree/genetics/linkage/
  - /biology/higher-zoology-tree/genetics/chromosome-patterns/
  - /mcq-arena/
toc: true
toc_sticky: true
classes: wide
header:
  overlay_image: /assets/images/biology/genetics-banner.webp
language: bn
curriculum_tracks:
  - HSC Biology
  - Higher Zoology
  - NEET Biology
  - IB Biology
neet_alignment: "NCERT Biology: linkage, recombination and chromosome mapping"
ib_theme: "Continuity and Change"
ib_subtopic: "Gene mapping and recombination frequency"
hsc_alignment: "HSC Biology: recombination frequency, linkage map, map unit and gene distance"
concept_level: "Advanced"
difficulty: "Intermediate"
xp: 750
time_min: 60
status: "Active"
---

# Genetics Lecture 09: Gene Mapping

## Concept Overview

**Gene mapping** হলো chromosome-এর উপর genes-এর relative position এবং distance বোঝার পদ্ধতি। Linked genes সবসময় perfectly together inherited হয় না, কারণ meiosis-এর সময় crossing over linked genes-এর মধ্যে নতুন allele combination তৈরি করতে পারে। এই recombinant combination-এর frequency ব্যবহার করে genes-এর distance estimate করা যায়।

Core idea:

```text
Crossing over between linked genes
  ↓
Recombinant offspring appear
  ↓
Recombination frequency calculated
  ↓
Gene distance estimated
  ↓
Linkage map constructed
```

## Why This Matters

Gene mapping learner-কে chromosome-কে একটি linear information map হিসেবে দেখতে শেখায়। Linkage শুধু বলে genes together move করে; gene mapping বলে কতটা close বা far they are. Modern genomics, breeding, disease-gene tracking, chromosome analysis and evolutionary genetics-এর foundation এই mapping logic-এর উপর দাঁড়িয়ে আছে।

{% include education/framework-links.html %}

## Gene-Mapping Learning Focus

এই lecture central LBFL framework-কে recombination-based mapping-এ প্রয়োগ করে। Learner-এর focus হবে linked genes, crossing over, parental type, recombinant type, recombination frequency, map unit, centiMorgan, gene distance and simple map construction.

## Parental and Recombinant Types

<div class="lbfl-info-grid lbfl-info-grid--compact">
  <section class="lbfl-info-card"><h3>Parental type</h3><p>Offspring or gamete combination that resembles original parental allele arrangement.</p></section>
  <section class="lbfl-info-card"><h3>Recombinant type</h3><p>New allele combination produced by crossing over between linked genes.</p></section>
</div>

In linked genes, parental types are usually more frequent than recombinant types.

## Recombination Frequency Formula

```text
Recombination frequency (%) = (Number of recombinant offspring / Total offspring) × 100
```

This percentage is used as an estimate of genetic distance.

## Map Unit and CentiMorgan

```text
1% recombination = 1 map unit = 1 centiMorgan (cM)
```

So if recombination frequency between two genes is 12%, the estimated distance between the genes is about:

```text
12 map units or 12 cM
```

## Worked Example

Suppose a test cross gives the following offspring:

| Offspring type | Count | Category |
|---|---:|---|
| AB | 420 | parental |
| ab | 430 | parental |
| Ab | 75 | recombinant |
| aB | 75 | recombinant |
| **Total** | **1000** |  |

Recombinant offspring:

```text
75 + 75 = 150
```

Recombination frequency:

```text
RF = (150 / 1000) × 100 = 15%
```

Map distance:

```text
Distance between A and B = 15 cM
```

## Why Distance Affects Recombination

```text
Genes close together
  ↓
Crossing over between them is less likely
  ↓
Low recombination frequency
  ↓
Short map distance

Genes far apart
  ↓
Crossing over between them is more likely
  ↓
Higher recombination frequency
  ↓
Longer map distance
```

## Simple Two-Gene Map

If recombination frequency between A and B is 15%, the basic map is:

```text
A —— 15 cM —— B
```

This map is relative, not a physical base-pair measurement.

## Three-Gene Mapping Preview

For three genes, pairwise recombination frequencies help infer order.

```text
A-B distance
B-C distance
A-C distance
  ↓
Compare distances
  ↓
Infer likely gene order
```

A full three-point test cross also uses double crossovers, but this lecture focuses on foundation logic.

## Gene Mapping Limits

<div class="lbfl-info-grid">
  <section class="lbfl-info-card"><h3>Approximation</h3><p>Map distance is an estimate based on recombination, not exact physical distance.</p></section>
  <section class="lbfl-info-card"><h3>Double crossing over</h3><p>Multiple crossovers can hide recombination events and underestimate distance.</p></section>
  <section class="lbfl-info-card"><h3>Maximum useful RF</h3><p>Recombination frequency approaches 50% for genes very far apart or assorting independently.</p></section>
  <section class="lbfl-info-card"><h3>Species context</h3><p>Recombination rate can vary by organism, sex, chromosome region and biological context.</p></section>
</div>

## Linkage vs Gene Mapping

| Feature | Linkage | Gene mapping |
|---|---|---|
| Main question | Are genes inherited together? | How far apart are the genes? |
| Evidence | parental types exceed recombinant types | recombination frequency calculation |
| Output | linkage relation | map distance or gene order |
| Unit | qualitative relationship | map unit / centiMorgan |

## Common Mistakes to Avoid

<div class="lbfl-info-grid">
  <section class="lbfl-info-card"><h3>Mistake 1</h3><p>Using total offspring as recombinant count. Only recombinant classes go in the numerator.</p></section>
  <section class="lbfl-info-card"><h3>Mistake 2</h3><p>Thinking centiMorgan is a direct physical length. It is a genetic distance estimate.</p></section>
  <section class="lbfl-info-card"><h3>Mistake 3</h3><p>Forgetting to add both recombinant classes before calculating RF.</p></section>
  <section class="lbfl-info-card"><h3>Mistake 4</h3><p>Assuming recombination frequency above 50% is meaningful for simple linkage mapping.</p></section>
</div>

## Synaptic Bridge

Gene mapping teaches distance through change. The more often two things separate, the farther apart they may be in the system. In learning and life, repeated separation between intention and action may reveal hidden distance between value, habit and environment. Mapping helps us see where correction is needed.

## Critical Thinking Questions

1. Why can recombination frequency estimate gene distance?
2. Why are parental types usually more frequent than recombinant types in linked genes?
3. What does 1 centiMorgan mean?
4. Why can double crossing over underestimate map distance?
5. How is gene mapping different from simply identifying linkage?

## Related Learning Paths

- [Genetics Course Index]({{ '/biology/higher-zoology-tree/genetics/course-index/' | relative_url }})
- [Linkage]({{ '/biology/higher-zoology-tree/genetics/linkage/' | relative_url }})
- [Chromosome Patterns]({{ '/biology/higher-zoology-tree/genetics/chromosome-patterns/' | relative_url }})
- [Epistasis and Gene Ratios]({{ '/biology/higher-zoology-tree/genetics/epistasis-gene-ratios/' | relative_url }})
- [MCQ Arena]({{ '/mcq-arena/' | relative_url }})

## References

- Standard HSC Biology Genetics notes.
- Integrated Genetics references on recombination frequency, gene mapping and linkage maps.
- NCERT Biology: Principles of Inheritance and Variation.
