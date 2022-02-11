const argParse = require('liquid-args');
const path = require('path');
const p = (...args) => path.join(__dirname, ...args);
const headerTemplate = require(p('dist', 'template.js'));

const buildHeader = function(...args) {
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

module.exports.generateHtml = buildHeader;

module.exports.eleventy = (eleventyConfig, opts={}) => {
    let { tagName = 'header' } = opts;
    eleventyConfig.addNunjucksShortcode(tagName, buildHeader);
    eleventyConfig.addLiquidTag(tagName, function(liquidEngine) {
        return {
            parse: function(tagToken) {
                this.args = tagToken.args;
            },
            render: async function(scope) {
                const evalValue = arg => liquidEngine.evalValue(arg, scope);
                const args = await Promise.all(argParse(this.args, evalValue));
                return buildHeader(...args);
            }
        };
    });
};
