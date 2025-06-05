<h1 align="center">Shedjs: Getting Started</h1>

<p align="center">
  <strong>Your Lightweight, Customizable JavaScript Framework</strong><br>
  <em>Shed the bloat. Keep the power.</em>
</p>

Welcome to **ShedJS**! This guide will help you quickly integrate our framework into your project.  

## **1. Installation & Setup**  

### Create a new project with Vite (recommended)
```bash
npm create vite@latest my-app
cd my-app
npm install
npm install shedjs
```

###  Or use any other bundler
```bash
# With webpack
npx create-react-app my-app --template vanilla
cd my-app
npm install shedjs

# With Parcel
mkdir my-app && cd my-app
npm init -y
npm install parcel shedjs
```

### In your main JavaScript file (e.g., `src/main.js`):

```javascript
import { Dom, Event, State, Route } from 'shedjs';
// Enjoy the framework!
```

### That's it! Run your dev server:
```bash
npm run dev
```

### Project Structure (any structure works)
```
my-app/
├── src/
│   └── main.js     # Your code here
├── index.html
└── package.json
```

**No specific structure required** - just import and use!

## **2. Core Concepts**  

ShedJS consists of four main modules:  

| Module      | Import Path                      | Purpose                        |
|-------------|----------------------------------|--------------------------------|
| **`Dom`**   | `import { Dom } from 'shedjs'`   | Virtual DOM & DOM manipulation |
| **`State`** | `import { State } from 'shedjs'` | Reactive state management      |
| **`Event`** | `import { Event } from 'shedjs'` | Event delegation system        |
| **`Route`** | `import { Route } from 'shedjs'` | Client-side routing            |

## 3. Quick Start

### A. Basic App Structure
```javascript
import { Dom, State } from 'shedjs';

class App {
  constructor() {
    this.state = new State({ count: 0 });
    this.state.subscribe(() => this.render());
  }

  render() {
    const { count } = this.state.getState();
    return Dom.h('div', {}, [
      Dom.h('h1', {}, `Count: ${count}`),
      Dom.h('button', { 
        onClick: () => this.state.setState({ count: count + 1 }) 
      }, 'Increment')
    ]);
  }
}

Dom.renderWithDiff(document.body, new App().render());
```

### B. Alternative Browser Usage
```html
<script src="https://cdn.jsdelivr.net/npm/shedjs@latest/dist/shedjs.umd.js"></script>
<script>
  const { Dom, State } = ShedJS;
  // Your code here
</script>
```

## 4. Key Features

### **Virtual DOM**
```javascript
const vdom = Dom.h('div', { class: 'app' }, [
  Dom.h('h1', {}, 'Hello World'),
  Dom.h('ul', {}, items.map(item => 
    Dom.h('li', { key: item.id }, item.text)
  ))
]);
```

### **State Management**
```javascript
const store = new State({ user: null });

store.subscribe(() => {
  console.log('New state:', store.getState());
});

store.setState({ user: { name: 'Alice' } });
```

### **Event System**
```javascript
const events = new Event();

// Delegate all clicks on .btn elements
events.onEvent('click', '.btn', (e) => {
  console.log('Button clicked:', e.target);
});
```

## 5. Best Practices

1. **Always use keys** for dynamic lists:
```javascript
Dom.h('ul', {}, items.map(item => 
  Dom.h('li', { key: item.id }, item.name)
))
```

2. **Batch state updates**:
```javascript
// Good
state.setState({ user, posts });

// Avoid
state.setState({ user });
state.setState({ posts });
```

3. **Use route parameters**:
```javascript
const router = new Route();
router.addRoute('/user/:id', ({ id }) => {
  console.log('User ID:', id);
});
```

## 6. Troubleshooting

| Symptom               | Solution                                    |
|-----------------------|---------------------------------------------|
| Can't import modules  | Ensure you ran `npm install shedjs`         |
| State not updating    | Verify `subscribe()` is called              |
| Events not triggering | Check event delegation targets exist in DOM |

## 7. Next Steps

- [Example Projects](https://github.com/Shedjs)
- [Contribute on GitHub](https://github.com/Shedjs/shedjs)

🚀 **We can't wait to see what you build with ShedJS!** 🚀
