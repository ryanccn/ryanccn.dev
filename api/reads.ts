import type { Handler } from '@netlify/functions';

const handler: Handler = async (ev) => {
  if (
    !ev.queryStringParameters ||
    typeof ev.queryStringParameters.slug !== 'string'
  ) {
    return { statusCode: 400 };
  }

  const slug = ev.queryStringParameters.slug;

  if (!slug) {
    return { statusCode: 400 };
  }

  let data;

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
      return a.json();
    });
  } catch {
    return { statusCode: 500 };
  }

  return { body: JSON.stringify({ value: data }), statusCode: 200 };
};

export { handler };
