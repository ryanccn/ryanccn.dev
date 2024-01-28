import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import stylistic from '@stylistic/eslint-plugin';
import unicorn from 'eslint-plugin-unicorn';

import globals from 'globals';

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: ['**/.obsidian/**/*', '_site/**/*'],
  },

  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs}'],
  },
  {
    ...unicorn.configs['flat/recommended'],
    rules: {
      ...unicorn.configs['flat/recommended'].rules,
      'unicorn/filename-case': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: 'latest',
        project: ['./src/assets/scripts/tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      ts,
    },
    rules: {
      ...ts.configs.recommended.rules,
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
