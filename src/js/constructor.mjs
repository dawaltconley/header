import CollapsibleMenu from './collapsible-menu.mjs';
import FixedHeader from './fixed-header.mjs';

/**
 * Create a fixed header and collapsible menu from the same element.
 * @param {Element} element - header parent element
 * @param {Object} [options]
 * @param {string} [options.name='header'] - base name for BEM classes
 * @param {Element} [options.scrollable=document.scrollingElement] - element to monitor for scrolling
 * @returns {Object}
 */
export default (element, options) => {
    let original = new CollapsibleMenu(element, options);
    let fixed = new FixedHeader(element, options);
    fixed.menu = new CollapsibleMenu(fixed.element, options);

    return { original, fixed };
};
