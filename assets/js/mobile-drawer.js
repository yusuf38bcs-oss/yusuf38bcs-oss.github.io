(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    const masthead = document.querySelector(".neural-site-masthead");
    const toggle = document.getElementById("neural-mobile-toggle");
    const drawer = document.getElementById("neural-mobile-drawer");

    if (!masthead || !toggle || !drawer) {
      console.warn("[Masthead] Required elements missing");
      return;
    }

    function setOpen(open) {
      masthead.classList.toggle("is-active-drawer", open);

      toggle.setAttribute("aria-expanded", open);
      drawer.setAttribute("aria-hidden", !open);

      document.body.style.overflow =
        open ? "hidden" : "";
    }

    toggle.addEventListener("click", function (e) {
      e.preventDefault();

      const open =
        !masthead.classList.contains("is-active-drawer");

      setOpen(open);
    });

    document.addEventListener("click", function (e) {

      if (
        masthead.classList.contains("is-active-drawer") &&
        !drawer.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        setOpen(false);
      }

    });

    document.addEventListener("keydown", function (e) {

      if (
        e.key === "Escape" &&
        masthead.classList.contains("is-active-drawer")
      ) {
        setOpen(false);
      }

    });

    window.addEventListener("resize", function () {

      if (
        window.innerWidth >= 769 &&
        masthead.classList.contains("is-active-drawer")
      ) {
        setOpen(false);
      }

    });

  });
})();