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
  purge: ['./src/**/*.11ty.js', './src/_data/navLinks.js'],
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
