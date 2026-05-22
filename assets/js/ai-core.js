/**
 * Synaptic AI - Production Core
 * Orchestrates the Socratic inquiry loop and secure proxy communication.
 */

class SynapticAI {
  constructor() {
    this.baseURL = "https://synapticai-proxy.yusuf-38bcs.workers.dev";
    this.isProcessing = false;
    this.history = [];
  }

  /**
   * Primary Socratic Inquiry Method
   * @param {string} prompt - The user's biological or reflective query
   * @param {string} workflow - The cognitive mode (socratic, academic, practice)
   */
  async askGemini(prompt, workflow = "socratic") {
    if (this.isProcessing) return;
    this.isProcessing = true;

    // 1. Inject Cognitive Context
    // Ensures the AI maintains its identity as a Socratic Biology mentor
    const contextPrompt = this.injectContext(prompt, workflow);

    try {
      const response = await fetch(`${this.baseURL}/api/gemini`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Synaptic-Version": "2.1.0"
        },
        body: JSON.stringify({
          prompt: contextPrompt,
          history: this.history.slice(-6) // Send only recent neural context
        })
      });

      if (!response.ok) throw new Error(`Neural Link Error: ${response.status}`);

      const data = await response.json();
      
      // 2. Update Neural History
      this.history.push({ role: "user", text: prompt });
      this.history.push({ role: "ai", text: data.response });

      return {
        success: true,
        response: data.response,
        workflow: workflow
      };

    } catch (error) {
      console.error("Synaptic AI Neural Link Failure:", error);
      return {
        success: false,
        error: "The synaptic connection was interrupted. Please try re-initiating the inquiry."
      };
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Prepends pedagogy instructions based on selected educational workflow.
   */
  injectContext(prompt, workflow) {
    const headers = {
      socratic: "As a Socratic Biology mentor, respond with a guiding question that connects this concept to systems thinking: ",
      academic: "Provide a detailed scientific explanation with biological citations for: ",
      practice: "Relate this biological mechanism to daily human behavior and life practice: "
    };
    return (headers[workflow] || headers.socratic) + prompt;
  }
}

// Global Singleton Initialization
window.synapticAI = new SynapticAI();

/**
 * UI Controller Integration
 * Binds the core AI logic to the floating widget UI.
 */
window.triggerInquiry = async function() {
  const inputEl = document.getElementById('ai-query');
  const chatBox = document.getElementById('ai-chat');
  const query = inputEl.value.trim();

  if (!query || window.synapticAI.isProcessing) return;

  // 1. Update UI - User Message
  chatBox.innerHTML += `<div class="chat-msg user-msg"><p>${query}</p></div>`;
  inputEl.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  // 2. Show Neural Loading State
  const loader = document.createElement('div');
  loader.className = 'ai-typing-indicator';
  loader.id = 'synaptic-loader';
  loader.innerHTML = '<span></span><span></span><span></span>';
  chatBox.appendChild(loader);

  // 3. Request Synthesis
  const result = await window.synapticAI.askGemini(query);

  // 4. Update UI - AI Response
  document.getElementById('synaptic-loader').remove();
  const responseClass = result.success ? 'ai-msg' : 'ai-msg error';
  const responseText = result.success ? result.response : result.error;

  chatBox.innerHTML += `<div class="chat-msg ${responseClass}"><p>${responseText}</p></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
};