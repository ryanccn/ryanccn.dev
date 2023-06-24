const { build: esbuild } = require('esbuild');

const { join } = require('path');
const logSize = require('../../utils/logSize');

class Page {
  data() {
    return {
      permalink: '/assets/script.js',
      eleventyExcludeFromCollections: true,
    };
  }
  async render() {
    const result = await esbuild({
      entryPoints: [join(process.cwd(), './src/assets/scripts/script.ts')],
      define: {
        DEV: JSON.stringify(
          process.env.NODE_ENV ? process.env.NODE_ENV !== 'production' : true
        ),
      },
      format: 'iife',
      platform: 'browser',
      minify: process.env.NODE_ENV === 'production',
      bundle: true,
      write: false,
    });

    const output = result.outputFiles[0].text;
    logSize(output.length, 'script.js');

    return output;
  }
}

module.exports = Page;
