import { createCssVariablesTheme } from 'shikiji';
import Shikiji from 'markdown-it-shikiji';

export const sitePluginShiki = async (eleventyConfig) => {
  const plugin = await Shikiji({
    theme: createCssVariablesTheme({
      name: 'css-variables',
      variableDefaults: {},
    }),
  });

  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(plugin);
  });
};
