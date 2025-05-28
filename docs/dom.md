<h1 align="center">DOM Manipulation</h1>

## Presentation

Dom is the only class that's designed in a singleton pattern with static methods, so no instances are needed, this is the correct choice for the following reasons:

1. **Stateless Operations**

    - DOM methods like `createElement()` and `setAttribute()` are pure functions.
    - No instance-specific data needed → No memory overhead.

2. **Global Access Pattern**

```js
    // More intuitive than instantiating a "DOM manager"
    Dom.createElement('div') 
    // vs
    new DomManager().createElement('div') // 🤮 Over-engineering
```

3. **Performance Optimisation**

    - Direct access top the class, no step-by-step lookup, as there's no instance:
    - Static calls avoid prototype chain lookups in modern JS engines.
    - No constructor/instance initialization overhead.

4. **Industry Standard**

    - React: `React.createElement()`
    - Vue: `h()` (hyperscript helper)
    - Svelte: `document.createElement()`

## Methods

| Methods                                      | Description                                                                |
|----------------------------------------------|----------------------------------------------------------------------------|
| `Dom.createTextNode(text)`                   | Create a text node from a string or number.                                |
| `Dom.createElement(tag, props, ...children)` | Create a DOM element with attributes and child nodes.                      |
| `Dom.setAttribute(element, key, value)`      | Set properties, attributes, or event listeners on a DOM element.           |
| `Dom.appendChild(parent, child)`             | Add one or more children (text, elements, arrays) to a parent DOM node.    |
| `Dom.createFromVNode(vnode)`                 | Convert a virtual DOM-like structure into real DOM nodes.                  |
| `Dom.render(element, container)`             | Insert a DOM element into a container after clearing its contents.         |
| `Dom.renderChainable(element, container)`    | render a DOM element to a container and then return a chainable interface. |

### 1. `createTextNode(text)`

Creates a text node with the specified content.

**Parameters:**

- `text` (string): The text content

**Returns:** Text

**Example:**

```js
const textNode = Dom.createTextNode('Hello world');
const div = Dom.createElement('div');
Dom.appendChild(div, textNode);
```

### 2. `createElement(tag, props, ...children)`

Creates a DOM element with specified tag, properties, and children.

**Parameters:**

- `tag` (string): The HTML tag name (e.g., 'div', 'span')
- `props` (Object, optional): Element properties/attributes
- `children` (...Node|string): Child elements or text content

**Returns:** HTMLElement

**Example:**

```js
// Create a button with a class and text content
const button = Dom.createElement('button', { class: 'btn' }, 'Click me');

// Create a div with multiple children
const div = Dom.createElement('div', 
    { class: 'container' },
    Dom.createElement('h1', {}, 'Title'),
    Dom.createElement('p', {}, 'Content')
);

// Create an input with attributes
const input = Dom.createElement('input', {
    type: 'text',
    placeholder: 'Enter your name',
    onInput: (e) => console.log(e.target.value)
});
```

Here's a more complete example showing how to build a form:

```js
const form = Dom.createElement('form',
    { class: 'login-form' },
    Dom.createElement('input', {
        type: 'text',
        placeholder: 'Username',
        onInput: (e) => console.log('Username:', e.target.value)
    }),
    Dom.createElement('input', {
        type: 'password',
        placeholder: 'Password',
        onInput: (e) => console.log('Password:', e.target.value)
    }),
    Dom.createElement('button',
        {
            type: 'submit',
            onClick: (e) => {
                e.preventDefault();
                console.log('Form submitted');
            }
        },
        'Login'
    )
);

// Add to document
Dom.appendChild(document.body, form);
```

### 3. `setAttribute(element, key, value)`

Sets an attribute, property, or event listener on a DOM element.

**Parameters:**

- `element` (Node): The target DOM element
- `key` (string): Attribute/property name
- `value` (*): The value to set

**Example:**

```js
const div = Dom.createElement('div');

// Set regular attribute
Dom.setAttribute(div, 'id', 'myDiv');

// Add event listener
Dom.setAttribute(div, 'onClick', () => console.log('clicked'));

// Set styles
Dom.setAttribute(div, 'style', {
    color: 'red',
    fontSize: '16px'
});
```

### 4. `Dom.appendChild(parent, child)`

Handles multiple child types:
- DOM Nodes (appends directly)
- Strings/Numbers (converts to text nodes)
- Arrays (flattens and appends recursively)
- Null/undefined values (silently skips)

```js
Dom.appendChild(parent, 'Text')      // Strings → text nodes
Dom.appendChild(parent, 123)         // Numbers → text nodes
Dom.appendChild(parent, [a, b])      // Arrays → flattened
Dom.appendChild(parent, domNode)     // Raw DOM nodes
Dom.appendChild(parent, vnode)       // VNodes → converted via createFromVNode
Dom.appendChild(parent, null)        // Skipped
```

### 5. `Dom.createFromVNode(vnode)`

The framework also supports creating DOM elements from virtual node objects:

**Parameters:**

- `vnode` (Object|string|number) - The virtual node to convert

**Returns:**

- `elemlent` (Node) - The created DOM element or text node

**Example:**

```js
const vnode = {
    tag: 'div',
    attrs: { class: 'sadiqui' },
    children: [
        { tag: 'input', attrs: { type: 'text', placeholder: 'Enter name' } },
        null,
        'Text Node',
        123,
        { tag: 'button', attrs: { type: 'submit' }, children: ['Submit', 'HI'] }
    ]
};

const domTree = Dom.createFromVNode(vnode);
Dom.appendChild(document.body, domTree);
```

### 6. `Dom.render(element, container)`

Clears the specified container and renders a DOM element into it. This is useful for "mounting" your app to a root DOM node.

**Parameters:**

- `element` (Node) - The DOM element to render (must be a valid Node)
- `container` (Node) - The target container element (must be a valid Node)

**Returns:**

- The rendered element (for optional chaining)

**Throws:**

- FrameworkError if container is not a valid DOM node
- Error if element is not a valid DOM node

**Behavior:**

- Validates both element and container
- Clears all existing content from the container
- Appends the new element
- Returns the element for method chaining

**Examples:**

```js
// Basic usage
const app = document.getElementById('app');
const root = Dom.createElement('div', { id: 'root' });
Dom.render(root, app);

// Method chaining
Dom.render(
  Dom.createElement('h1', {}, 'Hello World'),
  document.body
).classList.add('fade-in');

// Rendering a VNode structure
const vnode = {
  tag: 'div',
  children: [
    { tag: 'h1', children: ['Welcome'] },
    { tag: 'p', children: ['This was rendered from a VNode'] }
  ]
};
Dom.render(Dom.createFromVNode(vnode), document.getElementById('app'));
```

### 7. `Dom.renderChainable(element, container)`

Render a DOM element to a container and then return a chainable interface.

**Parameters:**

- `element` (Node) - DOM element to render
- `container` (Node) - Target container element

**Returns:** Chainable interface with methods:
- `element (Node)` - Reference to the rendered DOM node
- `.set(key, value)` - Proxy to `Dom.setAttribute()`
- `.addChildren(children)` - Proxy to `Dom.appendChild()`
- `.on(event, handler)` - Uses `Dom.setAttribute()`'s event handling

**Example:**

```js
Dom.renderChainable(Dom.createElement('div', { id: 'box' }, 'Hello'), document.body)
    .addChildren([
        Dom.createElement('p', {}, 'Paragraph'),
        Dom.createElement('br'),
        'More text'
    ]);
```
