const defaultTheme = require('tailwindcss/defaultTheme');
// const plugin = require('tailwindcss/plugin');

const customProseStyles = {
  color: defaultTheme.colors.black,
  maxWidth: null,

  /* header font sizes */
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

  /* custom link colors */
  a: {
    color: defaultTheme.colors.blue[500],
    transitionProperty: 'background-color, border-color, color, fill, stroke',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '150ms',
  },
  'a:hover': {
    color: defaultTheme.colors.blue[300],
  },

  /* remove most blockquote styling */
  blockquote: {
    fontStyle: 'normal',
  },
  'blockquote p:first-of-type::before': null,
  'blockquote p:last-of-type::after': null,

  code: {
    wordBreak: 'break-all',
  },
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
