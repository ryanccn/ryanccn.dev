const { EleventyRenderPlugin } = require('@11ty/eleventy');
const readingTime = require('eleventy-plugin-reading-time');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const registerShortcodes = require('./src/_11ty/shortcodes');

const { format } = require('date-fns');
const { readFileSync } = require('fs');

const htmlmin = require('html-minifier');

const inProduction = process.env.NODE_ENV === 'production';

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
const config = (eleventyConfig) => {
  require('dotenv').config({
    path: '.env.local',
  });

  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(readingTime);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy({
    './src/assets/icons': 'icons',
    './src/assets/fonts': 'assets/fonts',
    './_headers': '_headers',
  });

  eleventyConfig.addFilter(
    'head',
    /**
     * @param {unknown[]} arr array of *stuff*
     * @param {number} k number of items to return
     * @returns truncated array
     */
    (arr, k) => {
      return arr.slice(0, k);
    }
  );

  /**
   * @param {String[]} k list of tags
   * @returns {String[]} list of *filtered* tags
   */
  const filterTagsList = (k) => k.filter((a) => !['all', 'posts'].includes(a));

  eleventyConfig.addFilter('filterTagsList', filterTagsList);
  eleventyConfig.addCollection('postsTagList', (collection) => {
    let tagSet = new Set();

    collection.getFilteredByTag('posts').forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });

    return filterTagsList([...tagSet]);
  });

  eleventyConfig.addFilter('encodeURIComponent', encodeURIComponent);

  eleventyConfig.addFilter(
    'customDateFormat',
    /**
     * @param {Date} a a date object
     * @return {String} a formatted string
     */
    (d) => format(d, 'yyyy-MM-dd')
  );

  eleventyConfig.addFilter(
    'scoreToUnicode',
    /**
     * @param {number} score an integer score
     * @return {string} formatted string
     */
    (score) => {
      let ret = '';
      ret += '●'.repeat(Math.floor(score));
      ret += score > Math.floor(score) ? '◐' : '';
      ret = ret.padEnd(10, '○');
      return ret;
    }
  );

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
  const markdownItTOC = require('markdown-it-toc-done-right');

  const markdownLib = markdownIt({ html: true })
    .use(markdownItEmoji)
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.linkInsideHeader({
        placement: 'after',
        class: 'anchor',
        symbol: '#',
        ariaHidden: false,
      }),
      slugify: eleventyConfig.getFilter('slugify'),
      level: [2, 3, 4],
    })
    .use(markdownItTOC, {
      level: 2,
      listType: 'ul',
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
    callbacks: {
      ready: function (_err, bs) {
        const content_404 = readFileSync('_site/404.html');
        bs.addMiddleware('*', (_req, res) => {
          res.write(content_404);
          res.end();
        });
      },
    },
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
