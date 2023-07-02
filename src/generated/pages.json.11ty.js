class Page {
  data() {
    return {
      permalink: './pages.json',
      permalinkBypassOutputDir: true,
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    return JSON.stringify(
      [
        ...data.collections.all.map((page) => {
          return {
            title: page.data.title,
            slug: this.slugify(page.data.title),
            date: page.data.date,
          };
        }),
      ],
      undefined,
      2
    );
  }
}

module.exports = Page;
