const postcss = require('postcss');

const original = `
@tailwind base;

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
    const css = await postcss([
      require('tailwindcss'),
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
