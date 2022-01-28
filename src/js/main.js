import CollapsibleMenu from './collapsible-menu.mjs';

const collapsibleMenus = Array.from(document.querySelectorAll('[data-collapsible-menu]'))
    .map(e => new CollapsibleMenu(e));

collapsibleMenus.forEach(function (menu) {
    menu.buttons.open.forEach(function (button) {
        if (button.hash && location.hash === button.hash) {
            location.href = location.href.replace(/#.*$/, '');
        }
    });
});

export { collapsibleMenus };
