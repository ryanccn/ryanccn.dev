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
    return html`<h1 class="text-4xl font-bold mb-1">Posts</h1>
      <h2 class="text-lg text-gray-600 font-medium mb-12">
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
                  class="block link p-4 -mx-4 rounded-md hover:bg-gray-100"
                >
                  <h2 class="text-lg font-semibold">${i.data.title}</h2>
                  <p class="text-sm text-gray-800 font-medium">
                    <span data-reads>-</span> reads
                  </p>
                  <p class="text-sm text-gray-800 font-medium">
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
