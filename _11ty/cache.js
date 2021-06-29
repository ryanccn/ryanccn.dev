const chalk = require('chalk');
const exists = require('./exists');
const fs = require('fs/promises');
const path = require('path');

const inProduction = process.env.NODE_ENV === 'production';

const ensureCacheDir = async () => {
  if (!(await exists('.cache'))) {
    await fs.mkdir('.cache');
  }
};

module.exports = async (fetchData, id) => {
  ensureCacheDir();

  const cacheFile = path.join(process.cwd(), `.cache/${id}.json`);

  if (!inProduction && (await exists(cacheFile))) {
    const fileContent = await fs.readFile(cacheFile);

    console.log(chalk.yellowBright(`> Using cached version of ${id}`));

    return JSON.parse(fileContent);
  } else {
    const freshData = await fetchData();
    await fs.writeFile(cacheFile, JSON.stringify(freshData));

    console.log(chalk.blueBright(`> Using fresh data for ${id}`));

    return freshData;
  }
};
