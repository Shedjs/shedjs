<h1 align="center">DOM Manipulation</h1>

| Methods                                      | Description                                                                |
|----------------------------------------------|----------------------------------------------------------------------------|
| `Dom.createElement(tag, props, ...children)` | Create a DOM element with attributes and child nodes.                      |
| `Dom.setAttribute(element, key, value)`      | Set properties, attributes, or event listeners on a DOM element.           |
| `Dom.appendChild(parent, child)`             | Add one or more children (text, elements, arrays) to a parent DOM node.    |
| `Dom.createTextNode(text)`                   | Create a text node from a string or number.                                |
| `Dom.createFromVNode(vnode)`                 | Convert a virtual DOM-like structure into real DOM nodes.                  |
| `Dom.render(element, container)`             | Insert a DOM element into a container after clearing its contents.         |
| `Dom.renderChainable(element, container)`    | render a DOM element to a container and then return a chainable interface. |

----

### 1. `createElement(tag, props, ...children)`

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

### 2. `setAttribute(element, key, value)`

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

### 3. `createTextNode(text)`

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

### 4. `Dom.createFromVNode(vnode)`

The framework also supports creating DOM elements from virtual node objects:

**Parameters:**

- `vnode` (Object|string|number) - The virtual node to convert

**Returns:**

- `elemlent` (Node) - The created DOM element or text node

**Example:**

```js
const vnode = {
    tag: 'div',
    attrs: { class: 'container' },
    children: [
        {
            tag: 'input',
            attrs: { 
                type: 'text',
                placeholder: 'Enter name'
            }
        },
        null,  // Safely skipped by Dom.appendChild()
        ['Text Node', 123],  // Handled via array logic
        {
            tag: 'button',
            attrs: { type: 'submit' },
            children: ['Submit'] // Strings auto-converted to text nodes
        }
    ]
};

const domTree = Dom.createFromVNode(vnode);
Dom.appendChild(document.body, domTree);
```

### 5. `Dom.renderChainable(element, container)`

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
