const postcss = require('postcss');
const { readFile } = require('fs/promises');

const logSize = require('../utils/logSize');

module.exports = async () => {
  const switzer = await readFile(
    './src/assets/fonts/satoshi/satoshi.css',
    'utf-8'
  );
  const plex = await readFile('./src/assets/fonts/plex/plex.css', 'utf-8');

  const { content: css } = await postcss([
    require('autoprefixer'),
    require('cssnano'),
  ]).process(switzer + plex, {
    from: undefined,
    to: undefined,
  });

  logSize(css.length, 'inlinedFontStyles');

  return css;
};
