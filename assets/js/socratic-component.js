(function () {
  "use strict";

  const API_ENDPOINT = window.LBFL_AI_ENDPOINT || "/api/socratic";

  function getAttemptCount(form) {
    const current = Number(form.dataset.attemptCount || "0");
    return Number.isFinite(current) ? current : 0;
  }

  function setAttemptCount(form, value) {
    form.dataset.attemptCount = String(value);
  }

  function setLoading(button, isLoading) {
    if (!button) return;

    button.disabled = isLoading;
    button.dataset.originalText = button.dataset.originalText || button.textContent;
    button.textContent = isLoading ? "Synthesizing..." : button.dataset.originalText;
  }

  function renderFeedback(container, result) {
    if (!container) return;

    const feedbackBox = container.querySelector("[data-socratic-feedback]");
    if (!feedbackBox) return;

    feedbackBox.textContent = result.feedback_text || "No feedback received.";
    feedbackBox.dataset.mastery = result.mastery_achieved ? "true" : "false";

    if (result.next_vector) {
      const link = document.createElement("a");
      link.href = result.next_vector;
      link.textContent = "Continue learning pathway";
      link.className = "socratic-next-vector";
      feedbackBox.appendChild(document.createElement("br"));
      feedbackBox.appendChild(link);
    }
  }

  async function submitHypothesis(event) {
    const form = event.target.closest("[data-socratic-form]");
    if (!form) return;

    event.preventDefault();

    const container = form.closest("[data-socratic-node]");
    const button = form.querySelector("[type='submit']");
    const input = form.querySelector("[data-socratic-input]");
    const question = form.dataset.question || "";
    const hypothesis = input ? input.value.trim() : "";

    if (!hypothesis) {
      renderFeedback(container, {
        mastery_achieved: false,
        feedback_text: "Write your biological hypothesis first.",
        next_vector: ""
      });
      return;
    }

    const attemptCount = Math.min(getAttemptCount(form) + 1, 3);
    setAttemptCount(form, attemptCount);
    setLoading(button, true);

    const payload = {
      type: "socratic_reflex",
      anomaly_question: question,
      student_hypothesis: hypothesis,
      page_context: window.location.pathname,
      attempt_count: attemptCount
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Socratic Worker returned HTTP " + response.status);
      }

      const result = await response.json();
      renderFeedback(container, result);

      if (result.mastery_achieved === true) {
        document.dispatchEvent(
          new CustomEvent("lbfl:node-myelinated", {
            detail: { path: window.location.pathname }
          })
        );
      }
    } catch (error) {
      renderFeedback(container, {
        mastery_achieved: false,
        feedback_text: "The Socratic engine could not evaluate this response safely. Please try again.",
        next_vector: ""
      });
      console.error("[LBFL Socratic Error]", error);
    } finally {
      setLoading(button, false);
    }
  }

  document.addEventListener("submit", submitHypothesis);
})();
