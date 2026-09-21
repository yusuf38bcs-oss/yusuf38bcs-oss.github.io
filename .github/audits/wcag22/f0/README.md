# LBFL WCAG 2.2 — F0 Production Cascade Truth

Status: **DRAFT / HOLD — non-authorizing evidence packet**

Repository baseline: `main@aab010145138dbc835fd8625c666ac03aab9f71d`  
Baseline tree: `db08ada27eae7a2e1514cc59743bd1ca38f1536e`  
Normative target: **WCAG 2.2 Level AA**  
Working reference: authenticated supplied WCAG 2.2 document  
Authorization: audit, evidence collection, and narrowly scoped remediation design only.

## Non-authority boundary

This packet does **not** authorize:

- merge to `main` or `staging`;
- production deployment;
- Cloudflare, Worker, DNS, AdSense/CMP, or production mutation;
- broad CSS refactor or legacy deletion;
- a claim of WCAG 2.2 AA conformance.

Axe or another automated scanner is supporting evidence only. F10 remains the only whole-page exact-head conformance gate.

## Locked programme

F0 Production Cascade Truth  
→ F1 Contrast & Token Matrix  
→ F2 Keyboard / Focus Architecture  
→ F3 Masthead & Mobile Navigation  
→ F4 Contextual Sidebar  
→ F5 Archive & Pagination  
→ F6 Reflow / 200% Resize / 400% Zoom / Text Spacing  
→ F7 Language / Semantics / Name-Role-Value / Status Messages  
→ F8 Motion / Flashing / Reduced Motion  
→ F9 CSS consolidation only after stability  
→ F10 Exact-head whole-page WCAG 2.2 AA certification

## F0 question

For each selected audit file prove:

`file → imported/included by → transitive parent → rendered selector/markup → affected route families → active/inactive/conditional state → cascade position → evidence`

No source file may be mutated in F1-F8 merely because it looks relevant. The production path must first be demonstrated.

## Static findings already established at the pinned baseline

1. `assets/css/main.scss` is the production stylesheet entrypoint and imports the LBFL component/layout stack.
2. `main.scss` imports `core/variables`, Minimal Mistakes, `core/mixins`, components including `navigation`, `cards`, and `synaptic-glow`, then layout layers including `synaptic` and the late `omega-overrides`.
3. `main.scss` itself contains the final `.lbfl-*` responsive masthead rules after those imports.
4. `_layouts/default.html` includes `_includes/masthead.html` on non-home-v2 pages.
5. `_includes/masthead.html` is a compatibility wrapper that includes `navigation/masthead.html`.
6. `_includes/navigation/masthead.html` uses the current `.masthead.lbfl-masthead`, `.lbfl-nav`, `.lbfl-brand`, `.lbfl-desktop-links`, and `.lbfl-mobile-*` markup family.
7. `_sass/components/_navigation.scss` is loaded by `main.scss`, but it defines a separate `.neural-site-masthead` architecture and repeats that selector near the end. Runtime winning-selector evidence is still required before calling that selector family active, shadowed, or legacy.
8. No static import/reference was found for `_sass/components/_masthead-logo-firewall.scss` or `_sass/layout/_page-layouts.scss`; they remain **DORMANT — no production path proven**, not safe-to-delete.
9. `_layouts/single.html` conditionally includes `navigation/contextual-sidebar.html` when `page.sidebar` is present.
10. `_layouts/archive.html` directly includes `components/archive-single.html`, `components/neural-pagination.html`, and `navigation/contextual-sidebar.html`.
11. `_includes/archive-single.html` is a forwarding wrapper to `components/archive-single.html` and is directly used by multiple category/hub/utility pages.
12. `_includes/components/neural-pagination.html` embeds its own `<style>`, so it participates in the effective cascade independently of the SCSS import graph.
13. No direct include reference was found for `navigation/sidebar-academic.html` or `navigation/sidebar-socratic.html`; they remain dormant until a dynamic/transitive invocation is proven.
14. Both `layout: single` and `layout: archive` are used by multiple repository pages, so both layouts are production-relevant route families.

See `file-matrix.yml` for the 20-file static classification.

## Required runtime evidence before F0 can PASS

Static provenance is necessary but not sufficient. F0 remains **HOLD** until representative rendered pages prove:

- actual stylesheet bundle identity at this exact head;
- current masthead selector family and winning declarations;
- whether loaded `.neural-site-masthead` selectors match any rendered production markup;
- cascade winners affecting masthead, archive cards, pagination, and contextual sidebar;
- route-family differences;
- presence/absence of embedded pagination styles on real paginated routes;
- sticky/fixed behavior that will matter to later focus-not-obscured testing.

For each inspected element record:

`route | viewport | element | matched selector | source file | declaration | specificity/order | computed value | winning/overridden | evidence artifact`

## F0 classifications

Use only:

- **ACTIVE — production-proven**
- **ACTIVE — conditional/route-specific**
- **SHADOWED — loaded but overridden**
- **DUPLICATE/LEGACY — loaded but apparently superseded**
- **DORMANT — no production path proven**
- **UNRESOLVED — evidence insufficient**

`DORMANT` and `UNRESOLVED` are never deletion authority.

## F0 PASS gate

F0 passes only when the same exact candidate head has:

1. repository identity;
2. `main.scss` import order;
3. transitive SCSS dependency map;
4. include/layout invocation map;
5. actual masthead architecture proof;
6. sidebar invocation proof;
7. archive wrapper/implementation proof;
8. pagination implementation + embedded-style proof;
9. winning-selector evidence from representative rendered pages;
10. route-family mapping;
11. no unresolved ambiguity about files that F1-F8 must modify.

Until all eleven are evidenced, disposition is **HOLD — F0 incomplete**.

## Next authorized transition

When F0 passes, create the narrowest F1 packet against **production-proven files only**. F1 must build a token-to-computed-surface contrast matrix before changing any shared color token.

