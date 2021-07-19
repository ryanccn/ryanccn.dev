const plugin = require('tailwindcss/plugin');

const removeMarkBackground = plugin(({ addBase }) => {
  addBase({
    mark: {
      backgroundColor: 'transparent',
    },
  });
});

const bodyBackgroundWhite = plugin(({ addBase }) => {
  addBase({
    body: {
      backgroundColor: 'white',
    },
  });
});

module.exports = {
  mode: 'jit',
  purge: ['./*.11ty.js', './**/*.11ty.js', './utils/icons.js'],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    removeMarkBackground,
    bodyBackgroundWhite,
  ],
};
