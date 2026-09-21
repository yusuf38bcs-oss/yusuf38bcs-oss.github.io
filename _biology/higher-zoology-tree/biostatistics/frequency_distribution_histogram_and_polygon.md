---

layout: biostatistics-lecture
author_profile: true
author: "MD. Yusuf"

sidebar:
  nav: "synaptic_nav"

title: "Frequency distribution, Histogram and Polygon"
excerpt: "Advanced biological analysis and structural framework."

date: 2026-04-05T15:59:00.012Z
last_modified_at: 2026-06-09T04:13:27.000Z

permalink: /biology/higher-zoology-tree/biostatistics/frequency_distribution_histogram_and_polygon/
page_id: biostatistics-02
course_id: biostatistics-09
course_role: lecture
lecture_number: 2

categories:
  - Biology
  - Higher Zoology
  - Biostatistics

tags:
  - Zoology
  - Systems-Thinking

# AI Knowledge Graph & Neural Routing
node_id: zoology-biostatistics-frequency_distribution_histogram_and_polygon
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
neet_alignment: "Biology data organisation and graphical representation"
ib_theme: "Not Applicable"
ib_subtopic: "Frequency distribution, histogram, and frequency polygon"
hsc_alignment: "Higher Zoology: frequency distribution, histogram, and polygon"
concept_level: "Core"
previous: /biology/higher-zoology-tree/biostatistics/basic_concepts_of_biostatistics/
course_index: /biology/higher-zoology-tree/biostatistics/
next: /biology/higher-zoology-tree/biostatistics/measures-of-central-tendency/
---
## Concept Overview

A frequency distribution groups observations into classes so that the pattern of a biological dataset becomes easier to inspect. A histogram represents continuous class intervals with adjacent bars, while a frequency polygon joins the frequencies at class midpoints.

## Learning Objectives

By the end of this lecture, learners should be able to calculate range, choose class intervals, construct a grouped frequency table, distinguish class limits from class boundaries, and interpret a histogram and frequency polygon.

## Worked Dataset: Heights of 50 Students

The observed heights range from **147 cm to 172 cm**, so:

```text
Range = 172 − 147 = 25 cm
```

Using six 5-cm classes gives complete coverage of the observed values.

| Class interval (cm) | Frequency | Midpoint | Continuous boundaries |
|---|---:|---:|---|
| 146–150 | 3 | 148 | 145.5–150.5 |
| 151–155 | 10 | 153 | 150.5–155.5 |
| 156–160 | 17 | 158 | 155.5–160.5 |
| 161–165 | 14 | 163 | 160.5–165.5 |
| 166–170 | 5 | 168 | 165.5–170.5 |
| 171–175 | 1 | 173 | 170.5–175.5 |
| **Total** | **50** |  |  |

The frequencies sum to 50, matching the number of observations.

## Histogram

For equal-width continuous classes, place class boundaries on the x-axis and frequency on the y-axis. Adjacent bars touch because the measurement scale is continuous.

## Frequency Polygon

Plot each class midpoint against its frequency and join adjacent points with straight lines. The polygon helps visualize the overall shape of the distribution and can be useful when comparing distributions.

## Interpretation

The modal class is **156–160 cm** with frequency 17. The next largest class is 161–165 cm with frequency 14. Most observations therefore lie near the center rather than at the extremes.

## Common Errors

- Do not claim that range divided by class width automatically gives the exact number of classes without checking endpoint coverage.
- Do not use gaps between histogram bars for continuous data.
- Do not confuse class limits with continuous class boundaries.
- Always verify that grouped frequencies sum to the sample size.

## Self-check

1. Why are the histogram boundaries 145.5–150.5 rather than 146–150?
2. What is the modal class?
3. Why must the frequencies add to 50?
4. How would the graph change if unequal class widths were used?

## References

- NIST/SEMATECH Engineering Statistics Handbook: exploratory data analysis and histograms.
- Zar, *Biostatistical Analysis*.
