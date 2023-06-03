const postcss = require('postcss');
const { readFile } = require('fs/promises');

const logSize = require('../utils/logSize');

module.exports = async () => {
  const publicSans = await readFile(
    './src/assets/fonts/public-sans/public-sans.css',
    'utf-8'
  );

  const { content: css } = await postcss([
    require('autoprefixer'),
    require('cssnano'),
  ]).process(publicSans, {
    from: undefined,
    to: undefined,
  });

  logSize(css.length, 'inlinedFontStyles');

  return css;
};
