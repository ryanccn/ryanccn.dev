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
      data.collections.all.map((page) => {
        return {
          title: page.data.title,
          // slug: this.slugify(page.data.title),
          url: page.url,
          date: page.data.date,
        };
      }),
      undefined, 2,
    );
  }
}

export default Page;
