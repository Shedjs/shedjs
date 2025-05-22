class Route {
    constructor() {
        this.routes = {};
    }

    addRoute(path, action) {
        this.routes[path] = action // Register the route and its handler
    }

    navigate(path) {
        window.location.hash = path; // Change the URL hash
        this.renderRoute(path); // Load the corresponding route
    }

    renderRoute(path) {
        const route = this.routes[path];
        if (route) {
            route(); // Execute the associated action for the route
        } else {
            console.error(`Route not found: ${path}`);
        }
    }

    renderInitialRoute(path) {
        // Use window.location.hash to determine the initial path, default to '/'
        path = window.location.hash.slice(1) || '/';
        console.log(path);

        this.renderRoute(path)
        // Listen for changes in the hash (back/forward navigation)
        // window.addEventListener("hashchange", () => {
        window.onhashchange = () => { // ⚠️ Inline assignment
            this.renderRoute(window.location.hash.slice(1))
        };
    }
}

export default Route
