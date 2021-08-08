const html = require('../../utils/htmlTag');

const safe = (a) => ({ value: a, safe: true });

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
    </article>`;
  }
}

module.exports = Post;
