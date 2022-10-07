const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const domTransforms = require('./src/utils/domTransforms');
const htmlmin = require('html-minifier');

const hasha = require('hasha');
const { build: esbuild } = require('esbuild');
const { readFile } = require('fs/promises');
const { join } = require('path');
const logSize = require('./src/utils/logSize');

const inProduction = process.env.NODE_ENV === 'production';

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
const config = (eleventyConfig) => {
  require('dotenv').config({
    path: '.env.local',
  });

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(require('@11tyrocks/eleventy-plugin-social-images'));

  eleventyConfig.addPassthroughCopy({
    './src/assets/icons/*.png': 'icons',
    './src/assets/fonts': 'assets/fonts',
  });

  eleventyConfig.addAsyncShortcode('themeScript', async () => {
    const sourceHash = await hasha.fromFile(
      join(__dirname, './src/assets/scripts/theme.ts')
    );
    const cacheFile = `./node_modules/.cache/theme/${sourceHash}.js`;

    let cachedThemeScript;

    try {
      cachedThemeScript = await readFile(cacheFile, 'utf-8');
    } catch {
      /* */
    }

    if (!cachedThemeScript) {
      await esbuild({
        entryPoints: [join(__dirname, './src/assets/scripts/theme.ts')],
        define: {
          DEV: JSON.stringify(
            process.env.NODE_ENV ? process.env.NODE_ENV !== 'production' : true
          ),
        },
        format: 'iife',
        platform: 'browser',
        minify: true,
        bundle: true,
        outfile: cacheFile,
      });

      cachedThemeScript = await readFile(cacheFile, 'utf-8');
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
