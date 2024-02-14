import js from '@eslint/js';
import ts from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';
import stylistic from '@stylistic/eslint-plugin';

import globals from 'globals';

export default ts.config(
  {
    ignores: ['**/.obsidian/**/*', '_site/**/*'],
  },

  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  unicorn.configs['flat/recommended'],

  {
    files: ['**/*.{js,mjs,cjs}'],
    ...ts.configs.disableTypeChecked,
  },

  {
    rules: {
      'unicorn/filename-case': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },

  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    quoteProps: 'consistent-as-needed',
    arrowParens: true,
    braceStyle: '1tbs',
  }),
);
