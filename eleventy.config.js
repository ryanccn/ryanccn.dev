import 'dotenv/config.js';

// import { EleventyRenderPlugin } from '@11ty/eleventy';
import { VentoPlugin } from 'eleventy-plugin-vento';
import pluginReadingTime from 'eleventy-plugin-reading-time';
import pluginRss from '@ryanccn/eleventy-plugin-rss';

import pluginIcons from 'eleventy-plugin-icons';
import { optimize as svgo } from 'svgo';

import { sitePluginShortcodes } from './src/_11ty/shortcodes/index.js';
import { sitePluginFilters } from './src/_11ty/filters.js';
import { sitePluginMarkdown } from './src/_11ty/plugins/markdown.js';
import { sitePluginShiki } from './src/_11ty/plugins/shiki.js';
import { sitePluginHtmlmin } from './src/_11ty/plugins/htmlmin.js';

const config = (eleventyConfig) => {
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
      transform: async (svg) => {
        const optimized = svgo(svg, {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        }).data;

        return optimized;
      },
      attributesBySource: {
        simpleicon: {
          fill: 'currentColor',
          stroke: 'none',
        },
      },
    },
  });

  eleventyConfig.addPlugin(VentoPlugin, {
    ventoOptions: {
      autoescape: true,
      includes: 'src/_includes',
    },
  });

  // eleventyConfig.setQuietMode(true);
  // eleventyConfig.addPlugin(pluginDirectoryOutput);

  eleventyConfig.addPlugin(sitePluginShortcodes);
  eleventyConfig.addPlugin(sitePluginFilters);
  eleventyConfig.addPlugin(sitePluginMarkdown);
  eleventyConfig.addPlugin(sitePluginShiki);
  eleventyConfig.addPlugin(sitePluginHtmlmin);

  eleventyConfig.addPassthroughCopy({
    './src/assets/manifest.webmanifest': 'manifest.webmanifest',
    './src/assets/icons/favicon.ico': 'favicon.ico',
    './src/assets/icons': 'icons',
    './src/assets/fonts': 'fonts',
    './src/images': 'images',
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
