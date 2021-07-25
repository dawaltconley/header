const path = require('path');
const p = (...args) => path.join(__dirname, ...args);
const yaml = require('js-yaml');
const header = require(p('index.js'));

module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy('dist');
    eleventyConfig.addPassthroughCopy('eleventy/css');
    eleventyConfig.addWatchTarget('eleventy/css/**/*.css');
    eleventyConfig.addWatchTarget('eleventy/_sass/**/*.scss');

    // add YAML support
    eleventyConfig.addDataExtension('yml', data => yaml.safeLoad(data));
    eleventyConfig.addDataExtension('yaml', data => yaml.safeLoad(data));

    eleventyConfig.addPlugin(header.eleventy);

    return {
        dir: {
            input: './eleventy',
            output: './eleventy/_site',
        },
        htmlTemplateEngine: 'njk'
    };
};
