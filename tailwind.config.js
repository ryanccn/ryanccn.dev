const defaultTheme = require('tailwindcss/defaultTheme');
// const plugin = require('tailwindcss/plugin');

const customProseStyles = {
  color: defaultTheme.colors.black,
  maxWidth: null,

  h1: {
    fontWeight: defaultTheme.fontWeight.bold,
    fontSize: defaultTheme.fontSize['3xl'],
  },
  h2: {
    fontSize: defaultTheme.fontSize['xl'],
  },
  h3: {
    fontSize: defaultTheme.fontSize['lg'],
  },
  h4: {
    fontSize: defaultTheme.fontSize['base'],
  },
  h5: {
    fontSize: defaultTheme.fontSize['base'],
  },
  h6: {
    fontSize: defaultTheme.fontSize['base'],
  },

  a: {
    color: defaultTheme.colors.gray[500],
  },
  'a:hover': {
    color: defaultTheme.colors.gray[400],
  },

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
