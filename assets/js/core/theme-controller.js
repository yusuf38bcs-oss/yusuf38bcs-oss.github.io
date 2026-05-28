/**
 * Learning Biology For Life - Synaptic Theme Engine
 * Manages cognitive visual modes, state persistence, and cross-platform system UI synchronizations.
 * Built-in FOUC insulation safeguards and fully synchronized with core main.js telemetry.
 */

(function() {
  "use strict";

  const STORAGE_KEY = "lbfl-neural-theme";
  const THEMES = ["dark", "light", "midnight", "biology"];
  const DEFAULT_THEME = "dark";
  const ROOT = document.documentElement;

  const ThemeEngine = {
    init() {
      // 1. Core Optimization Step: Apply attribute instantly to kill Flash of Unstyled Content (FOUC)
      this.applyInitialTheme();
      
      // 2. Safe DOM Verification: Defer interface bindings until layout structures are ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.bindEcosystemElements());
      } else {
        this.bindEcosystemElements();
      }

      this.watchSystemPreference();
    },

    applyInitialTheme() {
      const storedTheme = localStorage.getItem(STORAGE_KEY);
      const initialTheme = THEMES.includes(storedTheme) ? storedTheme : DEFAULT_THEME;
      this.setTheme(initialTheme);
    },

    /**
     * Set active platform visualization matrix theme
     * @param {string} theme - Selected token from THEMES configuration map
     */
    setTheme(theme) {
      if (!THEMES.includes(theme)) theme = DEFAULT_THEME;

      ROOT.setAttribute("data-theme", theme);
      localStorage.setItem(STORAGE_KEY, theme);
      
      this.updateBrowserUI(theme);
      this.notifyEcosystem(theme);
    },

    toggle() {
      const currentTheme = ROOT.getAttribute("data-theme") || DEFAULT_THEME;
      // Fluid cycle shift logic fallback parameters
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      this.setTheme(nextTheme);
    },

    /**
     * Synchronizes browser runtime engine chrome/address-bar tabs with theme voids
     */
    updateBrowserUI(theme) {
      // Colors mapped to the absolute new premium main.scss luxury layout variables
      const colorPalette = {
        dark: "#020617",      // Premium unified dark void
        light: "#ffffff",     // Pure crisp white light track
        midnight: "#020617",  // Depth-first system mapping
        biology: "#052e16"    // Deep organic forest node
      };

      let themeMetaTag = document.querySelector('meta[name="theme-color"]');
      if (!themeMetaTag) {
        themeMetaTag = document.createElement("meta");
        themeMetaTag.name = "theme-color";
        document.head.appendChild(themeMetaTag);
      }
      themeMetaTag.content = colorPalette[theme] || colorPalette.dark;
    },

    /**
     * Safely binds click events after the layout DOM trees have completed compiling
     */
    bindEcosystemElements() {
      // Toggle control triggers
      document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
        btn.addEventListener("click", () => this.toggle());
      });

      // Specific core block selectors
      document.querySelectorAll("[data-set-theme]").forEach(btn => {
        btn.addEventListener("click", () => {
          const targetedTheme = btn.dataset.setTheme;
          if (targetedTheme) this.setTheme(targetedTheme);
        });
      });

      // Accessible Keyboard Navigation Accelerator Shortcut: Alt + T
      document.addEventListener("keydown", (e) => {
        if (e.altKey && e.key.toLowerCase() === "t") {
          e.preventDefault();
          this.toggle();
        }
      });
    },

    watchSystemPreference() {
      const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
      
      // Dynamic listener loops matching modern device visual theme shift changes
      prefersDarkScheme.addEventListener("change", (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          this.setTheme(e.matches ? "dark" : "light");
        }
      });
    },

    notifyEcosystem(theme) {
      // Dispatches state tracking footprints safely for analytics-engine.js mapping records
      document.dispatchEvent(new CustomEvent("lbfl:theme-changed", { 
        detail: { theme } 
      }));
    }
  };

  // Immediate runtime bootstrapping allocation
  ThemeEngine.init();

  // Exporting Interoperability Alias Handles to avoid main.js unhandled exceptions
  const ExposedGlobalAPI = {
    init: () => { /* Prevent double-init loops if main.js retoggles init() */ },
    set: (themeToken) => ThemeEngine.setTheme(themeToken),
    toggle: () => ThemeEngine.toggle(),
    current: () => ROOT.getAttribute("data-theme") || DEFAULT_THEME
  };

  window.SynapticTheme = ExposedGlobalAPI;
  window.ThemeController = ExposedGlobalAPI; // Securely links with window.ThemeController calls inside main.js
})();
