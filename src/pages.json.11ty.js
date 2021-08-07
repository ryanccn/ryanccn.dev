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
      ...data.collections.all.map((page) => ({
        title: this.addNbsp(page.data.title),
        imgName: this.slug(page.data.title),
      })),
      /* ...data.posts.map((post) => ({
        title: this.addNbsp(post.metadata.title),
        imgName: this.slug(post.metadata.title),
      })), */
    ]);
  }
}

module.exports = Page;
