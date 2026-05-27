---
layout: single
title: "Ecosystem Contact Portal"
permalink: /contact/
author_profile: true
classes: wide
---

<section class="contact-system-section">
  <div class="contact-grid-container">
    
    <div class="contact-details-panel">
      <span class="portal-badge">Communications Hub</span>
      <h2 style="color: #ffffff; font-weight: 800; letter-spacing: -0.02em;">Connect Your Dots of Inquiry</h2>
      <p>Reach out to our educational ecosystem framework for academic coordination, research alignment, or platform assistance.</p>
      
      <div class="channel-card-group">
        <div class="channel-card">
          <div class="channel-icon" aria-hidden="true">🌐</div>
          <div class="channel-meta">
            <h4>General & Research Portal</h4>
            <p>For administrative data, academic writing collaborations, and cadre networking.</p>
            <code>info@learningbiologyforlife.org</code>
          </div>
        </div>

        <div class="channel-card">
          <div class="channel-icon" aria-hidden="true">🛠️</div>
          <div class="channel-meta">
            <h4>Student & Technical Support</h4>
            <p>For MCQ Arena validation errors, MI diagnostic glitches, or subscription changes.</p>
            <code>support@learningbiologyforlife.org</code>
          </div>
        </div>
      </div>

      <div class="institutional-marker" aria-hidden="true">● ━━ ◯ ━━ ✕</div>
    </div>

    <div class="contact-form-panel">
      <form action="https://formspree.io/f/placeholder" method="POST" class="secure-ecosystem-form">
        
        <div class="form-row">
          <label for="user-name">Full Name</label>
          <input type="text" id="user-name" name="name" placeholder="Enter your name" required autocomplete="name">
        </div>

        <div class="form-row">
          <label for="user-email">Email Address</label>
          <input type="email" id="user-email" name="_replyto" placeholder="yourname@domain.com" required autocomplete="email">
        </div>

        <div class="form-row">
          <label for="routing-channel">Inquiry Classification</label>
          <div class="select-style-wrapper">
            <select id="routing-channel" name="department" required>
              <option value="" disabled selected>Select department channel...</option>
              <option value="info">General Info & Collaboration Framework (info@)</option>
              <option value="support">Student Support & Diagnostic Assistance (support@)</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label for="user-message">Message Context</label>
          <textarea id="user-message" name="message" rows="5" placeholder="Write your message here cleanly..." required></textarea>
        </div>

        <div class="form-action-strip">
          <button type="submit" class="portal-submit-btn">DISPATCH MESSAGE</button>
        </div>
      </form>
    </div>

  </div>
</section>

<style>
  .contact-system-section {
    background-color: #030712;
    padding: 2rem 0;
    color: #ffffff;
    width: 100%;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .contact-grid-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 3rem;
    align-items: flex-start;
  }
  .portal-badge {
    background: rgba(0, 212, 178, 0.08);
    border: 1px solid rgba(0, 212, 178, 0.25);
    color: #00d4b2;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.4rem 1rem;
    border-radius: 4px;
    width: fit-content;
    margin-bottom: 1.25rem;
    display: inline-block;
  }
  .contact-details-panel h2 {
    font-size: 2.2rem;
    margin: 0 0 1rem 0;
    line-height: 1.25;
  }
  .contact-details-panel p {
    color: #94a3b8;
    font-size: 1.05rem;
    line-height: 1.6;
    margin: 0 0 2.5rem 0;
  }
  .channel-card-group {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .channel-card {
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    padding: 1.5rem;
    display: flex;
    gap: 1.2rem;
    align-items: flex-start;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  .channel-icon {
    font-size: 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.02);
  }
  .channel-meta h4 {
    margin: 0 0 0.35rem 0;
    font-size: 1.1rem;
    color: #ffffff;
    font-weight: 700;
  }
  .channel-meta p {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: #94a3b8;
    line-height: 1.5;
  }
  .channel-meta code {
    color: #00d4b2;
    background: rgba(0, 212, 178, 0.05);
    border: 1px solid rgba(0, 212, 178, 0.15);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: monospace;
  }
  .institutional-marker {
    font-size: 0.85rem;
    color: rgba(0, 212, 178, 0.3);
    letter-spacing: 0.1em;
    margin-top: 2.5rem;
    font-weight: 700;
  }

  /* Secure Container Gateway Form Styles */
  .secure-ecosystem-form {
    background: #0f172a;
    border: 1px solid rgba(0, 212, 178, 0.15);
    border-radius: 12px;
    padding: 2.25rem 2rem;
    box-shadow: 0 15px 35px rgba(0,0,0,0.4);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .form-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;
  }
  .form-row label {
    font-size: 0.9rem;
    font-weight: 700;
    color: #cbd5e1;
  }
  .form-row input, .form-row select, .form-row textarea {
    background: #070a13;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 0.85rem 1rem;
    color: #ffffff;
    font-family: inherit;
    font-size: 0.95rem;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    -webkit-appearance: none;
  }
  .form-row input:focus, .form-row select:focus, .form-row textarea:focus {
    border-color: #00d4b2;
    box-shadow: 0 0 10px rgba(0, 212, 178, 0.15);
  }
  .select-style-wrapper {
    position: relative;
    width: 100%;
  }
  .select-style-wrapper::after {
    content: "▼";
    font-size: 0.7rem;
    color: #64748b;
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
  .portal-submit-btn {
    background: #00d4b2;
    color: #020617;
    font-weight: 700;
    letter-spacing: 0.05em;
    border: none;
    padding: 0.9rem;
    border-radius: 6px;
    width: 100%;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    font-size: 0.95rem;
    box-shadow: 0 4px 12px rgba(0, 212, 178, 0.2);
  }
  .portal-submit-btn:hover {
    background: #00bfa2;
  }
  .portal-submit-btn:active {
    transform: scale(0.99);
  }

  /* Responsive Viewport Alignment System Breakpoints */
  @media (max-width: 768px) {
    .contact-grid-container {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
    .secure-ecosystem-form {
      padding: 1.5rem 1.25rem;
    }
  }
</style>
