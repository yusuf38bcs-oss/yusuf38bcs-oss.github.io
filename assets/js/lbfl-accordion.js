(function () {
  "use strict";

  function isAccordionButton(element) {
    return element && element.classList && element.classList.contains("accordion");
  }

  function getButtonFromEvent(target) {
    if (!target || !target.closest) return null;
    var button = target.closest(".accordion");
    return isAccordionButton(button) ? button : null;
  }

  function getPanel(button) {
    if (!button) return null;
    var panel = button.nextElementSibling;
    if (!panel || !panel.classList || !panel.classList.contains("panel")) return null;
    return panel;
  }

  function setIndicator(button, text) {
    var indicator = button ? button.querySelector("span") : null;
    if (indicator) indicator.textContent = text;
  }

  function setOpen(button, panel, open) {
    button.classList.toggle("active", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
    panel.style.display = open ? "block" : "none";
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    setIndicator(button, open ? "−" : "+");
  }

  function closeSiblings(activeButton) {
    var buttons = document.querySelectorAll(".accordion");
    for (var i = 0; i < buttons.length; i += 1) {
      var button = buttons[i];
      if (button === activeButton) continue;
      var panel = getPanel(button);
      if (panel) setOpen(button, panel, false);
    }
  }

  function initializeAccordions() {
    var buttons = document.querySelectorAll(".accordion");
    for (var i = 0; i < buttons.length; i += 1) {
      var button = buttons[i];
      var panel = getPanel(button);
      if (!panel) continue;
      if (!button.hasAttribute("tabindex")) button.setAttribute("tabindex", "0");
      if (!button.hasAttribute("type") && button.tagName && button.tagName.toLowerCase() === "button") button.setAttribute("type", "button");
      var open = panel.style.display === "block" || button.classList.contains("active");
      setOpen(button, panel, open);
    }
  }

  document.addEventListener("click", function (event) {
    var button = getButtonFromEvent(event.target);
    if (!button) return;
    var panel = getPanel(button);
    if (!panel) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();

    var shouldOpen = panel.style.display !== "block";
    closeSiblings(button);
    setOpen(button, panel, shouldOpen);
  }, true);

  document.addEventListener("keydown", function (event) {
    var button = getButtonFromEvent(event.target);
    if (!button) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    button.click();
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAccordions, { once: true });
  } else {
    initializeAccordions();
  }
})();
