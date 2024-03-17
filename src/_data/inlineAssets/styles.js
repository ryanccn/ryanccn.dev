import postcss from 'postcss';

import { readFile } from 'node:fs/promises';
import { logSize } from '../../utils/log.js';
import { interopDefault } from '../../utils/interopDefault.js';

/**
 * @param {string} file
 * @param {string} label
 * @returns {Promise<string>}
 */
const buildStyle = async (file, label) => {
  const source = await readFile(file);

  const plugins = [await interopDefault(import('postcss-preset-env'))];

  if (process.env.NODE_ENV === 'production')
    plugins.push(await interopDefault(import('cssnano')));

  const css = await postcss(plugins)
    .process(source, { from: file, to: undefined });

  await logSize(css.content, label);
  return css.content;
};

export default async () => ({
  fonts: await buildStyle('src/assets/fonts/inter/inter.css', 'inlineAssets/styles/fonts'),
});
