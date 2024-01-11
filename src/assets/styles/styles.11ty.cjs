const postcss = require('postcss');
const { readFile } = require('fs/promises');

class Page {
  data() {
    return {
      permalink: '/assets/styles.css',
      eleventyExcludeFromCollections: true,
    };
  }

  async render() {
    const { logSize } = await import('../../utils/log.js');

    const sourceFile = `${__dirname}/styles.css`;
    const source = await readFile(sourceFile);

    const plugins = [
      require('postcss-import'),
      require('tailwindcss/nesting'),
      require('tailwindcss'),
      require('autoprefixer'),
    ];

    if (process.env.NODE_ENV === 'production') plugins.push(require('cssnano'));

    const css = await postcss(plugins).process(source, {
      from: sourceFile,
      to: undefined,
    });

    await logSize(css.content, 'styles.css');

    return css.content;
  }
}

module.exports = Page;
