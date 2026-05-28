/**
 * Learning Biology For Life - Synaptic Accordion Engine
 * Optimized for Socratic Educational Flow, Cross-Device Viewports & Accessibility
 */

(function() {
  "use strict";

  const CONFIG = {
    accordionSelector: ".accordion",
    panelSelector: ".panel", 
    activeClass: "active",
    persistState: true,
    allowMultipleOpen: false // Maintains strict cognitive focus for learners
  };

  const AccordionEngine = {
    init() {
      const accordions = document.querySelectorAll(CONFIG.accordionSelector);
      if (!accordions.length) return;

      accordions.forEach((el, index) => this.setupAccordion(el, index));
      this.handleResize();
    },

    setupAccordion(el, index) {
      const panel = el.nextElementSibling;
      if (!panel || !panel.classList.contains('panel')) return;

      // 1. Accessibility W3C Standard Mapping
      const id = el.id || `synaptic-acc-${index}`;
      const panelId = `synaptic-panel-${index}`;
      el.id = id;
      panel.id = panelId;
      
      el.setAttribute('role', 'button');
      el.setAttribute('aria-expanded', 'false');
      el.setAttribute('aria-controls', panelId);
      el.setAttribute('tabindex', '0');
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', id);

      // Strict Left Alignment Enforcer to destroy any hidden forced smartphone word gaps
      panel.style.textAlign = "left";
      panel.style.wordSpacing = "normal";

      // 2. State Persistence Logic
      if (CONFIG.persistState && localStorage.getItem(id) === 'open') {
        this.toggle(el, panel, true);
      }

      // 3. Secure Core Event Listeners
      el.addEventListener('click', () => this.toggle(el, panel));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle(el, panel);
        }
      });
    },

    toggle(el, panel, forceOpen = false) {
      const isOpen = el.classList.contains(CONFIG.activeClass) && !forceOpen;

      // Close other panels cleanly if single-open rule is active
      if (!CONFIG.allowMultipleOpen && !isOpen) {
        document.querySelectorAll(CONFIG.accordionSelector).forEach(otherEl => {
          if (otherEl !== el) {
            const otherPanel = otherEl.nextElementSibling;
            if (otherPanel && otherPanel.classList.contains('panel')) {
              otherEl.classList.remove(CONFIG.activeClass);
              otherEl.setAttribute('aria-expanded', 'false');
              otherPanel.style.maxHeight = null;
              otherPanel.classList.remove('show');
              if (CONFIG.persistState) localStorage.removeItem(otherEl.id);
            }
          }
        });
      }

      // Toggle Current Context Node State
      if (isOpen) {
        el.classList.remove(CONFIG.activeClass);
        el.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
        panel.classList.remove('show');
        if (CONFIG.persistState) localStorage.removeItem(el.id);
      } else {
        el.classList.add(CONFIG.activeClass);
        el.setAttribute('aria-expanded', 'true');
        panel.classList.add('show');
        panel.style.maxHeight = panel.scrollHeight + "px";
        if (CONFIG.persistState) localStorage.setItem(el.id, 'open');
      }
    },

    handleResize() {
      // Recalculate max-height constraints during responsive viewport transitions
      window.addEventListener('resize', () => {
        const activePanels = document.querySelectorAll(`${CONFIG.panelSelector}.show`);
        activePanels.forEach(panel => {
          panel.style.maxHeight = panel.scrollHeight + "px";
        });
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => AccordionEngine.init());
})();
