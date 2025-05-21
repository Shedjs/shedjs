# Event handling

Event handling with Shed js elements is similar to event handling with DOM elements, such as ``addEventListener``.
There are a few differences in syntax, Shed offers an APi:

* Check if events are supported
* Assign a unique ID to each handler to facilitate deletion a posteriori
* Handle events on specific CSS selectors if dealing with DOM-related event types like`(mouse events, keyboard events, form events)` and Window/Document events if dealing with document or window-related event types.like 

This documentation specifically supports the two main functions: ``onEvent`` and ``removeEvent``.

## API

`ShedEvent.onEvent(evenType, selector, callback)`   
Adds an event handler to an element corresponding to the CSS or window or document selector.
### Parameters:
  * `evenType`: This paramater is a string representing the name of event to monitor (ex: click, input, load...)
  * `selector`: As a string, this parameter representing a selector CSS or `'window'` or `'document'`(ex:`#btn`, `.input`, `window or document`)
  * `callback`: Function executed on event

### Return:
* `id`: Unique handler ID for later deletion    
* `-1` if event not supported

### Behavior:
* if the event is not supported by Shed, a warning message is displayed and the function returns -1


`ShedEvent.removeEvent(id)`     
Removes an event handler using its ID
### Parameters:
* `handleID`: ID of handler to be removed (id returned by onEvent)

### Return:
* `true` if the handler is found
* `false` if the handler is not found by this ID

### Behavior:
* if the ID cannot be found, a warning message is displayed
 and the function returns false.

## Example
<b>Add a handler for a click on a button with Shed
```javascript
import {ShedEvent} from 'events.js'

const handlerId = ShedEvent.onEvent('click', "#btn", () => {
 console.log('Button clicked !!');
})
// Displays: "Event handler added with ID: 0 => click on #btn"
console.log(handlerID) // displays 0
```
<b>Remove the handler with Shed
```javascript
import {ShedEvent} from 'events.js'

ShedEvent.removeEvent(handlerID)
// Display : "Event handler removed with ID: 0"
console.log(handlerID) // display 0

// Try to remove a non-existent ID, like
ShedEvent.removeEvent(99)// You get an error message like this: No handler with this ID: 99
```
<b>Resize the window with Shed
```javascript
import {ShedEvent} from 'events.js'

const handlerId = ShedEvent.onEvent('resize', 'window', () => {
 console.log('Window resized !!');
})
```



## Good practices

* Check supported events: Consult the supportedEvents list of your `ShedEvent` instance to avoid errors.

* Store IDs: Keep the ID returned by `onEvent` so you can delete handlers later.

* Use specific selectors: Prefer specific selectors (e.g. `#id` or `.class`) to avoid unexpected behavior.