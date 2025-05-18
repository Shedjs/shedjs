class Dom {
    /**
     * Creates a DOM element with specified tag, properties, and children.
     * 
     * @param {string} tag - The HTML tag name (e.g., 'div', 'span')
     * @param {Object} [props={}] - Element properties/attributes (e.g., { id: 'app', onClick: handler })
     * @param {...(Node|string)} children - Child elements or text content
     * @returns {HTMLElement} The created DOM element
     * 
     * @example
     * const button = Dom.createElement('button', { class: 'btn' }, 'Click me');
     */
    static createElement(tag, props = {}, ...children) {
        const element = document.createElement(tag);

        // Apply all properties/attributes to the element
        Object.keys(props).forEach(key => {
            Dom.setAttribute(element, key, props[key]);
        });

        // Process children (supports both text nodes and DOM elements)
        children.forEach(child => {
            if (typeof child === 'string') {
                // Convert strings to text nodes for safe insertion
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                // Append existing DOM nodes directly
                element.appendChild(child)
            }
            // Note: Silently skips other types (boolean, number, etc.)
        });

        return element;
    }

    /**
     * Sets an attribute, property, or event listener on a DOM element.
     * Handles different value types including:
     * - Event handlers (onClick, onInput)
     * - Class names (className)
     * - Style objects
     * - Native element properties
     * - Fallback to HTML attributes
     * 
     * @param {Node} element - The target DOM element
     * @param {string} key - Attribute/property name (e.g., 'id', 'onClick', 'style')
     * @param {*} value - The value to set (type depends on key)
     * @throws {Error} If element is not a valid DOM node
     * 
     * @example
     * // Set an attribute
     * Dom.setAttribute(div, 'title', 'Tooltip');
     * 
     * // Add an event listener
     * Dom.setAttribute(button, 'onClick', () => console.log('Clicked'));
     * 
     * // Apply styles
     * Dom.setAttribute(div, 'style', { color: 'red', fontSize: '16px' });
     */
    static setAttribute(element, key, value) {
        if (!(element instanceof Node)) {
            throw new Error('Invalid element provided');
        }

        // Handle event listeners (e.g., onClick, onInput)
        if (key.startsWith('on') && typeof value === "function") {
            const event = key.slice(2).toLowerCase(); // Remove 'on' prefix
            element.addEventListener(event, value);
            return; // Early return for clean control flow
        }

        // Special cases for className and style
        switch (key) {
            case 'className':
                element.className = value; // Direct property access
                break;
            case 'style':
                if (typeof value === 'object') {
                    Object.assign(element.style, value); // Merge style objects
                }
                break;
            default:
                // Set as property if it exists on the element
                if (key in element) {
                    element[key] = value; // ex: id, value, hidden
                } else {
                    // Fallback to HTML attribute
                    element.setAttribute(key, value);
                }
        }
    }

    /**
     * Appends one or more children to a parent DOM element.
     * Handles multiple child types:
     * - DOM Nodes (appends directly)
     * - Strings/Numbers (converts to text nodes)
     * - Arrays (flattens and appends recursively)
     * - Null/undefined values (silently skips)
     * 
     * @param {Node} parent - The target parent element
     * @param {Node|string|number|Array|null} child - Child to append (or array of children)
     * @throws {Error} If parent is not a valid DOM node
     * 
     * @example
     * // Append single element
     * Dom.appendChild(container, Dom.createElement('div'));
     * 
     * // Append text
     * Dom.appendChild(container, 'Hello World');
     * 
     * // Append multiple items
     * Dom.appendChild(container, [
     *   'Text node',
     *   Dom.createElement('span', {}, 'More text'),
     *   01 // Number becomes text node
     * ]);
     */
    static appendChild(parent, child) {
        if (!(parent instanceof Node)) {
            throw new Error(`Invalid parent element: Expected DOM Node, got ${parent?.constructor?.name}`);
        }

        // Skip null/undefined without error (common in conditional rendering)
        if (child == null) return;

        // Handle arrays recursively
        if (Array.isArray(child)) {
            child.forEach(c => Dom.appendChild(parent, c));
            return;
        }

        // Convert primitives to text nodes
        if (typeof child === 'string' || typeof child === 'number') {
            child = Dom.createTextNode(child.toString());
        }

        // Only append valid DOM nodes
        if (child instanceof Node) parent.appendChild(child);

        // Note: Silently skips non-renderable types (boolean, symbol, function, etc.) 
    }

    /**
     * Creates a text node with proper type conversion.
     * 
     * @param {string|number} text - The text content
     * @returns {Text} The created text node
     * 
     * @example
     * const greeting = Dom.createTextNode('Hello'); // Text node
     * const answer = Dom.createTextNode(01); // Converts numbers
     */
    static createTextNode(text) {
        return document.createTextNode(String(text)); // Ensure string conversion
    }

    /**
     * Clears and renders a DOM element into a container.
     * Safely replaces all existing content in the container.
     * 
     * @param {Node} element - The DOM element to render (must be a valid Node)
     * @param {Node} container - The target container (must be a valid Node)
     * @returns {Node} The rendered element for chaining
     * @throws {Error} If container or element is invalid
     * 
     * @example
     * // Basic usage
     * const app = document.getElementById('app');
     * const root = Dom.createElement('div', { id: 'root' });
     * Dom.render(root, app);
     * 
     * @example
     * // Chaining
     * Dom.render(
     *   Dom.createElement('h1', {}, 'Hello'),
     *   document.body
     * ).classList.add('fade-in');
     */
    static render(element, container) {
        // Validate inputs with detailed errors
        if (!(container instanceof Node)) {
            throw new Error(`Invalid container: Expected DOM Node, got ${container?.constructor?.name}`);
        }
        if (!(element instanceof Node)) {
            throw newError(`Invalid element: Expected DOM Node, got ${element?.constructor?.name}`);
        }

        // Performance optimization: Skip clear if container is empty
        if (container.hasChildNodes()) {
            container.innerHTML = ''; // Clear existing content
        }

        container.appendChild(element);
        return element; // Allow method chaining
    }

    /**
     * Chainable version of render() that returns an interface with Dom methods.
     * Allows fluent-style operations after rendering, in a consistent behavior.
     * 
     * @param {Node} element - DOM element to render
     * @param {Node} container - Target container element
     * @returns {Object} Chainable interface with:
     *   - .element {Node} - Reference to the rendered DOM node
     *   - .set(key, value) - Proxy to Dom.setAttribute()
     *   - .addChildren(children) - Proxy to Dom.appendChild()
     *   - .on(event, handler) - Uses Dom.setAttribute()'s event handling
     * 
     * @example
     * // Fluent chaining
     * Dom.renderChainable(Dom.createElement('div'), appContainer)
     *   .set('id', 'main-card')
     *   .addChildren([
     *     Dom.createElement('h3', {}, 'Title'),
     *     'Description text'
     *   ])
     *   .on('click', handleInteraction);
     * 
     * @example
     * // Single operation
     * const { element } = Dom.renderChainable(modal, document.body);
     * element.focus(); // Access raw DOM node when needed
     */
    static renderChainable(element, container) {
        // Renders element and stores reference
        const renderedElement = this.render(element, container);

        // Chainable interface that proxies to core Dom methods
        const chainable = {
            element: renderedElement,
            // Sets attributes/properties via Dom.setAttribute()
            set: (k, v) => { this.setAttribute(renderedElement, k, v); return chainable; },
            // Appends children via Dom.appendChild()
            addChildren: (children) => {
                this.appendChild(renderedElement, children);
                return chainable;
            },
            // Handles events via Dom.setAttribute()'s on* logic
            on: (evt, handler) => {
                this.setAttribute(renderedElement, `on${evt}`, handler);
                return chainable;
            }
        };

        return chainable;
    }
}
