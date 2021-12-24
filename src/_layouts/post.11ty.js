const { html, safe } = require('../../utils/htmlTag');

class Post {
  data() {
    return {
      layout: 'base',
      includePrismCSS: true,
    };
  }

  render(data) {
    return html`<article class="prose dark:prose-invert">
        <h1>${data.title}</h1>
        ${safe(data.content)}
      </article>
      <button
        class="article-cta bg-blue-500 dark:bg-blue-500 shadow-blue-400/30 hover:shadow-blue-400/60 mt-16"
        data-share-button
      >
        <h1 class="font-semibold text-2xl lg:text-3xl mb-4">
          If you liked this post...
        </h1>
        <p class="font-medium text-lg">
          Don't forget to share it with more people!
        </p>
        <p class="font-medium text-lg">
          Just click anywhere in the blue area to share.
        </p>
      </button>
      <a
        class="article-cta bg-green-400 dark:bg-green-500 shadow-green-400/30 hover:shadow-green-400/60 mt-6"
        href="https://twitter.com/RyanCaoDev"
      >
        <h1 class="font-semibold text-2xl lg:text-3xl mb-4">
          If you have something to say...
        </h1>
        <p class="font-medium text-lg">You can also fire me a Twitter DM!</p>
        <p class="font-medium text-lg">
          Click to open my Twitter: @RyanCaoDev.
        </p>
      </a>`;
  }
}

module.exports = Post;
