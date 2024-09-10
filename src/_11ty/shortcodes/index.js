import respimg from './respimg.js';

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
export const sitePluginShortcodes = (eleventyConfig) => {
  eleventyConfig.addAsyncShortcode('respimg', respimg);
};
