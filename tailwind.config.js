const defaultTheme = require('tailwindcss/defaultTheme');
// const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{11ty.js,njk}',
    './src/_data/navLinks.js',
    './src/assets/scripts/theme.ts',
  ],
  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        satoshi: ['Satoshi', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        hn: '#F0652F',
        twitter: '#1DA1F2',
        github: '#181717',
        coffee: '#FFDD00',
      },
    },
  },

  variants: {
    extend: {},
  },

  plugins: [require('@tailwindcss/typography')],
};
