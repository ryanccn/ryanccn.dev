const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{11ty.js,njk,liquid}',
    './src/_11ty/shortcodes/*.js',
    './src/assets/scripts/theme.ts',
  ],
  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        satoshi: ['Satoshi', ...defaultTheme.fontFamily.sans],
      },

      typography: {
        DEFAULT: {
          css: {
            blockquote: {
              'font-style': 'normal',
            },
            'blockquote p:first-of-type::before': {
              content: '',
            },
            'blockquote p:last-of-type::after': {
              content: '',
            },
          },
        },
      },

      colors: {
        hn: '#F0652F',
        twitter: '#1DA1F2',
        github: '#181717',
        coffee: '#FFDD00',
        discord: '#5865F2',

        tag: {
          1: colors.rose[500],
          2: colors.amber[500],
          3: colors.green[600],
          4: colors.blue[500],
          0: colors.indigo[500],
        },
      },
    },
  },

  variants: {
    extend: {},
  },

  plugins: [require('@tailwindcss/typography')],
};
