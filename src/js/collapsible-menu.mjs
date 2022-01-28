class CollapsibleMenu {
    constructor(element, opts={}) {
        let {
            n = 'header',
        } = opts;
        this.element = element;
        this.buttons = {
            open: Array.from(element.querySelectorAll('[data-menu-button="open"]')),
            close: Array.from(element.querySelectorAll('[data-menu-button="close"]')),
            toggle: Array.from(element.querySelectorAll('[data-menu-button="toggle"],[data-menu-button=""]'))
        };
        this.links = element.querySelector('[data-menu-links]');
        this.state = 'closed';

        const cssOnlyClasses = [ `${n}__nav--target` ];
        const cssOnlyQueries = cssOnlyClasses.map(c => '.' + c).join(', ');
        Array.from(element.querySelectorAll(cssOnlyQueries))
            .forEach(e => e.classList.remove(...cssOnlyClasses));

        for (const button of this.buttons.close)
            if (button.hash && location.hash === button.hash)
                location.href = location.href.replace(/#.*$/, '');

        this.close();
        this.addListeners();
    }

    open() {
        this.links.style.maxHeight = this.links.scrollHeight.toString() + 'px';
        this.buttons.open.forEach(function (button) {
            button.style.display = 'none';
        });
        this.buttons.close.forEach(function (button) {
            button.style.display = null;
        });
        this.state = 'open';
        // this.removeListener = onScrollDown(function () {
        //     if (this.element.getBoundingClientRect().top <=0) {
        //         this.close();
        //         this.removeListener();
        //     }
        // }.bind(this));
    }

    close() {
        this.links.style.maxHeight = '';
        this.buttons.close.forEach(function (button) {
            button.style.display = 'none';
        });
        this.buttons.open.forEach(function (button) {
            button.style.display = null;
        });
        this.state = 'closed';
        // this.removeListener();
    }

    toggle() {
        if (this.state === 'closed') {
            this.open();
        } else if (this.state === 'open') {
            this.close();
        }
    }

    addListeners() {
        for (const method in this.buttons) {
            if (this.buttons[method]) {
                this.buttons[method].forEach(function (button) {
                    button.addEventListener('click', function (event) {
                        event.preventDefault();
                        this[method]();
                    }.bind(this));
                }, this);
            }
        }
    }
}

export default CollapsibleMenu;
