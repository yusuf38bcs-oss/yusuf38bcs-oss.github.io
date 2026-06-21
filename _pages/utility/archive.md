---
permalink: /archive/
title: "Learning Archive"
excerpt: "A complete learning index for posts, Biology, Life Practices, Life Philosophy, Synaptic Bridge, Socratic, and MCQ Arena content."
description: "Global archive page for Learning Biology For Life, indexing posts and major Jekyll collections for SEO, navigation, and learner discovery."
layout: archive
author_profile: false
classes: wide
sitemap: true
---

# Learning Archive

A clean index of the **Learning Biology For Life** ecosystem. Use this page to move across academic biology, practical life learning, reflective philosophy, Socratic assessment, and MCQ practice.

{% assign blog_items = site.posts | default: empty %}
{% assign biology_collection = site.collections | where: "label", "biology" | first %}
{% assign practices_collection = site.collections | where: "label", "life-practices" | first %}
{% assign philosophy_collection = site.collections | where: "label", "life-philosophy" | first %}
{% assign synaptic_collection = site.collections | where: "label", "synaptic-bridge" | first %}
{% assign socratic_collection = site.collections | where: "label", "socratic" | first %}
{% assign mcq_collection = site.collections | where: "label", "mcq-arena" | first %}

{% assign biology_items = biology_collection.docs | default: empty %}
{% assign life_practices_items = practices_collection.docs | default: empty %}
{% assign life_philosophy_items = philosophy_collection.docs | default: empty %}
{% assign synaptic_items = synaptic_collection.docs | default: empty %}
{% assign socratic_items = socratic_collection.docs | default: empty %}
{% assign mcq_items = mcq_collection.docs | default: empty %}

{% assign total_items = blog_items.size | plus: biology_items.size | plus: life_practices_items.size | plus: life_philosophy_items.size | plus: synaptic_items.size | plus: socratic_items.size | plus: mcq_items.size %}

<div class="notice--info" markdown="1">
**Archive coverage:** {{ total_items }} learning items across posts and major collections.
</div>

## Blog Posts

{% if blog_items.size > 0 %}
  {% assign archive_items = blog_items | sort: 'date' | reverse %}
  {% for post in archive_items %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  No public blog posts are available yet.
{% endif %}

## Biology

{% if biology_items.size > 0 %}
  {% assign archive_items = biology_items | sort: 'title' %}
  {% for post in archive_items %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  No Biology collection items are available yet.
{% endif %}

## Life Practices

{% if life_practices_items.size > 0 %}
  {% assign archive_items = life_practices_items | sort: 'title' %}
  {% for post in archive_items %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  No Life Practices collection items are available yet.
{% endif %}

## Life Philosophy

{% if life_philosophy_items.size > 0 %}
  {% assign archive_items = life_philosophy_items | sort: 'title' %}
  {% for post in archive_items %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  No Life Philosophy collection items are available yet.
{% endif %}

## Synaptic Bridge

{% if synaptic_items.size > 0 %}
  {% assign archive_items = synaptic_items | sort: 'title' %}
  {% for post in archive_items %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  No Synaptic Bridge collection items are available yet.
{% endif %}

## Socratic

{% if socratic_items.size > 0 %}
  {% assign archive_items = socratic_items | sort: 'title' %}
  {% for post in archive_items %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  No Socratic collection items are available yet.
{% endif %}

## MCQ Arena

{% if mcq_items.size > 0 %}
  {% assign archive_items = mcq_items | sort: 'title' %}
  {% for post in archive_items %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  No MCQ Arena collection items are available yet.
{% endif %}
