---
title: "MCQ Data Bank"
layout: archive
language: en
permalink: /mcq-arena/data-bank/
collection: mcq-arena
classes: wide
---

These collection entries expose the reusable quiz records retained in `_data/quizzes.yml` as addressable `mcq-arena` Markdown pages.

<ul>
{% assign mcq_collection = site.collections | where: "label", "mcq-arena" | first %}
{% assign data_bank_pages = mcq_collection.docs | where_exp: "item", "item.path contains '_mcq-arena/data-bank/'" | sort: "title" %}
{% for item in data_bank_pages %}
  {% unless item.url == page.url %}
    <li><a href="{{ item.url | relative_url }}">{{ item.title }}</a></li>
  {% endunless %}
{% endfor %}
</ul>
