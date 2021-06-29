const html = String.raw;

class Page {
  data() {
    return {
      layout: 'base',
      eleventyComputed: {
        title: ({ post }) => post.metadata.title,
      },
      permalink: ({ post }) => `/posts/${post.slug}/`,
      pagination: {
        data: 'posts',
        size: 1,
        alias: 'post',
      },
      includePrismCSS: true,
    };
  }

  render({ post }) {
    return html`<article class="prose prose-indigo">
      <h1>${post.metadata.title}</h1>
      ${post.html}
    </article>`;
  }
}

module.exports = Page;
