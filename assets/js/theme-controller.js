/**
 * Learning Biology For Life - Synaptic Theme Engine
 * Manages cognitive visual modes and system synchronization.
 */

(function() {
  "use strict";

  const STORAGE_KEY = "lbfl-neural-theme";
  const THEMES = ["dark", "light", "midnight", "biology"];
  const DEFAULT_THEME = "dark";
  const ROOT = document.documentElement;

  const ThemeEngine = {
    init() {
      this.applyInitialTheme();
      this.bindEvents();
      this.watchSystemPreference();
    },

    applyInitialTheme() {
      const stored = localStorage.getItem(STORAGE_KEY);
      const initial = THEMES.includes(stored) ? stored : DEFAULT_THEME;
      this.setTheme(initial);
    },

    /**
     * Set active neural theme
     * @param {string} theme - One of THEMES
     */
    setTheme(theme) {
      if (!THEMES.includes(theme)) theme = DEFAULT_THEME;

      ROOT.setAttribute("data-theme", theme);
      localStorage.setItem(STORAGE_KEY, theme);
      
      this.updateBrowserUI(theme);
      this.notifyEcosystem(theme);
    },

    toggle() {
      const current = ROOT.getAttribute("data-theme") || DEFAULT_THEME;
      const next = current === "dark" ? "light" : "dark";
      this.setTheme(next);
    },

    updateBrowserUI(theme) {
      // Colors mapped to the neural-variables system
      const colors = {
        dark: "#0a0a0c",
        light: "#ffffff",
        midnight: "#020617",
        biology: "#052e16"
      };

      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }
      meta.content = colors[theme] || colors.dark;
    },

    bindEvents() {
      // Toggle buttons
      document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
        btn.addEventListener("click", () => this.toggle());
      });

      // Specific theme selectors
      document.querySelectorAll("[data-set-theme]").forEach(btn => {
        btn.addEventListener("click", () => this.setTheme(btn.dataset.setTheme));
      });

      // Keyboard Shortcut: Alt + T
      document.addEventListener("keydown", (e) => {
        if (e.altKey && e.key.toLowerCase() === "t") this.toggle();
      });
    },

    watchSystemPreference() {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      media.addEventListener("change", (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          this.setTheme(e.matches ? "dark" : "light");
        }
      });
    },

    notifyEcosystem(theme) {
      document.dispatchEvent(new CustomEvent("lbfl:theme-changed", { 
        detail: { theme } 
      }));
    }
  };

  // Immediate execution for Flash of Unstyled Content (FOUC) prevention
  ThemeEngine.init();

  // Export for Global Access
  window.SynapticTheme = {
    set: (t) => ThemeEngine.setTheme(t),
    toggle: () => ThemeEngine.toggle(),
    current: () => ROOT.getAttribute("data-theme") || DEFAULT_THEME
  };
})();
