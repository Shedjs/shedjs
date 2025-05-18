<p align="center">
  <img src="logo.png" alt="Shed.js_logo" width="300"/>
</p>

<p align="center">
<b>Shed.js</b> is a mini JavaScript framework that <b>abstracts DOM manipulation, routing, state management, and event handling</b> into a clean, modular system. As a demonstration, it includes a <u>todoMVC</u> example application built using the framework itself. 📄 <a href="https://github.com/01-edu/public/tree/master/subjects/mini-framework/">Project Requirements</a> 🔍 <a href="https://github.com/01-edu/public/tree/master/subjects/mini-framework/audit">Audit Questions</a>
</p>

<p align="center">
This JavaScript mini-framework was developed by <a href="https://github.com/sadiqui">@S</a>adiqui, <a href="https://github.com/youssefhrouk">@H</a>rouk, <a href="https://github.com/aelidris">@E</a>lidrissi, and <a href="https://github.com/majnun917">@N</a>dieye.
</p>

## Features

1. **[Virtual DOM Layer](/shedjs/dom.js)**: The framework introduces a Virtual DOM system that acts as an intermediary between your application logic and the actual DOM. Instead of manipulating real DOM elements directly, which can be slow and inefficient, the framework constructs a lightweight JavaScript representation of the DOM. Changes are first applied to this virtual structure, and then a diffing algorithm efficiently updates only the necessary parts of the real DOM. This abstraction enhances performance and simplifies UI updates.

2. **[Event Handling System](/shedjs/events.js)**: Event-driven architecture is at the core of the framework. It provides a flexible system for listening to and responding to DOM events such as clicks, form inputs, and custom triggers. Event listeners are automatically bound and unbound as components are mounted or unmounted, preventing memory leaks and ensuring a smooth, reactive user experience.

3. **[State Management](/shedjs/states.js)**: The framework includes a built-in state management system to store and track your application’s data. Whether it's user input, dynamic content, or UI configuration, this system ensures consistent data flow throughout your app. By centralizing state, it simplifies debugging, testing, and logic sharing between components. When state changes, the framework automatically triggers re-rendering of affected views, keeping the interface in sync with the underlying data.

4. **[Routing System](/shedjs/routes.js)**: To support single-page applications (SPAs), the framework offers a lightweight routing solution. It allows you to define different URL paths and map them to corresponding views or components. The router handles browser navigation, updates the address bar, and dynamically displays the appropriate content, all without full-page reloads. It enables seamless transitions between different parts of your app, mimicking the behavior of traditional multi-page websites in a modern, SPA-friendly way.

## Initialization

To get started with the framework, you must first include the core module located at [framework/module.js](/shedjs/module.js) in your project. This file contains the main logic that powers the framework’s functionality. Once imported, you can create and configure your framework instance by providing it with two essential components:

- **Initial Application State:** Defines the starting point of your app’s dynamic data, which the framework will manage and react to.

- **Routing Configuration:** A mapping of URL paths to their respective components or views, enabling navigation and dynamic rendering within your single-page application.

This initialization step lays the foundation for a fully interactive, reactive, and maintainable front-end architecture, allowing you to build modular and scalable web applications with minimal setup.

## Code Examples

For detailed usage examples and module explanations, please visit our [documentation folder](/docs/module.md).

## License

This project is open-sourced under [The MIT License](https://opensource.org/license/mit).  
Copyright (c) 2025 [Shed.js](https://github.com/youssefhrouk/mini-framework/graphs/contributors).
