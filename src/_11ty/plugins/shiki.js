import Shiki from '@shikijs/markdown-it';
import { createCssVariablesTheme } from 'shiki';
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
} from '@shikijs/transformers';

export const sitePluginShiki = async (eleventyConfig) => {
  const plugin = await Shiki({
    theme: createCssVariablesTheme({
      name: 'css-variables',
      variableDefaults: {},
    }),
    transformers: [
      transformerMetaHighlight(),
      transformerMetaWordHighlight(),
    ],
  });

  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(plugin);
  });
};
