const { Client } = require('@notionhq/client');
const sortBy = require('just-group-by');

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

module.exports = async () => {
  const db = await notion.databases.query({
    database_id: 'b1468e82f692429b85666e6a13608da2',
    page_size: 100000,
  });

  // console.log(db.results[0].properties);

  return sortBy(db.results, (page) => page.properties.Type.select.name);
};
