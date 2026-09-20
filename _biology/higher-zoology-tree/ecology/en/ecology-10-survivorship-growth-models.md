---
layout: single
author_profile: true
author: "MD. Yusuf"
sidebar:
  nav: "synaptic_nav"
title: "Ecology Lecture 10: Survivorship Curves and Population Growth Models"
excerpt: "English mirror for Ecology Lecture 10, aligned to syllabus Topic(s) 7 and CLO2."
date: 2026-09-09T00:00:00+06:00
last_modified_at: 2026-09-20T00:00:00+06:00
permalink: /en/biology/higher-zoology-tree/ecology/ecology-10-survivorship-growth-models/
slug: ecology-10-survivorship-growth-models
categories:
  - Biology
  - Higher Zoology
  - Ecology
tags:
  - Ecology
  - Ecology Lecture 10
  - CLO2
node_id: zoology-ecology-l10-survivorship-growth-models-en
parent_node: ecology
course_id: ecology-v2-10
course_role: lecture
network:
  - higher-zoology-tree
  - ecology
  - mcq-arena
related: true
synaptic_links:
  - /en/biology/higher-zoology-tree/ecology/
  - /biology/higher-zoology-tree/ecology/ecology-10-survivorship-growth-models/
toc: true
toc_sticky: true
classes: wide
language: en
lang: en
curriculum_tracks:
  - Higher Zoology Ecology
  - HSC Zoology
  - NEET Biology
  - IB Biology
hsc_alignment: "Ecology syllabus Topic(s) 7; CLO2"
neet_alignment: "NCERT Biology: Organisms and Populations; Ecosystem; Biodiversity and Conservation"
ib_theme: "Interaction and Interdependence"
concept_level: Intermediate
lesson_order: 10
lecture_number: "10"
translation_of: /biology/higher-zoology-tree/ecology/ecology-10-survivorship-growth-models/
gold_alignment: "LBFL Ecology V2 Detailed Course | English mirror"
status: Active
published: true
syllabus_topics:
  - 7
clo_alignment:
  - CLO2
math: true
---
# Ecology Lecture 10: Survivorship Curves and Population Growth Models

This Version 2 lecture is written as a **self-contained teaching note**, not a short revision page. It develops definitions, mechanisms, examples, diagrams, quantitative reasoning, evidence design, Bangladesh applications, misconceptions, exam preparation, and a bridge to the next lecture.


## Syllabus Alignment

| Field | Alignment |
|---|---|
| Lecture | 10 / 26 |
| Syllabus | Topic 7 — Population Ecology |
| CLO | CLO2 |
| Version | V2 fully detailed |
| Suggested class use | 2-hour lecture + guided reading/problem work |

## Lecture Question

**How do survivorship curves and exponential or logistic models reveal different aspects of population dynamics?**

## Learning Objectives

1. Interpret Type I, Type II, and Type III survivorship curves.
2. Relate survivorship patterns to life-history strategies without treating them as rigid categories.
3. Derive and interpret exponential growth \\(dN/dt=rN\\).
4. Calculate simple exponential growth and doubling time.
5. Explain logistic growth and carrying capacity \\(K\\).
6. Interpret density dependence in the logistic model.
7. Identify assumptions, limitations, overshoot, time lags, and changing carrying capacity.

## Big Picture

The purpose of this lecture is to make the topic understandable at three levels: **what the concept means, how the mechanism works, and how ecologists know**. The topic should therefore be read together with the figures, examples, calculations, and evidence-design sections rather than as a list of definitions.

## 1. From life tables to survivorship curves

A survivorship curve plots the proportion or number of individuals surviving to each age.

Life tables contain the numerical data; the curve makes the mortality pattern visible.

A logarithmic y-axis is often used because survivorship can span several orders of magnitude.

## 2. Type I survivorship

Type I shows relatively high survival through early and middle life followed by sharply increasing mortality at older ages.

Typical teaching examples include humans and some large mammals.

Traits often associated with Type I:
- few offspring,
- high parental investment,
- relatively low juvenile mortality.

Real species do not need to follow a perfect Type I curve.

## 3. Type II survivorship

Type II approximates a constant probability of death across ages.

On a semilog survivorship plot, this produces an approximately straight declining line.

