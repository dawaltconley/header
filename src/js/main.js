import CollapsibleMenu from './collapsible-menu.mjs';
import FixedHeader from './fixed-header.mjs';

const constructor = (element, options) => {
    let original = new CollapsibleMenu(element, options);
    let fixed = new FixedHeader(element, options);
    fixed.menu = new CollapsibleMenu(fixed.element, options);

    return { original, fixed };
};

export default constructor;
