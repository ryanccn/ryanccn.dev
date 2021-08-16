const esbuild = require('esbuild');
const logSize = require('../../../utils/logSize');
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
      define: {
        DEV: JSON.stringify(
          process.env.NODE_ENV ? process.env.NODE_ENV !== 'production' : true
        ),
      },
      format: 'iife',
      platform: 'browser',
      minify: true,
      bundle: true,
      write: false,
    });

    const output = build.outputFiles[0].text;

    logSize(output.length, 'main.js');

    return output;
  }
}

module.exports = Page;
