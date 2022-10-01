module.exports =
  process.env.NODE_ENV === 'production'
    ? 'https://www.ryanccn.dev'
    : 'http://localhost:8080';
