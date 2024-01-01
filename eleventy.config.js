import 'dotenv/config.js';

import { EleventyRenderPlugin } from '@11ty/eleventy';
import pluginReadingTime from 'eleventy-plugin-reading-time';
import pluginRss from '@ryanccn/eleventy-plugin-rss';
import pluginIcons from 'eleventy-plugin-icons';
import pluginDirectoryOutput from '@11ty/eleventy-plugin-directory-output';

import { sitePluginShortcodes } from './src/_11ty/shortcodes/index.js';
import { sitePluginFilters } from './src/_11ty/filters.js';
import { sitePluginMarkdown } from './src/_11ty/plugins/markdown.js';
import { sitePluginShiki } from './src/_11ty/plugins/shiki.js';
import { sitePluginHtmlmin } from './src/_11ty/plugins/htmlmin.js';

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
const config = (eleventyConfig) => {
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

  eleventyConfig.setQuietMode(true);
  eleventyConfig.addPlugin(pluginDirectoryOutput);

  eleventyConfig.addPlugin(sitePluginShortcodes);
  eleventyConfig.addPlugin(sitePluginFilters);
  eleventyConfig.addPlugin(sitePluginMarkdown);
  eleventyConfig.addPlugin(sitePluginShiki);
  eleventyConfig.addPlugin(sitePluginHtmlmin);

  eleventyConfig.addPassthroughCopy({
    './src/assets/icons': 'icons',
    './src/assets/fonts': 'fonts',
  });

  eleventyConfig.addWatchTarget('tailwind.config.js');
  eleventyConfig.addWatchTarget('src/_icons/*');
  eleventyConfig.addWatchTarget('src/assets/**/*.{js,ts,css}');
  eleventyConfig.addWatchTarget('.env');

  eleventyConfig.ignores.add('README.md');

  eleventyConfig.setServerOptions({ domDiff: false });

  return {
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
  };
};

export default config;
