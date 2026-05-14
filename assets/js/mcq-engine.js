(function () {
  "use strict";

  const MCQ_SCHEMA = {
    type: "object",
    properties: {
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            options: {
              type: "array",
              items: { type: "string" }
            },
            answerIndex: { type: "number" },
            explanation: { type: "string" },
            difficulty: { type: "string" },
            concept: { type: "string" }
          },
          required: [
            "question",
            "options",
            "answerIndex",
            "explanation",
            "difficulty",
            "concept"
          ]
        }
      }
    },
    required: ["questions"]
  };

  window.SynapticAI?.registerModule("mcq-engine", function (AI) {
    document.querySelectorAll("[data-mcq-arena]").forEach((root) => {
      const generateBtn = root.querySelector("[data-mcq-generate]");
      const quizBox = root.querySelector("[data-mcq-box]");
      const resultBox = root.querySelector("[data-mcq-result]");
      const timerBox = root.querySelector("[data-mcq-timer]");

      let quiz = [];
      let current = 0;
      let score = 0;
      let answers = [];
      let timeLeft = Number(root.dataset.timeLimit || 1200);
      let timerId = null;

      generateBtn?.addEventListener("click", async () => {
        quizBox.innerHTML = "Generating 20 MCQs...";
        resultBox.innerHTML = "";

        try {
          const result = await AI.generate({
            model: "fast",
            type: "json",
            responseSchema: MCQ_SCHEMA,
            temperature: 0.5,
            systemInstruction:
              "You are an expert biology examiner. Generate accurate, exam-oriented MCQs with clear explanations.",
            prompt:
              "Create exactly 20 MCQs from the current page. Each question must have exactly 4 options, one correct answer index from 0 to 3, explanation, difficulty, and tested concept."
          });

          const parsed = typeof result.text === "string" ? JSON.parse(result.text) : result;
          quiz = parsed.questions || [];

          if (quiz.length !== 20) {
            quiz = quiz.slice(0, 20);
          }

          current = 0;
          score = 0;
          answers = [];
          timeLeft = Number(root.dataset.timeLimit || 1200);

          startTimer();
          renderQuestion();
        } catch (error) {
          quizBox.innerHTML = "Could not generate quiz. Please try again.";
        }
      });

      function startTimer() {
        clearInterval(timerId);

        updateTimer();

        timerId = setInterval(() => {
          timeLeft--;
          updateTimer();

          if (timeLeft <= 0) {
            clearInterval(timerId);
            finishQuiz();
          }
        }, 1000);
      }

      function updateTimer() {
        if (!timerBox) return;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timerBox.textContent = "Time: " + minutes + ":" + String(seconds).padStart(2, "0");
      }

      function renderQuestion() {
        if (!quiz[current]) {
          finishQuiz();
          return;
        }

        const item = quiz[current];

        quizBox.innerHTML = '<div class="quiz-card" style="padding:1.25rem;"><p class="eyebrow">Question ' + (current + 1) + ' of ' + quiz.length + '</p><h3>' + escapeHtml(item.question) + '</h3><div>' + item.options.map(function (option, index) { return '<button class="quiz-option" data-option="' + index + '">' + String.fromCharCode(65 + index) + '. ' + escapeHtml(option) + '</button>'; }).join("") + '</div><div data-explanation style="margin-top:1rem;"></div></div>';

        quizBox.querySelectorAll("[data-option]").forEach((button) => {
          button.addEventListener("click", () => selectAnswer(Number(button.dataset.option)));
        });
      }

      function selectAnswer(selectedIndex) {
        const item = quiz[current];
        const correct = Number(item.answerIndex);
        const isCorrect = selectedIndex === correct;

        if (isCorrect) score++;

        answers.push({
          question: item.question,
          selectedIndex,
          correctIndex: correct,
          isCorrect,
          concept: item.concept,
          difficulty: item.difficulty
        });

        quizBox.querySelectorAll("[data-option]").forEach((button) => {
          const idx = Number(button.dataset.option);
          button.disabled = true;

          if (idx === correct) button.classList.add("correct");
          if (idx === selectedIndex && idx !== correct) button.classList.add("incorrect");
        });

        const explanation = quizBox.querySelector("[data-explanation]");
        explanation.innerHTML = '<strong>' + (isCorrect ? "Correct" : "Incorrect") + '.</strong> ' + escapeHtml(item.explanation) + '<br><br><button class="btn btn-primary" data-next-question>' + (current === quiz.length - 1 ? "Finish Quiz" : "Next Question") + '</button>';

        explanation.querySelector("[data-next-question]").addEventListener("click", () => {
          current++;
          renderQuestion();
        });
      }

      function finishQuiz() {
        clearInterval(timerId);

        const percentage = Math.round((score / quiz.length) * 100);
        const weakConcepts = answers
          .filter((answer) => !answer.isCorrect)
          .map((answer) => answer.concept);

        const analysis =
          percentage >= 85
            ? "Excellent conceptual command. You are ready for advanced application."
            : percentage >= 65
            ? "Good foundation. Revise the weak concepts and attempt one more round."
            : percentage >= 40
            ? "Partial understanding. Focus on definitions, mechanisms, and examples."
            : "Foundation needs rebuilding. Re-read the topic and make short notes before retrying.";

        quizBox.innerHTML = "";

        resultBox.innerHTML = '<div class="quiz-card" style="padding:1.25rem;"><h2>Quiz Complete</h2><p><strong>Score:</strong> ' + score + '/' + quiz.length + '</p><p><strong>Percentage:</strong> ' + percentage + '%</p><p><strong>Analysis:</strong> ' + analysis + '</p>' + (weakConcepts.length ? '<p><strong>Revise:</strong> ' + [...new Set(weakConcepts)].map(escapeHtml).join(", ") + '</p>' : '<p><strong>Revise:</strong> No major weak areas detected.</p>') + '</div>';
      }

      function escapeHtml(str) {
        return String(str || "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }
    });
  });
})();