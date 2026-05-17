/* =========================================================
   Learning Biology For Life
   Synaptic Accordion Engine
   Production Version
   Dark Theme Compatible
========================================================= */

(function () {

  "use strict";

  /* ======================================================
     CONFIG
  ====================================================== */

  const CONFIG = {

    accordionSelector: ".accordion",

    panelSelector: ".accordion-panel",

    activeClass: "active",

    animationDuration: 250,

    allowMultipleOpen: false,

    persistState: true

  };

  /* ======================================================
     UTILITIES
  ====================================================== */

  function qs(selector, scope = document) {

    return scope.querySelector(selector);

  }

  function qsa(selector, scope = document) {

    return [...scope.querySelectorAll(selector)];

  }

  function escapeId(id) {

    return String(id).replace(/[^a-zA-Z0-9_-]/g, "");

  }

  /* ======================================================
     STORAGE
  ====================================================== */

  function saveState(id, state) {

    if (!CONFIG.persistState) return;

    try {

      localStorage.setItem(
        `accordion-${id}`,
        state ? "open" : "closed"
      );

    } catch (err) {

      console.warn(
        "Accordion state save failed",
        err
      );

    }

  }

  function loadState(id) {

    if (!CONFIG.persistState) return false;

    try {

      return (
        localStorage.getItem(
          `accordion-${id}`
        ) === "open"
      );

    } catch {

      return false;

    }

  }

  /* ======================================================
     ANIMATION
  ====================================================== */

  function openPanel(panel) {

    panel.hidden = false;

    panel.style.maxHeight =
      panel.scrollHeight + "px";

  }

  function closePanel(panel) {

    panel.style.maxHeight = "0px";

    setTimeout(() => {

      panel.hidden = true;

    }, CONFIG.animationDuration);

  }

  /* ======================================================
     INITIALIZER
  ====================================================== */

  function initialiseAccordion(accordion, index) {

    const panel =
      accordion.nextElementSibling;

    if (!panel) return;

    /* --------------------------------------------------
       IDs
    -------------------------------------------------- */

    const accordionId =
      accordion.id ||
      `accordion-${index}`;

    const panelId =
      panel.id ||
      `panel-${index}`;

    accordion.id = escapeId(accordionId);

    panel.id = escapeId(panelId);

    /* --------------------------------------------------
       ACCESSIBILITY
    -------------------------------------------------- */

    accordion.setAttribute(
      "role",
      "button"
    );

    accordion.setAttribute(
      "tabindex",
      "0"
    );

    accordion.setAttribute(
      "aria-controls",
      panel.id
    );

    panel.setAttribute(
      "role",
      "region"
    );

    panel.setAttribute(
      "aria-labelledby",
      accordion.id
    );

    /* --------------------------------------------------
       ICON
    -------------------------------------------------- */

    let icon =
      accordion.querySelector(
        "[data-accordion-icon]"
      );

    if (!icon) {

      icon = document.createElement("span");

      icon.className =
        "accordion-icon";

      icon.dataset.accordionIcon = "";

      icon.setAttribute(
        "aria-hidden",
        "true"
      );

      accordion.appendChild(icon);

    }

    /* --------------------------------------------------
       INITIAL STATE
    -------------------------------------------------- */

    panel.classList.add(
      CONFIG.panelSelector.replace(".", "")
    );

    panel.style.overflow = "hidden";

    panel.style.transition =
      `max-height ${CONFIG.animationDuration}ms ease`;

    const shouldOpen =
      loadState(accordion.id);

    if (shouldOpen) {

      accordion.classList.add(
        CONFIG.activeClass
      );

      accordion.setAttribute(
        "aria-expanded",
        "true"
      );

      icon.textContent = "−";

      panel.hidden = false;

      panel.style.maxHeight =
        panel.scrollHeight + "px";

    } else {

      accordion.setAttribute(
        "aria-expanded",
        "false"
      );

      icon.textContent = "+";

      panel.hidden = true;

      panel.style.maxHeight = "0px";

    }

    /* --------------------------------------------------
       TOGGLE
    -------------------------------------------------- */

    function toggleAccordion() {

      const isOpen =
        accordion.classList.contains(
          CONFIG.activeClass
        );

      /* ----------------------------------------------
         SINGLE OPEN MODE
      ---------------------------------------------- */

      if (!CONFIG.allowMultipleOpen) {

        qsa(CONFIG.accordionSelector)
          .forEach((item) => {

            if (item === accordion) return;

            const sibling =
              item.nextElementSibling;

            const siblingIcon =
              item.querySelector(
                "[data-accordion-icon]"
              );

            item.classList.remove(
              CONFIG.activeClass
            );

            item.setAttribute(
              "aria-expanded",
              "false"
            );

            if (siblingIcon) {

              siblingIcon.textContent = "+";

            }

            if (sibling) {

              closePanel(sibling);

            }

            saveState(item.id, false);

          });

      }

      /* ----------------------------------------------
         TOGGLE CURRENT
      ---------------------------------------------- */

      accordion.classList.toggle(
        CONFIG.activeClass
      );

      const nowOpen = !isOpen;

      accordion.setAttribute(
        "aria-expanded",
        String(nowOpen)
      );

      icon.textContent =
        nowOpen ? "−" : "+";

      if (nowOpen) {

        openPanel(panel);

      } else {

        closePanel(panel);

      }

      saveState(accordion.id, nowOpen);

    }

    /* --------------------------------------------------
       EVENTS
    -------------------------------------------------- */

    accordion.addEventListener(
      "click",
      toggleAccordion
    );

    accordion.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          toggleAccordion();

        }

      }
    );

  }

  /* ======================================================
     INIT
  ====================================================== */

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      qsa(CONFIG.accordionSelector)
        .forEach(initialiseAccordion);

    }
  );

})();
