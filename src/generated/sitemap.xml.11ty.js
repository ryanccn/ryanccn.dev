class Page {
  data() {
    return {
      permalink: '/sitemap.xml',
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    return `
<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${data.collections.all.map((page) => `
  <url>
    <loc>${data.consts.domain}${page.url}</loc>
    <lastmod>${page.date.toISOString()}</lastmod>
  </url>`,
    ).join('\n')}
</urlset>
`.trimStart();
  }
}

export default Page;
