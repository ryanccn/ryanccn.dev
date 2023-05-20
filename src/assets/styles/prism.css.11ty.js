const postcss = require('postcss');
const fs = require('fs/promises');

const logSize = require('../../utils/logSize');

class Page {
  data() {
    return {
      permalink: '/assets/prism.css',
      eleventyExcludeFromCollections: true,
    };
  }

  async render() {
    const source = `${__dirname}/prism.css`;

    let plugins = [require('autoprefixer'), require('cssnano')];

    const css = await postcss(plugins).process(await fs.readFile(source), {
      from: source,
      to: source,
    });

    logSize(css.content.length, 'prism.css');

    return css.content;
  }
}

module.exports = Page;
