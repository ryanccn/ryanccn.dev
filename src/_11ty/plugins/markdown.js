const markdownIt = require('markdown-it');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTOC = require('markdown-it-toc-done-right');

module.exports = (eleventyConfig) => {
  const markdownLib = markdownIt({ html: true, typographer: true })
    .use(markdownItEmoji)
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.linkInsideHeader({
        placement: 'after',
        class: 'anchor',
        symbol: '#',
        ariaHidden: false,
      }),
      slugify: eleventyConfig.getFilter('slugify'),
      level: [2, 3, 4],
    })
    .use(markdownItTOC, {
      level: 2,
      listType: 'ul',
    })
    .disable('code');

  eleventyConfig.setLibrary('md', markdownLib);
};
