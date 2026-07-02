---
layout: single
author_profile: true
author: "MD. Yusuf"
sidebar:
  nav: "synaptic_nav"
title: "Measures of Central Tendency: কেন্দ্রীয় প্রবণতার পরিমাপ"
excerpt: "Mean, median and mode-এর formula, biological interpretation, grouped-ungrouped data logic and common mistakes নিয়ে পরিচ্ছন্ন Biostatistics formula lecture."
description: "A clean Biostatistics lesson on measures of central tendency: mean, median, mode, formulas, biological examples, interpretation and limitations."
date: 2026-05-05T06:20:00.000Z
last_modified_at: 2026-07-02T00:00:00.000Z
permalink: /biology/higher-zoology-tree/biostatistics/measures-of-central-tendency/
categories:
  - Biology
  - Higher Zoology
  - Biostatistics
tags:
  - Biostatistics
  - Central Tendency
  - Mean
  - Median
  - Mode
  - Data Analysis
node_id: zoology-biostatistics-measures-of-central-tendency
parent_node: biostatistics
network:
  - higher-zoology-tree
  - hsc-corner
  - mcq-arena
related: true
synaptic_links:
  - /biology/higher-zoology-tree/biostatistics/
  - /biology/higher-zoology-tree/biostatistics/basic_concepts_of_biostatistics/
  - /biology/higher-zoology-tree/biostatistics/measures-of-dispersion/
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
neet_alignment: "Biology data interpretation and measures of central tendency"
ib_theme: "Not Applicable"
ib_subtopic: "Measures of central tendency"
hsc_alignment: "Higher Zoology: mean, median, and mode"
concept_level: "Core"
difficulty: "Foundation"
xp: 700
time_min: 55
status: "Active"
---

# Measures of Central Tendency: কেন্দ্রীয় প্রবণতার পরিমাপ

## Concept Overview

**Central tendency** হলো data-র কেন্দ্র বা representative value নির্ণয়ের পদ্ধতি। Biological data অনেকগুলো observation নিয়ে গঠিত হয়; central tendency সেই data-কে একটি summary value দিয়ে বোঝাতে সাহায্য করে। সবচেয়ে প্রচলিত তিনটি measure হলো **mean**, **median** and **mode**.

Central tendency answers:

```text
Where is the center of the data?
Which value represents the dataset most usefully?
```

## Why This Matters

Fish length, plant height, blood pressure, seed germination, exam score or species count—যেকোনো biological dataset বিশ্লেষণের প্রথম ধাপ হলো center বোঝা। কিন্তু সব data-র জন্য একই measure best নয়। Symmetric data-তে mean useful, skewed data-তে median safer, categorical/frequency data-তে mode useful হতে পারে।

{% include education/framework-links.html %}

## Central-Tendency Learning Focus

এই lecture central LBFL framework-কে Biostatistics summary formula-তে প্রয়োগ করে। Learner-এর focus হবে mean, median, mode, data type, skewness awareness, grouped-ungrouped distinction, formula meaning, and biological interpretation.

## Mean / Arithmetic Mean

Mean হলো সব value-এর যোগফলকে observation সংখ্যায় ভাগ করলে যে মান পাওয়া যায়।

```text
Mean = ΣX / n
```

Where:

- ΣX = all observations-এর sum
- n = number of observations

Example:

```text
Data: 8, 10, 12, 14, 16
Mean = (8 + 10 + 12 + 14 + 16) / 5
     = 60 / 5
     = 12
```

## Median

Median হলো ordered data-র middle value. এটি extreme value দ্বারা mean-এর তুলনায় কম প্রভাবিত হয়।

Odd number of observations:

```text
Median position = (n + 1) / 2
```

Example:

```text
Data: 5, 7, 9, 11, 13
n = 5
Median position = (5 + 1) / 2 = 3rd value
Median = 9
```

Even number of observations:

```text
Median = average of two middle values
```

Example:

```text
Data: 5, 7, 9, 11
Median = (7 + 9) / 2 = 8
```

## Mode

Mode হলো dataset-এ সবচেয়ে বেশি বার যে value দেখা যায়।

Example:

```text
Data: 4, 5, 5, 6, 7, 8
Mode = 5
```

