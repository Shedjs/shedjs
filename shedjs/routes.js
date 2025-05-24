class Route {
    constructor() {
        /**
         * Registry of route paths and their associated action handlers.
         * @type {Object.<string, Function>}
         * @example { '/about': showAboutPage }
         */
        this.routes = {};
    }
    /**
    * Registers a route path with its corresponding action handler.
    * @param {string} path - Route path (should start with '/')
    * @param {Function} action - Callback to execute when route is activated
    */
    addRoute(path, action) {
        this.routes[path] = action // Register the route and its handler
    }

    /**
     * Programmatically navigates to a specified route.
     * Updates URL hash and triggers route rendering.
     * @param {string} path - Target route path
     */
    navigate(path) {
        window.location.hash = path; // Change the URL hash
        this.renderRoute(path); // Load the corresponding route
    }

    /**
     * Executes the handler for a given route path.
     * @param {string} path - Route path to render
     * @throws {Error} When attempting to render an unregistered route
     */
    renderRoute(path) {
        const route = this.routes[path];
        if (route) {
            route(); // Execute the associated action for the route
        } else {
            console.error(`Route not found: ${path}`);
        }
    }

    /**
     * Initializes the router and sets up hash change listeners.
     * - Renders current route on startup
     * - Listens for back/forward navigation via hash changes
     */
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
