import EleventyFetch from '@11ty/eleventy-fetch';
import { format } from 'date-fns';

import { logData } from '../utils/log.js';
import { bold } from 'kleur/colors';

import { readdir } from 'fs/promises';
import { join } from 'path';

const getViews = async ({ slug, originalUrl }) => {
  if (!process.env.PLAUSIBLE_TOKEN) return 0;

  logData('views', `Fetching for ${bold(slug)}`);

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

export default async () => {
  const ret = {};

  const postData = await readdir(join(process.cwd(), 'src', 'posts')).then(
    (files) =>
      files
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.slice(11, f.length - 3))
        .map((s) => ({ slug: s, originalUrl: `/posts/${s}/` })),
  );

  await Promise.all(
    postData.map(async (p) => {
      ret[p.slug] = await getViews(p);
    }),
  );

  return ret;
};
