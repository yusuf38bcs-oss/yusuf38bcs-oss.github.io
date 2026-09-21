---
title: "Admission Biology Evidence"
permalink: /admission/biology/
layout: single
classes: wide admission-biology-evidence-page
author_profile: false
robots: index,follow
description: "Transparent DU and Bangladesh Medical Biology admission evidence reconstructions with explicit evidence-state boundaries."
---

<link rel="stylesheet" href="{{ '/assets/css/admission-biology-evidence.css' | relative_url }}">

{% assign du = site.data.admission.biology.du["2016-17"] %}
{% assign medical = site.data.admission.biology.medical["2016-17"] %}

<section class="admission-evidence" data-admission-evidence-index>
  <header class="admission-evidence__hero">
    <p class="admission-evidence__kicker">LBFL · Evidence-led Admission Biology</p>
    <h1>Admission Biology Evidence</h1>
    <p>Explore source-traceable Biology reconstructions for Dhaka University Science/Ka Unit and Bangladesh Medical admission tests. Published records keep their evidence state visible and separate study evidence from any predictive ranking release.</p>
  </header>

  <aside class="admission-evidence__boundary">
    <strong>Current release class:</strong> full secondary reconstruction with independent paper-level verification pending. Predictive ranking is not released.
  </aside>

  <div class="admission-evidence__landing-grid">
    <a class="admission-evidence__paper-card" href="{{ '/admission/biology/du/2016-17/' | relative_url }}">
      <p class="admission-evidence__kicker">DU Science / Ka Unit</p>
      <h2>2016–17 Biology</h2>
      <p><strong>{{ du.paper_audit_state }} / {{ du.verification_status }}</strong> · {{ du.audited_question_count }}/{{ du.expected_biology_question_count }} secondary reconstruction.</p>
      <p>Original/global booklet positions are not claimed.</p>
    </a>
    <a class="admission-evidence__paper-card" href="{{ '/admission/biology/medical/2016-17/' | relative_url }}">
      <p class="admission-evidence__kicker">Bangladesh Medical</p>
      <h2>2016–17 Biology</h2>
      <p><strong>{{ medical.paper_audit_state }} / {{ medical.verification_status }}</strong> · {{ medical.audited_question_count }}/{{ medical.expected_biology_question_count }} secondary reconstruction.</p>
      <p>Question-level reconciliations remain visibly attributed to their sources.</p>
    </a>
  </div>

  <section class="admission-evidence__panel">
    <h2>What this release does</h2>
    <p>It exposes the reconstructed Biology records, concise question fingerprints, recorded answers, taxonomy labels and provenance links directly from the governed JSON ledgers.</p>
    <h2>What this release does not do</h2>
    <p>It does not publish a predictive ranking, does not change the evidence state of either paper, and does not replace independent verification.</p>
  </section>

  <p class="admission-evidence__back"><a href="{{ '/admission/' | relative_url }}">← Back to Admission Test Hub</a></p>
</section>
