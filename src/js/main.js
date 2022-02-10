import CollapsibleMenu from './collapsible-menu.mjs';
import FixedHeader from './fixed-header.mjs';

let fixedHeader = document.querySelector('[data-fixed-header]');

if (fixedHeader)
    fixedHeader = new FixedHeader(fixedHeader);

const collapsibleMenus = Array.from(document.querySelectorAll('[data-collapsible-menu]'))
    .map(e => {
        const o = new CollapsibleMenu(e);
        if (fixedHeader && fixedHeader.element === e)
            fixedHeader.menu = o;
        return o;
    });

export { fixedHeader, collapsibleMenus };
