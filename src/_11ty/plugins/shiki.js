import { getHighlighter } from 'shiki';

const highlighter = await getHighlighter({ theme: 'css-variables' });

export default (eleventyConfig) => {
  eleventyConfig.amendLibrary('md', (mdLib) => {
    return mdLib.set({
      highlight: (code, lang) => highlighter.codeToHtml(code, { lang }),
    });
  });
};
