const { html, safe } = require('../../utils/htmlTag');

class Post {
  data() {
    return {
      layout: 'base',
      includePrismCSS: true,
    };
  }

  render(data) {
    return html`<article class="prose">
        <h1>${data.title}</h1>
        ${safe(data.content)}
      </article>
      <button
        class="mt-16 article-cta rounded-b-none hover:rounded-b-2xl"
        data-share-button
      >
        <h1 class="font-semibold text-3xl mb-4">If you liked this post...</h1>
        <p class="font-medium text-lg">
          Don't forget to share it with more people!
        </p>
        <p class="font-medium text-lg">
          Just click anywhere in the blue area to share.
        </p>
      </button>
      <a
        class="bg-green-400 article-cta rounded-t-none hover:rounded-t-2xl"
        href="https://twitter.com/RyanCaoDev"
      >
        <h1 class="font-semibold text-3xl mb-4">
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
