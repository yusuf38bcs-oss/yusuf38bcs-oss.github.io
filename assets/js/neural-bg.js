/**
 * =========================================================
 * SYNAPTIC NEURAL BACKGROUND SYSTEM
 * File: assets/js/neural-bg.js
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("neural-network");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let width;
  let height;
  let particles = [];

  const PARTICLE_COUNT = window.innerWidth < 768 ? 45 : 90;
  const MAX_DISTANCE = 140;

  // -------------------------------------------------------
  // Resize Canvas
  // -------------------------------------------------------

  function resizeCanvas() {
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;

    canvas.width = width;
    canvas.height = height;
  }

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  // -------------------------------------------------------
  // Particle Class
  // -------------------------------------------------------

  class Particle {

    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;

      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;

      this.radius = Math.random() * 2.2 + 1;
    }

    update() {

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) {
        this.vx *= -1;
      }

      if (this.y < 0 || this.y > height) {
        this.vy *= -1;
      }
    }

    draw() {

      ctx.beginPath();

      ctx.arc(
        this.x,
        this.y,
        this.radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "rgba(62, 231, 182, 0.9)";

      ctx.shadowColor = "rgba(62, 231, 182, 0.9)";
      ctx.shadowBlur = 10;

      ctx.fill();

      ctx.closePath();
    }
  }

  // -------------------------------------------------------
  // Create Particles
  // -------------------------------------------------------

  function createParticles() {

    particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  createParticles();

  // -------------------------------------------------------
  // Draw Synaptic Connections
  // -------------------------------------------------------

  function connectParticles() {

    for (let a = 0; a < particles.length; a++) {

      for (let b = a + 1; b < particles.length; b++) {

        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < MAX_DISTANCE) {

          const opacity = 1 - distance / MAX_DISTANCE;

          ctx.beginPath();

          ctx.moveTo(
            particles[a].x,
            particles[a].y
          );

          ctx.lineTo(
            particles[b].x,
            particles[b].y
          );

          ctx.strokeStyle =
            `rgba(124, 92, 255, ${opacity * 0.5})`;

          ctx.lineWidth = 1;

          ctx.stroke();

          ctx.closePath();
        }
      }
    }
  }

  // -------------------------------------------------------
  // Animation Loop
  // -------------------------------------------------------

  function animate() {

    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    connectParticles();

    requestAnimationFrame(animate);
  }

  animate();

});
