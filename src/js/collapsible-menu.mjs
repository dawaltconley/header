import { onScrollDown } from './utils.mjs';

/** Class representing a collapsible menu UI. */
class CollapsibleMenu {
    /**
     * Create a collapsible menu.
     * @param {Element} element - menu parent element
     * @param {Object} [options]
     * @param {string} [options.name='header'] - base name for menu classes
     * @param {Element} [options.scrollable] - element to monitor for scrolling (defaults to document scroll)
     */
    constructor(element, options={}) {
        let {
            name = 'header',
            scrollable
        } = options;
        this.element = element;
        this.scrollable = scrollable;
        this.buttons = {
            open: Array.from(element.querySelectorAll('[data-menu-button="open"]')),
            close: Array.from(element.querySelectorAll('[data-menu-button="close"]')),
            toggle: Array.from(element.querySelectorAll('[data-menu-button="toggle"],[data-menu-button=""]'))
        };
        this.links = element.querySelector('[data-menu-links]');
        this.state = 'closed';

        const cssOnlyClasses = [ `${name}__nav--target` ];
        const cssOnlyQueries = cssOnlyClasses.map(c => '.' + c).join(', ');
        Array.from(element.querySelectorAll(cssOnlyQueries))
            .forEach(e => e.classList.remove(...cssOnlyClasses));

        for (const button of this.buttons.close)
            if (button.hash && location.hash === button.hash)
                location.href = location.href.replace(/#.*$/, '');

        this.close();
        this.addListeners();
    }

    /** Expand the menu. */
    open() {
        this.links.style.maxHeight = this.links.scrollHeight.toString() + 'px';
        this.buttons.open.forEach(function (button) {
            button.style.display = 'none';
        });
        this.buttons.close.forEach(function (button) {
            button.style.display = null;
        });
        this.state = 'open';
        this.removeScrollListener = onScrollDown(() => {
            if (this.element.getBoundingClientRect().top <=0) {
                this.close();
                this.removeScrollListener();
            }
        }, this.scrollable);
    }

    /** Collapse the menu */
    close() {
        this.links.style.maxHeight = '';
        this.buttons.close.forEach(function (button) {
            button.style.display = 'none';
        });
        this.buttons.open.forEach(function (button) {
            button.style.display = null;
        });
        this.state = 'closed';
        if (this.removeScrollListener)
            this.removeScrollListener();
    }

    /** Toggle the menu, collapsed or expanded. */
    toggle() {
        if (this.state === 'closed') {
            this.open();
        } else if (this.state === 'open') {
            this.close();
        }
    }

    /** Attempts to add listeners for CollapsibleMenu methods. Called during construction. */
    addListeners() {
        for (const method in this.buttons) {
            if (this.buttons[method]) {
                this.buttons[method].forEach(button => {
                    button.addEventListener('click', event => {
                        event.preventDefault();
                        this[method]();
                    });
                });
            }
        }
    }
}

export default CollapsibleMenu;
