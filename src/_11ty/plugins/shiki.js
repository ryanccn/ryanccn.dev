import Shiki from '@shikijs/markdown-it';
import { transformerMetaHighlight, transformerMetaWordHighlight } from '@shikijs/transformers';

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const readJSON = async (path) =>
  readFile(join(dirname(fileURLToPath(import.meta.url)), path), { encoding: 'utf8' })
    .then((r) => JSON.parse(r));

export const sitePluginShiki = async (eleventyConfig) => {
  const [
    flexokiLight, flexokiDark,
    gruvboxLight, gruvboxDark,
  ] = await Promise.all([
    readJSON('./shiki/flexoki-light.json'), readJSON('./shiki/flexoki-dark.json'),
    readJSON('./shiki/gruvbox-light.json'), readJSON('./shiki/gruvbox-dark.json'),
  ]);

  const plugin = await Shiki({
    themes: {
      'light': 'github-light-default',
      'dark': 'github-dark-default',
      'ctp-latte': 'catppuccin-latte',
      'ctp-frappe': 'catppuccin-frappe',
      'ctp-macchiato': 'catppuccin-macchiato',
      'ctp-mocha': 'catppuccin-mocha',
      'rose-pine': 'rose-pine',
      'rose-pine-moon': 'rose-pine-moon',
      'rose-pine-dawn': 'rose-pine-dawn',
      'nord': 'nord',
      'flexoki-light': flexokiLight,
      'flexoki-dark': flexokiDark,
      'gruvbox-light': gruvboxLight,
      'gruvbox-dark': gruvboxDark,
    },
    defaultColor: false,
    transformers: [
      transformerMetaHighlight(),
      transformerMetaWordHighlight(),
    ],
  });

  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(plugin);
  });
};
