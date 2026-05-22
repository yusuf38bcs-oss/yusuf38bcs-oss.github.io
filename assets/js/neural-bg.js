/**
 * Learning Biology For Life - Neural Background Engine
 * High-performance synaptic particle system with Retina support.
 */

(function() {
  "use strict";

  const NeuralEngine = {
    init() {
      this.canvas = document.getElementById("neural-network");
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext("2d");
      this.particles = [];
      this.ratio = window.devicePixelRatio || 1;
      
      // Dynamic Density Scaling
      this.settings = {
        count: window.innerWidth < 768 ? 40 : 85,
        dist: 150,
        speed: 0.5,
        dotColor: "rgba(62, 231, 182, 0.8)", // Synapse Glow
        lineColor: "rgba(124, 92, 255, 0.2)" // Neural Link
      };

      this.resize();
      this.createParticles();
      this.animate();

      window.addEventListener("resize", () => this.debouncedResize());
    },

    resize() {
      this.width = this.canvas.parentElement.offsetWidth;
      this.height = this.canvas.parentElement.offsetHeight;

      // Normalize for high-DPI displays
      this.canvas.width = this.width * this.ratio;
      this.canvas.height = this.height * this.ratio;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.ctx.scale(this.ratio, this.ratio);
    },

    debouncedResize() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.resize();
        this.createParticles();
      }, 250);
    },

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.settings.count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * this.settings.speed,
          vy: (Math.random() - 0.5) * this.settings.speed,
          r: Math.random() * 2 + 1
        });
      }
    },

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        let p = this.particles[i];

        // Update Position
        p.x += p.vx;
        p.y += p.vy;

        // Boundary Logic
        if (p.x < 0 || p.x > this.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.height) p.vy *= -1;

        // Draw Neural Node
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = this.settings.dotColor;
        this.ctx.fill();

        // Connect Synapses
        for (let j = i + 1; j < this.particles.length; j++) {
          let p2 = this.particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.settings.dist) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(124, 92, 255, ${1 - dist / this.settings.dist})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  };

  document.addEventListener("DOMContentLoaded", () => NeuralEngine.init());
})();