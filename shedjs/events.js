import { FrameworkError } from "./errors.js"

class Event {
    constructor() {
        /**
         * Internal registry of all event handlers.
         * Structure: {id, event, selector, callback, _winListener?}
         * @private
         */
        this._handlers = [];

        /**
         * Tracks elements that already have event listeners
         * Prevents duplicate event binding on the same elements.
         * Format: Map<ElementIdentifier, Set<EventType>>
         * @private
         */
        this._processedItems = new Map();

        /**
         * Standard DOM events bound to individual elements
         * @private
         */
        this._domEvents = [
            'click', 'dblclick', 'input', 'keydown', 'scroll',
            'mouseover', 'mouseout', 'change', 'submit',
            'keypress', 'keyup', 'blur', 'focus'
        ];

        /**
         * Global events bound to window/document
         * @private
         */
        this._winOrDocEvents = [
            'resize', 'load', 'unload', 'beforeunload',
            'hashchange', 'popstate', 'DOMContentLoaded'
        ];

        /**
         * Combined list of all supported event types
         * @private
         */
        this._supportedEvents = [...this._domEvents, ...this._winOrDocEvents];

        /**
         * Flag to prevent duplicate initialization
         * @private
         */
        this._initialized = false;

        /**
         * Initializes the event system
         * @private
         */
        this._initEventSystem();

        // Note: developers shouldn't access these variables directly, they are internal.
    }

    /**
     * Registers a new event handler
     * @param {string} event - Event type (e.g., 'click', 'keyup')
     * @param {string} selector - CSS selector or 'window'/'document' for global events
     * @param {Function} callback - Handler function
     * @returns {number} Handler ID for removal
     * @throws {FrameworkError} On invalid event type or callback
     */
    onEvent(event, selector, callback) {
        if (!this._supportedEvents.includes(event)) {
            throw new FrameworkError(
                'EVENT',
                'UNSUPPORTED_EVENT',
                `Event "${event}" is not supported`,
                { supportedEvents: this._supportedEvents }
            );
        }

        if (typeof callback !== 'function') {
            throw new FrameworkError(
                'EVENT',
                'INVALID_CALLBACK',
                'Callback must be a function',
                { received: typeof callback }
            );
        }

        const id = this._handlers.length;
        this._handlers.push({ id, event, selector, callback });
        this._applyEventHandler(this._handlers[this._handlers.length - 1]);

        return id;
    }

    /**
     * Removes an event handler by ID
     * @param {number} handlerId - The ID returned by onEvent()
     * @returns {boolean} True if handler was found and removed
     */
    removeEvent(handlerId) {
        const index = this._handlers.findIndex(h => h.id === handlerId);
        if (index === -1) return false;

        const handler = this._handlers[index];

        // Special cleanup for window/document events
        if (handler._winListener) {
            window.removeEventListener(handler.event, handler._winListener);
        }

        this._handlers.splice(index, 1);
        return true;
    }

    /**
     * Applies an event handler to matching elements
     * @private
     * @param {object} handler - The handler object from _handlers
     */
    _applyEventHandler(handler) {
        const { event, selector, callback, id } = handler;
        if (this._winOrDocEvents.includes(event) && (selector === 'window' || selector === 'document')) {
            const winListener = (e) => callback(e, window);
            handler._winListener = winListener;
            // window.addEventListener(event, winListener);
            window[`on${event}`] = winListener; // ⚠️ Inline assignment
            return;
        }

        try {
            const elements = document.querySelectorAll(selector);

            elements.forEach(el => {
                const elementKey = `${el.tagName}-${Array.from(el.classList).join('-')}-${el.id || Math.random()}`;
                if (!this._processedItems.has(elementKey)) {
                    this._processedItems.set(elementKey, new Set());
                }

                const elementEvents = this._processedItems.get(elementKey);
                if (!elementEvents.has(event)) {
                    elementEvents.add(event);
                    // el.addEventListener(event, (e) => {
                    el[`on${event}`] = (e) => { // ⚠️ Inline assignment
                        this._handlers.forEach(h => {
                            if (h.event === event && el.matches(h.selector)) {
                                h.callback(e, el);
                            }
                        });
                    };
                }
            });
        } catch (error) {
            console.error(`Erreur lors de l'application du gestionnaire d'événement: ${error}`);
        }
    }

    /**
     * Processes existing elements and sets up an
     * observer for new elements added to the DOM
     * @private
     */
    _initEventSystem() {
        if (this._initialized) {
            console.warn('[Framework] Event system already initialized');
            return;
        }

        this._handlers.forEach(handler => this._applyEventHandler(handler));
        const observer = new MutationObserver((mutations) => {
            let reapplyAgain = false;

            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    reapplyAgain = true;
                }
            });
            if (reapplyAgain) {
                this._handlers.forEach(handler => {
                    if (!this._winOrDocEvents.includes(handler.event) && handler.selector !== 'window' && handler.selector !== 'document') {
                        this._applyEventHandler(handler);
                    }
                });
            }
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            console.warn('Le body du document n\'est pas encore disponible pour l\'observateur.');
            // window.addEventListener('DOMContentLoaded', () => {
            window.onload = () => { // ⚠️ Inline fallback (less ideal)
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            };
        }
        console.log('Event system initialized');
    }
}

export default Event;
