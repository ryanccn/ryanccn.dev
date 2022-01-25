const { html, safe } = require('../../utils/htmlTag');

class Page {
  data() {
    return {
      layout: 'base',
      title: 'Posts',
      permalink: '/posts/',
      'override:tags': [],
    };
  }

  render(data) {
    return html`<h1 class="mb-1 text-4xl font-bold">Posts</h1>
      <h2 class="mb-12 text-lg font-medium text-zinc-600 dark:text-zinc-300">
        A list of posts that I have written
      </h2>

      <ol reversed class="flex flex-col space-y-4">
        ${safe(
          data.collections.posts
            .sort((a, b) => (a.date > b.date ? -1 : 1))
            .map(
              (i) => html`<li>
                <a
                  href="${i.url}"
                  class="link -mx-4 block rounded-md p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <h2 class="text-lg font-semibold">${i.data.title}</h2>
                  <p
                    class="text-sm font-medium text-zinc-800 dark:text-zinc-100"
                  >
                    <span data-reads>-</span> reads
                  </p>
                  <p
                    class="text-sm font-medium text-zinc-800 dark:text-zinc-100"
                  >
                    ${i.date.toDateString()}
                  </p>
                </a>
              </li>`
            )
            .join('\n')
        )}
      </ol>`;
  }
}

module.exports = Page;
