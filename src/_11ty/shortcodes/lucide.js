const lucide = require('lucide-static/lib');
const { parseHTML } = require('linkedom');
const memoize = require('just-memoize');

module.exports = memoize((a, classes) => {
  const { document } = parseHTML(lucide[a]);
  document.querySelector('svg').classList.add(classes);
  return document.toString();
});
