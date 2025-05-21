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




    // shedEvent.initEventSystem();
    // const input = document.createElement("input");
    // const button = document.createElement("button");
    // const div = document.createElement("div");
    // const select = document.createElement("select");
    // const option1 = document.createElement("option");
    // const option2 = document.createElement("option");


    // option1.innerText = "Option 1";
    // option2.innerText = "Option 2";

    // option1.setAttribute("value", "option1");createTextNode
    // option2.setAttribute("value", "option2");

    // select.appendChild(option1);
    // select.appendChild(option2);

    // select.setAttribute("id", "select");
    // select.setAttribute("name", "select");
    // app.appendChild(select);
    // app.appendChild(div);
    // div.setAttribute("id", "div");
    // button.innerText = "Click me";

    // button.setAttribute("id", "button");
    // input.setAttribute("type", "text");
    // input.setAttribute("id", "input");
    // input.setAttribute("placeholder", "Type something");
    // app.appendChild(input);
    // app.appendChild(button);

    // shedEvent.onEvent("click", "#button", (e, el) => {
    //     console.log("CLICK++>");
    //     console.log(e, el);
    // });
    // shedEvent.onEvent("input", "#input", (e, el) => {
    //     console.log("INPUT++>");
    //     console.log(e, el);
    // });

    // shedEvent.onEvent("change", "#select", (e, el) => {
    //     console.log("CHANGE++>");
    //     console.log(e, el);
    // }
    // );
    
    // router.addRoute('/', () => {
    //     console.log("njh");
        
    //     app.innerHTML = "<h1>Accueil</h1>";
    // });


    // router.loadInitialRoute();
}

main();
