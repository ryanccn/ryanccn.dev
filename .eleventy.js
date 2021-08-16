const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const domTransforms = require('./utils/domTransforms');
const htmlmin = require('html-minifier');

const inProduction = process.env.NODE_ENV === 'production';

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
const config = (eleventyConfig) => {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(require('@11tyrocks/eleventy-plugin-social-images'));

  eleventyConfig.addPassthroughCopy({
    './src/assets/icons/*.png': 'icons',
  });

  eleventyConfig.addTransform('domtransforms', domTransforms);

  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (inProduction && outputPath.endsWith('.html')) {
      return htmlmin.minify(content, {
        collapseWhitespace: true,
        useShortDoctype: true,
      });
    } else {
      return content;
    }
  });

  eleventyConfig.addWatchTarget('tailwind.config.js');
  eleventyConfig.addWatchTarget('src/assets/**/*.{js,css}');
  eleventyConfig.addWatchTarget('utils/*.js');

  eleventyConfig.ignores.add('README.md');

  eleventyConfig.setBrowserSyncConfig({
    ui: false,
  });

  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
  };
};

module.exports = config;
