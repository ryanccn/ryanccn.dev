const gray = require('gray-matter');
const remark = require('remark');
const prism = require('remark-prism');
const html = require('remark-html');

const globby = require('globby');
const fs = require('fs/promises');
const path = require('path');

const cache = require('../../utils/cache');

const fetchData = async () => {
  const files = await globby(path.join(process.cwd(), 'content') + '/*.md');

  const posts = await Promise.all(
    files.map(async (item) => {
      const fileContent = await fs.readFile(item, 'utf8');
      const slug = path.basename(item).replace('.md', '');
      const { data, content: mdContent } = gray(fileContent);

      const htmlContent = remark()
        .use(prism)
        .use(html)
        .processSync(mdContent)
        .toString();

      return {
        metadata: data,
        slug,
        html: htmlContent,
      };
    })
  );

  return posts.sort((a, b) =>
    new Date(a.metadata.date) > new Date(b.metadata.date) ? -1 : 1
  );
};

module.exports = async () => {
  return cache(fetchData, 'posts');
};
