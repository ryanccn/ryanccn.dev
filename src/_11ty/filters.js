import { format, isAfter, isBefore, subMonths, subYears } from 'date-fns';

/**
 * @param {string[]} k list of tags
 * @returns {string[]} list of *filtered* tags
 */
const filterTagsList = (k) => k.filter((a) => !['all', 'posts'].includes(a));

export const sitePluginFilters = (eleventyConfig) => {
  eleventyConfig.addFilter(
    'head',
    /**
     * @param {unknown[]} arr array of *stuff*
     * @param {number} k number of items to return
     * @returns truncated array
     */
    (arr, k) => {
      return arr.slice(0, k);
    },
  );

  eleventyConfig.addFilter('filterTagsList', (k) => filterTagsList(k));

  eleventyConfig.addCollection('postsTagList', (collection) => {
    let tagSet = new Set();

    for (const item of collection.getFilteredByTag('posts')) {
      for (const tag of item?.data?.tags || []) tagSet.add(tag);
    }

    return filterTagsList([...tagSet]);
  });

  eleventyConfig.addFilter('shortCount', (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;

    return n;
  });

  eleventyConfig.addFilter('numberFormat', (n) => Intl.NumberFormat('en-US').format(n));

  eleventyConfig.addFilter('encodeURIComponent', encodeURIComponent);

  eleventyConfig.addFilter('includes', (arr, value) => Array.isArray(arr) && arr.includes(value));

  eleventyConfig.addFilter('couldBeOutdated', (date) => isBefore(date, subYears(new Date(), 2)));
  eleventyConfig.addFilter('usesIsNew', (date) => date && isAfter(date, subMonths(new Date(), 1)));
  eleventyConfig.addFilter('prettyDateFormat', (date) => format(date, 'yyyy-MM-dd'));

  eleventyConfig.addFilter('ogImage', (url) => `https://ryanccn.dev/og${(url.replace(/\/$/, '') || '/index')}.png`);
};
