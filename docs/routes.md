# **Routing System**

**Core Methods**

| Methods                  | Description                              |
|--------------------------|------------------------------------------|
| `addRoute(path, action)` | Register the route and its handler.      |
| `navigate(path)`         | Navigates to a specified route.          |
| `renderRoute(path)`      | Maps a path to an action.                |
| `renderInitialRoute()`   | Handles browser back/forward navigation. |

## Example Usage

* example 1 : `addRoute` and `renderInitialRoute`
```js
import Router from './Router.js';

const router = new Router();

router.addRoute('/', () => {
    document.body.textContent = 'Home Page';
});
router.addRoute('/about', () => {
    document.body.textContent = 'About Page';
});

router.renderInitialRoute(); // Displays the page corresponding to the current URL
```

* example 2 : `navigate`
```js
import Router from './Router.js';

const router = new Router();

router.addRoute('/', () => {
    document.body.textContent = 'Home';
});
router.addRoute('/about', () => {
    document.body.textContent = 'About';
});

router.renderInitialRoute();

setTimeout(() => {
    router.navigate('/about'); // Changes the route to "/about"
}, 2000);
```

* example 3 : `renderRoute`
```js
import Router from './Router.js';

const router = new Router();

router.addRoute('/contact', () => {
    document.body.textContent = 'Contact Page';
});

router.renderRoute('/contact'); // Displays the "Contact Page" without changing the URL
```
