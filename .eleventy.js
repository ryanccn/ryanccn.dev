const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const EleventyFetch = require('@11ty/eleventy-fetch');

const domTransforms = require('./src/utils/domTransforms');
const htmlmin = require('html-minifier');

const lucide = require('lucide-static/lib');
const icons = require('simple-icons/icons');
const { parseHTML } = require('linkedom');

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
    './_headers': '_headers',
  });

  eleventyConfig.addShortcode('lucide', (a, classes) => {
    const { document } = parseHTML(lucide[a]);
    document.querySelector('svg').classList.add(classes);
    return document.toString();
  });

  eleventyConfig.addShortcode('simpleicon', (a, classes) => {
    const original = Object.values(icons).filter((k) => k.slug === a)[0].svg;

    const { document } = parseHTML(original);
    document.querySelector('svg').classList.add(classes);
    return document.toString();
  });

  eleventyConfig.addAsyncShortcode('inlinedScript', async () => {
    const result = await esbuild({
      entryPoints: [join(__dirname, './src/assets/scripts/inlinedScript.ts')],
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

    const output = result.outputFiles[0].text;
    logSize(output.length, 'inlinedScript');

    return output;
  });

  eleventyConfig.addAsyncShortcode('fontStyles', async () => {
    const inter = await readFile('./src/assets/fonts/inter/inter.css', 'utf-8');
    const satoshi = await readFile(
      './src/assets/fonts/satoshi/satoshi.css',
      'utf-8'
    );

    return inter + satoshi;
  });

  eleventyConfig.addAsyncShortcode(
    'postReads',
    /**
     * @param originalUrl {string}
     */
    async (originalUrl) => {
      console.log(`Fetching analytics data for ${originalUrl}`);

      const url = `https://plausible.io/api/v1/stats/aggregate?site_id=ryanccn.dev&period=12mo&metrics=pageviews&filters=${encodeURIComponent(
        `event:page==${originalUrl}` +
          (originalUrl.endsWith('/')
            ? `\|${originalUrl.substring(0, originalUrl.length - 1)}`
            : '')
      )}`;

      const res = await EleventyFetch(url, {
        fetchOptions: {
          headers: { Authorization: `Bearer ${process.env.PLAUSIBLE_TOKEN}` },
        },
        duration: '1d',
        type: 'json',
      });

      return `${res.results.pageviews.value}`;
    }
  );

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
