/**
 * @param {string} str
 * @returns {string}
 */
const escapeHTML = (str) => {
  return str
    .replace(/#/g, '%23')
    .replace(/%/g, '%25')
    .replace(/:/g, '%3A')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/"/g, "'");
};

const html = String.raw;

module.exports = { html, escapeHTML };
