module.exports = {
  mode: 'jit',
  purge: ['./*.11ty.js', './**/*.11ty.js'],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
