
class Dom {
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
        return document.createTextNode(String(text));
    }

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
        Object.keys(props).forEach(key => {
            Dom.setAttribute(element, key, props[key]);
        });
        children.forEach(child => {
            Dom.appendChild(element, child);
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
            throw new Error(`Expected valid DOM Node for setAttribute(), got ${element?.constructor?.name}`);
        }

        if (key.startsWith('on') && typeof value === "function") {
            element[key.toLowerCase()] = value;
            return;
        }

        switch (key) {
            case 'className':
                element.className = value;
                break;
            case 'style':
                if (typeof value === 'object') {
                    Object.assign(element.style, value);
                }
                break;
            default:
                if (key in element) {
                    element[key] = value;
                } else {
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

        if (child == null) return;

        if (Array.isArray(child)) {
            child.forEach(c => Dom.appendChild(parent, c));
            return;
        }

        if (typeof child === 'string' || typeof child === 'number') {
            parent.appendChild(Dom.createTextNode(String(child)));
        } else if (child instanceof Node) {
            parent.appendChild(child);
        } else if (child?.tag) {
            Dom.appendChild(parent, Dom.createFromVNode(child));
        } else {
            console.warn('Unsupported child type ignored:', child);
        }
    }

    /**
     * Converts a Virtual DOM (VDOM) node into a real DOM element.
     * Recursively processes child nodes and handles primitive values.
     * 
     * @static
     * @param {Object|string|number} vnode - The virtual node to convert. Can be:
     *   - An object with `tag`, `attrs`, `children` (VDOM structure)
     *   - A string/number (converted to text node)
     * @returns {Node} The created DOM element or text node.
     * 
     * @example
     * // VDOM input
     * const vnode = {
     *   tag: 'div',
     *   attrs: { class: 'container' },
     *   children: [
     *     { tag: 'p', children: ['Hello'] },
     *     'World' // Auto-converted to text node
     *   ]
     * };
     * 
     * // Usage
     * const domElement = Dom.createFromVNode(vnode);
     * Dom.appendChild(document.body, domElement);
     */
    static createFromVNode(vnode) {
        if (typeof vnode === 'string' || typeof vnode === 'number') {
            return this.createTextNode(vnode);
        }

        const element = this.createElement(vnode.tag, vnode.attrs || {});

        if (vnode.children) {
            vnode.children.forEach(child => {
                if (child == null) return;
                if (typeof child === 'string' || typeof child === 'number') {
                    this.appendChild(element, this.createTextNode(String(child)));
                } else {
                    this.appendChild(element, child);
                }
            });
        }

        return element;
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
        if (!(container instanceof Node)) {
            throw new Error('Container must be a DOM element');
        }
        if (!(element instanceof Node)) {
            throw new Error(`Invalid element: Expected DOM Node, got ${element?.constructor?.name}`);
        }

        if (container.hasChildNodes()) {
            container.innerHTML = '';
        }
        container.appendChild(element);
        return element;
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
        const renderedElement = this.render(element, container);
        const chainable = {
            element: renderedElement,
            set: (k, v) => { this.setAttribute(renderedElement, k, v); return chainable; },
            addChildren: (children) => {
                this.appendChild(renderedElement, children);
                return chainable;
            },
            on: (evt, handler) => {
                this.setAttribute(renderedElement, `on${evt}`, handler);
                return chainable;
            }
        };
        return chainable;
    }

    // Virtual DOM helper for creating VNodes
    static h(tag, attrs = {}, children = []) {
        return {
            tag,
            attrs,
            children: Array.isArray(children) ? children : [children],
            key: attrs.key || null
        };
    }

    // Efficient diffing and patching
    static patch(parent, newVNode, oldVNode, index = 0) {
        // Handle null/undefined cases
        if (!oldVNode && !newVNode) return;

        // Case 1: New node added
        if (!oldVNode) {
            const newNode = this.createFromVNode(newVNode);
            if (parent.childNodes[index]) {
                parent.insertBefore(newNode, parent.childNodes[index]);
            } else {
                parent.appendChild(newNode);
            }
            return;
        }

        // Case 2: Node removed
        if (!newVNode) {
            const nodeToRemove = parent.childNodes[index];
            if (nodeToRemove) {
                parent.removeChild(nodeToRemove);
            }
            return;
        }

        // Case 3: Nodes are different (by key or type)
        if (this.hasChanged(newVNode, oldVNode)) {
            const nodeToReplace = parent.childNodes[index];
            if (nodeToReplace) {
                parent.replaceChild(this.createFromVNode(newVNode), nodeToReplace);
            }
            return;
        }

        // Case 4: Same node type, update attributes and children
        if (newVNode.tag) {
            const element = parent.childNodes[index];
            if (element) {
                this.updateAttributes(element, newVNode.attrs || {}, oldVNode.attrs || {});
                this.patchChildren(element, newVNode.children || [], oldVNode.children || []);
            }
        }
    }

    static hasChanged(node1, node2) {
        // Different types
        if (typeof node1 !== typeof node2) return true;

        // Primitive values
        if (typeof node1 === 'string' || typeof node1 === 'number') {
            return node1 !== node2;
        }

        // Different tags
        if (node1.tag !== node2.tag) return true;

        // Different keys (if both have keys)
        if (node1.attrs?.key !== undefined && node2.attrs?.key !== undefined) {
            return node1.attrs.key !== node2.attrs.key;
        }

        return false;
    }

    static updateAttributes(element, newAttrs, oldAttrs) {
        // Remove old attributes that are no longer present
        Object.keys(oldAttrs).forEach(key => {
            if (!(key in newAttrs)) {
                if (key === 'className') {
                    element.className = '';
                } else if (key === 'checked' || key === 'disabled' || key === 'selected') {
                    element[key] = false;
                } else if (key.startsWith('on')) {
                    element[key.toLowerCase()] = null;
                } else {
                    element.removeAttribute(key);
                }
            }
        });

        // Set new/changed attributes
        Object.entries(newAttrs).forEach(([key, value]) => {
            if (oldAttrs[key] !== value) {
                this.setAttribute(element, key, value);
            }
        });
    }

    static patchChildren(parent, newChildren, oldChildren) {
        try {
            console.group('Diffing children');
            console.log('Old children:', oldChildren);
            console.log('New children:', newChildren);

            // If completely different, just replace
            if (newChildren.length === 0 || oldChildren.length === 0) {
                parent.innerHTML = '';
                newChildren.forEach(child => {
                    parent.appendChild(this.createFromVNode(child));
                });
                return;
            }

            // First remove excess old children
            while (parent.childNodes.length > newChildren.length) {
                parent.removeChild(parent.lastChild);
            }

            // Then update/add children
            for (let i = 0; i < newChildren.length; i++) {
                const newChild = newChildren[i];
                const oldChild = oldChildren[i];
                const domNode = parent.childNodes[i];

                if (!domNode) {
                    // New node needs to be added
                    parent.appendChild(this.createFromVNode(newChild));
                } else if (!oldChild || this.hasChanged(newChild, oldChild)) {
                    // Node needs replacement
                    parent.replaceChild(this.createFromVNode(newChild), domNode);
                } else if (newChild.tag) {
                    // Update existing node
                    this.updateAttributes(domNode, newChild.attrs || {}, oldChild.attrs || {});
                    this.patchChildren(domNode, newChild.children || [], oldChild.children || []);
                }
            }
            console.groupEnd();
        } catch (error) {
            console.error('Diffing error:', error);
            // Fallback to full re-render
            parent.innerHTML = '';
            newChildren.forEach(child => {
                parent.appendChild(this.createFromVNode(child));
            });
        }

    }

    // Efficient render method that handles diffing
    static renderWithDiff(container, newVTree, oldVTree = null) {
        if (!oldVTree) {
            // Initial render
            container.innerHTML = '';
            if (newVTree) {
                container.appendChild(this.createFromVNode(newVTree));
            }
        } else {
            // Efficient update using diffing
            this.patch(container, newVTree, oldVTree, 0);
        }
    }
}

export default Dom;
