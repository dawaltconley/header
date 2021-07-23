/*
 * Collapsible Menus
 */

const toArray = collection => Array.prototype.slice.call(collection);

class CollapsibleMenu {
    constructor(element) {
        this.element = element;
        this.buttons = {
            open: toArray(element.querySelectorAll('[data-menu-button="open"]')),
            close: toArray(element.querySelectorAll('[data-menu-button="close"]')),
            toggle: toArray(element.querySelectorAll('[data-menu-button="toggle"],[data-menu-button=""]'))
        };
        this.links = element.querySelector('[data-menu-links]');
        this.state = 'closed';

        for (const button of this.buttons.close)
            if (button.hash && location.hash === button.hash)
                location.href = location.href.replace(/#.*$/, '');
    }

    open() {
        this.links.style.maxHeight = this.links.scrollHeight.toString() + 'px';
        this.buttons.open.forEach(function (button) {
            button.classList.add('hidden');
        });
        this.buttons.close.forEach(function (button) {
            button.classList.remove('hidden');
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
            button.classList.add('hidden');
        });
        this.buttons.open.forEach(function (button) {
            button.classList.remove('hidden');
        });
        this.state = 'closed';
        this.removeListener();
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
                    button.classList.remove('target-hide', 'target-display');
                    button.addEventListener('click', function (event) {
                        event.preventDefault();
                        this[method]();
                    }.bind(this));
                }, this);
            }
        }
    }
}

module.exports = CollapsibleMenu;

// Browser compatible
//
// var toArray = collection => Array.prototype.slice.call(collection);
//
// var collapsibleMenus = toArray(document.querySelectorAll("[data-menu]")).map(function (e) {
//     var o = new CollapsibleMenu(e);
//     // if (fixedHeader && fixedHeader === e) {
//     //     fixedHeader.menu = o;
//     // }
//     return o;
// });
//
// function CollapsibleMenu(element) {
//     this.element = element;
//     this.buttons = {
//         "open" : toArray(element.querySelectorAll('[data-menu-button="open"]')),
//         "close" : toArray(element.querySelectorAll('[data-menu-button="close"]')),
//         "toggle" : toArray(element.querySelectorAll('[data-menu-button="toggle"],[data-menu-button=""]'))
//     };
//     this.links = element.querySelector('[data-menu-links]');
//     this.state = "closed";
// }
//
// collapsibleMenus.forEach(function (menu) {
//     menu.buttons.open.forEach(function (button) {
//         if (button.hash && location.hash === button.hash) {
//             location.href = location.href.replace(/#.*$/, "");
//         }
//     });
// });
//
// CollapsibleMenu.prototype.open = function () {
//     this.links.style.maxHeight = this.links.scrollHeight.toString() + "px";
//     this.buttons.open.forEach(function (button) {
//         button.classList.add("hidden");
//     });
//     this.buttons.close.forEach(function (button) {
//         button.classList.remove("hidden");
//     });
//     this.state = "open";
//     // this.removeListener = onScrollDown(function () {
//     //     if (this.element.getBoundingClientRect().top <=0) {
//     //         this.close();
//     //         this.removeListener();
//     //     }
//     // }.bind(this));
// };
//
// CollapsibleMenu.prototype.close = function () {
//     this.links.style.maxHeight = "";
//     this.buttons.close.forEach(function (button) {
//         button.classList.add("hidden");
//     });
//     this.buttons.open.forEach(function (button) {
//         button.classList.remove("hidden");
//     });
//     this.state = "closed";
//     this.removeListener();
// };
//
// CollapsibleMenu.prototype.toggle = function () {
//     if (this.state === "closed") {
//         this.open();
//     } else if (this.state === "open") {
//         this.close();
//     }
// };
//
// CollapsibleMenu.prototype.addListeners = function () {
//     for (var method in this.buttons) {
//         if (this.buttons[method]) {
//             this.buttons[method].forEach(function (button) {
//                 button.classList.remove("target-hide", "target-display");
//                 button.addEventListener("click", function (event) {
//                     event.preventDefault();
//                     this[method]();
//                 }.bind(this));
//             }, this);
//         }
//     }
// };
//
