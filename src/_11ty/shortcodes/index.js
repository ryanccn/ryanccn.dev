const lucide = require('./lucide');
const postReads = require('./postReads');
const respimg = require('./respimg');
const simpleicon = require('./simpleicon');
const tweet = require('./tweet');

/**
 * @param {string} path
 */
const absoluteUrl = (path) => new URL(path, 'https://ryanccn.dev').toString();

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.addShortcode('twitterShareLink', function () {
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      absoluteUrl(this.page.url)
    )}`;
  });

  eleventyConfig.addShortcode('hnShareLink', function (title) {
    return (
      `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
        absoluteUrl(this.page.url)
      )}` + (title ? `&t=${encodeURIComponent(title)}` : '')
    );
  });

  eleventyConfig.addShortcode('lucide', lucide);
  eleventyConfig.addShortcode('simpleicon', simpleicon);
  eleventyConfig.addAsyncShortcode('tweet', tweet);
  eleventyConfig.addAsyncShortcode('respimg', respimg);
  eleventyConfig.addAsyncShortcode('postReads', postReads);
};
