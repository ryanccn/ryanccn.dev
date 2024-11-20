import typographyPlugin from '@tailwindcss/typography';

import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{11ty.js,njk,liquid,md}',
    './src/_11ty/shortcodes/*.js',
    './src/assets/scripts/theme.ts',
  ],
  darkMode: 'class',

  theme: {
    colors: {
      'transparent': colors.transparent,
      'black': colors.black,
      'white': colors.white,
      'current': colors.current,

      'fg': 'rgba(var(--fg) / <alpha-value>)',
      'fg-brighter': 'rgba(var(--fg-brighter) / <alpha-value>)',
      'fg-less-dimmed': 'rgba(var(--fg-less-dimmed) / <alpha-value>)',
      'fg-dimmed': 'rgba(var(--fg-dimmed) / <alpha-value>)',
      'accent': 'rgba(var(--accent) / <alpha-value>)',
      'accent-lighter': 'rgba(var(--accent-lighter) / <alpha-value>)',

      'background': 'rgba(var(--background) / <alpha-value>)',
      'surface': 'rgba(var(--surface) / <alpha-value>)',
      'surface-hover': 'rgba(var(--surface-hover) / <alpha-value>)',

      'warning': 'rgba(var(--warning) / <alpha-value>)',
    },

    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
        display: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
      },
      typography: {
        DEFAULT: {
          css: {
            'blockquote': {
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

  plugins: [typographyPlugin({ target: 'modern' })],
};
