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
    colors: {
      hn: '#F0652F',
      twitter: '#1DA1F2',
      github: '#181717',
      mastodon: '#6364FF',
      kofi: '#FF5E5B',
      discord: '#5865F2',

      white: colors.white,

      fg: 'rgba(var(--fg) / <alpha-value>)',
      'fg-less-dimmed': 'rgba(var(--fg-less-dimmed) / <alpha-value>)',
      'fg-dimmed': 'rgba(var(--fg-dimmed) / <alpha-value>)',
      accent: 'rgba(var(--accent) / <alpha-value>)',
      'accent-lighter': 'rgba(var(--accent-lighter) / <alpha-value>)',

      background: 'rgba(var(--background) / <alpha-value>)',
      surface: 'rgba(var(--surface) / <alpha-value>)',
      'surface-hover': 'rgba(var(--surface-hover) / <alpha-value>)',

      tag: {
        1: colors.rose[500],
        2: colors.amber[500],
        3: colors.green[600],
        4: colors.blue[500],
        0: colors.indigo[500],
      },
    },

    extend: {
      fontFamily: {
        prose: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
        display: ['Satoshi', ...defaultTheme.fontFamily.sans],
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
    },
  },

  variants: {
    extend: {},
  },

  plugins: [require('@tailwindcss/typography')],
};
