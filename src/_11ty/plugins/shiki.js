import Shiki from '@shikijs/markdown-it';
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
} from '@shikijs/transformers';

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const readJSON = async (path) =>
  readFile(join(__dirname, path), { encoding: 'utf8' }).then((r) => JSON.parse(r));

export const sitePluginShiki = async (eleventyConfig) => {
  const [flexokiLight, flexokiDark] = await Promise.all([
    readJSON('./shiki/flexoki-light.json'), readJSON('./shiki/flexoki-dark.json'),
  ]);

  const plugin = await Shiki({
    themes: {
      'light': 'min-light',
      'dark': 'min-dark',
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
