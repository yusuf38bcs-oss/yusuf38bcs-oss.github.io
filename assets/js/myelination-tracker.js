(function () {
  "use strict";

  const STORAGE_KEY = "lbfl_myelinated_nodes";

  function readState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeState(nodes) {
    const uniqueNodes = Array.from(new Set(nodes));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueNodes));
  }

  function normalizePath(path) {
    if (!path) return "/";
    return path.endsWith("/") ? path : path + "/";
  }

  function markCurrentPageIfMastered() {
    const nodes = readState().map(normalizePath);
    const currentPath = normalizePath(window.location.pathname);

    if (!nodes.includes(currentPath)) return;

    document.documentElement.classList.add("lbfl-node-myelinated");

    document.querySelectorAll("[data-socratic-node]").forEach((node) => {
      node.dataset.mastered = "true";
    });

    document.querySelectorAll("[data-socratic-form]").forEach((form) => {
      form.querySelectorAll("input, textarea, button").forEach((field) => {
        field.disabled = true;
      });
    });
  }

  document.addEventListener("lbfl:node-myelinated", function (event) {
    const nodes = readState();
    const path = normalizePath(event.detail && event.detail.path);

    if (!nodes.includes(path)) {
      nodes.push(path);
      writeState(nodes);
    }

    markCurrentPageIfMastered();
  });

  document.addEventListener("DOMContentLoaded", markCurrentPageIfMastered);
})();
