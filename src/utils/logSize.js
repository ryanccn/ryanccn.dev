const { bold, magenta, green, yellow, red } = require('kleur/colors');

module.exports = (length, name) => {
  const kb = length / 1000;
  let sizeStr = `(${kb.toFixed(2)}KB)`;

  if (kb < 25) {
    sizeStr = green(sizeStr);
  } else if (kb >= 25 && kb < 50) {
    sizeStr = yellow(sizeStr);
  } else {
    sizeStr = red(sizeStr);
  }

  console.log(`${magenta('[assets]')} Creating ${bold(name)} ${sizeStr}`);
};
