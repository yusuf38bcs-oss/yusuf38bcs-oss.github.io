---
layout: single
author_profile: true
author: "MD. Yusuf"

sidebar:
  nav: "synaptic_nav"

title: "Genetics: The Source Code of Life"
excerpt: "Decode the molecular programming, inheritance algorithms, and DNA architecture that drive all biological systems."

date: 2026-06-09T05:00:00.000Z

permalink: /biology/higher-zoology-tree/genetics/

# AI Knowledge Graph & Neural Routing
node_id: index-genetics
parent_node: higher-zoology-tree
network:
  - higher-zoology-tree
  - hsc-corner

# Synaptic Connections
related: false
synaptic_links:
  - /biology/higher-zoology-tree/animal-diversity/
  - /biology/higher-zoology-tree/biostatistics/
  - /socratic/mcq-arena/genetics/

classes: wide
header:
  overlay_image: /assets/images/biology/genetics-banner.webp
---

<style>
  .manifold-header { background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); color: white; padding: 2.5rem; border-radius: 14px; text-align: center; margin-bottom: 2.5rem; border: 1px solid rgba(0, 212, 178, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
  .manifold-header h1 { color: #ffffff !important; margin: 0 0 10px 0 !important; font-size: 2.2rem !important; font-weight: 800; letter-spacing: -0.02em; }
  .manifold-header p { margin: 0; font-size: 1.1rem; color: #00d4b2; font-weight: 600; }
  
  .neural-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
  
  .neural-card { background: #0f172a; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.5rem; transition: all 0.3s ease; text-decoration: none !important; display: flex; flex-direction: column; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border-top: 4px solid #8b5cf6; }
  .neural-card:hover { transform: translateY(-5px); border-color: rgba(139, 92, 246, 0.4); box-shadow: 0 10px 25px rgba(139, 92, 246, 0.15); border-top: 4px solid #a78bfa; }
  
  .neural-card .card-date { font-size: 0.85rem; color: #a78bfa; font-family: monospace; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }
  .neural-card h3 { color: #ffffff; font-size: 1.3rem; margin: 0 0 1rem 0; font-weight: 700; line-height: 1.4; }
  .neural-card p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin: 0 0 1.5rem 0; flex-grow: 1; }
  
  .neural-card .card-cta { color: #a78bfa; font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; justify-content: space-between; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 1rem; }
  .neural-card:hover .card-cta { color: #ffffff; }
</style>

<div class="manifold-header">
  <h1>🧬 জিনতত্ত্ব ও বংশগতি (Genetics)</h1>
  <p>Data Node: The Source Code of Inheritance</p>
</div>

<p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.7; text-align: center; max-width: 800px; margin: 0 auto 2.5rem auto;">
  Decode the molecular algorithms, Mendelian logic, and epistatic overrides that dictate biological architecture. Select a data log to read the sequence.
</p>

<div class="neural-grid">
  {% assign category_posts = site.categories["Genetics"] %}
  {% for post in category_posts %}
  <a href="{{ post.url | relative_url }}" class="neural-card">
    <div class="card-date">{{ post.date | date: "%B %d, %Y" }}</div>
    <h3>{{ post.title }}</h3>
    <p>{{ post.excerpt | strip_html | truncatewords: 25 }}</p>
    <div class="card-cta">
      Read Data Log <span>→</span>
    </div>
  </a>
  {% else %}
    <p style="color: #ef4444; text-align: center; width: 100%;">No data logs found in the Genetics matrix.</p>
  {% endfor %}
</div>
