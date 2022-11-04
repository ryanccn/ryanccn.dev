const icons = require('simple-icons/icons');
const { parseHTML } = require('linkedom');

module.exports = (a, classes) => {
  const original = Object.values(icons).filter((k) => k.slug === a)[0].svg;

  const { document } = parseHTML(original);
  document.querySelector('svg').classList.add(classes);
  return document.toString();
};
