/**
 * Learning Biology For Life - Neural Background Engine (Ecosystem Edition)
 * High-performance synaptic particle system with Retina optimization,
 * advanced requestAnimationFrame lifecycle management, and active core power-saving hooks.
 */

(function() {
  "use strict";

  const NeuralEngine = {
    init() {
      this.canvas = document.getElementById("neural-network");
      if (!this.canvas) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      this.ctx = this.canvas.getContext("2d");
      if (!this.ctx) return;

      this.particles = [];
      this.ratio = window.devicePixelRatio || 1;
      this.animationId = null;
      this.isSuspended = false; // Flag tracking performance state shifts
      
      // Premium Quantum Vector Settings aligned with your Neon Cyan Accent (#00d4b2)
      this.settings = {
        count: window.innerWidth < 768 ? 25 : 75, // Strict count throttling to secure mobile frames
        dist: 135,
        speed: 0.3, // Ultra-slow organic drifting speed for deep reading comfort
        dotColor: "rgba(0, 212, 178, 0.55)", // Signature Neon Cyan
        lineColor: "rgba(0, 212, 178, 0.05)"  // Delicate wireframe connect nodes
      };

      this.resize();
      this.createParticles();
      this.setupPerformanceHooks();
      
      // Trigger native initial layout paint loop
      this.kickstartRenderLoop();

      window.addEventListener("resize", () => this.debouncedResize(), { passive: true });
    },

    resize() {
      if (!this.canvas.parentElement) return;
      this.width = this.canvas.parentElement.offsetWidth;
      this.height = this.canvas.parentElement.offsetHeight;

      // High-DPI Display Normalization Matrix (Retina Shields)
      this.canvas.width = this.width * this.ratio;
      this.canvas.height = this.height * this.ratio;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      // Issue: repeated resize calls previously compounded canvas scaling.
      this.ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
    },

    debouncedResize() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.resize();
        this.createParticles();
      }, 200);
    },

    createParticles() {
      this.particles = [];
      const particleCount = this.settings.count;
      
      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * this.settings.speed,
          vy: (Math.random() - 0.5) * this.settings.speed,
          r: Math.random() * 1.5 + 1 // Micro-geometry tracking dots
        });
      }
    },

    /**
     * Integrates directly with performance-guard.js broadcast network
     * Suspends canvas recalculations to achieve 0% CPU consumption when tab is hidden
     */
    setupPerformanceHooks() {
      document.addEventListener("synaptic:core-performance-suspend", (e) => {
        const suspendRequested = e.detail.suspendActive;

        if (suspendRequested) {
          this.isSuspended = true;
          cancelAnimationFrame(this.animationId); // Drops frame calculation immediately
        } else {
          if (this.isSuspended) {
            this.isSuspended = false;
            this.kickstartRenderLoop(); // Re-ignites node tracking organically
          }
        }
      });
    },

    kickstartRenderLoop() {
      // Prevent loop branching and duplicate thread leaks
      cancelAnimationFrame(this.animationId);
      this.animate();
    },

    animate() {
      if (this.isSuspended) return;

      this.ctx.clearRect(0, 0, this.width, this.height);
      
      const pLen = this.particles.length;
      const connectionMaxDist = this.settings.dist;

      // 1. Position Evaluation Matrix
      for (let i = 0; i < pLen; i++) {
        let p = this.particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Fluid Boundary Elasticity Locks
        if (p.x < 0 || p.x > this.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.height) p.vy *= -1;

        // Draw Synaptic Node Points
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = this.settings.dotColor;
        this.ctx.fill();

        // 2. Proportional Relational Line Connecting Matrix
        for (let j = i + 1; j < pLen; j++) {
          let p2 = this.particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionMaxDist) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            
            // Dynamic alpha gradient scaling based on spatial proximity
            const alphaFactor = (1 - (dist / connectionMaxDist)) * 0.15;
            this.ctx.strokeStyle = `rgba(0, 212, 178, ${alphaFactor})`;
            this.ctx.lineWidth = 0.6;
            this.ctx.stroke();
          }
        }
      }

      this.animationId = requestAnimationFrame(() => this.animate());
    }
  };

  // Safe Global Context Binding for template controllers
  window.NeuralBackgroundEngine = NeuralEngine;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => NeuralEngine.init());
  } else {
    NeuralEngine.init();
  }
})();
