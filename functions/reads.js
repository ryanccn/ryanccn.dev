export async function onRequest(context) {
  const { request } = context;

  const slug = request.url.searchParams.get('slug');

  if (!slug) {
    return new Response(null, {
      status: 400,
    });
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
    return new Response(null, { status: 500 });
  }

  return new Response(JSON.stringify({ value: data }), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
