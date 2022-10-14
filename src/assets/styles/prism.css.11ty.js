const postcss = require('postcss');
const logSize = require('../../utils/logSize');

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
    const prismPath = path.join(__dirname, 'prism.css');
    const original = await fs.readFile(prismPath);

    const css = await postcss([
      require('autoprefixer'),
      require('cssnano'),
    ]).process(original, {
      from: prismPath,
      to: prismPath,
    });

    logSize(css.content.length, 'prism.css');

    return css.content;
  }
}

module.exports = Page;
