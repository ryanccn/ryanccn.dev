const respimg = require('./respimg');
const warning = require('./warning');

/**
 * @param {string} path
 */
const absoluteUrl = (path) => new URL(path, 'https://ryanccn.dev').toString();

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.addShortcode('twitterShareLink', function () {
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      absoluteUrl(this.page.url),
    )}`;
  });

  eleventyConfig.addShortcode('mastodonShareLink', function () {
    return `https://mastoroute.deno.dev/share?text=${encodeURIComponent(
      absoluteUrl(this.page.url),
    )}`;
  });

  eleventyConfig.addShortcode('hnShareLink', function (title) {
    return (
      `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
        absoluteUrl(this.page.url),
      )}` + (title ? `&t=${encodeURIComponent(title)}` : '')
    );
  });

  eleventyConfig.addAsyncShortcode('respimg', respimg);

  eleventyConfig.addShortcode('warning', warning);
};
