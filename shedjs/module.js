import Router from "./routes.js";

function main() {
    const router = new Router();
    const app = document.getElementById("app");
    console.log(app);
    
    router.addRoute('/', () => {
        console.log("njh");
        
        app.innerHTML = "<h1>Accueil</h1>";
    });


    router.loadInitialRoute();
}

main();
