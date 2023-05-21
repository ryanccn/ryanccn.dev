const icons = require('simple-icons/icons');
const { parseHTML } = require('linkedom');
const memoize = require('just-memoize');

module.exports = memoize((a, classes) => {
  const original = Object.values(icons).filter((k) => k.slug === a)[0].svg;

  const { document } = parseHTML(original);
  document.querySelector('svg').classList.add(classes);
  document.querySelector('svg').setAttribute('fill', 'currentColor');
  return document.toString();
});
