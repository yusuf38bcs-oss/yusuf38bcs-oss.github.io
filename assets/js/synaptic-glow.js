/**
 * Synaptic Glow Tracker
 * Maps pointer coordinates to card-local CSS variables for the neural glass
 * spotlight effect. Uses delegated listeners so dynamically rendered cards also
 * receive the effect without attaching many individual handlers.
 */
(() => {
  "use strict";

  const SELECTOR = [
    ".neural-card",
    ".question-item-card",
    ".mi-question-card",
    ".glass-card",
    ".synaptic-card",
    ".biology-matrix-card",
    ".biology-metric-card",
    ".concept-card-container",
    ".relationship-panel",
    ".relation-card",
    ".archive__item"
  ].join(", ");

  let activeCard = null;
  let frame = 0;
  let nextX = 0;
  let nextY = 0;

  function setCardPosition(card, clientX, clientY) {
    const rect = card.getBoundingClientRect();
    nextX = clientX - rect.left;
    nextY = clientY - rect.top;

    if (frame) return;

    frame = window.requestAnimationFrame(() => {
      card.style.setProperty("--mouse-x", `${nextX}px`);
      card.style.setProperty("--mouse-y", `${nextY}px`);
      card.classList.add("is-synaptic-active");
      frame = 0;
    });
  }

  function clearCard(card) {
    if (!card) return;
    card.classList.remove("is-synaptic-active");
  }

  function closestCard(target) {
    if (!(target instanceof Element)) return null;
    return target.closest(SELECTOR);
  }

  document.addEventListener(
    "pointermove",
    (event) => {
      const card = closestCard(event.target);

      if (!card) {
        clearCard(activeCard);
        activeCard = null;
        return;
      }

      if (activeCard && activeCard !== card) {
        clearCard(activeCard);
      }

      activeCard = card;
      setCardPosition(card, event.clientX, event.clientY);
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerleave",
    () => {
      clearCard(activeCard);
      activeCard = null;
    },
    { passive: true }
  );
})();
