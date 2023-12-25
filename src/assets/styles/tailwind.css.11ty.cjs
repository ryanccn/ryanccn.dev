const postcss = require('postcss');
const { readFile } = require('fs/promises');

class Page {
  data() {
    return {
      permalink: '/assets/tailwind.css',
      eleventyExcludeFromCollections: true,
    };
  }

  async render() {
    const { logSize } = await import('../../utils/log.js');

    const sourceFile = `${__dirname}/tailwind.css`;
    const source = await readFile(sourceFile);

    let plugins = [
      require('tailwindcss/nesting/index.js'),
      require('tailwindcss'),
      require('autoprefixer'),
      require('cssnano'),
    ];

    const css = await postcss(plugins).process(source, {
      from: sourceFile,
      to: undefined,
    });

    await logSize(css.content, 'tailwind.css');

    return css.content;
  }
}

module.exports = Page;
