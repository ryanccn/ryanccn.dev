import markdownIt from 'markdown-it';
import { full as markdownItEmoji } from 'markdown-it-emoji';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTOC from 'markdown-it-toc-done-right';

export const sitePluginMarkdown = (eleventyConfig) => {
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
