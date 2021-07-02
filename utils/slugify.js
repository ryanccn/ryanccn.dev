const slugify = require('slugify');

module.exports = (str) => {
  return slugify.default(str, {
    lower: true,
    strict: true,
  });
};
