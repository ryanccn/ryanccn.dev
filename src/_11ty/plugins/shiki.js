import { getHighlighter } from 'shiki';

export const sitePluginShiki = async (eleventyConfig) => {
  const highlighter = await getHighlighter({ theme: 'css-variables' });

  eleventyConfig.amendLibrary('md', (mdLib) => {
    return mdLib.set({
      highlight: (code, lang) => highlighter.codeToHtml(code, { lang }),
    });
  });
};
