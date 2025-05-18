# **Routing System**

## Router Class

```javascript
class Router {
    constructor() {
        this.routes = {};
    }
    addRoute(path, action) {
        this.routes[path] = action 
    }
    navigate(path) {
        window.location.hash = path;
        this.renderRoute(path); 
    }
    renderRoute(path) {
        const route = this.routes[path];
        if (route) {
            route(); 
        } else {
            console.error(`Route not found: ${path}`);
        }
    }
    renderInitialRoute() {
        const path = window.location.hash.slice(1) || '/';
        this.renderRoute(path);
        window.addEventListener("hashchange", () => {
            this.renderRoute(window.location.hash.slice(1));
        });
    }
}

export default Router
```

* **Methods**:
  * `addRoute(path, action)`: Register the route and its handler.
  * `navigate(path)`: Navigates to a specified route.
  * `renderInitialRoute()`: Handles browser back/forward navigation.

---

## Example Usage

```javascript
import Router from './Router.js';

const router = new Router();

router.addRoute('/', () => {
    document.body.textContent = 'Home Page';
});
router.addRoute('/about', () => {
    document.body.textContent = 'About Page';
});

router.renderInitialRoute();
```