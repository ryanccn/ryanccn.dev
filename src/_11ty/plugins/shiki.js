const shiki = require('shiki');

module.exports = (eleventyConfig) => {
  eleventyConfig.amendLibrary('md', () => {});

  eleventyConfig.on('eleventy.before', async () => {
    const highlighter = await shiki.getHighlighter({ theme: 'css-variables' });

    eleventyConfig.amendLibrary('md', (mdLib) => {
      return mdLib.set({
        highlight: (code, lang) => highlighter.codeToHtml(code, { lang }),
      });
    });
  });
};
