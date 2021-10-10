const { html } = require('../utils/htmlTag');

class Page {
  data() {
    return {
      layout: 'base',
      title: 'Ryan Cao',
      permalink: '/',
    };
  }

  render() {
    return html`
      <p class="text-3xl font-semibold mb-10">
        Hi! I'm <span class="font-bold">Ryan</span>.
      </p>
      <p class="mb-4">
        I am a
        <mark
          data-color="rgba(196, 181, 253, 0.5)"
          data-iterations="1"
          data-duration="750"
          class="font-medium"
        >
          fullstack web developer
        </mark>
        who loves working with SSGs and performant stuff.
      </p>
      <p class="mb-16">
        I do
        <mark data-iterations="1" data-duration="750" class="font-medium"
          >web development</mark
        >
        and am currently learning
        <mark
          data-color="rgba(110, 231, 183, 0.5)"
          data-iterations="1"
          data-duration="750"
          class="font-medium"
          >SwiftUI</mark
        >.
      </p>
      <a class="big-blue-btn" href="/posts"> Read my blog posts → </a>
    `;
  }
}

module.exports = Page;
