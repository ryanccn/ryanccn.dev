const { EleventyRenderPlugin } = require('@11ty/eleventy');
const pluginReadingTime = require('eleventy-plugin-reading-time');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginShikier = require('./src/_11ty/plugins/shikier');

const sitePluginShortcodes = require('./src/_11ty/shortcodes');
const sitePluginFilters = require('./src/_11ty/filters');
const sitePluginMarkdown = require('./src/_11ty/plugins/markdown');
const sitePluginHtmlmin = require('./src/_11ty/plugins/htmlmin');

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
const config = (eleventyConfig) => {
  require('dotenv').config({
    path: '.env.local',
  });

  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginReadingTime);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginShikier);

  eleventyConfig.addPlugin(sitePluginShortcodes);
  eleventyConfig.addPlugin(sitePluginFilters);
  eleventyConfig.addPlugin(sitePluginMarkdown);
  eleventyConfig.addPlugin(sitePluginHtmlmin);

  eleventyConfig.addPassthroughCopy({
    './src/assets/icons': 'icons',
    './src/assets/fonts': 'assets/fonts',
    './functions': 'functions',
    './_headers': '_headers',
    './_redirects': '_redirects',
  });

  eleventyConfig.addWatchTarget('tailwind.config.js');
  eleventyConfig.addWatchTarget('src/assets/**/*.{js,ts,css}');
  eleventyConfig.addWatchTarget('src/utils/*.js');

  eleventyConfig.ignores.add('README.md');
  eleventyConfig.ignores.add('src/utils/socialImages/');

  eleventyConfig.setServerOptions({
    domDiff: false,
  });

  return {
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
  };
};

module.exports = config;
