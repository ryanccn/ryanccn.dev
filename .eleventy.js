const imageTransform = require('./utils/imageTransform');
const htmlmin = require('html-minifier');

const inProduction = process.env.NODE_ENV === 'production';

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
const config = (eleventyConfig) => {
  eleventyConfig.addPlugin(require('@11tyrocks/eleventy-plugin-social-images'));

  eleventyConfig.addPassthroughCopy({
    './src/assets/icons/*.png': 'icons',
  });

  eleventyConfig.addTransform('images', imageTransform);

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
  eleventyConfig.addWatchTarget('content');
  eleventyConfig.addWatchTarget('src/assets/**/*.{js,css}');
  eleventyConfig.addWatchTarget('utils/*.js');

  eleventyConfig.ignores.add('README.md');
  eleventyConfig.ignores.add('content');

  eleventyConfig.setBrowserSyncConfig({
    ui: false,
  });

  if (inProduction) {
    eleventyConfig.setQuietMode(true);
  }

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
    },
  };
};

module.exports = config;
