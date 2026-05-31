(function() {
  if (typeof window.SynapticAI !== 'undefined') return;

  console.warn('[SynapticGuard] SynapticAI not detected. Providing safe fallback.');

  window.SynapticAI = {
    generate: async function() {
      return {
        text: "⚡ AI module is initializing. If this message persists, verify that `socratic-component.js` is present in `assets/js/core/` and loads before this script."
      };
    },
    renderMarkdown: function(text) {
      return '<p style="color:#cbd5e1;line-height:1.6;">' + (text || '').replace(/\n/g, '<br>') + '</p>';
    },
    clearMemory: function() {
      console.log('[SynapticGuard] Memory clear called (no-op fallback).');
    }
  };
})();
