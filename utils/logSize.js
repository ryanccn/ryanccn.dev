const chalk = require('chalk');

module.exports = (length, name) => {
  const kb = (length / 1000).toFixed(2);
  let sizeStr = `(${kb}KB)`;

  if (kb < 15) {
    sizeStr = chalk.greenBright(sizeStr);
  } else if (kb >= 15 && kb < 25) {
    sizeStr = chalk.yellowBright(sizeStr);
  } else {
    sizeStr = chalk.redBright(sizeStr);
  }

  console.log(`Creating ${chalk.bold(name)} ${sizeStr}`);
};
