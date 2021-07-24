const path = require('path');
const p = (...args) => path.join(__dirname, ...args);
const headerTemplate = require(p('dist', 'dot.js'));

module.exports = eleventyConfig => {
    eleventyConfig.addNunjucksShortcode('header', (links, logo=undefined, opts={}) => {
        return headerTemplate({
            links: links,
            logo: logo,
            name: opts.name || 'header',
            center: opts.center,
            pathPrefix: opts.pathPrefix || ''
        });
    });
};
