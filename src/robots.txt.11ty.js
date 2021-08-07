class Page {
  data() {
    return {
      permalink: '/robots.txt',
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    return `
Sitemap: ${data.domain}/sitemap.xml

User-agent: *
Disallow:
`.trimStart();
  }
}

module.exports = Page;
