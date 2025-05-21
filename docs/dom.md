# DOM Manipulation Library Documentation

## Class: Dom

A utility class providing static methods for DOM manipulation and creation.

### Methods

#### `createElement(tag, props, ...children)`

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

#### `setAttribute(element, key, value)`

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

#### `createTextNode(text)`

Creates a text node with the specified content.

**Parameters:**
- `text` (string): The text content

**Returns:** Text

**Example:**
```js
const textNode = Dom.createTextNode('Hello world');
const div = Dom.createElement('div');
div.appendChild(textNode);
```

### Complex Example

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
document.body.appendChild(form);
```

### Virtual DOM Support

The library also supports creating DOM elements from virtual node objects:

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
        {
            tag: 'button',
            attrs: { type: 'submit' },
            children: ['Submit']
        }
    ]
};

const element = Dom.createFromVNode(vnode);
document.body.appendChild(element);
```