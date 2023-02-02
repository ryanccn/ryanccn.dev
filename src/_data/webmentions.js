const { AssetCache } = require('@11ty/eleventy-fetch');
const { ofetch } = require('ofetch');
const { cyan } = require('kleur/colors');

module.exports = async () => {
  const cache = new AssetCache('webmentions');

  if (cache.isCacheValid('1d')) {
    console.log(`${cyan('[data]')} Using cached webmentions`);
    return await cache.getCachedValue();
  }

  const getURL = (page) =>
    `https://webmention.io/api/mentions.jf2?domain=ryanccn.dev&token=${process.env.WEBMENTION_TOKEN}&page=${page}&per-page=1000`;

  let mentions = [];
  let page = 0;
  while (true) {
    console.log(`${cyan('[data]')} Fetching webmentions (page ${page})`);

    const data = await ofetch(getURL(page));

    if (!data?.children?.length) break;
    mentions.push(...data.children);
    page++;
  }

  await cache.save(mentions, 'json');

  return mentions;
};
