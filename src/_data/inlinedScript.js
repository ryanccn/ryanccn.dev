const { build: esbuild } = require('esbuild');

const { join } = require('path');
const logSize = require('../utils/logSize');

module.exports = async () => {
  const result = await esbuild({
    entryPoints: [join(process.cwd(), './src/assets/scripts/inlinedScript.ts')],
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
  logSize(output.length, 'inlinedScript');

  return output;
};
