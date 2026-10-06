# CONV-04G-R1 — Shared Platform Visual System Repair

**Authorized base:** `3c9d57e8b3b40a599de960d145165e2f4f4304cd`  
**Programme step:** 2 of 5  
**Machine phase:** `CONV-04G-R1`  
**Mutation type:** shared visual infrastructure only

## 1. Preconditions

CONV-04F is formally closed.

On exact `main@3c9d57e8b3b40a599de960d145165e2f4f4304cd`:

- GitHub Pages: PASS
- Sovereign Site Audit v4: PASS
- Ecology 10-Lecture Live Production Certification: PASS
- eight retained Zoology Practical production-parity workflows: PASS
- failed/pending post-merge production groups: 0

## 2. Forensic findings frozen before mutation

The platform currently contains several overlapping presentation layers:

- Minimal Mistakes / legacy Sass;
- `synaptic-overrides.css`;
- `production-hotfix.css`;
- legacy `zoology-academic.css`;
- opt-in Academic Design System v1;
- Practical-specific styling;
- Homepage V3's independent shell and typography.

The canonical site configuration already points to the real LBFL logo:

`/assets/images/logo.png`

The ordinary masthead already renders that configured logo, while Homepage V3 still owns a page-local text mark. Homepage migration is deliberately deferred to CONV-04I so G-R1 does not mix infrastructure convergence with homepage narrative work.

The Academic Surface Contract already requires one shared LBFL identity/header system and describes page-local brand implementations as migration debt.

## 3. G-R1 architecture

G-R1 creates a foundation beneath Academic-v1 rather than another theme.

### Platform layer

`assets/css/lbfl-platform-system.css`

owns only:

- platform color/contrast tokens;
- typography scale tokens;
- spacing, reading measure and shell geometry;
- canonical brand/logo sizing;
- header/footer shell hooks;
- responsive matrix primitive;
- neutral card primitive;
- accessible overflow table wrapper primitive;
- figure primitive;
- focus and reduced-motion rules.

The platform stylesheet does not style bare `body`, headings, paragraphs, tables, images, or learner content. Rules require explicit `lbfl-platform-*` classes.

### Canonical identity

`_includes/brand/lbfl-identity.html`

uses `site.logo` and `site.title` as the single brand authority. The ordinary masthead consumes this include while retaining legacy class names for compatibility.

Homepage V3 does not consume it until CONV-04I.

### Academic-v1 relationship

Academic-v1 keeps its existing class/component vocabulary but maps core color, geometry and typography variables onto the platform token layer with fallbacks. This makes Academic-v1 a consumer of the platform system instead of a parallel token universe.

## 4. Known design debt intentionally not patched page-by-page

The following observations are retained as later migration evidence, not isolated hotfixes in G-R1:

- Homepage V3 logo/wordmark, oversized mobile hero typography and spacing: integrate in CONV-04I.
- Higher Study surfaces missing a consistent matrix presentation: consume the G-R1 matrix primitive during the relevant governed migration.
- Biostatistics lecture pages with excessive leading/top whitespace: diagnose route/layout ownership after the shared geometry layer is certified; do not patch individual lectures before ownership is known.
- remaining inline footer styling: retained for compatibility while shared footer hooks are introduced; later convergence may remove duplicated declarations after route/browser evidence.

## 5. Workflow isolation

G-R1 does not modify:

- `worker/**`;
- Worker deployment workflows or scripts;
- Wrangler configuration;
- Cloudflare DNS/configuration;
- Homepage V3 content/includes;
- Socratic learner content;
- academic learner files;
- Admission;
- assessment ownership.

A dedicated validator enforces the exact changed-file boundary.

## 6. Promotion gate

G-R1 may merge only when the unchanged exact head has:

- platform visual-system validator PASS;
- retained Academic Design System validator PASS;
- Academic Surface Contract validator PASS;
- `git diff --check` PASS;
- production Jekyll build PASS;
- all triggered retained route/browser/accessibility checks PASS;
- zero unresolved review threads;
- SHA-bound SOLO authority;
- Trusted Governance PASS.

After merge, exact-main Pages/Sovereign and affected production parity must be green before G-01 learner-facing Socratic convergence begins.
