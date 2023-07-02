const EleventyFetch = require('@11ty/eleventy-fetch');
const { cyan, blue } = require('kleur/colors');
const memoize = require('just-memoize');

module.exports = memoize(async (originalUrl) => {
  if (!process.env.PLAUSIBLE_TOKEN) return 0;

  console.log(`${cyan('[data]')} Fetching reads for ${blue(originalUrl)}`);

  const url = `https://plausible.io/api/v1/stats/aggregate?site_id=ryanccn.dev&period=12mo&metrics=pageviews&filters=${encodeURIComponent(
    `event:page==${originalUrl}` +
      (originalUrl.endsWith('/')
        ? `|${originalUrl.substring(0, originalUrl.length - 1)}`
        : '')
  )}`;

  const res = await EleventyFetch(url, {
    fetchOptions: {
      headers: { Authorization: `Bearer ${process.env.PLAUSIBLE_TOKEN}` },
    },
    duration: '1d',
    type: 'json',
  });

  return res.results.pageviews.value;
});
