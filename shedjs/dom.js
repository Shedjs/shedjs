class Dom {

    //Creates a new DOM element with given tag, props, and children
    static createElement(tag, props = {}, ...children) {
        const element = document.createElement(tag);

        // Set attributes if any
        Object.keys(props).forEach(key => {
            Dom.setAttribute(key, props[key])
        })

        // Append children: Handle both string (text) and element nodes
        children.forEach(child => {
            if (typeof child === 'string') {
                // Append as text node if it's a string
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                // Append as element node if it's a valid DOM node
                element.appendChild(child)
            }
        });

        return element
    }

    //Sets an attribute/property on a DOM elemen
    static setAttribute(element, key, value) {
        if (!(element instanceof Node)) {
            throw new Error('Invalid element provided');
        }
        if (key.startsWith('on') && typeof value === "function") {
            const event = key.slice(2).toLowerCase();
            element.addEventListener(event, value);
        } else if (key === "className") {
            element.className = value;
        } else if (key === "style" && typeof value === "object") {
            Object.assign(element.style, value)
        } else if (key in element) {
            element[key] = value
        } else {
            element.setAttribute(key, value)
        }
    }
    // Appends a child to a parent element
    static appendChild(parent, child) {
        if (!(parent instanceof Node)) {
            throw new Error('Invalid parent element');
        }
        if (child == null || parent == null) {
            return;
        }

        if (Array.isArray(child)) {
            child.forEach(c => Dom.appendChild(parent, c))
        }

        if (typeof child == "string" || typeof child === "number") {
            parent.appendChild(document.createTextNode(child.toString()));
        } else if (child instanceof Node) {
            parent.appendChild(child)
        }

    }
    // Creates a text node
    static createTextNode(text) {
        return document.createTextNode(text);
    }
    // Renders an element to a container
    static render(element, container) {
        if (!(container instanceof Node)) {
            throw new Error('Invalid container');
        }
        if (!(element instanceof Node)) {
            throw new Error('Invalid element to render');
        }
        container.innerHTML = '';
        container.appendChild(element);

        return element;
    }
}

