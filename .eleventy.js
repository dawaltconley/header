const fs = require('fs');
const path = require('path');
const p = (...args) => path.join(__dirname, ...args);

module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy('dist');
    eleventyConfig.addPassthroughCopy('eleventy/css');

    return {
        dir: {
            input: './eleventy',
            output: './eleventy/_site',
        },
        htmlTemplateEngine: 'njk'
    }
}
