<h1 align="center">Event Handling</h1>

Event handling with Shedjs elements is similar to event handling with DOM elements, such as `addEventListener()`.  
There are a few differences in syntax, Shed offers an API:  

* Check if events are supported
* Assign a unique ID to each handler to facilitate later deletion
* Handle events on specific CSS selectors or Window/Document targets

| Methods                                       | Description                                                                             |
|-----------------------------------------------|-----------------------------------------------------------------------------------------|
| `instance.onEvent(event, selector, callback)` | Registers an event handler to elements matching the CSS selector, returns handler ID.   |
| `instance.removeEvent(handlerId)`             | Removes an event handler by its ID, returns true if successful.                         |
| `instance.destry()`                           | Completely shut down an ENTIRE event system (for complex apps).                         |

## Important: Event Types and Selectors

Shedjs categorizes events into two types that determine which selectors you can use:

### **DOM Events** (Use CSS selectors like `body`, `#id`, `.class`)
These events must be attached to actual DOM elements:

```js
// ✅ Correct - DOM events with CSS selectors
instance.onEvent('keydown', 'body', handleKeyDown);
instance.onEvent('click', '#button', handleClick);
instance.onEvent('input', '.form-field', handleInput);
instance.onEvent('mouseover', '.card', handleHover);
```

**Supported DOM Events:**
- **Keyboard:** `keydown`, `keypress`, `keyup`
- **Mouse:** `click`, `dblclick`, `mouseover`, `mouseout`
- **Form:** `input`, `change`, `submit`, `blur`, `focus`
- **Other:** `scroll`

### **Window/Document Events** (Use `'window'` or `'document'`)
These events can only be attached to window or document:

```js
// ✅ Correct - Window/Document events
instance.onEvent('resize', 'window', handleResize);
instance.onEvent('load', 'window', handleLoad);
instance.onEvent('DOMContentLoaded', 'document', handleDOMReady);
```

**Supported Window/Document Events:**
- **Window:** `resize`, `load`, `unload`, `beforeunload`, `hashchange`, `popstate`
- **Document:** `DOMContentLoaded`

### **Common Mistakes**

```js
// ❌ Wrong - keydown is a DOM event, can't use 'window'
instance.onEvent('keydown', 'window', handleKeyDown);

// ❌ Wrong - keydown is a DOM event, can't use 'document'  
instance.onEvent('keydown', 'document', handleKeyDown);

// ❌ Wrong - resize is a window event, can't use CSS selector
instance.onEvent('resize', 'body', handleResize);
```

### 💡 **Quick Reference Guide**

| Want to listen for... | Use this selector | Example |
|----------------------|-------------------|---------|
| Key presses globally | `'body'` | `onEvent('keydown', 'body', fn)` |
| Clicks on specific element | `'#id'` or `'.class'` | `onEvent('click', '#btn', fn)` |
| Window resize | `'window'` | `onEvent('resize', 'window', fn)` |
| Page load | `'window'` | `onEvent('load', 'window', fn)` |
| DOM ready | `'document'` | `onEvent('DOMContentLoaded', 'document', fn)` |

## API

### 1. `instance.onEvent(eventType, selector, callback)`

Adds an event handler to elements matching the selector.

- **Parameters:**
  * `eventType`: String representing the event name (e.g., 'click', 'keydown', 'resize')
  * `selector`: 
    - For DOM events: CSS selector (`'body'`, `'#id'`, `'.class'`, `'div'`, etc.)
    - For Window/Document events: `'window'` or `'document'`
  * `callback`: Function executed when event occurs

- **Return:**
  * `id`: Unique handler ID for later deletion
  * Throws error if event type is not supported or selector is incompatible

- **Behavior:**
  * Validates event type and selector compatibility
  * Throws `FrameworkError` for unsupported events or invalid selectors

### 2. `instance.removeEvent(id)`

Removes an event handler using its ID.

- **Parameters:**
  * `handlerId`: ID returned by `onEvent()`

- **Return:**
  * `true` if handler was found and removed
  * `false` if handler ID not found

### 3. `instance.destroy()`

Completely shuts down the entire event system.  
Mainly for complex apps that dynamically create/remove event systems.

- **Parameters:** None
- **Return:** None
- **Behavior:** Removes all listeners, disconnects observers, resets state

## Examples

### Basic DOM Events

```js
import { Event } from 'events.js';

const instance = new Event();

// Listen for key presses globally
const keyHandler = instance.onEvent('keydown', 'body', (e) => {
    console.log(`Key pressed: ${e.key}`);
});

// Listen for clicks on specific button
const clickHandler = instance.onEvent('click', '#start-btn', (e) => {
    console.log('Game started!');
});

// Listen for input changes
const inputHandler = instance.onEvent('input', '.username', (e) => {
    console.log(`Username: ${e.target.value}`);
});
```

### Window/Document Events

```js
// Listen for window resize
const resizeHandler = instance.onEvent('resize', 'window', () => {
    console.log('Window resized!');
});

// Listen for page load
const loadHandler = instance.onEvent('load', 'window', () => {
    console.log('Page fully loaded!');
});

// Listen for DOM ready
const domHandler = instance.onEvent('DOMContentLoaded', 'document', () => {
    console.log('DOM is ready!');
});
```

### Cleanup

```js
// onEvent() returns a number ID - store it for later cleanup
const keyHandlerId = instance.onEvent('keydown', 'body', handleKeyDown);
const clickHandlerId = instance.onEvent('click', '#btn', handleClick);

console.log(keyHandlerId);   // outputs: 0 (first handler)
console.log(clickHandlerId); // outputs: 1 (second handler)

// Remove specific handler using the stored ID
instance.removeEvent(keyHandlerId);   // removes the keydown handler
instance.removeEvent(clickHandlerId); // removes the click handler

// Or destroy entire system (removes ALL handlers)
instance.destroy();
```

**💡 Pro tip:** Store handler IDs in descriptive variables so you know what you're removing:

```js
// Good: descriptive variable names
const globalKeyboardHandler = instance.onEvent('keydown', 'body', handleKeys);
const startButtonHandler = instance.onEvent('click', '#start', startGame);

// Later...
instance.removeEvent(globalKeyboardHandler); // clear what this does
instance.removeEvent(startButtonHandler);    // clear what this does
```

## Troubleshooting

### "Event not supported" Error
Make sure you're using a supported event type. Check the lists above.

### "Handler not working" Issue
1. **Check event category**: DOM events need CSS selectors, Window events need `'window'`/`'document'`
2. **Verify selector**: Make sure your CSS selector matches existing elements
3. **Timing**: For DOM events, ensure elements exist when handler is registered

### Getting Available Events
```js
// Check what events are supported
console.log(instance._supportedEvents);
```

## Best Practices

* **Use specific selectors**: Prefer `#id` or `.class` over generic tags
* **Store handler IDs**: Keep IDs returned by `onEvent()` for cleanup
* **Global keyboard events**: Use `'body'` selector for keyboard events you want to catch globally
* **Window events**: Only use `'window'`/`'document'` for events that actually belong to window/document
* **Clean up**: Remove handlers when no longer needed to prevent memory leaks
