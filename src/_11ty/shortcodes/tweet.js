const { Client } = require('twitter-api-sdk');
const Image = require('@11ty/eleventy-img');

const { html, safe, escapeHtml } = require('../../utils/htmlTag');
const lucideShortcode = require('./lucide');

/**
 * @param id {string}
 */
module.exports = async (id) => {
  const twitterClient = new Client(process.env.TWITTER_ACCESS_TOKEN);

  const { data: tweet, includes } = await twitterClient.tweets.findTweetById(
    id,
    {
      expansions: ['author_id'],
      'tweet.fields': ['public_metrics'],
      'user.fields': ['name', 'profile_image_url'],
    }
  );

  const author = includes.users[0];

  const optimizedAvatar = await Image(
    author.profile_image_url.replace('_normal', ''),
    {
      widths: [64, 32],
      formats: ['webp', 'png'],
      outputDir: './_site/images/twitter',
      urlPath: '/images/twitter',
    }
  );

  const avatar2xUrl = optimizedAvatar.png.filter((a) => a.width === 64)[0].url;
  const avatar1xUrl = optimizedAvatar.png.filter((a) => a.width === 32)[0].url;
  const avatar2xWebpUrl = optimizedAvatar.webp.filter((a) => a.width === 64)[0]
    .url;
  const avatar1xWebpUrl = optimizedAvatar.webp.filter((a) => a.width === 32)[0]
    .url;

  return html`
    <div class="not-prose">
      <a
        class="flex flex-col gap-y-4 rounded-lg border border-surface p-6 transition"
        href="https://twitter.com/${tweet.username}/status/${tweet.id}"
      >
        <div class="flex items-start gap-x-2">
          <picture>
            <source
              type="image/webp"
              srcset="${avatar2xWebpUrl} 2x, ${avatar1xWebpUrl} 1x"
            />
            <source
              type="image/png"
              srcset="${avatar2xUrl} 2x, ${avatar1xUrl} 1x"
            />
            <img
              src="${avatar2xUrl}"
              width="32"
              height="32"
              alt=""
              loading="lazy"
              decoding="async"
              class="h-[32px] w-[32px] rounded-full"
            />
          </picture>
          <div class="flex flex-col gap-y-1">
            <span class="font-semibold leading-none">${author.name}</span>
            <span class="text-zinc-600 dark:text-zinc-400 text-sm leading-none">
              @${author.username}
            </span>
          </div>
        </div>
        <p class="text-lg">
          ${safe(escapeHtml(tweet.text).replace(/\n/g, '<br>'))}
        </p>
        <div class="flex justify-between">
          <div class="flex items-center gap-x-1">
            ${safe(lucideShortcode('messageCircle', 'block w-4 h-4'))}
            <span class="font-medium">${tweet.public_metrics.reply_count}</span>
          </div>
          <div class="flex items-center gap-x-1">
            ${safe(lucideShortcode('refreshCcw', 'block w-4 h-4'))}
            <span class="font-medium">
              ${tweet.public_metrics.retweet_count}
            </span>
          </div>
          <div class="flex items-center gap-x-1">
            ${safe(lucideShortcode('heart', 'block w-4 h-4'))}
            <span class="font-medium">${tweet.public_metrics.like_count}</span>
          </div>
        </div>
      </a>
    </div>
  `.trim();
};
