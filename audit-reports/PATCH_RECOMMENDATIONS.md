# Patch Recommendations

## 1. Wire Mobile Drawer to _data/navigation.yml
**File:** _includes/navigation/masthead.html

Replace the hardcoded <ul class="mobile-nav-menu-list"> block inside <div id="neural-mobile-drawer"> with:

```liquid
<ul class="mobile-nav-menu-list">
  {% for item in site.data.navigation.main %}
    {% if item.children %}
      <li class="mobile-menu-section-header">{{ item.title }}</li>
      {% for child in item.children %}
        <li><a href="{{ child.url | relative_url }}" class="mobile-sub-link">{{ child.title }}</a></li>
      {% endfor %}
    {% else %}
      <li><a href="{{ item.url | relative_url }}">{{ item.title }}</a></li>
    {% endif %}
  {% endfor %}
  <li><a href="{{ "/contact/" | relative_url }}">Contact</a></li>
</ul>
```

## 2. Fix Missing Routes
- /biology/higher-zoology-tree: Source exists at _pages/biology-higher-zoology.md; rebuild Jekyll to generate _site output.
- /biology/hsc-corner: Source exists at _pages/biology-hsc-corner.md; rebuild Jekyll to generate _site output.
- /life-practices: Source exists at _pages/life-practices.md; rebuild Jekyll to generate _site output.
- /socratic: Source exists at _pages/socratic.md; rebuild Jekyll to generate _site output.
- Create source for /synaptic-bridge/ai-education (e.g., synaptic-bridge-ai-education.md) with front matter including permalink: /synaptic-bridge/ai-education

## 3. CSS Drawer Visibility Fix
If .masthead-mobile-dropdown-drawer is hidden by display: none and .is-active-drawer does not override it, add to _sass/layout/_homepage-stabilizer.scss:

```scss
.masthead-mobile-dropdown-drawer {
  display: block; /* ensure not none */
}

.neural-site-masthead.is-active-drawer .masthead-mobile-dropdown-drawer {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}
```

## 4. External JS Conflict Resolution
If neural-nav.js or synaptic-navigation.js target different selectors, update them to use #neural-mobile-toggle and #neural-mobile-drawer, or remove them if masthead.html already contains inline JS.

## 5. Collection Output
