class ShedEvent {
    constructor() {
        /**
         * Registered event handlers.
         * @type {Array<{id: number, event: string, selector: string, callback: Function}>}
         * @example 
         * { id: 0, event: 'click', selector: '.btn', callback: handleClick }
         */
        this.handlers = [];

        /**
         * Tracks which elements already have event listeners.
         * Prevents duplicate bindings for the same event on the same element.
         * @type {Map<string, Set<string>>}
         * @example
         * 'DIV-btn-submit-btn' → Set(['click', 'mouseover'])
         */
        this.processedItems = new Map();

        /**
         * Supported DOM events (bound to individual elements).
         * @type {string[]}
         */
        this.domEvents = [
            'click', 'dblclick', 'input', 'keydown', 'scroll',
            'mouseover', 'mouseout', 'change', 'submit',
            'keypress', 'keyup', 'blur', 'focus'
        ];

        /**
         * Supported window/document events (global scope).
         * @type {string[]}
         */
        this.winOrDocEvents = [
            'resize', 'load', 'unload', 'beforeunload',
            'hashchange', 'popstate', 'DOMContentLoaded'
        ];

        /**
         * All allowed event types (DOM + window/document).
         * @type {string[]}
         */
        this.supportedEvents = [...this.domEvents, ...this.winOrDocEvents];
    }

    /**
     * Ajoute un gestionnaire d'événement avec un sélecteur CSS
     * @param {string} event - Type d'événement a écouter (ex: 'click', 'input', etc.)
     * @param {string} selector - Sélecteur CSS pour cibler les éléments
     * @param {Function} callback - Fonction à exécuter lors de l'événement
     * @returns {number} ID du gestionnaire pour pouvoir le supprimer plus tard
     */
    onEvent(event, selector, callback) {
        if (!this.supportedEvents.includes(event)) {
            console.warn(`Événement non supporté: ${event}`);
            return -1;
        }

        const id = this.handlers.length;

        this.handlers.push({ id, event, selector, callback });
        this.applyEventHandler(this.handlers[this.handlers.length - 1]);

        console.log(`Gestionnaire d'événement ajouté avec ID: ${id} => ${event} sur ${selector}`);

        return id;
    }

    /**
     * Supprime un gestionnaire d'événement par son ID
     * @param {number} handlerId - ID du gestionnaire à supprimer
     * @returns {boolean} true si le gestionnaire a été trouvé et supprimé
     */
    removeEvent(handlerId) {
        // console.log(`Suppression du gestionnaire d'événement avec ID: ${handlerId}`);
        const index = this.handlers.findIndex(h => h.id === handlerId);
        if (index !== -1) {
            this.handlers.splice(index, 1);
            return true;
        }
        console.log(`Aucun gestionnaire with this ID: ${handlerId}`);

        return false;
    }

    /**
     * Applique un gestionnaire d'événement aux éléments correspondants
     * @param {Object} handler - Gestionnaire d'événement à appliquer
     */
    applyEventHandler(handler) {
        const { event, selector, callback, id } = handler;
        if (this.winOrDocEvents.includes(event) && (selector === 'window' || selector === 'document')) {
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
                console.log(`Key de l'élément: ${elementKey} pour l'événement: ${event}`);

                if (!this.processedItems.has(elementKey)) {
                    this.processedItems.set(elementKey, new Set());
                }

                const elementEvents = this.processedItems.get(elementKey);

                if (!elementEvents.has(event)) {
                    elementEvents.add(event);
                    // el.addEventListener(event, (e) => {
                    el[`on${event}`] = (e) => { // ⚠️ Inline assignment
                        this.handlers.forEach(h => {
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
     * Initialisation: traite les éléments existants et configure un observateur
     * pour les nouveaux éléments ajoutés au DOM
     */
    initEventSystem() {
        this.handlers.forEach(handler => this.applyEventHandler(handler));
        const observer = new MutationObserver((mutations) => {
            let reapplyAgain = false;

            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    reapplyAgain = true;
                }
            });
            if (reapplyAgain) {
                this.handlers.forEach(handler => {
                    if (!this.winOrDocEvents.includes(handler.event) && handler.selector !== 'window' && handler.selector !== 'document') {
                        this.applyEventHandler(handler);
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
        console.log('Système event initialisé');
    }
}

export default ShedEvent;
