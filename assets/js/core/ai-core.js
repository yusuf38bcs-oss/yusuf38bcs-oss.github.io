/**
 * Synaptic AI - Global Production Core Engine v3.1
 * Finalized frontend for Cloudflare Worker proxy.
 */

(function() {
  "use strict";

  class SynapticAICore {
    constructor() {
      this.baseURL = "https://synapticai-proxy.yusuf-38bcs.workers.dev";
      this.isProcessing = false;
      this.memoryHistory = [];
      this.requestTimeout = 30000;
      this.version = "3.1.0";
    }

    async generate(options = {}) {
      if (this.isProcessing) {
        throw new Error("Core Operation Active: A biological inference track is currently being synthesized.");
      }

      const prompt = options.prompt ? String(options.prompt).trim() : "";
      if (!prompt) throw new Error("Null Prompt Paradox: Introspection query cannot be blank.");

      this.isProcessing = true;

      const systemInstruction = options.systemInstruction || "You are a Socratic biology tutor. Guide students using constructive left-aligned questions.";
      const useMemory = options.useMemory !== false;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

      try {
        const response = await fetch(`${this.baseURL}/api/gemini`, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "X-Synaptic-Version": this.version
          },
          body: JSON.stringify({
            prompt: prompt,
            systemInstruction: systemInstruction,
            history: useMemory ? this.memoryHistory.slice(-8) : []
          })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Neural Link Interrupted: HTTP Status ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.text || data.response || data.output || "";

        if (useMemory && generatedText) {
          this.memoryHistory.push({ role: "user", text: prompt });
          this.memoryHistory.push({ role: "ai", text: generatedText });
          if (this.memoryHistory.length > 40) {
            this.memoryHistory = this.memoryHistory.slice(-40);
          }
        }

        return {
          success: true,
          text: generatedText,
          output: generatedText
        };

      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error("Neural Link Timeout: The inference engine did not respond within the allocated window.");
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

    renderMarkdown(mdText) {
      if (!mdText || typeof mdText !== 'string') return "";

      let html = mdText.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[m]));

      const codeBlocks = [];
      html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
        const token = `__SYNAPTIC_CODE_${codeBlocks.length}__`;
        codeBlocks.push(code);
        return token;
      });

      const inlineCodes = [];
      html = html.replace(/`([^`]+?)`/g, (match, code) => {
        const token = `__SYNAPTIC_INLINE_${inlineCodes.length}__`;
        inlineCodes.push(code);
        return token;
      });

      const lines = html.split('\n');
      const blocks = [];
      let paraLines = [];
      let listItems = [];

      const flushParagraph = () => {
        if (paraLines.length === 0) return;
        let text = paraLines.join(' ').trim();
        paraLines = [];
        if (!text) return;
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#00d4b2; font-weight:700;">$1</strong>');
        blocks.push(`<p style="text-align:left; line-height:1.6; margin:0 0 1rem 0; color:#e2e8f0;">${text}</p>`);
      };

      const flushList = () => {
        if (listItems.length === 0) return;
        const items = listItems.map(item => {
          item = item.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#00d4b2; font-weight:700;">$1</strong>');
          return `<li class="console-li-item" style="text-align:left; color:#cbd5e1; margin-bottom:4px;">${item}</li>`;
        }).join('');
        blocks.push(`<ul style="text-align:left; padding-left:1.5rem; margin:0 0 1rem 0; list-style-position:outside;">${items}</ul>`);
        listItems = [];
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const headerMatch = line.match(/^(#{1,3})\s+(.*)$/);
        const listMatch = line.match(/^\*\s+(.*)$/);

        if (headerMatch) {
          flushParagraph();
          flushList();
          const level = headerMatch[1].length;
          let text = headerMatch[2].replace(/\*\*(.*?)\*\*/g, '<strong style="color:#00d4b2; font-weight:700;">$1</strong>');
          const size = level === 1 ? '1.75rem' : level === 2 ? '1.5rem' : '1.25rem';
          blocks.push(`<h${level} style="color:#00d4b2; font-size:${size}; margin:1.5rem 0 1rem 0; font-weight:700;">${text}</h${level}>`);
        } else if (listMatch) {
          flushParagraph();
          listItems.push(listMatch[1]);
        } else if (line.trim() === '') {
          flushParagraph();
          flushList();
        } else {
          flushList();
          paraLines.push(line.trim());
        }
      }

      flushParagraph();
      flushList();

      html = blocks.join('\n');

      html = html.replace(/__SYNAPTIC_INLINE_(\d+)__/g, (match, index) => {
        const code = inlineCodes[parseInt(index, 10)];
        return `<code style="background:rgba(0,212,178,0.1); color:#00d4b2; padding:2px 6px; border-radius:4px; font-family:'Courier New',monospace; font-size:0.9em;">${code}</code>`;
      });

      html = html.replace(/__SYNAPTIC_CODE_(\d+)__/g, (match, index) => {
        const code = codeBlocks[parseInt(index, 10)];
        return `<pre class="console-code-block" style="overflow-x:auto; background:#0f172a; border:1px solid rgba(0,212,178,0.2); border-radius:8px; padding:1rem; margin-bottom:1rem;"><code style="font-family:'Courier New',monospace; color:#a5f3fc; font-size:0.9rem; line-height:1.5;">${code}</code></pre>`;
      });

      return html;
    }
  }

  if (!window.SynapticAI) {
    window.SynapticAI = new SynapticAICore();
  }
})();
