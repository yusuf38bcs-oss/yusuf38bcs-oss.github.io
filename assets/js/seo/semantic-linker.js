/**
 * Learning Biology For Life - Semantic Linker Engine
 * Safely traverses the document DOM to dynamically convert core biological keywords
 * into premium tactile hyperlinks and semantic anchors without corrupting HTML attributes.
 */

(function() {
  "use strict";

  const SemanticLinker = {
    // Master Dictionary: Keywords mapped directly to internal paths or bridge nodes
    DICTIONARY: {
      "homeostasis": "/biology/homeostatic-systems/",
      "mitochondria": "/biology/molecular-architectures/",
      "nucleotide": "/biology/genetic-engineering/",
      "ecosystem": "/biology/ecological-monitoring/",
      "socratic": "/socratic-portal/",
      "synaptic": "/synaptic-bridge/"
    },

    init() {
      // Focus strictly on rendered markdown article zones to protect navigation elements
      this.targetContainer = document.querySelector(".page-rendered-markdown-body");
      if (!this.targetContainer) return;

      this.compileKeywords();
      this.executeLinkingPipeline();
    },

    /**
     * Pre-compiles vocabulary map into safe Regex boundaries for high performance rendering
     */
    compileKeywords() {
      const escapedTerms = Object.keys(this.DICTIONARY)
        .map(term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
        .join('|');
      
      // Case-insensitive matching locked precisely on word boundaries (\b)
      this.matchRegex = new RegExp(`\\b(${escapedTerms})\\b`, 'i');
    },

    /**
     * Safe TextNode Traversal Loop - Eradicates the lethal innerHTML string replacement bugs
     */
    executeLinkingPipeline() {
      const nodeWalker = document.createTreeWalker(
        this.targetContainer,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // Reject text nodes trapped inside active links, scripts, or interactive nodes
            const parentTag = node.parentElement ? node.parentElement.tagName.toLowerCase() : "";
            if (parentTag === "a" || parentTag === "script" || parentTag === "style" || parentTag === "button") {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      const nodesToProcess = [];
      let currentNode;

      // Capture all targeted text segments before alteration to prevent loop index mutation
      while (currentNode = nodeWalker.nextNode()) {
        if (this.matchRegex.test(currentNode.nodeValue)) {
          nodesToProcess.push(currentNode);
        }
      }

      // Process and insert semantic nodes cleanly
      nodesToProcess.forEach(node => this.transformTextToSemanticAnchor(node));
    },

    /**
     * Splits raw text nodes safely and injects premium styled sayan link objects
     */
    transformTextToSemanticAnchor(textNode) {
      const rawValue = textNode.nodeValue;
      const match = rawValue.match(this.matchRegex);
      if (!match) return;

      const matchedWord = match[0];
      const lowerWord = matchedWord.toLowerCase();
      const targetURL = this.DICTIONARY[lowerWord];
      if (!targetURL) return;

      const matchIndex = match.index;

      // Extract left and right text remnants safely
      const leftSlice = rawValue.substring(0, matchIndex);
      const rightSlice = rawValue.substring(matchIndex + matchedWord.length);

      const fragment = document.createDocumentFragment();

      if (leftSlice.length > 0) {
        fragment.appendChild(document.createTextNode(leftSlice));
      }

      // Create elite responsive anchor tag configuration
      const anchorNode = document.createElement("a");
      anchorNode.href = targetURL;
      anchorNode.className = "semantic-interactive-link";
      anchorNode.textContent = matchedWord;
      
      // Strict Inline Styles Enforced: Protecting mobile viewports from white-space distortion
      anchorNode.style.cssText = `
        color: #00d4b2 !important;
        text-decoration: none !important;
        font-weight: 700 !important;
        border-bottom: 1px dashed rgba(0, 212, 178, 0.4) !important;
        transition: all 0.2s ease !important;
        text-align: left !important;
        word-spacing: normal !important;
        letter-spacing: normal !important;
        display: inline-block;
      `;

      // Hover styling micro-interactions handled safely via JS triggers
      anchorNode.addEventListener("mouseenter", () => {
        anchorNode.style.color = "#ffffff";
        anchorNode.style.textShadow = "0 0 10px rgba(0,212,178,0.4)";
        anchorNode.style.borderBottomColor = "#00d4b2";
      });

      anchorNode.addEventListener("mouseleave", () => {
        anchorNode.style.color = "#00d4b2";
        anchorNode.style.textShadow = "none";
        anchorNode.style.borderBottomColor = "rgba(0, 212, 178, 0.4)";
      });

      fragment.appendChild(anchorNode);

      if (rightSlice.length > 0) {
        // Recursive loop fallback: check if the remaining text on right block contains more keywords
        const subsequentNode = document.createTextNode(rightSlice);
        fragment.appendChild(subsequentNode);
        
        if (this.matchRegex.test(rightSlice)) {
          setTimeout(() => this.transformTextToSemanticAnchor(subsequentNode), 0);
        }
      }

      // Swap out the old raw text node for our premium hyperlinked fragment object safely
      if (textNode.parentNode) {
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    }
  };

  // Secure Initialization Entry Point matching your Master main.js architecture
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => SemanticLinker.init());
  } else {
    SemanticLinker.init();
  }
})();
