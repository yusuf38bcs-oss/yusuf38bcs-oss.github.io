/**
 * Learning Biology For Life - Neural Flow Conceptual Interactive Grid
 * Maps premium 3D parallax micro-tilt coordinates, viewport tracking & automated transition loops
 */

(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {
    const flowBlock = document.querySelector(".premium-neural-flow-block");
    if (!flowBlock) return;

    const cards = flowBlock.querySelectorAll(".flow-node-card-slot");
    const isMobile = window.innerWidth <= 768;

    /**
     * 1. High Performance Viewport Intersection Mapping Engine
     * Fallback anchor in case global AOS core structures lag on dynamic mobile viewport loads
     */
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        threshold: isMobile ? 0.1 : 0.2,
        rootMargin: "0px 0px -40px 0px"
      };

      const flowObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0) scale(1)";
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      cards.forEach(card => {
        // Enforcing smooth CSS hardware acceleration transition parameters initially
        card.style.opacity = "0";
        card.style.transform = "translateY(25px) scale(0.98)";
        card.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease, border-color 0.3s ease";
        flowObserver.observe(card);
      });
    } else {
      // Direct pass safe fallback parameters for ancient webview contexts
      cards.forEach(card => card.style.opacity = "1");
    }

    /**
     * 2. Premium 3D Micro-Tilt Parallax Mechanics
     * Runs strictly on desktop monitors to minimize memory bloat on modern mobile browsers
     */
    if (!isMobile) {
      cards.forEach(card => {
        card.addEventListener("mousemove", function(e) {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left; // Mouse X coordinate relative to card bounding container
          const y = e.clientY - rect.top;  // Mouse Y coordinate relative to card bounding container
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          // Micro tilt calculations maximum threshold caps at exactly 4 degrees
          const rotateX = ((centerY - y) / centerY) * 4;
          const rotateY = ((x - centerX) / centerX) * 4;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
          card.style.boxShadow = `0 18px 40px rgba(0, 212, 178, 0.06)`;
        });

        card.addEventListener("mouseleave", function() {
          // Reset card geometry seamlessly back into standard layout slot matrix
          card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
          card.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.4)";
        });
      });
    }
  });
})();
