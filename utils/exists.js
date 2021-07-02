const fs = require('fs/promises');

module.exports = async (path) => {
  let exists = true;

  try {
    await fs.stat(path);
  } catch {
    exists = false;
  }

  return exists;
};
