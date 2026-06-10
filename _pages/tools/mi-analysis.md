---
title: "Find Your Intelligence Zone (Gardner's MI Theory)"
layout: single
permalink: /mi-analysis/
author_profile: true
header:
  overlay_color: "#e6f2f5"
  excerpt: "Discover the unique configuration of your neural pathways and how it shapes your leadership and learning styles."
---

Human intelligence is not a single, measurable metric. It is a vast, interconnected ecosystem. This tool maps your dominance across key "Intelligence Zones" based on Howard Gardner's theory, translating psychological preferences into biological principles.

### The Synaptic Mapping Tool

Rate how instinctively you agree with each statement below to map your dominant neural pathway.

<div id="mi-app" style="background: #fdfdfd; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0; margin-top: 20px;">
  
  <div id="mi-questions-container">
    <!-- Questions Injected by JS -->
  </div>

  <button id="mi-submit-btn" class="btn btn--primary btn--large" style="width: 100%; margin-top: 20px; font-size: 16px; padding: 15px;">Analyze My Neural Pathways</button>

  <div id="mi-results" style="display: none; margin-top: 30px; padding: 20px; background: #e6f2f5; border-radius: 8px; border-left: 5px solid #1e88e5;">
    <h3 style="margin-top: 0; color: #0d47a1;">Your Dominant Zone: <span id="dominant-zone"></span></h3>
    <p id="zone-description" style="font-weight: 500; font-size: 1.1em; color: #555;"></p>
    <p id="biological-bridge" style="border-top: 1px dashed #b3e5fc; padding-top: 15px; margin-top: 15px;"></p>
  </div>

</div>

<style>
  .mi-statement { margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
  .mi-statement p { font-weight: bold; margin-bottom: 15px; color: #333; font-size: 1.1em;}
  .mi-options {display: flex; gap: 15px; flex-wrap: wrap;}
  .mi-options label { cursor: pointer; font-size: 0.95em; color: #666; background: #f8f9fa; padding: 8px 12px; border-radius: 4px; border: 1px solid #ddd; transition: 0.2s;}
  .mi-options input { margin-right: 8px; }
  .mi-options label:hover { background: #e3f2fd; border-color: #90caf9;}
  .mi-options input:checked + span { font-weight: bold; color: #1e88e5; }
</style>

<script>
const miQuestions = [
  { text: "I naturally find patterns and logical sequences in complex data.", type: "Logical" },
  { text: "I have a deep, practical understanding of my own internal emotions and motivations.", type: "Intrapersonal" },
  { text: "I easily read the intentions, moods, and feelings of other people (empathy).", type: "Interpersonal" },
  { text: "I am strongly attuned to the natural world, instantly classifying plants, animals, and natural phenomena.", type: "Naturalist" },
  { text: "I learn complex biological processes best by moving my body, doing hands-on experiments, or building physical models.", type: "Kinesthetic" },
  { text: "I find deep satisfaction in exploring 'big questions' about life, meaning, and the human condition.", type: "Existential" }
];

const container = document.getElementById('mi-questions-container');

miQuestions.forEach((q, i) => {
  const html = `
    <div class="mi-statement">
      <p>${i + 1}. ${q.text}</p>
      <div class="mi-options">
        <label><input type="radio" name="q${i}" value="3" required><span>Strongly Agree</span></label>
        <label><input type="radio" name="q${i}" value="2"><span>Neutral / Sometimes</span></label>
        <label><input type="radio" name="q${i}" value="1"><span>Disagree</span></label>
      </div>
    </div>
  `;
  container.innerHTML += html;
});

document.getElementById('mi-submit-btn').addEventListener('click', () => {
  let scores = { "Logical": 0, "Intrapersonal": 0, "Interpersonal": 0, "Naturalist": 0, "Kinesthetic": 0, "Existential": 0 };
  let allAnswered = true;

  miQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected) {
      scores[q.type] += parseInt(selected.value);
    } else {
      allAnswered = false;
    }
  });

  if (!allAnswered) {
    alert("Incomplete Synapse detected. Please answer all prompts to fully calibrate your intelligence zone mapping.");
    return;
  }

  let dominant = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  
  document.getElementById('mi-questions-container').style.display = 'none';
  document.getElementById('mi-submit-btn').style.display = 'none';
  document.getElementById('mi-results').style.display = 'block';
  
  document.getElementById('dominant-zone').innerText = dominant + " Intelligence Zone";
  
  const descriptions = {
    "Logical": { 
        desc: "You have a powerful analytical mind. You process information like a genetic database, constantly structuring patterns and understanding the causes behind every effect.", 
        bridge: "<strong>Biological Leadership Analogy:</strong> Your mind operates like the Central Nervous System, prioritizing exact calculations, operational efficiency, and maintaining systemic homeostasis." 
    },
    "Intrapersonal": { 
        desc: "You possess exceptional self-awareness. You are intimately familiar with your own inner landscape, processing knowledge through introspection and biological self-regulation.", 
        bridge: "<strong>Biological Leadership Analogy:</strong> Like an organism undergoing metamorphosis, your focus is internal development. Your leadership is regulated from within, prioritizing authenticity and personal growth." 
    },
    "Interpersonal": { 
        desc: "You are the ultimate human empath. You 'tune into' the social ecosystem, easily reading the unspoken dynamics and motives of those around you.", 
        bridge: "<strong>Biological Leadership Analogy:</strong> You represent the 'Mycorrhizal Network' of your team, establishing symbiotic relationships and nourishing connections that allow the entire collective ecosystem to thrive." 
    },
    "Naturalist": { 
        desc: "You are deeply connected to the living world. You excel at classification, understanding how the environment shapes biological survival and adaptation.", 
        bridge: "<strong>Biological Leadership Analogy:</strong> You are an ecological leader. You excel at seeing the macro-environment and understanding how small variables (niches) affect the stability of the entire biome." 
    },
    "Kinesthetic": { 
        desc: "Your primary mode of interaction is physical. You possess exceptional motor-neuron coordination and learn through action, movement, and physical sensation.", 
        bridge: "<strong>Biological Leadership Analogy:</strong> Leadership for you is a reflex arcâ€”immediate action. You emphasize practical, hands-on, 4IR technology applications and physically resilient team dynamics." 
    },
    "Existential": { 
        desc: "You navigate the deep waters of philosophy and purpose. You see the ultimate context of biological systemsâ€”the 'why' behind survival and the broader meaning of existence.", 
        bridge: "<strong>Biological Leadership Analogy:</strong> You are the Evolutionary Architect of your team. Your focus is on long-term sustainability, ensuring the team adapts not just to survive, but to thrive with clear, profound purpose." 
    }
  };

  document.getElementById('zone-description').innerText = descriptions[dominant].desc;
  document.getElementById('biological-bridge').innerHTML = descriptions[dominant].bridge;
});
</script>