Some birds and small mammals are used as examples, although real populations usually deviate from the ideal.

## 4. Type III survivorship

Type III shows very high mortality early in life, followed by better survival among individuals that reach later stages.

Common examples include many fishes, marine invertebrates, and plants producing large numbers of seeds.

Producing many offspring can compensate demographically for low early survival.

## 5. Comparing survivorship patterns

```text
Survivorship
^
| Type I  ────────────────|                          | Type II  \                |           \                | Type III   \____
|                 \___________
+--------------------------------> Age
```

The curves describe mortality schedules, not moral “strategies” or fixed categories.

## 6. What is population growth?

Population growth depends on the balance of births, deaths, and movement. In a closed population, the simplest continuous model focuses on the per-capita net rate of increase \\(r\\).

If each individual contributes the same average net growth rate, then:

\\[
\frac{dN}{dt}=rN
\\]

This is the exponential-growth model.

## 7. Intrinsic rate of increase

The parameter \\(r\\) represents the per-capita rate of population increase under the model.

- \\(r>0\\): population grows.
- \\(r=0\\): population remains constant.
- \\(r<0\\): population declines.

In ideal conditions, \\(r\\) is sometimes called the intrinsic rate of increase. In real populations, realized growth depends on environment and demographic structure.

## 8. Exponential solution

The continuous-time solution is:

\\[
N_t=N_0e^{rt}
\\]

where:
- \\(N_0\\) = initial population,
- \\(N_t\\) = population after time \\(t\\),
- \\(r\\) = per-capita growth rate,
- \\(e\\) = base of natural logarithms.

The curve is J-shaped when \\(r>0\\).

## 9. Doubling time

For exponential growth, approximate doubling time is:

\\[
t_d=\frac{\ln 2}{r}
\\]

If \\(r=0.2\\) per year, doubling time is \\(0.693/0.2\approx3.47\\) years.

## 10. Why exponential growth cannot continue indefinitely

Exponential growth assumes effectively unlimited resources and constant per-capita growth. No real population can maintain such growth forever.

As density increases:
- resources become depleted,
- interference increases,
- disease can spread,
- waste accumulates,
- predators may respond,
- space becomes limiting.

## 11. Logistic growth

The logistic model introduces density dependence:

\\[
\frac{dN}{dt}=rN\left(1-\frac{N}{K}\right)
\\]

where \\(K\\) is carrying capacity.

The term \\(1-N/K\\) reduces per-capita growth as population size approaches \\(K\\).

## 12. Carrying capacity

Carrying capacity is the population size an environment can sustain under a particular set of conditions.

It is not a fixed species property.

\\(K\\) can change with:
- rainfall,
- food supply,
- habitat area,
- pollution,
- disease,
- temperature,
- management,
- disturbance.

## 13. Where logistic growth is fastest

Absolute population increase is low when \\(N\\) is very small because there are few reproducing individuals. Growth also slows near \\(K\\) because density dependence is strong.

In the simple logistic model, absolute growth \\(dN/dt\\) is maximal at:

\\[
N=\frac{K}{2}
\\]

This result is important in theoretical population and harvest models, but real populations may not follow it exactly.

## 14. J-shaped versus S-shaped growth

```text
Population size
^
|                         exponential
|                       /
|                     /
|           _________/ 
|         _/  logistic
|       _/
|     _/
|____/____________________________> time
        ---------------- K
```

Exponential growth is J-shaped. Logistic growth is S-shaped or sigmoid when it approaches \\(K\\).

## 15. Overshoot and time lag

If population response to resource depletion is delayed, a population can exceed carrying capacity temporarily—an **overshoot**.

After overshoot, resource depletion may cause decline or oscillation.

Time delays are common because reproduction and resource renewal do not respond instantaneously.

## 16. Environmental stochasticity

Real environments fluctuate. Drought, flood, disease, cyclone, and temperature variation can change birth and death rates unpredictably.

Therefore, population size may fluctuate around rather than smoothly approach a fixed \\(K\\).

## 17. Model assumptions and limitations

Simple exponential and logistic models assume:
- no age structure,
- no spatial structure,
- homogeneous individuals,
- simple density dependence,
- no time lag,
- constant parameters.

These models are valuable because they clarify mechanisms. Their simplicity is a feature when used correctly, not a claim that nature is simple.

