/**
 * Learning Biology For Life - Synaptic Breadcrumb & SEO Engine
 * Dynamically parses path vectors, builds W3C-compliant accessible breadcrumb trails,
 * and synchronizes semantic tracking matrices for search engine crawlers.
 */

(function() {
  "use strict";

  const BreadcrumbEngine = {
    init() {
      // Target container element hook matching your page sheets
      this.container = document.querySelector("[data-breadcrumb-container]");
      if (!this.container) return; // Silent exit if page layout doesn't require a trail

      this.executePipeline();
    },

    /**
     * Orchestrates path parsing, HTML generation, and Schema automation
     */
    executePipeline() {
      const currentPath = window.location.pathname;
      
      // 1. Clean and filter the path segments array safely
      const segments = currentPath.split('/')
        .filter(segment => segment.length > 0 && segment !== "index.html");

      // Skip rendering if user is on the absolute root timeline
      if (segments.length === 0) {
        this.container.style.display = "none";
        return;
      }

      // 2. Generate Premium Accessible HTML Trail
      const breadcrumbHTML = this.compileHTMLTrail(segments);
      this.container.innerHTML = breadcrumbHTML;
      this.container.style.display = "block";

      // 3. Inject On-The-Fly Schema.org BreadcrumbList JSON-LD Matrix
      this.injectSchemaMetadata(segments);
    },

    /**
     * Translates raw URL segments into human-readable capitalized text links
     */
    compileHTMLTrail(segments) {
      let relativeAccumulatedPath = "";
      
      // Enforce absolute left alignment to destroy any mobile white-space blitting bugs
      let html = `<nav class="synaptic-breadcrumb-nav" aria-label="Breadcrumb Trail" style="text-align:left !important; direction:ltr !important;">`;
      html += `<ol style="display:flex; flex-wrap:wrap; list-style:none; padding:0; margin:0; align-items:center; text-align:left;">`;
      
      // Establish Core Root Node Connection
      html += `
        <li style="display:inline-flex; align-items:center; font-size:0.85rem; font-weight:600;">
          <a href="${window.location.origin}/" style="color:#64748b; text-decoration:none; transition:color 0.2s ease;">Home</a>
          <span style="margin:0 8px; color:#475569; opacity:0.5; font-size:0.75rem; user-select:none;">➔</span>
        </li>
      `;

      const len = segments.length;
      segments.forEach((segment, index) => {
        relativeAccumulatedPath += `/${segment}`;
        const cleanTitle = this.sanitizeLabel(segment);
        const isLastNode = index === len - 1;

        html += `<li style="display:inline-flex; align-items:center; font-size:0.85rem; font-weight:600; text-align:left;">`;
        
        if (isLastNode) {
          // Current leaf node: Active static state highlighted in Signature Cyan Accent
          html += `<span aria-current="page" style="color:#00d4b2; text-shadow:0 0 10px rgba(0,212,178,0.15); font-weight:700;">${cleanTitle}</span>`;
        } else {
          // Parent node: High contrast interactive pointer link
          html += `
            <a href="${window.location.origin}${relativeAccumulatedPath}/" style="color:#cbd5e1; text-decoration:none; transition:color 0.2s ease;">${cleanTitle}</a>
            <span style="margin:0 8px; color:#475569; opacity:0.5; font-size:0.75rem; user-select:none;">➔</span>
          `;
        }
        
        html += `</li>`;
      });

      html += `</ol></nav>`;
      return html;
    },

    /**
     * Formats raw slug parameters into beautiful exam-friendly pedagogical labels
     */
    sanitizeLabel(slug) {
      // Decode URL entities, strip dashes, and optimize explicit core subject strings
      let title = decodeURIComponent(slug).replace(/[-_]/g, ' ');
      
      const acronyms = {
        hsc: "HSC",
        mcq: "MCQ",
        ai: "AI",
        seo: "SEO"
      };

      if (acronyms[title.toLowerCase()]) {
        return acronyms[title.toLowerCase()];
      }

      // Perform fast capitalize cascade rules
      return title.replace(/\b\w/g, char => char.toUpperCase());
    },

    /**
     * Injects a dynamic secure JSON-LD Microdata schema packet directly into page DOM
     */
    injectSchemaMetadata(segments) {
      const schemaId = "synaptic-breadcrumb-schema-node";
      
      // Flush older instance if it exists to allow fluid context switching
      const existingSchema = document.getElementById(schemaId);
      if (existingSchema) existingSchema.remove();

      let relativeAccumulatedPath = "";
      const itemListElement = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${window.location.origin}/`
        }
      ];

      segments.forEach((segment, index) => {
        relativeAccumulatedPath += `/${segment}`;
        itemListElement.push({
          "@type": "ListItem",
          "position": index + 2,
          "name": this.sanitizeLabel(segment),
          "item": `${window.location.origin}${relativeAccumulatedPath}/`
        });
      });

      const jsonLD = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": itemListElement
      };

      const scriptNode = document.createElement("script");
      scriptNode.type = "application/ld+json";
      scriptNode.id = schemaId;
      scriptNode.textContent = JSON.stringify(jsonLD);
      
      document.head.appendChild(scriptNode);
    }
  };

  // Safe Multi-Device Egress Boot Thread
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => BreadcrumbEngine.init());
  } else {
    BreadcrumbEngine.init();
  }
})();
