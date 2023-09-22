const EleventyFetch = require('@11ty/eleventy-fetch');
const { format } = require('date-fns');

const { cyan, blue } = require('kleur/colors');
const { readdir } = require('fs/promises');
const { join } = require('path');

const getViews = async (originalUrl) => {
  if (!process.env.PLAUSIBLE_TOKEN) return 0;

  console.log(`${cyan('[data]')} Fetching views for ${blue(originalUrl)}`);

  const now = format(new Date(), 'yyyy-MM-dd');

  const url = new URL('https://plausible.io/api/v1/stats/aggregate');
  url.searchParams.set('site_id', 'ryanccn.dev');
  url.searchParams.set('period', 'custom');
  url.searchParams.set('date', `1970-01-01,${encodeURIComponent(now)}`);
  url.searchParams.set('metrics', 'pageviews');
  url.searchParams.set(
    'filters',
    `event:page==${originalUrl}` +
      (originalUrl.endsWith('/')
        ? `|${originalUrl.substring(0, originalUrl.length - 1)}`
        : ''),
  );

  const res = await EleventyFetch(url.toString(), {
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${process.env.PLAUSIBLE_TOKEN}`,
      },
    },
    duration: '1d',
    type: 'json',
  });

  return res.results.pageviews.value;
};

module.exports = async () => {
  const ret = {};

  const urlList = await readdir(join(process.cwd(), 'src', 'posts')).then(
    (files) =>
      files
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.slice(11, f.length - 3))
        .map((s) => `/posts/${s}/`),
  );

  const { default: pLimit } = await import('p-limit');
  const lim = pLimit(8);

  await Promise.all(
    urlList.map((url) =>
      lim(async () => {
        ret[url] = await getViews(url);
      }),
    ),
  );

  return ret;
};
