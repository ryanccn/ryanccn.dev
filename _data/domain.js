module.exports =
  process.env.NODE_ENV === 'production'
    ? process.env.DEPLOY_ENV === 'staging'
      ? 'https://staging.ryanccn.dev'
      : 'https://ryanccn.dev'
    : 'http://localhost:8080';
