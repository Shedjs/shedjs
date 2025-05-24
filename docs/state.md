<h1 align="center">State Management</h1>

## Features

- **Persistence**: State survives page refreshes.
- **Reactivity**: Components can subscribe to changes.
- **Immutability**: Prevent accidental state mutations.
- **Clean API**: Familiar patterns (React-like).

## Methods/Properties

1. `setState()`
    - Uses shallow merge (for nested objects, consider deep merge libraries)
    - Persists entire state to localStorage automatically
    - Notifies all subscribers synchronously

2. `getState()`
    - Returns a copy to enforce immutability
    - Prevents external code from modifying internal state directly

3. `subscribe()`
    - Implements observer pattern with Set for efficient lookups
    - Returns cleanup function for memory leak prevention

> ⚠️ **WARNING**: Do not access or modify any property or method starting with `_` directly.  
These are internal and may change or break in future versions. Use the provided public methods instead.

1. `_state`
    - Internal state with _ prefix (common convention for "private" members)
    - Always merged immutably to prevent side effects

2. `_hydrate()`
    - Private method that loads persisted state on initialization
    - Merges localStorage data with initial state (giving priority to saved state)

## Usage Example

```js
// Initialize
const state = new State({ theme: 'dark' });

// Subscribe
const unsubscribe = state.subscribe(stt => {
  console.log('New state:', stt);
});

// Update
state.setState({ user: { name: 'Alice' } }); 
// Console logs: "New state: { theme: 'dark', user: { name: 'Alice' } }"

// Unsubscribe later
unsubscribe();
```
