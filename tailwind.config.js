// const defaultTheme = require('tailwindcss/defaultTheme');
// const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.11ty.js',
    './src/_data/navLinks.js',
    './src/assets/scripts/theme.ts',
  ],
  darkMode: 'class',

  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: null,

            /* header font sizes */
            h1: {
              fontWeight: theme('fontWeight.bold'),
              fontSize: theme('fontSize.4xl')[0],
              lineHeight: theme('lineHeight.tight'),
            },
            h2: {
              fontSize: theme('fontSize.xl')[0],
            },
            h3: {
              fontSize: theme('fontSize.lg')[0],
            },
            h4: {
              fontSize: theme('fontSize.base')[0],
            },
            h5: {
              fontSize: theme('fontSize.base')[0],
            },
            h6: {
              fontSize: theme('fontSize.base')[0],
            },

            /* custom link colors */
            a: {
              color: theme('colors.blue.500'),

              transitionProperty: theme('transitionProperty.colors'),
              transitionTimingFunction: theme(
                'transitionTimingFunction.DEFAULT'
              ),
              transitionDuration: theme('transitionDuration.150'),
            },
            'a:hover': {
              color: theme('colors.blue.300'),
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
          },
        },
      }),
    },
  },

  variants: {
    extend: {},
  },

  plugins: [require('@tailwindcss/typography')],
};
