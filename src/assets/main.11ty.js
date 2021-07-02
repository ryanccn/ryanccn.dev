const esbuild = require('esbuild');
const { join } = require('path');

class Page {
  data() {
    return {
      permalink: '/assets/main.js',
      eleventyExcludeFromCollections: true,
    };
  }

  async render() {
    const build = await esbuild.build({
      entryPoints: [join(__dirname, 'main.js')],
      format: 'iife',
      platform: 'browser',
      minify: true,
      bundle: false,
      write: false,
    });

    return build.outputFiles[0].text;
  }
}

module.exports = Page;
