import { config } from '@ryanccn/eslint-config';

export default config({
  ignores: ['**/.obsidian', '**/_site'],
  globals: ['es2021', 'node'],
  stylistic: {
    indent: 2,
  },
  rules: {
    'unicorn/no-anonymous-default-export': 'off',
    'unicorn/import-style': 'off',
  },
});
