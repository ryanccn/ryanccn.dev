module.exports =
  process.env.NODE_ENV === 'production'
    ? 'https://ryanccn.dev' // TODO: change when pushing to `ryanccn.dev` domain!!!
    : 'http://localhost:8080';
