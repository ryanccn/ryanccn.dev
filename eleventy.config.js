import 'dotenv/config.js';

import { EleventyHtmlBasePlugin } from '@11ty/eleventy';
import pluginReadingTime from 'eleventy-plugin-reading-time';
import pluginRss from '@11ty/eleventy-plugin-rss';

import pluginIcons from 'eleventy-plugin-icons';
import { optimize as svgo } from 'svgo';

import { sitePluginShortcodes } from './src/_11ty/shortcodes/index.js';
import { sitePluginFilters } from './src/_11ty/filters.js';
import { sitePluginMarkdown } from './src/_11ty/plugins/markdown.js';
import { sitePluginShiki } from './src/_11ty/plugins/shiki.js';
import { sitePluginHtmlmin } from './src/_11ty/plugins/htmlmin.js';

const configFn = (eleventyConfig) => {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
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

  eleventyConfig.setServerOptions({ domDiff: false });
};

export const config = {
  dir: {
    input: 'src',
    layouts: '_layouts',
  },
  markdownTemplateEngine: 'njk',
};

export default configFn;
