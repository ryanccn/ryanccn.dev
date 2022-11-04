const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const registerShortcodes = require('./src/_11ty/shortcodes');

const htmlmin = require('html-minifier');

const inProduction = process.env.NODE_ENV === 'production';

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
const config = (eleventyConfig) => {
  require('dotenv').config({
    path: '.env.local',
  });

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy({
    './src/assets/icons/*.png': 'icons',
    './src/assets/fonts': 'assets/fonts',
    './_headers': '_headers',
  });

  eleventyConfig.addFilter('encodeURIComponent', encodeURIComponent);

  registerShortcodes(eleventyConfig);

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

  const markdownIt = require('markdown-it');
  const markdownItEmoji = require('markdown-it-emoji');
  const markdownItAnchor = require('markdown-it-anchor');

  const markdownLib = markdownIt({ html: true })
    .use(markdownItEmoji)
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: 'after',
        class: 'anchor',
        symbol: '#',
        level: [2, 3, 4],
      }),
      slugify: eleventyConfig.getFilter('slugify'),
    })
    .disable('code');

  eleventyConfig.setLibrary('md', markdownLib);

  eleventyConfig.addWatchTarget('tailwind.config.js');
  eleventyConfig.addWatchTarget('src/assets/**/*.{js,ts,css}');
  eleventyConfig.addWatchTarget('src/utils/*.js');

  eleventyConfig.ignores.add('README.md');
  eleventyConfig.ignores.add('src/utils/socialTmpl.html');

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
