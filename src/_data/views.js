import EleventyFetch from '@11ty/eleventy-fetch';

import { logData } from '../utils/log.js';

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export default async () => {
  const slugs = await readdir(join(process.cwd(), 'src', 'posts'))
    .then((files) => files
      .filter((file) => file.endsWith('.md'))
      .map((file) => file.slice(11, -3))
      .map((slug) => ({
        slug,
        urls: [`/posts/${slug}`, `/posts/${slug}/`, `/posts/${slug}.html`],
      })),
    );

  if (!process.env.PLAUSIBLE_TOKEN) {
    logData('views', 'Using mock data as PLAUSIBLE_TOKEN is not available');
    return Object.fromEntries(slugs.map(({ slug }) => [slug, 1234]));
  }

  logData('views', 'Fetching pageviews from Plausible API');

  const { results: data } = await EleventyFetch('https://plausible.io/api/v2/query', {
    fetchOptions: {
      method: 'POST',
      body: JSON.stringify({
        site_id: 'ryanccn.dev',
        metrics: ['pageviews'],
        date_range: ['1970-01-01T00:00:00Z', new Date().toISOString()],
        filters: [['is', 'event:page', slugs.flatMap((s) => s.urls)]],
        dimensions: ['event:page'],
      }),
      headers: {
        'authorization': `Bearer ${process.env.PLAUSIBLE_TOKEN}`,
        'content-type': 'application/json; charset=utf-8',
      },
    },
    duration: '1d',
    type: 'json',
  });

  const viewsEntries = slugs.map(({ slug, urls }) => [
    slug,
    data.find((entry) => urls.includes(entry.dimensions[0]))?.metrics[0] ?? 0,
  ]);

  return Object.fromEntries(viewsEntries);
};
