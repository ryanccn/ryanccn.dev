const { EleventyRenderPlugin } = require('@11ty/eleventy');
const pluginReadingTime = require('eleventy-plugin-reading-time');
const pluginRss = require('@ryanccn/eleventy-plugin-rss');
const pluginIcons = require('eleventy-plugin-icons');

const sitePluginShortcodes = require('./src/_11ty/shortcodes');
const sitePluginFilters = require('./src/_11ty/filters');
const sitePluginMarkdown = require('./src/_11ty/plugins/markdown');
const sitePluginShiki = require('./src/_11ty/plugins/shiki');
const sitePluginHtmlmin = require('./src/_11ty/plugins/htmlmin');

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
const config = (eleventyConfig) => {
  require('dotenv').config();

  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginReadingTime);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginIcons, {
    mode: 'inline',
    sources: [
      { name: 'lucide', path: './node_modules/lucide-static/icons' },
      { name: 'simpleicon', path: './node_modules/simple-icons/icons' },
      { name: 'custom', path: './src/_icons' },
    ],
    icon: {
      class: () => '',
      attributesBySource: {
        simpleicon: {
          fill: 'currentColor',
          stroke: 'none',
        },
      },
    },
  });

  eleventyConfig.addPlugin(sitePluginShortcodes);
  eleventyConfig.addPlugin(sitePluginFilters);
  eleventyConfig.addPlugin(sitePluginMarkdown);
  eleventyConfig.addPlugin(sitePluginShiki);
  eleventyConfig.addPlugin(sitePluginHtmlmin);

  eleventyConfig.addPassthroughCopy({
    './src/assets/icons': 'icons',
    './src/assets/fonts': 'assets/fonts',
    './_headers': '_headers',
    './_redirects': '_redirects',
  });

  eleventyConfig.addWatchTarget('tailwind.config.js');
  eleventyConfig.addWatchTarget('src/_11ty/**/*.js');
  eleventyConfig.addWatchTarget('src/_icons/**/*.js');
  eleventyConfig.addWatchTarget('src/assets/**/*.{js,ts,css}');
  eleventyConfig.addWatchTarget('src/utils/*.js');
  eleventyConfig.addWatchTarget('.env');

  eleventyConfig.ignores.add('README.md');
  eleventyConfig.ignores.add('src/utils/socialImages/');

  eleventyConfig.setServerOptions({ domDiff: false });

  return {
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
  };
};

module.exports = config;
