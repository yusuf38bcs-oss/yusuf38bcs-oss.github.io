/**
 * ====================================================================
 * THE SYNAPTIC BRIDGE: AI MIDDLEWARE ENGINE (v4.0)
 * File: assets/js/ai-core.js
 * Description: Elite orchestration, persistent caching, async queues,
 * secure proxy routing, and self-registering module architecture.
 * ====================================================================
 */

window.SynapticAI = (function() {
  'use strict';

  // ------------------------------------------------------------------
  // 1. PRIVATE STATE & CONSTANTS
  // ------------------------------------------------------------------
  const CACHE_PREFIX = 'synaptic_cache_';
  const MEMORY_KEY = 'synaptic_session_memory';
  
  let requestQueue = [];
  let isProcessing = false;
  let lastCallTime = 0;

  // ------------------------------------------------------------------
  // 2. CORE SYSTEM OBJECT
  // ------------------------------------------------------------------
  const Core = {
    config: {},
    page: {},
    modules: {}, // Registry for lazy-loaded UI modules
    sessionMemory: [], // Continuous conversation context
    
    // Security: Point this to your Cloudflare Worker!
    // NEVER expose the raw Google API url or Key here.
    apiProxyUrl: "https://synapticai-proxy.yusuf-38bcs.workers.dev", 

    /**
     * Bootstraps the environment and loads saved memory
     */
    init: function() {
      if (!window.SynapticAI_Data) {
        this.log('error', "Initialization failed: Global data payload missing.");
        return;
      }
      this.config = window.SynapticAI_Data.config;
      this.page = window.SynapticAI_Data.page;
      this.cooldownMs = (this.config.orchestration.cooldown_seconds || 5) * 1000;
      
      // Load continuous memory
      const savedMemory = sessionStorage.getItem(MEMORY_KEY);
      if (savedMemory) this.sessionMemory = JSON.parse(savedMemory);

      this.log('info', `Middleware Online (v${this.config.version}). Environment secured.`);
      
      // Initialize any modules that registered before core loaded
      Object.values(this.modules).forEach(mod => mod.initFn());
    },

    // ------------------------------------------------------------------
    // 3. PLUGIN ARCHITECTURE (Lazy Registration)
    // ------------------------------------------------------------------
    registerModule: function(id, initFn) {
      this.modules[id] = { initFn, active: true };
      this.log('info', `Module Registered: [${id}]`);
      // If core is already initialized, run it immediately
      if (this.config.version) initFn();
    },

    // ------------------------------------------------------------------
    // 4. OBSERVABILITY, ANALYTICS & ERRORS
    // ------------------------------------------------------------------
    log: function(level, msg, data = null) {
      const timestamp = new Date().toISOString();
      const format = `[SynapticAI:${level.toUpperCase()}] ${msg}`;
      if (level === 'error') console.error(format, data || '');
      else if (level === 'warn') console.warn(format, data || '');
      else console.log(format, data || '');
    },

    track: function(event, data) {
      if (!this.config.orchestration.analytics) return;
      // Hook this into Google Analytics, Plausible, or Mixpanel
      this.log('analytics', `Event: ${event}`, data);
    },

    handleError: function(err, context) {
      this.log('error', `Failure in [${context}]: ${err.message}`, err);
      this.track('ai_error', { context, error: err.message });
      return { error: true, message: "Synaptic misfire. Please try again." };
    },

    // ------------------------------------------------------------------
    // 5. ASYNC QUEUE & ORCHESTRATION
    // ------------------------------------------------------------------
    generate: function(moduleId, dynamicInput = "", useMemory = false) {
      return new Promise((resolve, reject) => {
        requestQueue.push({ moduleId, dynamicInput, useMemory, resolve, reject });
        this._processQueue();
      });
    },

    _processQueue: async function() {
      if (isProcessing || requestQueue.length === 0) return;
      
      const now = Date.now();
      if (now - lastCallTime < this.cooldownMs) {
        setTimeout(() => this._processQueue(), 500); // Wait and retry
        return;
      }

      isProcessing = true;
      const request = requestQueue.shift();

      try {
        const result = await this._executeMiddleware(request);
        request.resolve(result);
      } catch (err) {
        request.reject(this.handleError(err, request.moduleId));
      } finally {
        isProcessing = false;
        lastCallTime = Date.now();
        this._processQueue(); // Process next in line
      }
    },

    // ------------------------------------------------------------------
    // 6. MIDDLEWARE EXECUTION & CACHING
    // ------------------------------------------------------------------
    _executeMiddleware: async function({ moduleId, dynamicInput, useMemory }) {
      const moduleConfig = this.config.modules[moduleId];
      if (!moduleConfig || !moduleConfig.enabled) throw new Error("Module misconfigured.");

      // A. Prompt Assembly & Memory Injection
      let prompt = moduleConfig.prompt.replace('{title}', this.page.title).replace('{excerpt}', this.page.excerpt);
      if (useMemory && this.sessionMemory.length > 0) {
        prompt += `\n\nPrior Context: ${JSON.stringify(this.sessionMemory.slice(-3))}`; // Pass last 3 interactions
      }
      if (dynamicInput) prompt += `\n\nUser Input: ${dynamicInput}`;

      // B. Persistent Cache Check (localStorage)
      // Hash prompt to create a safe cache key
      const cacheHash = btoa(unescape(encodeURIComponent(prompt))).substring(0, 32);
      const cacheKey = `${CACHE_PREFIX}${moduleId}_${cacheHash}`;
      
      if (this.config.orchestration.cache_enabled) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          this.track('cache_hit', { module: moduleId });
          this.log('info', `Cache Hit: [${moduleId}]`);
          return JSON.parse(cached);
        }
      }

      // C. Routing & API Call with Retry Logic
      const modelAlias = moduleConfig.model;
      const actualModel = this.config.routing[modelAlias];
      
      this.track('ai_request_started', { module: moduleId, model: actualModel });
      const result = await this._fetchWithRetry(actualModel, prompt, moduleConfig.system, modelAlias, moduleConfig);

      // D. Memory & Cache Storage
      if (useMemory && dynamicInput && !result.error) {
        this.sessionMemory.push({ role: 'user', content: dynamicInput });
        this.sessionMemory.push({ role: 'model', content: result });
        sessionStorage.setItem(MEMORY_KEY, JSON.stringify(this.sessionMemory));
      }

      if (this.config.orchestration.cache_enabled && !result.error) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(result));
        } catch (e) {
          this.log('warn', "localStorage quota exceeded. Clearing old cache.");
          // Basic cache eviction could go here
        }
      }

      this.track('ai_request_success', { module: moduleId });
      return result;
    },

    // ------------------------------------------------------------------
    // 7. EXPONENTIAL BACKOFF RETRY LOGIC
    // ------------------------------------------------------------------
    _fetchWithRetry: async function(modelName, prompt, systemInstruction, modelType, moduleConfig, retries = 3) {
      let payload = { model: modelName, type: modelType, prompt, systemInstruction };
      if (modelType === "audio") payload.voice = moduleConfig.voice;

      for (let i = 0; i < retries; i++) {
        try {
          // Sending request to YOUR secure backend proxy, NOT Google directly.
          const response = await fetch(this.apiProxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          return data.result; // Proxy should standardize response format to { result: "..." }

        } catch (err) {
          this.log('warn', `Fetch attempt ${i + 1} failed.`, err);
          if (i === retries - 1) throw new Error("Maximum retries reached.");
          // Exponential backoff: 1s, 2s, 4s...
          await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i))); 
        }
      }
    },

    // ------------------------------------------------------------------
    // 8. ROBUST FORMATTING (marked.js Integration)
    // ------------------------------------------------------------------
    formatHTML: function(text) {
      if (!text) return "";
      // If marked.js is loaded via CDN in your layout, use it! Otherwise fallback.
      if (window.marked) {
        return window.marked.parse(text);
      }
      this.log('warn', "marked.js not found. Falling back to basic regex formatting.");
      return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>');
    }
  };

  return Core;
})();

// Bootstrap the system
document.addEventListener("DOMContentLoaded", () => {
  window.SynapticAI.init();
});