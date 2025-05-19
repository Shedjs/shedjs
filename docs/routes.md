# **Routing System**

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