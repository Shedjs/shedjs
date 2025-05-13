class Router {
    constructor() {
        this.routes = {};
    }
    addRoute(path, action) {
        this.routes[path] = action // Register the route and its handler
    }
    navigate(path) {
        window.location.hash = path; // Change the URL hash
        this.loadRoute(path); // Load the corresponding route
    }
    loadRoute(path) {
        const route = this.routes[path];
        if (route) {
            route(); // Execute the associated action for the route
        } else {
            console.error(`Route not found: ${path}`);
        }
    };
    loadInitialRoute(path) {
        // Use window.location.hash to determine the initial path, default to '/'
        path = window.location.hash.slice(1) || '/';
        console.log(path);

        this.loadRoute(path)
        // Listen for changes in the hash (back/forward navigation)
        window.addEventListener("hashchange", () => {
            this.loadRoute(window.location.hash.slice(1))
        })
    }
}

export default Router