## 18. Life-history connection

Survivorship pattern, age at first reproduction, offspring number, parental care, growth rate, and longevity are linked through life-history trade-offs.

However, Type I/II/III curves should not be treated as identical to the historical r/K classification. They describe different dimensions of life history.


## Concept Diagrams and Flows

### Survivorship curves

```text
log survivorship
^
| Type I ────────────────| Type II \               |          \               | Type III  \____           |                \___________
+--------------------------------> age
```

### Logistic feedback

```text
N small → resources abundant → high per-capita growth
      ↓
N increases
      ↓
competition / disease / resource depletion
      ↓
per-capita growth declines
      ↓
N approaches K
```

## Worked Ecological Examples

### Invasive plant

A newly introduced aquatic plant may grow rapidly while space and nutrients are abundant, approximating exponential growth early in invasion.

### Aquaculture pond

Fish biomass may increase after stocking but slow as food, oxygen, and space become limiting.

### Type III fish

A fish releases many eggs; most eggs or larvae die, but individuals reaching later stages survive much better.

## Quantitative / Analytical Skill

Worked exponential growth: \\(N_0=100\\), \\(r=0.2\\) yr⁻¹, \\(t=3\\) yr. \\(N_t=100e^{0.6}\approx182\\). Worked logistic instantaneous growth: if \\(N=50\\), \\(K=200\\), \\(r=0.4\\), then \\(dN/dt=0.4(50)(1-50/200)=15\\) individuals per time unit.

When solving a quantitative ecology problem, always write the biological meaning of the answer. A number without ecological interpretation is incomplete.

## Bangladesh Context

Population models are useful for aquaculture stocking, mosquito outbreaks, invasive aquatic plants, fisheries recovery, and wildlife populations. However, seasonal monsoon dynamics, migration, harvesting, and fluctuating habitat mean that constant \\(r\\) and \\(K\\) assumptions must be treated cautiously.

## How to Read the Graphs in This Lecture

Use this sequence:

```text
1. Identify x-axis and y-axis
        ↓
2. Read units and scale
        ↓
3. Describe the pattern without explaining it
        ↓
4. Propose the ecological mechanism
        ↓
5. Look for alternative explanations
        ↓
6. State what additional evidence would test the mechanism
```

Important patterns to recognize include monotonic increase or decrease, an optimum curve, a threshold, a time lag, a density-dependent response, and differences among treatments.

## Comparison Table: Exponential and Logistic Growth

| Feature | Exponential | Logistic |
|---|---|---|
| Equation | \\(dN/dt=rN\\) | \\(dN/dt=rN(1-N/K)\\) |
| Resources | effectively unlimited | density-limited |
| Curve | J-shaped | S-shaped |
| Per-capita growth | constant | declines with N |
| Carrying capacity | absent | included as K |

## Mini Calculation Set

1. \\(N_0=200\\), \\(r=0.1\\) yr⁻¹, \\(t=5\\): calculate \\(N_t\\).
2. If \\(K=1000\\) and \\(N=500\\), identify the density-dependent multiplier \\(1-N/K\\).
3. Compare growth when \\(N=50\\) and \\(N=950\\) with the same \\(r\\) and \\(K\\).
4. Explain biologically why the model predicts the largest absolute logistic growth near \\(K/2\\).

## Model Explanation Paragraph

Survivorship curves describe when mortality occurs during a lifetime, whereas population-growth models describe how population size changes through time. Exponential growth is useful when density effects are weak over a short period. Logistic growth adds negative density dependence through carrying capacity, but real populations experience changing \\(K\\), time lags, migration, age structure, and environmental stochasticity.

## Evidence and Study Design

For any ecological claim in this lecture, ask four questions:

1. **What was measured?**
2. **What was compared or manipulated?**
3. **Were samples independent and replicated?**
4. **Does the evidence show correlation, mechanism, or causation?**

A strong ecological explanation combines field observation with experiments, repeated monitoring, or models where appropriate.

## Common Misconceptions

- Carrying capacity is not a fixed universal property of a species.
- Exponential growth does not continue forever in nature.
- Type III survivorship is not identical to r-selection.
- Logistic growth does not imply every real population stabilizes smoothly at K.
- A mathematical model is a simplification, not a photograph of reality.

