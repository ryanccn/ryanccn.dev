const postcss = require('postcss');
const logSize = require('../../../utils/logSize');

const original = `
@tailwind base;

@layer base {
  body {
    background-color: #ffffff;
  }

  mark {
    background-color: transparent;
  }
}

@tailwind components;

@tailwind utilities;
`;

class Page {
  data() {
    return {
      permalink: '/assets/tailwind.css',
      eleventyExcludeFromCollections: true,
    };
  }

  async render() {
    let plugins = [require('tailwindcss'), require('autoprefixer')];

    if (process.env.NODE_ENV === 'production') {
      plugins = [...plugins, require('cssnano')];
    }

    const css = await postcss(plugins).process(original, {
      from: undefined,
      to: undefined,
    });

    logSize(css.content.length, 'tailwind.css');

    return css.content;
  }
}

module.exports = Page;
