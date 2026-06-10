---
permalink: /contact/
title: "Contact Us"
layout: single
author_profile: true
---

We would love to hear from you! Whether you have questions about a specific biological concept, digital pedagogy, or the Synaptic Bridge, drop a message below.

<div data-fs-success class="notice--success" style="display:none;"><strong>Success!</strong> Your message has been sent safely.</div>
<div data-fs-error class="notice--danger" style="display:none;"></div>

<form id="my-form" class="form">
  <div class="form-group" style="margin-bottom: 15px;">
    <label for="email"><strong>Email Address</strong></label>
    <input type="email" id="email" name="email" data-fs-field required style="width: 100%; padding: 8px;" />
    <span data-fs-error="email" style="color:red; font-size:14px;"></span>
  </div>

  <div class="form-group" style="margin-bottom: 15px;">
    <label for="message"><strong>Your Message</strong></label>
    <textarea id="message" name="message" rows="6" data-fs-field required style="width: 100%; padding: 8px;"></textarea>
    <span data-fs-error="message" style="color:red; font-size:14px;"></span>
  </div>

  <button type="submit" class="btn btn--primary btn--large" data-fs-submit-btn>Send Message</button>
</form>

<script>
  window.formspree = window.formspree || function () { (formspree.q = formspree.q || []).push(arguments); };
  formspree('initForm', { formElement: '#my-form', formId: 'mgodyrbq' });
</script>
<script src="https://unpkg.com/@formspree/ajax@1" defer></script>
