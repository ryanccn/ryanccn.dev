const URL = 'https://plausible.io/js/plausible.js';

module.exports = async (_, res) => {
  const origin = await fetch(URL);
  const script = (await origin.text())
    .replace(/window.plausible/g, 'window.syCCxbd3Ch')
    .replace(/plausible_ignore/g, 'plausibleIgnore');

  res.setHeader('content-type', 'text/javascript');
  res.setHeader('cache-control', 's-maxage=60');

  res.send(script);
};
