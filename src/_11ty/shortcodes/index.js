import respimg from './respimg.js';
import warning from './warning.js';

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
export const sitePluginShortcodes = (eleventyConfig) => {
  eleventyConfig.addAsyncShortcode('respimg', respimg);
  eleventyConfig.addShortcode('warning', warning);
};
