---
title: Population Ecology
layout: single
language: en
permalink: "/mcq-arena/data-bank/ecology/"
quiz_id: ecology
quiz:
  quiz_title: Population Ecology
  time_limit_mins: 12
  questions:
  - id: q1
    question_text: Which type of survivorship curve characterizes species that produce
      large numbers of offspring with high juvenile mortality?
    options:
    - a: Type I
    - b: Type II
    - c: Type III
    - d: Type IV
    correct_key: c
    explanation: Type III survivorship curves show high early mortality with relatively
      low death rates for survivors, typical of organisms like marine invertebrates
      and plants that produce many offspring.
  - id: q2
    question_text: In the logistic growth model, what does the parameter K represent?
    options:
    - a: Intrinsic rate of increase
    - b: Carrying capacity
    - c: Population density
    - d: Generation time
    correct_key: b
    explanation: K represents the carrying capacity — the maximum population size
      that a particular environment can sustain indefinitely given available resources.
---

This `mcq-arena` collection item exposes the `ecology` quiz from `_data/quizzes.yml` as an individual Markdown page while retaining the shared data bank as the canonical source.

{% include components/quiz-render.html quiz_id=page.quiz_id %}
