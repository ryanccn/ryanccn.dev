const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

const customProseStyles = {
  color: defaultTheme.colors.black,
  maxWidth: null,

  h1: {
    fontWeight: defaultTheme.fontWeight.bold,
  },

  a: {
    color: defaultTheme.colors.blue[400],
  },
  'a:hover': {
    color: defaultTheme.colors.blue[500],
  },

  'ol, ul': {
    listStyle: 'normal',
  },

  'ol > li': null,
  'ul > li': null,
  'ol > li::before': null,
  'ul > li::before': null,

  blockquote: {
    fontStyle: 'normal',
  },
  'blockquote p:first-of-type::before': null,
  'blockquote p:last-of-type::after': null,
};

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.11ty.js', './src/_data/navLinks.js'],
  darkMode: false,
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: customProseStyles,
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
