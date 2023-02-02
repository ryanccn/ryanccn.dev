const EleventyFetch = require('@11ty/eleventy-fetch');
const { cyan } = require('kleur/colors');

module.exports = async () => {
  console.log(`${cyan('[data]')} Fetching webmentions`);

  const url = `https://webmention.io/api/mentions.jf2?domain=ryanccn.dev&token=${process.env.WEBMENTION_TOKEN}`;

  const res = await EleventyFetch(url, {
    duration: '1d',
    type: 'json',
  });

  return res;
};
