import Router from "./routes.js";
import  ShedEvent from "./events.js";
import Dom from "./dom.js"

function main() {
    const router = new Router();
    const shedEvent = new ShedEvent();
    
    // Create paragraph element
    const elm = Dom.createElement("p", { 
        class: "hello",
        id: "display-text"  // Add an ID for easier reference
    }, "hello");
    
    // Create input element with event handler
    const input = Dom.createElement('input', {
        type: 'text',
        placeholder: 'Enter your name',
        id: 'name-input',  // Add an ID for easier reference
        onInput: function(e) {
            const displayText = document.getElementById('display-text');
            displayText.textContent = e.target.value || "hello";
        }
    });

    const app = document.querySelector("#app");
    
    // Append elements to DOM
    app.appendChild(elm);
    app.appendChild(input);

    // Initialize event system
    shedEvent.initEventSystem();

    // Add event listener using ShedEvent
    shedEvent.onEvent("input", "#name-input", (e, el) => {
        const displayText = document.getElementById('display-text');
        displayText.textContent = el.value || "hello";
    });
}

main();
