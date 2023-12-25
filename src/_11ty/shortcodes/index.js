import respimg from './respimg.js';
import warning from './warning.js';

/**
 * @param {string} path
 */
const absoluteUrl = (path) => new URL(path, 'https://ryanccn.dev').toString();

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
export default (eleventyConfig) => {
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
