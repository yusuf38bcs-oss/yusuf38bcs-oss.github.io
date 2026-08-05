/**
 * Synaptic AI - Global Production Core Engine v4.1
 * Frontend bridge for Learning Biology For Life.
 *
 * Security model:
 * - Browser calls only the Cloudflare Worker.
 * - Gemini remains the only public Socratic Mentor provider.
 * - OpenAI is not exposed through this public website bridge.
 * - Provider API keys remain inside Worker secrets; none are stored here.
 */
(function () {
  "use strict";

  const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost"]);
  const DEFAULT_LOCAL_ENDPOINT = "http://localhost:8787";
  const DEFAULT_PRODUCTION_ENDPOINT = "https://api.learningbiologyforlife.org";

  function normalizeEndpoint(endpoint) {
    if (!endpoint || typeof endpoint !== "string") return "";
    return endpoint.trim().replace(/\/+$/, "");
  }

  function resolveEndpoint() {
    const configured = window.LBFL_AI_ENDPOINT || window.SYNAPTIC_AI_ENDPOINT || window.SYNAPTIC_WORKER_ENDPOINT || "";
    const normalizedConfigured = normalizeEndpoint(configured);
    if (normalizedConfigured) return normalizedConfigured;

    if (LOCAL_HOSTS.has(window.location.hostname)) {
      return DEFAULT_LOCAL_ENDPOINT;
    }

    return DEFAULT_PRODUCTION_ENDPOINT;
  }

  function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function cleanForWorker(value, limit) {
    return String(value || "")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  class SynapticAICore {
    constructor() {
      this.baseURL = resolveEndpoint();
      this.isProcessing = false;
      this.memoryHistory = [];
      this.requestTimeout = 30000;
      this.version = "4.1.0";
    }

    get endpoint() {
      return this.baseURL;
    }

    setEndpoint(endpoint) {
      const normalizedEndpoint = normalizeEndpoint(endpoint);
      if (!normalizedEndpoint) {
        throw new Error("Invalid Synaptic endpoint: endpoint cannot be empty.");
      }
      this.baseURL = normalizedEndpoint;
      return this.baseURL;
    }

    async health() {
      const response = await fetch(`${this.baseURL}/api/health`, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Synaptic Worker health check failed: HTTP ${response.status}`);
      }

      return response.json().catch(function () {
        return { ok: true };
      });
    }

    async generate(options = {}) {
      if (this.isProcessing) {
        throw new Error("Core Operation Active: a biological inference track is already being synthesized.");
      }

      const prompt = options.prompt ? cleanForWorker(options.prompt, 2400) : "";
      if (!prompt) {
        throw new Error("Null Prompt Paradox: introspection query cannot be blank.");
      }

      this.isProcessing = true;

      const systemInstruction = cleanForWorker(
        options.systemInstruction || "Guide this learner through a concise Socratic biology response.",
        800
      );
      const useMemory = options.useMemory !== false;

      const controller = new AbortController();
      const timeoutId = window.setTimeout(function () {
        controller.abort();
      }, this.requestTimeout);

      try {
        const response = await fetch(`${this.baseURL}/api/socratic`, {
          method: "POST",
          mode: "cors",
          credentials: "omit",
          cache: "no-store",
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type: "socratic_reflex",
            anomaly_question: systemInstruction || "Guide this learner through a concise Socratic biology response.",
            student_hypothesis: prompt,
            page_context: window.location.pathname || "/biology/",
            attempt_count: 1
          })
        });

        window.clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = `Neural Link Interrupted: HTTP Status ${response.status}`;
          try {
            const errorPayload = await response.json();
            errorMessage = errorPayload.error || errorPayload.message || errorMessage;
          } catch (_ignored) {
            errorMessage = `${errorMessage}. Worker returned a non-JSON error response.`;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        const generatedText = data.feedback_text || data.text || data.response || data.output || data.answer || "";

        if (!generatedText) {
          throw new Error("Empty Inference: Worker returned no text output.");
        }

        if (useMemory) {
          this.memoryHistory.push({ role: "user", text: prompt });
          this.memoryHistory.push({ role: "ai", text: generatedText });
          if (this.memoryHistory.length > 40) {
            this.memoryHistory = this.memoryHistory.slice(-40);
          }
        }

        return {
          success: true,
          text: generatedText,
          output: generatedText,
          raw: data
        };
      } catch (error) {
        window.clearTimeout(timeoutId);

        if (error && error.name === "AbortError") {
          throw new Error("Neural Link Timeout: the inference engine did not respond within the allocated window.");
        }

        console.error("Synaptic AI Core Misfire Trace:", error);
        throw error;
      } finally {
        this.isProcessing = false;
      }
    }

    clearMemory() {
      this.memoryHistory = [];
      return true;
    }

    renderMarkdown(markdownText) {
      if (!markdownText || typeof markdownText !== "string") return "";

      let html = escapeHTML(markdownText);

      const codeBlocks = [];
      html = html.replace(/```([\s\S]*?)```/g, function (_match, code) {
        const token = `__SYNAPTIC_CODE_${codeBlocks.length}__`;
        codeBlocks.push(code);
        return token;
      });

      const inlineCodes = [];
      html = html.replace(/`([^`]+?)`/g, function (_match, code) {
        const token = `__SYNAPTIC_INLINE_${inlineCodes.length}__`;
        inlineCodes.push(code);
        return token;
      });

      const lines = html.split("\n");
      const blocks = [];
      let paragraphLines = [];
      let listItems = [];

      const formatInline = function (text) {
        return text
          .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#00d4b2; font-weight:700;">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
      };

      const flushParagraph = function () {
        if (paragraphLines.length === 0) return;
        const text = formatInline(paragraphLines.join(" ").trim());
        paragraphLines = [];
        if (!text) return;
        blocks.push(`<p style="text-align:left; line-height:1.6; margin:0 0 1rem 0; color:#e2e8f0;">${text}</p>`);
      };

      const flushList = function () {
        if (listItems.length === 0) return;
        const items = listItems.map(function (item) {
          return `<li class="console-li-item" style="text-align:left; color:#cbd5e1; margin-bottom:4px;">${formatInline(item)}</li>`;
        }).join("");
        blocks.push(`<ul style="text-align:left; padding-left:1.5rem; margin:0 0 1rem 0; list-style-position:outside;">${items}</ul>`);
        listItems = [];
      };

      lines.forEach(function (line) {
        const trimmed = line.trim();
        const headerMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
        const unorderedListMatch = trimmed.match(/^[-*]\s+(.*)$/);
        const orderedListMatch = trimmed.match(/^\d+\.\s+(.*)$/);

        if (headerMatch) {
          flushParagraph();
          flushList();
          const level = headerMatch[1].length;
          const text = formatInline(headerMatch[2]);
          const size = level === 1 ? "1.55rem" : level === 2 ? "1.32rem" : "1.12rem";
          blocks.push(`<h${level} style="color:#00d4b2; font-size:${size}; margin:1.25rem 0 0.75rem 0; font-weight:800; text-align:left;">${text}</h${level}>`);
        } else if (unorderedListMatch || orderedListMatch) {
          flushParagraph();
          listItems.push((unorderedListMatch || orderedListMatch)[1]);
        } else if (trimmed === "") {
          flushParagraph();
          flushList();
        } else {
          flushList();
          paragraphLines.push(trimmed);
        }
      });

      flushParagraph();
      flushList();

      html = blocks.join("\n");

      html = html.replace(/__SYNAPTIC_INLINE_(\d+)__/g, function (_match, index) {
        const code = escapeHTML(inlineCodes[Number(index)] || "");
        return `<code style="background:rgba(0,212,178,0.1); color:#00d4b2; padding:2px 6px; border-radius:4px; font-family:'Courier New',monospace; font-size:0.9em;">${code}</code>`;
      });

      html = html.replace(/__SYNAPTIC_CODE_(\d+)__/g, function (_match, index) {
        const code = escapeHTML(codeBlocks[Number(index)] || "");
        return `<pre class="console-code-block" style="overflow-x:auto; background:#0f172a; border:1px solid rgba(0,212,178,0.2); border-radius:8px; padding:1rem; margin-bottom:1rem; text-align:left;"><code style="font-family:'Courier New',monospace; color:#a5f3fc; font-size:0.9rem; line-height:1.5;">${code}</code></pre>`;
      });

      return html;
    }
  }

  if (!window.SynapticAI) {
    window.SynapticAI = new SynapticAICore();
  }

  window.SynapticAICore = SynapticAICore;
})();
