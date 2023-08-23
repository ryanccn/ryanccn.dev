class Page {
  data() {
    return {
      permalink: '/feed/feed.json',
      eleventyExcludeFromCollections: true,
    };
  }

  async render(data) {
    return JSON.stringify(
      {
        version: 'https://www.jsonfeed.org/version/1.1/',
        title: 'Ryan Cao',
        home_page_url: 'https://ryanccn.dev/',
        feed_url: 'https://ryanccn.dev/feed/feed.json',
        items: await Promise.all(
          [...data.collections.posts].reverse().map(async (post) => ({
            id: post.url,
            url: this.absoluteUrl(post.url),
            title: post.data.title,
            content_html: await this.htmlToAbsoluteUrls(
              post.templateContent,
              this.absoluteUrl(post.url),
            ),
            date_published: post.data.date.toISOString(),
            tags: post.data.tags,
          })),
        ),
      },
      undefined,
      2,
    );
  }
}

module.exports = Page;
