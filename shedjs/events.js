class ShedEvent {
    constructor(){
        // Pour stocker les gestionnaires d'événements
        // Chaque gestionnaire est un objet contenant l'ID, le type d'événement, le sélecteur et la fonction de rappel
        // ID est un nombre unique pour chaque gestionnaire
        // Le sélecteur est une chaîne CSS pour cibler les éléments
        // La fonction de callback est la fonction à exécuter lorsque l'événement se produit
        this.handlers = [];
        // Map pour suivre les éléments déjà traités par événement
        // Chaque élément est identifié par une clé unique basée sur son tagName, ses classes et son ID
        // La clé est une chaîne de caractères
        // La valeur est un ensemble d'événements déjà appliqués à cet élément
        // Cela permet d'éviter d'appliquer plusieurs fois le même gestionnaire à un même élément
        this.processedItems = new Map();
        // Liste d'événements pris en charge  
        // Ces événements sont ceux que nous allons écouter sur les éléments
        // Ils incluent des événements courants comme 'click', 'input', 'keydown', etc.
        // Cette liste peut être étendue pour inclure d'autres événements si nécessaire
        this.supportedEvents = ['click', 'input', 'keydown', 'scroll', 'mouseover', 'mouseout', 'change', 'submit'];
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
        return false;
    }
    /**
 * Applique un gestionnaire d'événement aux éléments correspondants
 * @param {Object} handler - Gestionnaire d'événement à appliquer
 */
     applyEventHandler(handler) {
        const { event, selector, callback, id } = handler;
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

                el.addEventListener(event, (e) => {
                    this.handlers.forEach(h => {
                        if (h.event === event && el.matches(h.selector)) {
                            h.callback(e, el);
                        }
                    });
                });
            }
        });
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
                this.handlers.forEach(handler => this.applyEventHandler(handler));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log('Système event initialisé');
    }

}

export default ShedEvent;





