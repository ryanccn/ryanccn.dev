import postcss from 'postcss';

import { interopDefault } from '../../utils/interopDefault.js';
import { readFile } from 'node:fs/promises';
import { logSize } from '../../utils/log.js';

class Page {
  data() {
    return {
      permalink: '/assets/styles.css',
      eleventyExcludeFromCollections: true,
    };
  }

  async render() {
    const sourceFile = `src/assets/styles/styles.css`;
    const source = await readFile(sourceFile);

    const plugins = await Promise.all([
      interopDefault(import('postcss-import')),
      interopDefault(import('postcss-mixins')),
      interopDefault(import('tailwindcss')),
      interopDefault(import('postcss-preset-env')),
    ]);

    if (process.env.NODE_ENV === 'production')
      plugins.push(await interopDefault(import('cssnano')));

    const css = await postcss(plugins)
      .process(source, { from: sourceFile, to: undefined });

    await logSize(css.content, 'styles.css');

    return css.content;
  }
}

export default Page;
