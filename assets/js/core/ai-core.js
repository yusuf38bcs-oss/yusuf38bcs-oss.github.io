/**
 * Synaptic AI - Global Production Core Engine
 * Orchestrates the Socratic Inquiry Pipeline, Async Streaming, Memory Tracking, and Contextual Markdown Synthesis.
 * Fully synchronized with window.SynapticAI call nodes across all site front-end layers.
 */

(function() {
  "use strict";

  class SynapticAICore {
    constructor() {
      // Cloudflare Workers secure gateway proxy infrastructure
      this.baseURL = "https://synapticai-proxy.yusuf-38bcs.workers.dev";
      this.isProcessing = false;
      this.memoryHistory = [];
    }

    /**
     * Core Execution Hook mapping perfectly to front-end layout configurations
     * @param {Object} options - Parameter parameters containing model, useMemory, systemInstruction, prompt
     */
    async generate(options = {}) {
      if (this.isProcessing) {
        throw new Error("Core Operation Active: A biological inference track is currently being synthesized.");
      }

      const prompt = options.prompt ? options.prompt.trim() : "";
      if (!prompt) throw new Error("Null Prompt Paradox: Introspection query cannot be blank.");

      this.isProcessing = true;

      // Sync system instructions and apply active workflow memory filters
      const systemInstruction = options.systemInstruction || "You are a Socratic biology tutor. Guide students using constructive left-aligned questions.";
      const useMemory = options.useMemory !== false;

      try {
        const response = await fetch(`${this.baseURL}/api/gemini`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Synaptic-Version": "3.0.0"
          },
          body: JSON.stringify({
            prompt: prompt,
            systemInstruction: systemInstruction,
            history: useMemory ? this.memoryHistory.slice(-8) : [] // Send structured neural history arrays safely
          })
        });

        if (!response.ok) throw new Error(`Neural Link Interrupted: HTTP Status ${response.status}`);

        const data = await response.json();
        const generatedText = data.text || data.response || data.output || "";

        if (useMemory && generatedText) {
          this.memoryHistory.push({ role: "user", text: prompt });
          this.memoryHistory.push({ role: "ai", text: generatedText });
        }

        return {
          success: true,
          text: generatedText,
          output: generatedText
        };

      } catch (error) {
        console.error("🔒 Synaptic AI Core Misfire Trace:", error);
        throw error;
      } finally {
        this.isProcessing = false;
      }
    }

    /**
     * Clears active session tracking parameters
     */
    clearMemory() {
      this.memoryHistory = [];
      return true;
    }

    /**
     * Embedded Lightweight Fast Markdown Parser Rendering Raw Text into Secure Left-Aligned HTML Paragraphs
     * Ensures clean typography layout configurations for mobile smartphones
     * @param {string} mdText - Raw markdown text payload returned from Worker proxy
     */
    renderMarkdown(mdText) {
      if (!mdText) return "";
      
      let html = mdText.trim();

      // Clear potential malicious script vectors safely
      html = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "");

      // 1. Process Code Blocks Cleanly
      html = html.replace(/```([\s\S]*?)```/g, '<pre class="console-code-block"><code>$1</code></pre>');

      // 2. Process Bold Elements Metric
      html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong style="color:#00d4b2; font-weight:700;">$1</strong>');

      // 3. Process Bullet Lists Framework
      html = html.replace(/^\*\s+(.*)$/gim, '<li class="console-li-item" style="text-align:left; color:#cbd5e1; margin-bottom:4px; padding-left:4px;">➔ $1</li>');

      // 4. Wrap Isolated Text Rows Into Beautiful, Strict Left-Aligned Paragraph blocks
      const rows = html.split("\n\n");
      const configuredParagraphs = rows.map(row => {
        if (row.trim().startsWith("<pre") || row.trim().startsWith("<li")) return row;
        return `<p style="text-align:left !important; word-spacing:normal !important; line-height:1.6 !important; margin:0 0 1rem 0; color:#e2e8f0;">${row}</p>`;
      });

      return configuredParagraphs.join("");
    }
  }

  // Initializing Global Object Instance linked to your layout sheets
  window.SynapticAI = new SynapticAICore();
})();
