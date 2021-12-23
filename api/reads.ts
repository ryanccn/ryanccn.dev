import { VercelApiHandler } from '@vercel/node';
import fetch from 'node-fetch';

type PlausibleReturnType = {
  results: {
    pageviews: {
      value: number;
    };
  };
};

const handler: VercelApiHandler = async (req, res) => {
  const slug = req.query.slug;

  if (!slug) {
    res.status(400).json({ error: 'you need to provide a `slug` parameter!' });
    return;
  }

  let data: PlausibleReturnType;

  try {
    data = await fetch(
      `https://plausible.io/api/v1/stats/aggregate?site_id=ryanccn.dev&period=12mo&metrics=pageviews&filters=${encodeURIComponent(
        `event:page==/posts/${slug}`
      )}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PLAUSIBLE_TOKEN}`,
        },
      }
    ).then((a) => {
      return <Promise<PlausibleReturnType>>a.json();
    });
  } catch {
    res.json({ error: 'an error occurred in fetching the data.' });
    return;
  }

  res.setHeader('cache-control', 's-maxage=60, stale-while-revalidate');

  res.json({ value: data.results.pageviews.value });
};

export default handler;
