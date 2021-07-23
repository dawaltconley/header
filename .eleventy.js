const fs = require('fs');
const path = require('path');
const p = (...args) => path.join(__dirname, ...args);

module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy('dist/header.css');
    eleventyConfig.addPassthroughCopy('dist/header.js');

    return {
        dir: {
            input: './eleventy',
            output: './eleventy/_site',
        },
        htmlTemplateEngine: 'njk'
    }
}
