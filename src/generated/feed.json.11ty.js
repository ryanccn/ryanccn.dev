class Page {
  data() {
    return {
      permalink: '/feed/feed.json',
      eleventyExcludeFromCollections: true,
    };
  }

  async render(data) {
    return JSON.stringify({
      version: 'https://www.jsonfeed.org/version/1.1/',
      title: 'Ryan Cao',
      home_page_url: 'https://ryanccn.dev/',
      feed_url: 'https://ryanccn.dev/feed/feed.json',
      items: await Promise.all(
        [...data.collections.posts]
          .reverse()
          .slice(0, 5)
          .map(async (post) => ({
            id: post.url,
            url: this.htmlBaseUrl(post.url, 'https://ryanccn.dev/'),
            title: post.data.title,
            content_html: await this.renderTransforms(post.content, post.data.page, 'https://ryanccn.dev/'),
            date_published: post.data.date.toISOString(),
            tags: post.data.tags,
          })),
      ),
    }, undefined, 2);
  }
}

export default Page;
