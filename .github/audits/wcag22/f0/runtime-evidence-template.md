# F0 Runtime Evidence Template

Use this template only against an exact preview/browser identity bound to the candidate head.

## Candidate identity

- Repository:
- Branch:
- Head SHA:
- Tree SHA:
- Preview URL:
- Deployment identifier:
- Deployment source SHA:
- Generated at:
- Auditor:

If deployment source SHA cannot be proven equal to the candidate head, stop and record **HOLD — preview identity unbound**.

## Representative route families

At minimum sample:

1. non-home-v2 default/single page;
2. homepage separately (different header path);
3. archive/category page;
4. paginated archive route where paginator.total_pages > 1;
5. page with contextual sidebar;
6. Bangla route;
7. Higher Zoology route;
8. route containing custom interactive controls.

Add more routes where the cascade or layout differs.

## Browser matrix

Record at least:

| Route | Viewport | Zoom | Header family | Sidebar | Archive cards | Pagination | Notes |
|---|---:|---:|---|---|---|---|---|
| | 320px | 100% | | | | | |
| | 390px | 100% | | | | | |
| | 768px | 100% | | | | | |
| | 1280px | 100% | | | | | |
| | 1280px | 400% | | | | | |

F0 is not the final WCAG test; these viewports exist to expose production cascade differences needed by F1-F8.

## Matched-rule evidence

For every critical surface capture the winning computed declaration and overridden candidates.

| Route | Element | Property | Computed value | Winning selector | Source | Order/specificity | Overridden candidate(s) | Evidence |
|---|---|---|---|---|---|---|---|---|
| | masthead | position | | | | | | |
| | masthead | background | | | | | | |
| | nav link | color | | | | | | |
| | mobile menu | display | | | | | | |
| | sidebar link | color | | | | | | |
| | archive excerpt | color | | | | | | |
| | pagination button | color | | | | | | |
| | pagination button | background | | | | | | |

## Mandatory questions

### Masthead
- Does rendered markup use `.lbfl-*`, `.neural-site-masthead`, both, or another family?
- Which source wins for position, z-index, dimensions, colors, hover, and focus?
- Does any rule from `_navigation.scss` match current masthead markup?
- Is `_masthead-logo-firewall.scss` absent from the compiled stylesheet?

### Sidebar
- Which routes actually render `contextual-sidebar-nav`?
- Does `sidebar-academic.html` or `sidebar-socratic.html` appear anywhere in rendered output?
- Which CSS source controls sticky behavior and link colors?

### Archive cards
- Is `_includes/archive-single.html` reached through wrapper routes?
- Is `components/archive-single.html` the final rendered card body?
- Which rules from cards, synaptic-glow, omega-overrides, or Minimal Mistakes win?

### Pagination
- Does the route render `neural-pagination`?
- Is the embedded style block present?
- Does the embedded `#64748b` / `#475569` styling win, or is it overridden later?
- Record actual computed foreground/background before F1 makes any contrast decision.

## F0 disposition

Choose one:

- **PASS — Production cascade truth proven**
- **HOLD — unresolved runtime ambiguity**
- **FAIL — evidence contradicts the static provenance model**

A PASS must answer every F0 gate in README.md and update `file-matrix.yml` from static-only classifications to final production classifications.

Do not mutate shared CSS from this template. F1 begins only after F0 PASS.
