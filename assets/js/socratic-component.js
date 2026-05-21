/**
 * =========================================================
 * SOCRATIC INQUIRY WEB COMPONENT
 * Learning Biology For Life
 * =========================================================
 */

class SocraticInquiry extends HTMLElement {

  constructor() {

    super();

    this.attachShadow({
      mode: "open"
    });
  }

  connectedCallback() {

    this.render();
  }

  render() {

    this.shadowRoot.innerHTML = `
      <style>

        :host {

          display:block;
          width:100%;
        }

        .socratic-panel {

          position:relative;

          overflow:hidden;

          padding:2rem;

          border-radius:24px;

          background:
            linear-gradient(
              135deg,
              rgba(7,17,31,.88),
              rgba(2,8,18,.96)
            );

          border:
            1px solid rgba(0,255,213,.14);

          box-shadow:
            0 12px 40px rgba(0,0,0,.35);

          color:#eef7ff;

          font-family:
            Inter,
            system-ui,
            sans-serif;

          backdrop-filter:
            blur(18px);

          -webkit-backdrop-filter:
            blur(18px);
        }

        .socratic-panel::before {

          content:"";

          position:absolute;
          inset:0;

          background:
            radial-gradient(
              circle at top right,
              rgba(0,255,213,.08),
              transparent 40%
            );

          pointer-events:none;
        }

        .ai-status {

          color:#00ffd5;

          font-size:.78rem;

          letter-spacing:.14em;

          text-transform:uppercase;

          margin-bottom:1rem;

          opacity:.82;
        }

        .socratic-title {

          font-size:
            clamp(1.6rem,4vw,2.4rem);

          font-weight:800;

          line-height:1.1;

          margin:0 0 1rem;

          letter-spacing:-.03em;
        }

        .socratic-text {

          line-height:1.8;

          color:
            rgba(235,245,255,.78);

          margin:0;
        }

        @media (max-width:768px){

          .socratic-panel{

            padding:1.5rem;
          }
        }

      </style>

      <section class="socratic-panel">

        <div class="ai-status">
          Neural Link Active
        </div>

        <h2 class="socratic-title">
          Socratic Inquiry Interface
        </h2>

        <p class="socratic-text">
          A reflective AI learning node integrating biology,
          systems thinking, behavioral science and cognitive inquiry.
        </p>

      </section>
    `;
  }
}

/* =========================================================
   SAFE REGISTRATION
========================================================= */

if (
  !customElements.get(
    "socratic-inquiry"
  )
) {

  customElements.define(
    "socratic-inquiry",
    SocraticInquiry
  );
}