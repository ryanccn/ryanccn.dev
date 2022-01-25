const { html, safe } = require('../../utils/htmlTag');

class Post {
  data() {
    return {
      layout: 'base',
      includePrismCSS: true,
    };
  }

  render(data) {
    return html`<article
        class="prose prose-a:text-blue-500
        prose-a:underline-offset-1 prose-a:transition-colors
        hover:prose-a:text-blue-400 dark:prose-invert
        dark:prose-a:text-blue-400
        dark:hover:prose-a:text-blue-500"
      >
        <h1>${data.title}</h1>
        ${safe(data.content)}
      </article>
      <button
        class="article-cta mt-16 bg-blue-500 shadow-blue-400/30 hover:shadow-blue-400/60 dark:bg-blue-500"
        data-share-button
      >
        <h1 class="mb-4 text-2xl font-semibold lg:text-3xl">
          If you liked this post...
        </h1>
        <p class="text-lg font-medium">
          Don't forget to share it with more people!
        </p>
        <p class="text-lg font-medium">
          Just click anywhere in the blue area to share.
        </p>
      </button>
      <a
        class="article-cta mt-6 bg-green-400 shadow-green-400/30 hover:shadow-green-400/60 dark:bg-green-500"
        href="https://twitter.com/RyanCaoDev"
      >
        <h1 class="mb-4 text-2xl font-semibold lg:text-3xl">
          If you have something to say...
        </h1>
        <p class="text-lg font-medium">You can also fire me a Twitter DM!</p>
        <p class="text-lg font-medium">
          Click to open my Twitter: @RyanCaoDev.
        </p>
      </a>`;
  }
}

module.exports = Post;
