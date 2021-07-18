import got from 'got';

const URL = 'https://plausible.io/js/plausible.js';

module.exports = async (_, res) => {
  const origin = await got(URL);
  const script = origin.body
    .replace(/window.plausible/g, 'window.syCCxbd3Ch')
    .replace(/plausible_ignore/g, 'plausibleIgnore');

  res.setHeader('content-type', 'text/javascript');
  res.setHeader('cache-control', 's-maxage=3600');

  res.send(script);
};
