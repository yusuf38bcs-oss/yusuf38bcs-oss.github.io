// assets/js/neural-engine.js
document.addEventListener("DOMContentLoaded", function() {
    console.log("Neural Engine Online. Synaptic pathways active.");

    // Target the Socratic input form from your layout
    const socraticForm = document.querySelector('.socratic-reflex-form');
    
    if (socraticForm) {
        socraticForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent page reload
            
            const inputField = document.getElementById("nodeSocraticInput");
            const consoleOutput = document.getElementById("socraticConsole");
            
            if (inputField.value.trim() !== "") {
                // Simulate processing the vector
                consoleOutput.innerHTML = `<span style="color: #00f5d4;">> Vector transmitted:</span> Processing hypothesis...`;
                
                // Add your logic here for what happens next (e.g., scoring, feedback)
                setTimeout(() => {
                    consoleOutput.innerHTML = `<span style="color: #3FA63F;">> Synaptic connection secured. Excellent analysis.</span>`;
                    inputField.value = ""; // clear input
                }, 1500);
            } else {
                consoleOutput.innerHTML = `<span style="color: #ff4d4d;">> Error: Empty vector. Please synthesize a hypothesis.</span>`;
            }
        });
    }
});