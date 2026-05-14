(function () {
  "use strict";

  const MI_ITEMS = [
    {
      intelligence: "Linguistic",
      prompt: "I understand ideas best through words, reading, writing, or discussion."
    },
    {
      intelligence: "Logical-Mathematical",
      prompt: "I enjoy patterns, reasoning, experiments, numbers, and problem solving."
    },
    {
      intelligence: "Spatial",
      prompt: "I learn well through diagrams, images, maps, and visual organization."
    },
    {
      intelligence: "Bodily-Kinesthetic",
      prompt: "I understand better when movement, models, hands-on practice, or physical activity is involved."
    },
    {
      intelligence: "Musical",
      prompt: "Rhythm, sound, tone, or music helps me remember and understand ideas."
    },
    {
      intelligence: "Interpersonal",
      prompt: "I learn strongly through teamwork, teaching others, debate, or social interaction."
    },
    {
      intelligence: "Intrapersonal",
      prompt: "Reflection, journaling, solitude, and self-analysis help me learn deeply."
    },
    {
      intelligence: "Naturalistic",
      prompt: "I notice patterns in nature, organisms, ecosystems, and classification systems."
    }
  ];

  window.SynapticAI?.registerModule("mi-engine", function () {
    document.querySelectorAll("[data-mi-analysis]").forEach((root) => {
      const form = root.querySelector("[data-mi-form]");
      const result = root.querySelector("[data-mi-result]");

      renderForm();

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        const scores = {};

        MI_ITEMS.forEach((item, index) => {
          const value = Number(
            form.querySelector('input[name="mi_' + index + '"]:checked')?.value || 0
          );

          scores[item.intelligence] = value;
        });

        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const top = sorted.slice(0, 3);

        result.innerHTML = renderResult(scores, top);
      });

      function renderForm() {
        form.innerHTML = MI_ITEMS.map(function (item, index) {
          return '<fieldset class="quiz-card" style="padding:1rem; margin-bottom:1rem;"><legend><strong>' + item.intelligence + '</strong></legend><p>' + item.prompt + '</p><label><input type="radio" name="mi_' + index + '" value="1" required> Rarely</label> <label><input type="radio" name="mi_' + index + '" value="2"> Sometimes</label> <label><input type="radio" name="mi_' + index + '" value="3"> Often</label> <label><input type="radio" name="mi_' + index + '" value="4"> Very often</label> <label><input type="radio" name="mi_' + index + '" value="5"> Almost always</label></fieldset>';
        }).join("") + '<button class="btn btn-primary" type="submit">Analyse My Learning Pattern</button>';
      }

      function renderResult(scores, top) {
        const recommendations = {
          Linguistic: "Use summaries, analogies, debate notes, flashcards, and teaching scripts.",
          "Logical-Mathematical": "Use flowcharts, formulas, causal chains, data tables, and problem sets.",
          Spatial: "Use diagrams, mind maps, labelled sketches, colour coding, and visual memory palaces.",
          "Bodily-Kinesthetic": "Use models, lab activities, gesture-based recall, and real-world demonstrations.",
          Musical: "Use rhythm, mnemonics, recitation, and audio summaries.",
          Interpersonal: "Use group discussion, peer teaching, oral quizzes, and collaborative projects.",
          Intrapersonal: "Use reflection journals, private questioning, goal tracking, and self-testing.",
          Naturalistic: "Use classification, field examples, organism comparisons, and ecological analogies."
        };

        return '<div class="quiz-card" style="padding:1.25rem;"><h3>Your Dominant Learning Channels</h3><ol>' + top.map(function (entry) { return '<li><strong>' + entry[0] + '</strong>: ' + entry[1] + '/5<br>' + recommendations[entry[0]] + '</li>'; }).join("") + '</ol><h4>All Scores</h4><ul>' + Object.entries(scores).map(function (entry) { return '<li>' + entry[0] + ': ' + entry[1] + '/5</li>'; }).join("") + '</ul><p>This is a reflective learning profile, not a fixed label. Strong learners often combine several intelligences depending on the task.</p></div>';
      }
    });
  });
})();