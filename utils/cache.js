const kleur = require('kleur');

const { pathExists, ensureDir, readJSON, writeJSON } = require('fs-extra');
const path = require('path');

const inProduction = process.env.NODE_ENV === 'production';

const ensureCacheDir = async () => {
  ensureDir(path.join(process.cwd(), '.cache'));
};

module.exports = async (fetchData, id) => {
  await ensureCacheDir();

  const cacheFile = path.join(process.cwd(), `.cache/${id}.json`);

  if (!inProduction && (await pathExists(cacheFile))) {
    const fileContent = await readJSON(cacheFile);

    console.log(kleur.yellow().bold(`[${id}] Using cached data`));

    return fileContent;
  } else {
    const freshData = await fetchData();
    await writeJSON(cacheFile, freshData);

    console.log(kleur.blue().bold(`[${id}] Using fresh data`));

    return freshData;
  }
};
