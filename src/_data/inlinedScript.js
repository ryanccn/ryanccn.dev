import { build as esbuild } from 'esbuild';

import { join } from 'path';
import { logSize } from '../utils/log.js';

export default async () => {
  const result = await esbuild({
    entryPoints: [join(process.cwd(), './src/assets/scripts/inlinedScript.ts')],
    define: {
      DEV: JSON.stringify(
        process.env.NODE_ENV ? process.env.NODE_ENV !== 'production' : true,
      ),
    },
    format: 'iife',
    platform: 'browser',
    minify: process.env.NODE_ENV === 'production',
    bundle: true,
    write: false,
  });

  const output = result.outputFiles[0].text;
  await logSize(output, 'inlinedScript');

  return output;
};
