/* =========================================================
   Learning Biology For Life
   Theme Controller Engine
   Synaptic UI System
========================================================= */

(function () {

  "use strict";

  const STORAGE_KEY = "lbfl-theme";

  const THEMES = [
    "dark",
    "light",
    "midnight",
    "biology"
  ];

  const DEFAULT_THEME = "dark";

  const root = document.documentElement;

  /* ======================================================
     INITIALIZE
  ====================================================== */

  document.addEventListener(
    "DOMContentLoaded",
    initThemeController
  );

  function initThemeController() {

    applyStoredTheme();

    setupThemeButtons();

    setupSystemThemeWatcher();

    setupKeyboardShortcut();

  }

  /* ======================================================
     APPLY STORED THEME
  ====================================================== */

  function applyStoredTheme() {

    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (
      stored &&
      THEMES.includes(stored)
    ) {

      setTheme(stored);

    } else {

      setTheme(DEFAULT_THEME);

    }

  }

  /* ======================================================
     SET THEME
  ====================================================== */

  function setTheme(theme) {

    if (!THEMES.includes(theme)) {

      theme = DEFAULT_THEME;

    }

    root.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      STORAGE_KEY,
      theme
    );

    updateThemeMeta(theme);

    dispatchThemeEvent(theme);

  }

  /* ======================================================
     TOGGLE THEME
  ====================================================== */

  function toggleTheme() {

    const current =
      root.getAttribute("data-theme") ||
      DEFAULT_THEME;

    const next =
      current === "dark"
        ? "light"
        : "dark";

    setTheme(next);

  }

  /* ======================================================
     META THEME COLOR
  ====================================================== */

  function updateThemeMeta(theme) {

    let color = "#0f172a";

    switch (theme) {

      case "light":
        color = "#ffffff";
        break;

      case "midnight":
        color = "#020617";
        break;

      case "biology":
        color = "#052e16";
        break;

    }

    let meta =
      document.querySelector(
        'meta[name="theme-color"]'
      );

    if (!meta) {

      meta = document.createElement("meta");

      meta.name = "theme-color";

      document.head.appendChild(meta);

    }

    meta.content = color;

  }

  /* ======================================================
     BUTTONS
  ====================================================== */

  function setupThemeButtons() {

    document
      .querySelectorAll("[data-set-theme]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            const theme =
              button.dataset.setTheme;

            setTheme(theme);

          }
        );

      });

    document
      .querySelectorAll("[data-theme-toggle]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          toggleTheme
        );

      });

  }

  /* ======================================================
     SYSTEM PREFERENCE
  ====================================================== */

  function setupSystemThemeWatcher() {

    if (
      !window.matchMedia
    ) return;

    const media =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    media.addEventListener(
      "change",
      (event) => {

        const stored =
          localStorage.getItem(STORAGE_KEY);

        if (!stored) {

          setTheme(
            event.matches
              ? "dark"
              : "light"
          );

        }

      }
    );

  }

  /* ======================================================
     KEYBOARD SHORTCUT
  ====================================================== */

  function setupKeyboardShortcut() {

    document.addEventListener(
      "keydown",
      (event) => {

        if (
          event.altKey &&
          event.key.toLowerCase() === "t"
        ) {

          toggleTheme();

        }

      }
    );

  }

  /* ======================================================
     CUSTOM EVENT
  ====================================================== */

  function dispatchThemeEvent(theme) {

    document.dispatchEvent(

      new CustomEvent(
        "lbfl:theme-changed",
        {
          detail: {
            theme
          }
        }
      )

    );

  }

  /* ======================================================
     PUBLIC API
  ====================================================== */

  window.ThemeController = {

    setTheme,

    toggleTheme,

    getCurrentTheme() {

      return (
        root.getAttribute("data-theme") ||
        DEFAULT_THEME
      );

    }

  };

})();
