import Shikiji from 'markdown-it-shikiji';
import { createCssVariablesTheme } from 'shikiji';
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
} from 'shikiji-transformers';

export const sitePluginShiki = async (eleventyConfig) => {
  const plugin = await Shikiji({
    theme: createCssVariablesTheme({
      name: 'css-variables',
      variableDefaults: {},
    }),
    transformers: [transformerMetaHighlight(), transformerMetaWordHighlight()],
  });

  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(plugin);
  });
};
