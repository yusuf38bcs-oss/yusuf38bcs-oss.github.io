(() => {
  "use strict";

  const enhanceTables = () => {
    const tables = Array.from(document.querySelectorAll(".page__content table"));

    tables.forEach((table, index) => {
      if (table.closest(".zoology-practical-table-scroll")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "zoology-practical-table-scroll";
      wrapper.tabIndex = 0;
      wrapper.setAttribute("role", "region");

      const caption = table.querySelector("caption")?.textContent?.trim();
      wrapper.setAttribute(
        "aria-label",
        caption || `Scrollable practical data table ${index + 1}`
      );

      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceTables, { once: true });
  } else {
    enhanceTables();
  }
})();
