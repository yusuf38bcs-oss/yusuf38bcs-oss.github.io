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
    var indicators = button ? button.querySelectorAll("span") : [];
    for (var i = 0; i < indicators.length; i += 1) {
      indicators[i].textContent = text;
    }
  }

  function openPanel(panel) {
    panel.classList.add("show");
    panel.style.setProperty("display", "block", "important");
    panel.style.setProperty("max-height", "none", "important");
    panel.style.setProperty("height", "auto", "important");
    panel.style.setProperty("visibility", "visible", "important");
    panel.style.setProperty("opacity", "1", "important");
    panel.style.setProperty("overflow", "visible", "important");
    panel.setAttribute("aria-hidden", "false");
  }

  function closePanel(panel) {
    panel.classList.remove("show");
    panel.style.setProperty("display", "none", "important");
    panel.style.setProperty("max-height", "0", "important");
    panel.style.setProperty("height", "0", "important");
    panel.style.setProperty("visibility", "hidden", "important");
    panel.style.setProperty("opacity", "0", "important");
    panel.style.setProperty("overflow", "hidden", "important");
    panel.setAttribute("aria-hidden", "true");
  }

  function setOpen(button, panel, open) {
    button.classList.toggle("active", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      openPanel(panel);
    } else {
      closePanel(panel);
    }
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
      var open = panel.classList.contains("show") || panel.style.display === "block" || button.classList.contains("active");
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

    var shouldOpen = !panel.classList.contains("show") && panel.style.display !== "block";
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
