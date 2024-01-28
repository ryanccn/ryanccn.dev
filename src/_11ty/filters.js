import { format, isBefore, subYears } from 'date-fns';

/**
 * @param {String[]} k list of tags
 * @returns {String[]} list of *filtered* tags
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
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;

    return n;
  });

  eleventyConfig.addFilter('numberFormat', (n) => {
    return Intl.NumberFormat('en-US').format(n);
  });

  eleventyConfig.addFilter('encodeURIComponent', encodeURIComponent);

  eleventyConfig.addFilter('couldBeOutdated', (date) => {
    return isBefore(date, subYears(new Date(), 2));
  });

  eleventyConfig.addFilter(
    'customDateFormat',
    /**
     * @param {Date} a a date object
     * @return {String} a formatted string
     */
    (d) => format(d, 'yyyy-MM-dd'),
  );
};
