const argParse = require('liquid-args');
const path = require('path');
const p = (...args) => path.join(__dirname, ...args);
const headerTemplate = require(p('dist', 'template.js'));

/**
 * Generates html for the header element.
 * @param {...KeywordArguments} args - one or more kwarg objects
 * @returns {string} - header html
 */
const generateHtml = function(...args) {
    let kwargs = args.find(a => a.__keywords);
    let config = args.reduce((final, obj) => {
        if (obj.__keywords)
            return final;
        return { ...final, ...obj };
    }, {});

    let { // reserve these keywords for config
        name = 'header',
        links = [],
        logo, icons,
        iconOpen, iconClose,
        ...attr // interpret everything else as an html attribute
    } = { ...config, ...kwargs };

    delete attr.__keywords;
    if (!attr.class || !attr.class.includes(name))
        attr.class = name + (attr.class ? ` ${attr.class}` : '');

    return headerTemplate({
        name, links, logo,
        icons, iconOpen, iconClose,
        attributes: attr
    });
};

/**
 * Eleventy plugin for the generateHtml function.
 * Supports inserting html via Nunjucks and Liquid tags.
 * @param {Object} [options]
 * @param {string} [options.tagName='header']
 */
const eleventy = (eleventyConfig, options={}) => {
    let { tagName = 'header' } = options;
    eleventyConfig.addNunjucksShortcode(tagName, generateHtml);
    eleventyConfig.addLiquidTag(tagName, function(liquidEngine) {
        return {
            parse: function(tagToken) {
                this.args = tagToken.args;
            },
            render: async function(scope) {
                const evalValue = arg => liquidEngine.evalValue(arg, scope);
                const args = await Promise.all(argParse(this.args, evalValue));
                return generateHtml(...args);
            }
        };
    });
};

module.exports = { generateHtml, eleventy };

/**
 * The key/value pairs used in for the `generateHtml` function and templating tags.
 * @typedef {Object} KeywordArguments
 * @property {string} [name='header'] - base name for element id and BEM classes
 * @property {Link[]} [links=[]] - array of links displayed in the header
 * @property {Logo|string} [logo] - header logo. can pass a Logo object or directly pass an html string
 * @property {Icons} [icons] - open and close icons
 * @property {string} [iconOpen] - html string for the open icon
 * @property {string} [iconClose] - html string for the close icon
 * @property {string} [attributeName] - interpret all other key/value pairs as attribute names/values in the parent `<header>` element
 */

/**
 * An object representing a header link.
 * @typedef {Object} Link
 * @property {string} text - the link's text, as displayed to the user
 * @property {string} [page] - the href value of the link
 * @property {Link[]} [dropdown] - a nested array of links, visible as a dropdown
 */

/**
 * An object representing a logo `<img>` in the header.
 * @typedef {Object} Logo
 * @property {string} src
 * @property {string} alt
 */

/**
 * An object for open and close icons in the header.
 * @typedef {Object} Icons
 * @property {string} open - html string for the open icon
 * @property {string} close - html string for the close icon
 */
