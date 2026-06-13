/**
 * Synchronizes the neural network canvas resolution with CSS display dimensions.
 * Handles High-DPI (Retina) displays and debounces resize events.
 */
function initializeNeuralCanvasSync() {
  const canvas = document.getElementById('neural-network');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let resizeTimer;

  const synchronizeDimensions = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const displayWidth = Math.floor(rect.width);
    const displayHeight = Math.floor(rect.height);

    if (!displayWidth || !displayHeight) return;

    const targetWidth = displayWidth * dpr;
    const targetHeight = displayHeight * dpr;

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Normalize coordinate system to CSS pixels so existing draw logic remains valid
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (typeof initNeuralNetwork === 'function') {
        initNeuralNetwork();
      }
    }
  };

  const observer = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(synchronizeDimensions, 150);
  });

  if (canvas.parentElement) {
    observer.observe(canvas.parentElement);
  }

  synchronizeDimensions();
}

// Attach execution to safe setup runtime loop 
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNeuralCanvasSync);
} else {
  initializeNeuralCanvasSync();
}
