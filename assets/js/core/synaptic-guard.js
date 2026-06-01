(function () {
  window.addEventListener("load", () => {

    if (window.SynapticAI) return;

    console.warn(
      "[SynapticGuard] SynapticAI missing after page load."
    );

    window.SynapticAI = {
      generate: async () => ({
        text: "AI engine failed to load."
      }),

      renderMarkdown: text =>
        `<p>${text || ""}</p>`,

      clearMemory: () => {}
    };

  });
})();