module.exports =
  process.env.NODE_ENV === 'production'
    ? 'https://ryanccn.dev'
    : 'http://localhost:8080';
