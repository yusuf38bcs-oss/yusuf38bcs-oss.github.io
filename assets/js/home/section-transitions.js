/**
 * Learning Biology For Life - Section Transition & Viewport Reveal Engine
 * Coordinates hardware-accelerated scroll animations and viewport entry tracking safely
 */

(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll(".premium-academic-block, .premium-tests-cta-block, .brevo-integrated-section, .neural-system-divider");
    const isMobileDevice = window.innerWidth <= 768;

    if (!sections.length) return;

    /**
     * Master Viewport Observer Strategy
     * Leverages native optimization to cycle animation calculations out of memory when off-screen
     */
    if ("IntersectionObserver" in window) {
      const transitionObserverOptions = {
        root: null,
        threshold: isMobileDevice ? 0.05 : 0.15, // Prompt load triggers earlier on smartphone viewports
        rootMargin: "0px 0px -20px 0px"
      };

      const sectionObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            
            // Trigger alpha fade-in parameters seamlessly
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
            
            // Disconnect tracking layer immediately once state is loaded to conserve system resources
            observer.unobserve(element);
          }
        });
      }, transitionObserverOptions);

      sections.forEach(section => {
        // Prepare strict layout parameters on memory initialize threads
        section.style.opacity = "0";
        section.style.transform = "translateY(35px)";
        
        // Inject modern GPU compositing layer hints directly via native CSS hooks
        section.style.willChange = "transform, opacity";
        section.style.transition = "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease";
        
        sectionObserver.observe(section);
      });
    } else {
      // Safe dynamic cascade failback parameters in case user runs legacy web viewports
      sections.forEach(section => {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      });
    }
  });
})();
