/**
 * ==========================================================================
 * SEMANTIC LINKER (THE NEUROTRANSMITTER)
 * System: Learning Biology For Life Ecosystem
 * ==========================================================================
 * Purpose:
 * 1. Blood-Brain Barrier: Secures external links automatically.
 * 2. Axon Scrolling: Creates smooth, frictionless scrolling for anchor links.
 * 3. Synaptic Highlighting: Activates subtle cognitive hover states.
 */

document.addEventListener('DOMContentLoaded', () => {

    const SemanticLinker = {

        init() {
            this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.secureExternalLinks();
            this.enableAxonScrolling();
            this.activateSynapticNodes();
            console.log('[SYSTEM] Semantic Linker: Neurotransmitters active.');
        },

        /**
         * 1. THE BLOOD-BRAIN BARRIER
         * Protects the internal learning environment. Any link leading outside
         * the 'Learning Biology For Life' matrix opens in a new tab securely.
         */
        secureExternalLinks() {
            const currentDomain = window.location.hostname;

            document.querySelectorAll('a[href^="http"]').forEach(link => {
                try {
                    const url = new URL(link.href);
                    if (url.hostname !== currentDomain) {
                        link.setAttribute('target', '_blank');
                        link.setAttribute('rel', 'noopener noreferrer');
                        link.classList.add('external-synapse');
                    }
                } catch (e) {
                    // Invalid URL, skip
                }
            });
        },

        /**
         * 2. AXON SCROLLING
         * Smooth scroll to anchor targets with sticky header offset.
         * Respects prefers-reduced-motion.
         */
        enableAxonScrolling() {
            const headerOffset = 80;

            document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        e.preventDefault();
                        const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: this.prefersReducedMotion ? 'auto' : 'smooth'
                        });

                        if (!this.prefersReducedMotion) {
                            targetElement.classList.add('cognitive-flash');
                            setTimeout(() => {
                                targetElement.classList.remove('cognitive-flash');
                            }, 1500);
                        }
                    }
                });
            });
        },

        /**
         * 3. SYNAPTIC NODES
         * Adds interactive tracking to specialized internal links for CSS hooks.
         */
        activateSynapticNodes() {
            const selectors = [
                'a[href^="/biology"]',
                'a[href^="/socratic"]',
                'a[href^="/life-practices"]'
            ].join(', ');

            document.querySelectorAll(selectors).forEach(node => {
                node.classList.add('semantic-node');
            });
        }
    };

    SemanticLinker.init();
});