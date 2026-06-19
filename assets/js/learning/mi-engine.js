/**
 * Learning Biology For Life - Dynamic MI Analysis Engine
 * Data source: _data/mi_questionnaire.yml rendered by Jekyll into data-mi-schema-json.
 */
(function () {
  "use strict";

  if (window.LBFL_MI_ENGINE_BOOTED) return;
  window.LBFL_MI_ENGINE_BOOTED = true;

  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeSelectorValue(value) {
    const text = String(value || "");
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(text);
    }
    return text.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
  }

  function safeURL(value) {
    const url = String(value || "").trim();
    if (!url) return "/matrix/multiple-intelligences/";
    if (url.startsWith("/")) return url;
    return "/matrix/multiple-intelligences/";
  }

  function readSchema(root) {
    const carrier = root.querySelector("[data-mi-schema-json]");
    const raw = carrier ? carrier.getAttribute("data-mi-schema-json") : "";

    try {
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (error) {
      console.warn("LBFL MI schema parse failed.", error);
    }

    if (Array.isArray(window.LBFL_MI_SCHEMA) && window.LBFL_MI_SCHEMA.length) {
      return window.LBFL_MI_SCHEMA;
    }

    return [];
  }

  function renderQuestionnaire(root, schema) {
    const zone = root.querySelector("[data-mi-question-zone]");
    if (!zone) return;

    zone.innerHTML = schema.map(function (item, index) {
      const name = escapeHTML(item.id || "mi_" + index);
      const title = escapeHTML(item.type || item.short_type || "Intelligence");
      const prompt = escapeHTML(item.socratic_prompt || "Reflect on this learning channel.");

      return [
        '<article class="mi-question-card">',
          '<span class="mi-eyebrow-tag">' + title + '</span>',
          '<h3 class="mi-question-text">' + (index + 1) + '. ' + prompt + '</h3>',
          '<div class="mi-options-vertical-stack" role="radiogroup" aria-label="' + title + ' score">',
            [1, 2, 3, 4, 5].map(function (score) {
              return '<label class="mi-radio-label-wrapper"><input class="mi-radio-input" type="radio" name="' + name + '" value="' + score + '" required><span>' + score + '</span></label>';
            }).join(""),
          '</div>',
          '<div class="mi-scale-labels-strip"><span>Rarely fits</span><span>Always fits</span></div>',
        '</article>'
      ].join("");
    }).join("");
  }

  function scoreSchema(form, schema) {
    return schema.map(function (item, index) {
      const id = item.id || "mi_" + index;
      const selected = form.querySelector('input[name="' + escapeSelectorValue(id) + '"]:checked');
      const score = selected ? Number(selected.value) : 0;
      return {
        id: id,
        type: item.type || item.short_type || "Intelligence",
        shortType: item.short_type || item.type || "Intelligence",
        score: Number.isFinite(score) ? score : 0,
        conceptURL: safeURL(item.concept_url),
        conceptID: item.concept_id || "multiple-intelligences",
        strategy: item.study_vector || "Review the related concept node and choose activities aligned with this learning channel."
      };
    }).sort(function (a, b) {
      return b.score - a.score;
    });
  }

  function renderResults(root, ranked) {
    const form = root.querySelector("[data-mi-form]");
    const result = root.querySelector("[data-mi-result]");
    const top = ranked.slice(0, 3);
    if (!form || !result) return;

    form.style.display = "none";
    result.style.display = "block";

    result.innerHTML = [
      '<h3 class="mi-result-title">Cognitive Spectrum Synthesized</h3>',
      '<div class="mi-result-grid">',
        top.map(function (item, index) {
          return [
            '<article class="mi-result-node ' + (index === 0 ? 'is-dominant' : '') + '">',
              '<div class="mi-result-node-header">',
                '<strong>' + (index + 1) + '. ' + escapeHTML(item.type) + '</strong>',
                '<span class="mi-score-chip">Score: ' + escapeHTML(item.score) + '/5</span>',
              '</div>',
              '<p class="mi-strategy-line"><strong>Learning vector:</strong> ' + escapeHTML(item.strategy) + '</p>',
              '<a class="mi-concept-link" href="' + escapeHTML(item.conceptURL) + '">Open Matrix Node</a>',
            '</article>'
          ].join("");
        }).join(""),
      '</div>',
      '<p class="mi-validation-note">This is a reflective educational audit, not a clinical or psychometric diagnosis. Use it to select better learning strategies inside Learning Biology For Life.</p>',
      '<div style="text-align:center;margin-top:1.5rem"><button type="button" class="mi-btn-calculate" data-mi-reset>Restart Audit</button></div>'
    ].join("");

    const reset = result.querySelector("[data-mi-reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        result.style.display = "none";
        form.style.display = "flex";
        form.reset();
        root.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    document.dispatchEvent(new CustomEvent("lbfl:mi-profile-generated", {
      detail: { top: top, all: ranked }
    }));
  }

  function setup(root) {
    if (root.dataset.miReady === "true") return;
    root.dataset.miReady = "true";

    const schema = readSchema(root);
    const form = root.querySelector("[data-mi-form]");
    const result = root.querySelector("[data-mi-result]");

    if (!schema.length || !form) {
      if (result) {
        result.style.display = "block";
        result.innerHTML = '<p class="mi-validation-note">MI schema could not be loaded. Please rebuild the Jekyll site and verify _data/mi_questionnaire.yml.</p>';
      }
      return;
    }

    renderQuestionnaire(root, schema);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      renderResults(root, scoreSchema(form, schema));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-mi-analysis]").forEach(setup);
  });
})();
