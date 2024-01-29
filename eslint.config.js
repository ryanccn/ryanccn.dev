import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import stylistic from '@stylistic/eslint-plugin';
import unicorn from 'eslint-plugin-unicorn';

import globals from 'globals';

export default [
  {
    ignores: ['**/.obsidian/**/*', '_site/**/*'],
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.cjs', '**/*.mjs', '**/*.cts', '**/*.mts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      js,
      '@typescript-eslint': ts,
      ts,
      unicorn,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      ...unicorn.configs['flat/recommended'].rules,
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
];
