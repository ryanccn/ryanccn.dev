const esbuild = require('esbuild');

const original = `
document.body.addEventListener(
  'load',
  (e) => {
    if (e.target.tagName != 'IMG') {
      return;
    }

    e.target.style.backgroundImage = 'none';
  },
  true
);
`;

class Page {
  data() {
    return {
      permalink: '/assets/lqip.js',
      eleventyExcludeFromCollections: true,
    };
  }

  async render() {
    const build = await esbuild.transform(original, {
      minify: true,
    });

    return build.code;
  }
}

module.exports = Page;
