---
layout: home
title: "Ecosystem Contact Portal"
permalink: /contact/
---

<section class="contact-system-section">
  <div class="contact-grid-container">
    
    <div class="contact-details-panel">
      <span class="portal-badge">Communications Hub</span>
      <h2>Connect Your Dots of Inquiry</h2>
      <p>Reach out to our educational ecosystem framework for academic coordination, research alignment, or platform assistance.</p>
      
      <div class="channel-card-group">
        <div class="channel-card">
          <div class="channel-icon">🌐</div>
          <div class="channel-meta">
            <h4>General & Research Portal</h4>
            <p>For administrative data, academic writing collaborations, and cadre networking.</p>
            <code>info@learningbiologyforlife.org</code>
          </div>
        </div>

        <div class="channel-card">
          <div class="channel-icon">🛠️</div>
          <div class="channel-meta">
            <h4>Student & Technical Support</h4>
            <p>For MCQ Arena validation errors, MI diagnostic glitches, or subscription changes.</p>
            <code>support@learningbiologyforlife.org</code>
          </div>
        </div>
      </div>

      <div class="institutional-marker">● ━ ◯</div>
    </div>

    <div class="contact-form-panel">
      <form action="https://formspree.io/f/placeholder" method="POST" class="secure-ecosystem-form">
        
        <div class="form-row">
          <label for="user-name">Full Name</label>
          <input type="text" id="user-name" name="name" placeholder="Enter your name" required />
        </div>

        <div class="form-row">
          <label for="user-email">Email Address</label>
          <input type="email" id="user-email" name="_replyto" placeholder="yourname@domain.com" required />
        </div>

        <div class="form-row">
          <label for="routing-channel">Inquiry Classification</label>
          <select id="routing-channel" name="department" required>
            <option value="info">General Info & Collaboration Framework (info@)</option>
            <option value="support">Student Support & Diagnostic Assistance (support@)</option>
          </select>
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
    background-color: #070b12;
    padding: clamp(3rem, 6vw, 5rem) 1.5rem;
    color: #ffffff;
    width: 100%;
    box-sizing: border-box;
  }
  .contact-grid-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 5vw, 4rem);
    align-items: flex-start;
  }
  .portal-badge {
    background: rgba(0, 212, 178, 0.12);
    border: 1px solid rgba(0, 212, 178, 0.3);
    color: #00d4b2;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding: 0.4rem 1rem;
    border-radius: 50px;
    width: fit-content;
    margin-bottom: 1rem;
    display: inline-block;
  }
  .contact-details-panel h2 {
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 800;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }
  .contact-details-panel p {
    color: #94a3b8;
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0 0 2rem 0;
  }
  .channel-card-group {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .channel-card {
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    gap: 1.2rem;
    align-items: flex-start;
  }
  .channel-icon {
    font-size: 1.5rem;
    background: rgba(255,255,255,0.04);
    padding: 0.5rem;
    border-radius: 8px;
  }
  .channel-meta h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    color: #ffffff;
  }
  .channel-meta p {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #94a3b8;
    line-height: 1.4;
  }
  .channel-meta code {
    color: #00d4b2;
    font-size: 0.95rem;
    font-weight: 600;
  }
  .institutional-marker {
    font-size: 1.2rem;
    color: #9d4edd;
    letter-spacing: 4px;
    margin-top: 2rem;
  }

  /* ফর্ম এলিমেন্ট স্টাইলিং */
  .secure-ecosystem-form {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: clamp(1.5rem, 4vw, 2.5rem);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
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
    font-size: 0.95rem;
    font-weight: 600;
    color: #cbd5e1;
  }
  .form-row input, .form-row select, .form-row textarea {
    background: #070b12;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 0.85rem 1rem;
    color: #ffffff;
    font-family: inherit;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.25s;
  }
  .form-row input:focus, .form-row select:focus, .form-row textarea:focus {
    border-color: #00d4b2;
    outline: none;
  }
  .portal-submit-btn {
    background: #00d4b2;
    color: #020617;
    font-weight: 700;
    letter-spacing: 1px;
    border: none;
    padding: 1rem;
    border-radius: 50px;
    width: 100%;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 12px rgba(0, 212, 178, 0.2);
  }
  .portal-submit-btn:hover {
    background: #00f2cc;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 212, 178, 0.3);
  }

  @media (max-width: 992px) {
    .contact-grid-container {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }
</style>
