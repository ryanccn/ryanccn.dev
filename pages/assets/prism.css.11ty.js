const postcss = require('postcss');

const fs = require('fs/promises');
const path = require('path');

class Page {
  data() {
    return {
      permalink: '/assets/prism.css',
      eleventyExcludeFromCollections: true,
    };
  }

  async render() {
    const original = await fs.readFile(path.join(__dirname, 'prism.css'));

    const css = await postcss([
      require('autoprefixer'),
      require('cssnano'),
    ]).process(original, {
      from: undefined,
      to: undefined,
    });

    return css.content;
  }
}

module.exports = Page;