Mode categorical data-তেও ব্যবহারযোগ্য। যেমন: most common blood group, most common habitat type, or most frequent response category.

## Mean, Median and Mode Comparison

<div class="lbfl-info-grid">
  <section class="lbfl-info-card"><h3>Mean</h3><p>All values ব্যবহার করে central value বের করে।</p><p><strong>Best for:</strong> approximately symmetric numerical data.</p></section>
  <section class="lbfl-info-card"><h3>Median</h3><p>Ordered data-র middle value.</p><p><strong>Best for:</strong> skewed data or outlier-prone data.</p></section>
  <section class="lbfl-info-card"><h3>Mode</h3><p>Most frequent value/category.</p><p><strong>Best for:</strong> categorical or frequency data.</p></section>
</div>

## Which Measure Should You Use?

| Data condition | Better measure | Reason |
|---|---|---|
| Symmetric numerical data | Mean | all observations included |
| Skewed numerical data | Median | less affected by extreme values |
| Categorical data | Mode | category frequency matters |
| Outlier present | Median | robust central location |
| Most common response needed | Mode | identifies frequent value/category |

## Grouped Data Awareness

For grouped frequency table, mean is calculated using class midpoint and frequency.

```text
Mean = Σfx / Σf
```

Where:

- f = frequency
- x = class midpoint
- Σfx = sum of frequency × midpoint
- Σf = total frequency

Grouped median and grouped mode use separate class-boundary formulas, but the central idea remains the same: find the representative center of the distribution.

## Central Tendency and Skewness

```text
Symmetric distribution:
Mean ≈ Median ≈ Mode

Right-skewed distribution:
Mean > Median > Mode

Left-skewed distribution:
Mean < Median < Mode
```

Skewness matters because extreme values can pull mean away from the typical value.

## Worked Biological Example

Suppose body weight of five fishes is:

```text
120 g, 125 g, 130 g, 135 g, 190 g
```

Mean:

```text
Mean = (120 + 125 + 130 + 135 + 190) / 5
     = 700 / 5
     = 140 g
```

Median:

```text
Ordered data: 120, 125, 130, 135, 190
Median = 130 g
```

Interpretation: The 190 g fish pulls mean upward. Median may better represent the typical fish weight in this small skewed dataset.

## Common Mistakes to Avoid

<div class="lbfl-info-grid">
  <section class="lbfl-info-card"><h3>Mistake 1</h3><p>Using mean for every dataset without checking outliers or skewness.</p></section>
  <section class="lbfl-info-card"><h3>Mistake 2</h3><p>Finding median before arranging data in ascending or descending order.</p></section>
  <section class="lbfl-info-card"><h3>Mistake 3</h3><p>Thinking mode must always exist or must be unique. A dataset can be no-mode, unimodal, bimodal or multimodal.</p></section>
  <section class="lbfl-info-card"><h3>Mistake 4</h3><p>Confusing central tendency with dispersion. Center and spread answer different questions.</p></section>
</div>

## Synaptic Bridge

Central tendency teaches that a complex group can sometimes be summarized by a representative value, but every summary has limits. In learning and life, average is useful, but it should never hide variation, outliers or individual realities.

## Critical Thinking Questions

1. Why can mean be misleading when outliers are present?
2. Why must data be ordered before finding median?
3. When is mode more useful than mean?
4. How can two datasets have the same mean but different dispersion?
5. In a skewed biological dataset, why might median be more honest than mean?

## Related Learning Paths

- [Biostatistics Hub]({{ '/biology/higher-zoology-tree/biostatistics/' | relative_url }})
- [Basic Concepts of Biostatistics]({{ '/biology/higher-zoology-tree/biostatistics/basic_concepts_of_biostatistics/' | relative_url }})
- [Measures of Dispersion]({{ '/biology/higher-zoology-tree/biostatistics/measures-of-dispersion/' | relative_url }})
- [T-test: Significant Difference Between Means]({{ '/biology/higher-zoology-tree/biostatistics/t-test-significant-difference-between-means/' | relative_url }})
- [MCQ Arena]({{ '/mcq-arena/' | relative_url }})

## References

- Standard HSC Zoology Biostatistics notes.
- General biostatistics references on mean, median, mode and grouped data summary.
