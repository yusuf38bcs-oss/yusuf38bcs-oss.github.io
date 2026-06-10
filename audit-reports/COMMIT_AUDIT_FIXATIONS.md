# Commit Audit Fixations

This audit follows the recent commit stream and records each concrete issue fixed in this patch.

## Issues fixed

1. **Cookie consent markup was created but never rendered.**
   - Problem: commit `9493ef2` added `_includes/body/gdpr-banner.html`, while the default layout never included it, so the consent script could not display the banner.
   - Fix: render the GDPR banner from `_layouts/default.html` after the footer.

2. **Cookie preference link had no behavior.**
   - Problem: the footer exposed `Cookie Preferences`, but no click handler reopened the banner.
   - Fix: add a handler in `_includes/head/head.html` that prevents the empty hash navigation and reopens the consent dialog.

3. **AdSense could be injected repeatedly.**
   - Problem: accepting consent multiple times could append duplicate AdSense scripts.
   - Fix: mark the injected script with `data-cookie-managed="adsense"` and skip loading if it already exists.

4. **Consent storage could break in restricted browsers.**
   - Problem: direct `localStorage` access can throw in private or privacy-restricted environments.
   - Fix: wrap consent reads and writes in safe helper functions.

5. **Hero particle math could create `NaN` coordinates.**
   - Problem: if a particle overlapped the mouse exactly, the repel calculation divided by zero.
   - Fix: only divide by distance when `distance > 0`.

6. **Hero animation loops could overlap after resize/visibility events.**
   - Problem: resize and visibility handlers restarted the animation without a single lifecycle guard.
   - Fix: add explicit `startEngineLoop`/`stopEngineLoop` state management.

7. **Mobile drawer close reset body overflow incorrectly.**
   - Problem: closing the drawer always reset `document.body.style.overflow` to an empty value.
   - Fix: preserve the original inline overflow value and restore it on close.

8. **Mobile drawer stayed open after selecting a link.**
   - Problem: link navigation from the drawer did not close the drawer or restore scroll immediately.
   - Fix: close the drawer when a drawer link is clicked.

9. **Imported Sass partials declared `@charset` after earlier imports.**
   - Problem: `_footer.scss` and `_network.scss` are imported from `assets/css/main.scss`, so partial-level `@charset` directives can land after earlier CSS.
   - Fix: remove partial-level `@charset` directives and leave stylesheet encoding to the compiled entrypoint.

10. **Footer links targeted stale routes.**
    - Problem: footer route updates pointed to paths that do not exist after taxonomy reorganization.
    - Fix: align footer biology and life-practice links with existing hub/category routes.

11. **Front matter contained duplicate keys.**
    - Problem: many `_pages` files had duplicate `permalink` keys, making route intent ambiguous and YAML parsing dependent on last-key behavior.
    - Fix: remove duplicate permalink entries and keep the canonical route.

12. **Neural background JavaScript had literal escaped newlines.**
    - Problem: `assets/js/core/neural-bg.js` contained literal `\n` text inside executable code, causing `node --check` to fail.
    - Fix: restore real line breaks and add a canvas context guard.

13. **Neural background canvas scaling compounded on resize.**
    - Problem: repeated `ctx.scale(...)` calls multiplied the transform on each resize.
    - Fix: use `ctx.setTransform(...)` to reset the device-pixel-ratio transform deterministically.

14. **Footer archive link had no page target.**
    - Problem: `/archive/` was linked from the footer without a matching page.
    - Fix: add `_pages/utility/archive.md` as the public archive endpoint.
