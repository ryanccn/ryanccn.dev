const fs = require('fs/promises');

const exists = async (path) => {
  return fs
    .stat(path)
    .then(() => true)
    .catch(() => false);
};

module.exports = exists;
