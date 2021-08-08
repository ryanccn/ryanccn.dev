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

      <ol reversed class="flex flex-col space-y-8">
        ${safe(
          data.collections.posts
            .sort((a, b) => (a.date > b.date ? -1 : 1))
            .map(
              (i) => html`<li>
                <h2 class="text-lg font-semibold">
                  <a class="link" href="${i.url}">${i.data.title} </a>
                </h2>
                <p class="text-sm">${i.date.toDateString()}</p>
              </li>`
            )
            .join('\n')
        )}
      </ol>`;
  }
}

module.exports = Page;