## Exam-Ready Framework

For a broad question on **Survivorship Curves and Population Growth Models**, a strong answer can follow this order:

1. Give the definition and scope.
2. Explain the main mechanism or conceptual model.
3. Draw the most useful diagram or graph.
4. Give at least one ecological example.
5. Add a Bangladesh example where relevant.
6. Include an equation or quantitative relation if the topic has one.
7. State assumptions or limitations.
8. End with ecological significance or application.

## One-Page Recap

**Core topic:** Survivorship Curves and Population Growth Models

**Syllabus:** Topic 7 — Population Ecology

**What to remember**
- Define the major terms precisely.
- Explain mechanism, not only outcome.
- Connect organism-level effects to population or ecosystem consequences where relevant.
- Interpret graphs and equations biologically.
- Separate direct evidence from inference.
- Use local examples without assuming that one case represents every ecosystem.

## Practice Questions

1. Compare Type I, II, and III survivorship.
2. Derive the meaning of r in exponential growth.
3. Calculate doubling time when r=0.1 yr⁻¹.
4. Explain the logistic term (1−N/K).
5. Why can real populations overshoot carrying capacity?

### Broad Questions

1. Discuss Survivorship Curves and Population Growth Models as a connected ecological topic, using diagrams and examples.
2. Explain how the main concepts in this lecture would be tested in a field or experimental study.
3. Apply the lecture to a Bangladesh ecosystem and identify the strongest uncertainty in your explanation.

## MCQ Self-Check

**1. Type III survivorship is characterized by:**
A. low early mortality
B. high early mortality
C. constant population size
D. zero reproduction
**Answer: B**

**2. Exponential growth is represented by:**
A. dN/dt = rN
B. N = K always
C. qx = dx/nx only
D. H' = 0
**Answer: A**

**3. In the logistic model, K represents:**
A. mutation rate
B. carrying capacity
C. migration distance
D. species richness
**Answer: B**

**4. In the simple logistic model, absolute growth is maximal near:**
A. N = 0
B. N = K/2
C. N = 2K
D. N = −K
**Answer: B**

**5. Carrying capacity is best viewed as:**
A. a permanent species constant
B. environment-dependent and potentially variable
C. unrelated to resources
D. identical to population size at all times
**Answer: B**


## Key Terms

Survivorship, Curves, and, Population, Growth, Models, Topic, Population, Ecology, ecology, mechanism, evidence, interaction, environmental response, ecological interpretation.

## References and Further Academic Reading

- OpenStax Biology 2e, 45.1 Population Demography.
- OpenStax Biology 2e, 45.3 Environmental Limits to Population Growth.
- OpenStax Biology 2e, 45.4 Population Dynamics and Regulation.
- Begon, Townsend & Harper. Ecology: From Individuals to Ecosystems.

### Verified online support used during V2 review

- OpenStax Biology 2e Ecology chapters: https://openstax.org/books/biology-2e/pages/44-introduction
- OpenStax Population Demography: https://openstax.org/books/biology-2e/pages/45-1-population-demography
- OpenStax Environmental Limits to Population Growth: https://openstax.org/books/biology-2e/pages/45-3-environmental-limits-to-population-growth
- OpenStax Population Dynamics and Regulation: https://openstax.org/books/biology-2e/pages/45-4-population-dynamics-and-regulation
- OpenStax Community Ecology: https://openstax.org/books/biology-2e/pages/45-6-community-ecology

## Synaptic Bridge to the Next Lecture

Lecture 11 will move from growth models to mechanisms of population regulation, density dependence, density-independent forces, and life-history strategies.

```text
Current lecture
      ↓
Concept understood
      ↓
Mechanism and evidence
      ↓
Next ecological level / process
      ↓
Lecture 11
```

## Course Navigation

- [Ecology Course Hub]({{ '/en/biology/higher-zoology-tree/ecology/' | relative_url }})
- [Bangla version]({{ '/biology/higher-zoology-tree/ecology/ecology-10-survivorship-growth-models/' | relative_url }})
- [← Previous lecture]({{ '/en/biology/higher-zoology-tree/ecology/ecology-09-demography-vital-rates-life-tables/' | relative_url }})
- [MCQ Arena]({{ '/mcq-arena/' | relative_url }})
