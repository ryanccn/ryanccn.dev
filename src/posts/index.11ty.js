const html = String.raw;

class Page {
  data() {
    return {
      layout: 'base',
      title: 'Posts',
      permalink: '/posts/',
    };
  }

  render(data) {
    return html`<h1 class="font-bold text-4xl">Posts</h1>
      <h2 class="text-gray-600 font-medium text-xl mb-10">
        A list of posts that I have written
      </h2>

      <ol reversed class="flex flex-col space-y-4">
        ${data.collections.posts
          .map(
            (i) => html`<li>
              <h2
                class="text-lg font-semibold text-black hover:text-blue-500 transition-colors"
              >
                <a href="${i.url}"> ${i.data.title.replace('&', '&amp;')} </a>
              </h2>
              <p class="text-sm">${new Date(i.date).toDateString()}</p>
            </li>`
          )
          .join('\n')}
      </ol>`;
  }
}

module.exports = Page;
