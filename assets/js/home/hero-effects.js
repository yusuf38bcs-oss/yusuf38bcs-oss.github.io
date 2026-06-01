/**
 * Learning Biology For Life - Hero Interactive Canvas Particles
 * Optimized for High-Performance 60 FPS Rendering, Mobile Battery Protection & Safe Memory Disposal
 */

(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("synaptic-hero-canvas");\n    if (!canvas) return;\n    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    let animationFrameId;

    // Multi-Viewport Optimization Grid
    const isMobile = window.innerWidth <= 480;
    const CONFIG = {
      particleCount: isMobile ? 30 : 85, // Strict throttling to shield iPhone hardware loops
      connectDistance: isMobile ? 65 : 115,
      baseSpeed: 0.35,
      particleColor: "rgba(0, 212, 178, 0.3)", // Signature Neon Cyan Matrix
      lineColor: "rgba(0, 212, 178, 0.05)"
    };

    const mouse = { x: null, y: null, radius: 150 };

    // Activate mouse tracking vectors exclusively on desktop configurations
    if (!isMobile) {
      window.addEventListener("mousemove", function(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });

      window.addEventListener("mouseleave", function() {
        mouse.x = null;
        mouse.y = null;
      });
    }

    function resizeCanvas() {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * CONFIG.baseSpeed;
        this.vy = (Math.random() - 0.5) * CONFIG.baseSpeed;
        this.radius = Math.random() * 1.5 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Fluid Boundary Collision Inversions
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Interactive Magnetism Repel Loop
        if (mouse.x !== null && mouse.y !== null) {
          let dx = this.x - mouse.x;
          let dy = this.y - mouse.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            // Smooth directional shift vectors
            this.x += (dx / distance) * 0.8; 
            this.y += (dy / distance) * 0.8;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = CONFIG.particleColor;
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < CONFIG.particleCount; i++) {
        particlesArray.push(new Particle());
      }
    }

    function connectLines() {
      const len = particlesArray.length;
      for (let a = 0; a < len; a++) {
        for (let b = a + 1; b < len; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONFIG.connectDistance) {
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.strokeStyle = CONFIG.lineColor;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
    }

    function animateEngineLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const len = particlesArray.length;
      for (let i = 0; i < len; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      connectLines();
      animationFrameId = requestAnimationFrame(animateEngineLoop);
    }

    // High performance debouncing simulation on window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        animateEngineLoop();
      }, 150);
    });

    document.addEventListener("visibilitychange", () => {\n      if (document.hidden) { cancelAnimationFrame(animationFrameId); }\n      else { resizeCanvas(); animateEngineLoop(); }\n    });\n    resizeCanvas();\n    animateEngineLoop();
  });
})();
