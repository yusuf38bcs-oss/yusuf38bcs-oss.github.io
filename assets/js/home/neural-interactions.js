document.addEventListener("DOMContentLoaded", () => {

  const revealSections =
    document.querySelectorAll(".reveal-section");

  const observer =
    new IntersectionObserver((entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }

      });

    }, {
      threshold: 0.15
    });

  revealSections.forEach((section) => {
    observer.observe(section);
  });

});