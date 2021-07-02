const html = String.raw;

class Page {
  data() {
    return {
      layout: 'base',
      title: 'Posts',
      permalink: '/posts/',
    };
  }

  render({ posts }) {
    return html`<ol reversed class="flex flex-col space-y-4">
      ${posts
        .map(
          (i) => html`<li>
            <h2 class="font-semibold hover:underline">
              <a href="/posts/${i.slug}">
                ${i.metadata.title.replace('&', '&amp;')}
              </a>
            </h2>
            <p class="text-sm">${new Date(i.metadata.date).toDateString()}</p>
          </li>`
        )
        .join('\n')}
    </ol>`;
  }
}

module.exports = Page;
