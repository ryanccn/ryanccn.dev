const lucide = require('lucide-static/lib');
const { parseHTML } = require('linkedom');

module.exports = (a, classes) => {
  const { document } = parseHTML(lucide[a]);
  document.querySelector('svg').classList.add(classes);
  return document.toString();
};
