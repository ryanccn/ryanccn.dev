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
          // const titleFragments = page.data.title.split(' ');
          // const titleWithNbsp =
          //   titleFragments.slice(0, titleFragments.length - 1).join(' ') +
          //   ' ' +
          //   titleFragments[titleFragments.length - 1];

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
