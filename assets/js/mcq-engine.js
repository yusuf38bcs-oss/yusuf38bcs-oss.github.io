/* =========================================================
   Learning Biology For Life
   Synaptic Bridge — MCQ Arena Engine
   Production Architecture
========================================================= */

(function () {

  "use strict";

  /* ======================================================
     MCQ RESPONSE SCHEMA
  ====================================================== */

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

  /* ======================================================
     MODULE REGISTRATION
  ====================================================== */

  window.SynapticAI?.registerModule(
    "mcq-engine",
    function (AI) {

      document
        .querySelectorAll("[data-mcq-arena]")
        .forEach((root) => {

          /* ==================================================
             ELEMENTS
          ================================================== */

          const generateBtn =
            root.querySelector("[data-mcq-generate]");

          const quizBox =
            root.querySelector("[data-mcq-box]");

          const resultBox =
            root.querySelector("[data-mcq-result]");

          const timerBox =
            root.querySelector("[data-mcq-timer]");

          /* ==================================================
             STATE
          ================================================== */

          let quiz = [];

          let current = 0;

          let score = 0;

          let answers = [];

          let timeLeft =
            Number(root.dataset.timeLimit || 1200);

          let timerId = null;

          let generating = false;

          /* ==================================================
             CACHE
          ================================================== */

          function getCacheKey() {

            return (
              "mcq-cache-" +
              window.location.pathname
            );

          }

          function saveCache(data) {

            try {

              localStorage.setItem(
                getCacheKey(),
                JSON.stringify(data)
              );

            } catch (err) {

              console.warn(
                "MCQ cache save failed",
                err
              );

            }

          }

          function loadCache() {

            try {

              const cached =
                localStorage.getItem(
                  getCacheKey()
                );

              return cached
                ? JSON.parse(cached)
                : null;

            } catch (err) {

              return null;

            }

          }

          /* ==================================================
             ESCAPE HTML
          ================================================== */

          function escapeHtml(str) {

            return String(str || "")
              .replaceAll("&", "&amp;")
              .replaceAll("<", "&lt;")
              .replaceAll(">", "&gt;")
              .replaceAll('"', "&quot;")
              .replaceAll("'", "&#039;");

          }

          /* ==================================================
             VALIDATION
          ================================================== */

          function validateQuiz(data) {

            if (
              !data ||
              !Array.isArray(data.questions)
            ) {
              return [];
            }

            return data.questions.filter((q) => {

              return (

                typeof q.question === "string" &&

                Array.isArray(q.options) &&

                q.options.length === 4 &&

                typeof q.answerIndex === "number" &&

                typeof q.explanation === "string" &&

                typeof q.concept === "string"

              );

            });

          }

          /* ==================================================
             TIMER
          ================================================== */

          function updateTimer() {

            if (!timerBox) return;

            const minutes =
              Math.floor(timeLeft / 60);

            const seconds =
              timeLeft % 60;

            timerBox.textContent =
              `⏱️ Time: ${minutes}:${String(seconds)
                .padStart(2, "0")}`;

          }

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

          /* ==================================================
             AI GENERATION
          ================================================== */

          async function generateQuiz() {

            if (generating) return;

            generating = true;

            generateBtn.disabled = true;

            quizBox.innerHTML = `
              <div class="mcq-loading">
                <div class="spinner"></div>
                <p>Generating AI Questions...</p>
              </div>
            `;

            resultBox.innerHTML = "";

            /* ----------------------------------------------
               CACHE FIRST
            ---------------------------------------------- */

            const cached = loadCache();

            if (cached) {

              quiz = cached;

              initialiseQuiz();

              generating = false;

              generateBtn.disabled = false;

              return;

            }

            try {

              const result =
                await AI.generate({

                  model: "fast",

                  type: "json",

                  responseSchema: MCQ_SCHEMA,

                  temperature: 0.5,

                  systemInstruction:
                    "You are an expert biology examiner generating concept-based MCQs.",

                  prompt:
                    "Create exactly 20 biology MCQs from the current lesson. Each question must contain: question, 4 options, answerIndex (0-3), explanation, difficulty, and concept."

                });

              const parsed =
                typeof result.text === "string"
                  ? JSON.parse(result.text)
                  : result;

              quiz = validateQuiz(parsed);

              if (!quiz.length) {

                throw new Error(
                  "Invalid AI response"
                );

              }

              saveCache(quiz);

              initialiseQuiz();

            } catch (error) {

              console.error(error);

              quizBox.innerHTML = `
                <div class="quiz-error">
                  Could not generate quiz.
                  Please try again.
                </div>
              `;

            }

            generating = false;

            generateBtn.disabled = false;

          }

          /* ==================================================
             INITIALISE QUIZ
          ================================================== */

          function initialiseQuiz() {

            current = 0;

            score = 0;

            answers = [];

            timeLeft =
              Number(root.dataset.timeLimit || 1200);

            startTimer();

            renderQuestion();

          }

          /* ==================================================
             RENDER QUESTION
          ================================================== */

          function renderQuestion() {

            if (!quiz[current]) {

              finishQuiz();

              return;

            }

            const item = quiz[current];

            const wrapper =
              document.createElement("div");

            wrapper.className = "quiz-card";

            wrapper.style.padding = "1.25rem";

            /* ----------------------------------------------
               HEADER
            ---------------------------------------------- */

            const eyebrow =
              document.createElement("p");

            eyebrow.className = "eyebrow";

            eyebrow.textContent =
              `Question ${current + 1} of ${quiz.length}`;

            wrapper.appendChild(eyebrow);

            /* ----------------------------------------------
               QUESTION
            ---------------------------------------------- */

            const title =
              document.createElement("h3");

            title.textContent =
              item.question;

            wrapper.appendChild(title);

            /* ----------------------------------------------
               OPTIONS
            ---------------------------------------------- */

            item.options.forEach(
              (option, index) => {

                const button =
                  document.createElement("button");

                button.className =
                  "quiz-option";

                button.dataset.option =
                  index;

                button.setAttribute(
                  "role",
                  "button"
                );

                button.setAttribute(
                  "aria-label",
                  `Option ${index + 1}`
                );

                button.innerHTML =
                  `${String.fromCharCode(65 + index)}.
                  ${escapeHtml(option)}`;

                button.addEventListener(
                  "click",
                  () => selectAnswer(index)
                );

                wrapper.appendChild(button);

              }
            );

            /* ----------------------------------------------
               EXPLANATION
            ---------------------------------------------- */

            const explanation =
              document.createElement("div");

            explanation.dataset.explanation =
              "";

            explanation.style.marginTop =
              "1rem";

            wrapper.appendChild(explanation);

            quizBox.innerHTML = "";

            quizBox.appendChild(wrapper);

          }

          /* ==================================================
             ANSWER HANDLER
          ================================================== */

          function selectAnswer(selectedIndex) {

            const item = quiz[current];

            const correct =
              Number(item.answerIndex);

            const isCorrect =
              selectedIndex === correct;

            if (isCorrect) score++;

            answers.push({

              question: item.question,

              selectedIndex,

              correctIndex: correct,

              isCorrect,

              concept: item.concept,

              difficulty: item.difficulty

            });

            const buttons =
              quizBox.querySelectorAll(
                "[data-option]"
              );

            buttons.forEach((button) => {

              const idx =
                Number(button.dataset.option);

              button.disabled = true;

              if (idx === correct) {

                button.classList.add(
                  "correct"
                );

              }

              if (
                idx === selectedIndex &&
                idx !== correct
              ) {

                button.classList.add(
                  "incorrect"
                );

              }

            });

            const explanation =
              quizBox.querySelector(
                "[data-explanation]"
              );

            explanation.innerHTML = `
              <strong>
                ${isCorrect ? "Correct" : "Incorrect"}
              </strong>

              <p>${escapeHtml(item.explanation)}</p>

              <button
                class="btn btn-primary"
                data-next-question
              >
                ${
                  current === quiz.length - 1
                    ? "Finish Quiz"
                    : "Next Question"
                }
              </button>
            `;

            explanation
              .querySelector(
                "[data-next-question]"
              )
              .addEventListener("click", () => {

                current++;

                renderQuestion();

              });

          }

          /* ==================================================
             FINISH QUIZ
          ================================================== */

          function finishQuiz() {

            clearInterval(timerId);

            const percentage =
              Math.round(
                (score / quiz.length) * 100
              );

            const weakConcepts =
              answers
                .filter((a) => !a.isCorrect)
                .map((a) => a.concept);

            const analysis =
              percentage >= 85
                ? "Excellent conceptual command."
                : percentage >= 65
                ? "Good understanding with minor gaps."
                : percentage >= 40
                ? "Partial understanding detected."
                : "Foundation requires revision.";

            quizBox.innerHTML = "";

            resultBox.innerHTML = `
              <div class="quiz-card" style="padding:1.25rem;">

                <h2>🎯 Quiz Complete</h2>

                <p>
                  <strong>Score:</strong>
                  ${score}/${quiz.length}
                </p>

                <p>
                  <strong>Percentage:</strong>
                  ${percentage}%
                </p>

                <p>
                  <strong>Analysis:</strong>
                  ${analysis}
                </p>

                <p>
                  <strong>Weak Concepts:</strong>
                  ${
                    weakConcepts.length
                      ? [...new Set(weakConcepts)]
                          .map(escapeHtml)
                          .join(", ")
                      : "No major weak areas detected."
                  }
                </p>

              </div>
            `;

          }

          /* ==================================================
             INIT
          ================================================== */

          generateBtn?.addEventListener(
            "click",
            generateQuiz
          );

        });

    }

  );

})();
