const argParse = require('liquid-args');
const path = require('path');
const p = (...args) => path.join(__dirname, ...args);
const headerTemplate = require(p('dist', 'template.js'));

const buildHeader = function(kwargs) {
    if (kwargs && kwargs.__keywords !== true)
        throw new Error('Header tag only takes kwargs; found positional arg.');

    let opts = {
        links: [],
        name: 'header',
        ...kwargs
    };

    return headerTemplate(opts);
};

module.exports.eleventy = (eleventyConfig) => {
    eleventyConfig.addNunjucksShortcode('header', buildHeader);
    eleventyConfig.addLiquidTag('header', function(liquidEngine) {
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
