const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const domTransforms = require('./utils/domTransforms');
const htmlmin = require('html-minifier');

const { build: esbuild } = require('esbuild');
const { join } = require('path');
const logSize = require('./utils/logSize');

const inProduction = process.env.NODE_ENV === 'production';

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
const config = (eleventyConfig) => {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(require('@11tyrocks/eleventy-plugin-social-images'));

  eleventyConfig.addPassthroughCopy({
    './assets/icons/*.png': 'icons',
  });

  let cachedThemeScript = null;

  eleventyConfig.addAsyncShortcode('themeScript', async () => {
    if (!cachedThemeScript) {
      const build = await esbuild({
        entryPoints: [join(__dirname, './assets/scripts/theme.ts')],
        define: {
          DEV: JSON.stringify(
            process.env.NODE_ENV ? process.env.NODE_ENV !== 'production' : true
          ),
        },
        format: 'iife',
        platform: 'browser',
        minify: true,
        bundle: true,
        write: false,
      });

      const themeScript = build.outputFiles[0].text;
      cachedThemeScript = themeScript;

      logSize(cachedThemeScript.length, '[embedded theme script]');
    }

    return cachedThemeScript;
  });

  let cachedThemeScript = null;

  eleventyConfig.addAsyncShortcode('themeScript', async () => {
    if (!cachedThemeScript) {
      const build = await esbuild({
        entryPoints: [join(__dirname, './assets/scripts/theme.ts')],
        define: {
          DEV: JSON.stringify(
            process.env.NODE_ENV ? process.env.NODE_ENV !== 'production' : true
          ),
        },
        format: 'iife',
        platform: 'browser',
        minify: true,
        bundle: true,
        write: false,
      });

      const themeScript = build.outputFiles[0].text;
      cachedThemeScript = themeScript;

      logSize(cachedThemeScript.length, '[embedded theme script]');
    }

    return cachedThemeScript;
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

  const markdownIt = require('markdown-it');
  const markdownItEmoji = require('markdown-it-emoji');
  const options = {
    html: true,
  };
  const markdownLib = markdownIt(options).use(markdownItEmoji);

  eleventyConfig.setLibrary('md', markdownLib);

  eleventyConfig.addWatchTarget('tailwind.config.js');
  eleventyConfig.addWatchTarget('assets/**/*.{js,ts,css}');
  eleventyConfig.addWatchTarget('utils/*.js');

  eleventyConfig.ignores.add('README.md');

  eleventyConfig.setBrowserSyncConfig({
    ui: false,
  });

  return {
    dir: {
      layouts: '_layouts',
    },
  };
};

module.exports = config;
