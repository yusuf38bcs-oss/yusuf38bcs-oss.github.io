(function () {
  "use strict";

  const QUESTIONS = [
    {
      text: "When facing a complex problem, I first try to understand the underlying principle.",
      trait: "Architect"
    },
    {
      text: "I naturally guide people toward a shared goal.",
      trait: "Catalyst"
    },
    {
      text: "I observe quietly before acting.",
      trait: "Observer"
    },
    {
      text: "I enjoy experimenting with unconventional ideas.",
      trait: "Explorer"
    },
    {
      text: "I feel responsible for maintaining harmony and support.",
      trait: "Steward"
    },
    {
      text: "I prefer clear systems, plans, and measurable progress.",
      trait: "Architect"
    },
    {
      text: "I energize others during uncertainty.",
      trait: "Catalyst"
    },
    {
      text: "I notice subtle emotional and behavioural patterns.",
      trait: "Observer"
    },
    {
      text: "I learn by trying, failing, and adapting quickly.",
      trait: "Explorer"
    },
    {
      text: "I protect the wellbeing of the group.",
      trait: "Steward"
    }
  ];

  const DESCRIPTIONS = {
    Architect:
      "You prefer structure, principles, systems, and long-range clarity. Your growth edge is acting before every variable is perfectly known.",
    Catalyst:
      "You mobilize energy, people, and momentum. Your growth edge is slowing down enough to listen deeply and refine direction.",
    Observer:
      "You detect patterns others miss. Your growth edge is sharing your insight before the moment passes.",
    Explorer:
      "You are adaptive, curious, and experimental. Your growth edge is sustaining focus after novelty fades.",
    Steward:
      "You create safety, continuity, and trust. Your growth edge is protecting your own needs while supporting others."
  };

  window.SynapticAI?.registerModule("personality-engine", function () {
    document.querySelectorAll("[data-personality-analysis]").forEach((root) => {
      const form = root.querySelector("[data-personality-form]");
      const result = root.querySelector("[data-personality-result]");

      renderForm();

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        const scores = {
          Architect: 0,
          Catalyst: 0,
          Observer: 0,
          Explorer: 0,
          Steward: 0
        };

        QUESTIONS.forEach((question, index) => {
          const value = Number(
            form.querySelector('input[name="p_' + index + '"]:checked')?.value || 0
          );

          scores[question.trait] += value;
        });

        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const dominant = sorted[0];
        const secondary = sorted[1];

        result.innerHTML = '<div class="quiz-card" style="padding:1.25rem;"><h3>Your Reflective Archetype</h3><p><strong>Primary:</strong> ' + dominant[0] + ' (' + dominant[1] + ' points)</p><p>' + DESCRIPTIONS[dominant[0]] + '</p><p><strong>Secondary influence:</strong> ' + secondary[0] + ' (' + secondary[1] + ' points)</p><h4>Trait Scores</h4><ul>' + sorted.map(function (entry) { return '<li>' + entry[0] + ': ' + entry[1] + '</li>'; }).join("") + '</ul><p>This is a reflective archetype tool for learning and self-awareness. It is not a psychological diagnosis.</p></div>';
      });

      function renderForm() {
        form.innerHTML = QUESTIONS.map(function (question, index) {
          return '<fieldset class="quiz-card" style="padding:1rem; margin-bottom:1rem;"><legend>' + (index + 1) + '. ' + question.text + '</legend><label><input type="radio" name="p_' + index + '" value="1" required> Strongly disagree</label> <label><input type="radio" name="p_' + index + '" value="2"> Disagree</label> <label><input type="radio" name="p_' + index + '" value="3"> Neutral</label> <label><input type="radio" name="p_' + index + '" value="4"> Agree</label> <label><input type="radio" name="p_' + index + '" value="5"> Strongly agree</label></fieldset>';
        }).join("") + '<button class="btn btn-primary" type="submit">Reveal My Archetype</button>';
      }
    });
  });
})();