import Router from "./routes.js";
import  ShedEvent from "./events.js";
import Dom from "./dom.js"


function main() {
    const router = new Router();
    const shedEvent = new ShedEvent();
    // const dom = new Dom();
    const elm = Dom.createElement("div",{class:"hello"},"hello")
    console.log(elm);
    
    elm.style.color = "red"

    const app = document.querySelector("#app");

    Dom.appendChild(elm);




    shedEvent.initEventSystem();
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
