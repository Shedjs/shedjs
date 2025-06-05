<p align="center">
  <img src="https://i.postimg.cc/13bCpQW1/logo.png" alt="Shedjs_logo" width="300"/>
</p>

<p align="center">
  <b>Shed the bloat. Keep the power.</b>
</p>

**Shedjs** (or Shed.js) delivers just enough structure without the bloat of larger frameworks. This lightweight **JavaScript framework** abstracts DOM manipulation, routing, state management, and event handling into a clean, modular system, with **first-class TypeScript support** for robust type safety.  

- **Zero dependencies:** Pure JS/TS with no hidden bloat  
- **Focused API:** Minimal surface area for maximum control  
- **Type-Reactive:** Optional static typing for better tooling and maintenance  
- **Performance-Centric:** Virtual DOM diffing and direct property assignment  

Ideal for developers who value **simplicity without compromises**, whether you’re writing vanilla JS or fully typed TypeScript.  

> *"JavaScript’s agility meets TypeScript’s rigor, when you need it."*  

## Core Features

The framework introduces a powerful architecture composed of a **[Virtual DOM Layer](https://github.com/Shedjs/shedjs/blob/main/src/dom.js)**, an **[Event Handling System](https://github.com/Shedjs/shedjs/blob/main/src/events.js)**, a **[Routing System](https://github.com/Shedjs/shedjs/blob/main/src/routes.js)**, and a **[State Management Module](https://github.com/Shedjs/shedjs/blob/main/src/state.js)**. The Virtual DOM acts as an efficient abstraction that applies changes via a diffing algorithm, avoiding direct and costly DOM manipulations. The event system provides a declarative and automatic way to manage user interactions with memory leak prevention and dynamic adaptability. The lightweight router enables SPA-like navigation with native history API support, offering modular design and SEO-friendly URLs. Finally, the centralized state manager ensures predictable UI updates and consistent data flow across components. Together, these systems promote a **declarative approach**, **type safety**, and **memory efficiency**, while maintaining a strong focus on **developer experience** and **performance**. The framework is **framework-agnostic**, supports **progressive enhancement**, and is both **testing** and **maintenance friendly**, with **session continuity**, **resource management**, and **component isolation** baked in. Its **modular** and **predictable** design accelerates **development speed** and ensures smooth integration with existing JavaScript environments.

## Initialization

For detailed guidance on how to get started with the framework, please refer to our [setup documentation](https://github.com/Shedjs/shedjs/blob/main/documentation/core/getting-started.md).

## Code Examples

For in-depth examples and usage of the framework’s APIs and methods, please see our [modules documentation](https://github.com/Shedjs/shedjs/blob/main/documentation/modules).

## Contribution

Submit PRs to improve the [framework](https://github.com/Shedjs/shedjs)

## License

Open-sourced under [The MIT License](https://github.com/Shedjs/shedjs/blob/main/LICENSE.md).  
