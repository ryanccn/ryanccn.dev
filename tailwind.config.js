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
  plugins: [require('@tailwindcss/typography')],
};
