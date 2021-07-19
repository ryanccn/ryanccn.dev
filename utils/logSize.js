const kleur = require('kleur');

module.exports = (length, name) => {
  const kb = (length / 1000).toFixed(2);
  let sizeStr = `(${kb}KB)`;

  if (kb < 15) {
    sizeStr = kleur.green(sizeStr);
  } else if (kb >= 15 && kb < 25) {
    sizeStr = kleur.yellow(sizeStr);
  } else {
    sizeStr = kleur.red(sizeStr);
  }

  console.log(`Creating ${kleur.bold(name)} ${sizeStr}`);
};
