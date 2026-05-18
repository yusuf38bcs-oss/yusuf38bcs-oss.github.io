/**
 * Synaptic Bridge AI Core
 * Static frontend AI middleware for Jekyll + Cloudflare Worker + Gemini.
 */

(function () {
  "use strict";

  const DEFAULT_CONFIG = {
    endpoint: "https://synapticai-proxy.yusuf-38bcs.workers.dev",
    cooldownMs: 1200,
    maxRetries: 3,
    cacheEnabled: true,
    memoryEnabled: true,
    analytics: false,
    memoryKey: "synaptic_session_memory",
    cachePrefix: "synaptic_cache_",
    maxMemoryTurns: 3
  };

  const SynapticAI = {
    config: {},
    page: {},
    modules: {},
    requestQueue: [],
    isProcessing: false,
    lastCallTime: 0,
    booted: false,

    init() {
      const data = window.SynapticAI_Data || {};

      this.config = {
        ...DEFAULT_CONFIG,
        ...(data.config || {})
      };

      this.page = data.page || {
        title: document.title || "",
        excerpt: "",
        categories: []
      };

      this.booted = true;

      Object.keys(this.modules).forEach((id) => {
        const mod = this.modules[id];
        if (!mod.initialized && typeof mod.initFn === "function") {
          mod.initFn(this);
          mod.initialized = true;
        }
      });

      this.track("ai_core_booted", {
        page: this.page.title
      });
    },

    registerModule(id, initFn) {
      if (!id || typeof initFn !== "function") {
        console.warn("[SynapticAI] Invalid module registration.");
        return;
      }

      this.modules[id] = {
        initFn,
        initialized: false
      };

      if (this.booted) {
        initFn(this);
        this.modules[id].initialized = true;
      }
    },

    generate(options = {}) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push({
          options,
          resolve,
          reject
        });

        this._processQueue();
      });
    },

    async _processQueue() {
      if (this.isProcessing || this.requestQueue.length === 0) return;

      const now = Date.now();
      const elapsed = now - this.lastCallTime;

      if (elapsed < this.config.cooldownMs) {
        setTimeout(() => this._processQueue(), this.config.cooldownMs - elapsed);
        return;
      }

      this.isProcessing = true;

      const job = this.requestQueue.shift();

      try {
        const result = await this._execute(job.options);
        job.resolve(result);
      } catch (error) {
        const fallback = this.handleError(error, job.options);
        job.reject(fallback);
      } finally {
        this.lastCallTime = Date.now();
        this.isProcessing = false;

        if (this.requestQueue.length > 0) {
          this._processQueue();
        }
      }
    },

    async _execute(options) {
      const {
        model = "fast",
        type = "text",
        prompt = "",
        systemInstruction = "",
        useMemory = false,
        responseSchema = null,
        temperature = 0.7
      } = options;

      const memory = useMemory ? this.getMemoryText() : "";

      const enrichedPrompt = [
        `Page title: ${this.page.title || ""}`,
        this.page.excerpt ? `Page summary: ${this.page.excerpt}` : "",
        memory ? `Recent conversation:\n${memory}` : "",
        `User task:\n${prompt}`
      ]
        .filter(Boolean)
        .join("\n\n");

      const cacheKey = this._makeCacheKey({
        model,
        type,
        prompt: enrichedPrompt,
        systemInstruction,
        responseSchema,
        temperature
      });

      if (this.config.cacheEnabled) {
        const cached = this._getCache(cacheKey);
        if (cached) {
          this.track("cache_hit", { model, type });
          return cached;
        }
      }

      this.track("ai_request_started", { model, type });

      const payload = {
        model,
        type,
        prompt: enrichedPrompt,
        systemInstruction,
        responseSchema,
        temperature
      };

      const result = await this._fetchWithRetry(this.config.endpoint, payload);

      if (useMemory && result && !result.error) {
        this.remember(prompt, result.text || result.output || "");
      }

      if (this.config.cacheEnabled) {
        this._setCache(cacheKey, result);
      }

      this.track("ai_request_completed", { model, type });

      return result;
    },

    async _fetchWithRetry(url, payload) {
      let lastError = null;

      for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }

          return await response.json();
        } catch (error) {
          lastError = error;

          if (attempt < this.config.maxRetries) {
            const delay = Math.pow(2, attempt) * 1000;
            await this.sleep(delay);
          }
        }
      }

      throw lastError;
    },

    remember(userPrompt, modelResponse) {
      if (!this.config.memoryEnabled) return;

      const memory = this.getMemory();

      memory.push({
        user: userPrompt,
        assistant: modelResponse,
        timestamp: new Date().toISOString()
      });

      const sliced = memory.slice(-this.config.maxMemoryTurns);

      sessionStorage.setItem(this.config.memoryKey, JSON.stringify(sliced));
    },

    getMemory() {
      try {
        return JSON.parse(sessionStorage.getItem(this.config.memoryKey)) || [];
      } catch {
        return [];
      }
    },

    getMemoryText() {
      const memory = this.getMemory().slice(-this.config.maxMemoryTurns);

      return memory
        .map((turn, index) => {
          return `Turn ${index + 1}\nUser: ${turn.user}\nAssistant: ${turn.assistant}`;
        })
        .join("\n\n");
    },

    clearMemory() {
      sessionStorage.removeItem(this.config.memoryKey);
      this.track("memory_cleared", {});
    },

    _makeCacheKey(input) {
      const raw = JSON.stringify(input);

      try {
        return (
          this.config.cachePrefix +
          btoa(unescape(encodeURIComponent(raw))).substring(0, 48)
        );
      } catch {
        return this.config.cachePrefix + String(raw.length) + "_" + Date.now();
      }
    },

    _getCache(key) {
      try {
        const item = localStorage.getItem(key);
        if (!item) return null;

        const parsed = JSON.parse(item);

        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          localStorage.removeItem(key);
          return null;
        }

        return parsed.value;
      } catch {
        return null;
      }
    },

    _setCache(key, value, ttlMs = 1000 * 60 * 60 * 24) {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({
            value,
            expiresAt: Date.now() + ttlMs
          })
        );
      } catch {
        // Ignore storage quota errors.
      }
    },

    renderMarkdown(text) {
      if (!text) return "";

      if (window.marked && typeof window.marked.parse === "function") {
        return window.marked.parse(text);
      }

      return String(text)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/\n/g, "<br>");
    },

    handleError(error, context = {}) {
      console.error("[SynapticAI] Error:", error);

      this.track("ai_error", {
        message: error.message || "Unknown error",
        context
      });

      return {
        error: true,
        message: "Synaptic misfire. Please try again."
      };
    },

    track(eventName, payload = {}) {
      if (!this.config.analytics) return;

      window.dispatchEvent(
        new CustomEvent("synaptic-ai-event", {
          detail: {
            event: eventName,
            payload,
            timestamp: new Date().toISOString()
          }
        })
      );
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  };

  window.SynapticAI = SynapticAI;

  document.addEventListener("DOMContentLoaded", () => {
    SynapticAI.init();
  });
})();
