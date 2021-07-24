const fs = require('fs');
const path = require('path');
const p = (...args) => path.join(__dirname, ...args);
const yaml = require('js-yaml');

module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy('dist');
    eleventyConfig.addPassthroughCopy('eleventy/css');

    // add YAML support
    eleventyConfig.addDataExtension('yml', data => yaml.safeLoad(data));
    eleventyConfig.addDataExtension('yaml', data => yaml.safeLoad(data));

    return {
        dir: {
            input: './eleventy',
            output: './eleventy/_site',
        },
        htmlTemplateEngine: 'njk'
    }
}
