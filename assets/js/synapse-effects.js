/**
 * =========================================================
 * SYNAPTIC UI EFFECTS SYSTEM
 * File: assets/js/synapse-effects.js
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------------------------------
  // Glow Hover Effects
  // -------------------------------------------------------

  const glowCards = document.querySelectorAll(
    ".feature-card, .post-card, .sidebar-card"
  );

  glowCards.forEach((card) => {

    card.addEventListener("mousemove", (e) => {

      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.background =
        `
        radial-gradient(
          circle at ${x}px ${y}px,
          rgba(62,231,182,0.16),
          rgba(255,255,255,0.04)
        )
        `;
    });

    card.addEventListener("mouseleave", () => {

      card.style.background =
        `
        linear-gradient(
          180deg,
          rgba(255,255,255,0.075),
          rgba(255,255,255,0.035)
        )
        `;
    });

  });

  // -------------------------------------------------------
  // Synaptic Pulse Animation
  // -------------------------------------------------------

  const synapseLines = document.querySelectorAll(".synapse-line");

  synapseLines.forEach((line, index) => {

    line.animate(
      [
        {
          opacity: 0.25,
          transform: line.style.transform + " scaleX(0.9)"
        },
        {
          opacity: 1,
          transform: line.style.transform + " scaleX(1.05)"
        },
        {
          opacity: 0.25,
          transform: line.style.transform + " scaleX(0.9)"
        }
      ],
      {
        duration: 2800 + (index * 400),
        iterations: Infinity,
        easing: "ease-in-out"
      }
    );

  });

  // -------------------------------------------------------
  // Floating Neuron Orb
  // -------------------------------------------------------

  const orb = document.querySelector(".neuron-orb");

  if (orb) {

    orb.animate(
      [
        {
          transform: "translateY(0px)"
        },
        {
          transform: "translateY(-12px)"
        },
        {
          transform: "translateY(0px)"
        }
      ],
      {
        duration: 4200,
        iterations: Infinity,
        easing: "ease-in-out"
      }
    );

  }

  // -------------------------------------------------------
  // Scroll Reveal
  // -------------------------------------------------------

  const revealItems = document.querySelectorAll(
    ".feature-card, .post-card, .sidebar-card"
  );

  const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0px)";

      }

    });

  }, {
    threshold: 0.1
  });

  revealItems.forEach((item) => {

    item.style.opacity = "0";
    item.style.transform = "translateY(30px)";
    item.style.transition =
      "opacity 700ms ease, transform 700ms ease";

    observer.observe(item);

  });

});
