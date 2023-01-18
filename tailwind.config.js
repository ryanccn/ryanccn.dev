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
      modrinth: '#00AF5C',

      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,

      fg: 'rgba(var(--fg) / <alpha-value>)',
      'fg-brighter': 'rgba(var(--fg-brighter) / <alpha-value>)',
      'fg-less-dimmed': 'rgba(var(--fg-less-dimmed) / <alpha-value>)',
      'fg-dimmed': 'rgba(var(--fg-dimmed) / <alpha-value>)',
      accent: 'rgba(var(--accent) / <alpha-value>)',
      'accent-lighter': 'rgba(var(--accent-lighter) / <alpha-value>)',

      background: 'rgba(var(--background) / <alpha-value>)',
      surface: 'rgba(var(--surface) / <alpha-value>)',
      'surface-hover': 'rgba(var(--surface-hover) / <alpha-value>)',
    },

    extend: {
      fontFamily: {
        display: ['Switzer', ...defaultTheme.fontFamily.sans],
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

  plugins: [require('@tailwindcss/typography')],
};
