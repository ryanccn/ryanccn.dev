const slugify = require('../_11ty/slugify');

class Page {
  data() {
    return {
      permalink: './pages.json',
      permalinkBypassOutputDir: true,
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    return JSON.stringify([
      ...data.collections.all
        .filter(
          (page) => !(page.url.startsWith('/posts/') && page.url !== '/posts/')
        )
        .map((page) => ({
          title: this.addNbsp(page.data.title),
          imgName: slugify(page.data.title),
        })),
      ...data.posts.map((post) => ({
        title: this.addNbsp(post.metadata.title),
        imgName: slugify(post.metadata.title),
      })),
    ]);
  }
}

module.exports = Page;
