/* eslint-disable @typescript-eslint/no-var-requires */

const postcss = require('postcss');
const { readFile } = require('node:fs/promises');

/**
 * @param {string} file
 * @param {string} label
 * @returns {Promise<string>}
 */
const buildStyle = async (file, label) => {
  const { logSize } = await import('../utils/log.js');

  const source = await readFile(file);

  const plugins = [require('autoprefixer')];
  if (process.env.NODE_ENV === 'production') plugins.push(require('cssnano'));

  const css = await postcss(plugins).process(source,
    { from: file, to: undefined });

  await logSize(css.content, label);
  return css.content;
};

module.exports = async () => ({
  fonts: await buildStyle(
    `${__dirname}/../assets/fonts/inter/inter.css`,
    'inlineStyles/fonts',
  ),
});
