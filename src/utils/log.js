import { bold, magenta, green, yellow, red, dim, cyan } from 'kleur/colors';
import { brotliCompress as brotliCompressCb } from 'node:zlib';
import { promisify } from 'node:util';
const brotliCompress = promisify(brotliCompressCb);

const te = new TextEncoder();

const threshold = { md: 50, lg: 75 };

/**
 * Log an asset file with its size and compressed size (with brotli)
 *
 * @param {number} str the string contents of the file
 * @param {string} name name of the file
 */
const logSize = async (str, name) => {
  const { byteLength } = te.encode(str);
  const kib = byteLength / 1024;

  const brLength = await brotliCompress(str).then((bf) => bf.byteLength);
  const brKib = brLength / 1024;

  let sizeStr = `${kib.toFixed(2)} KiB`;

  if (kib < threshold.md) {
    sizeStr = green(sizeStr);
  } else if (kib < threshold.lg) {
    sizeStr = yellow(sizeStr);
  } else {
    sizeStr = red(sizeStr);
  }

  let brStr = dim(`brotli: ${brKib.toFixed(2)} KiB`);

  if (brKib < threshold.md) {
    brStr = green(brStr);
  } else if (brKib < threshold.lg) {
    brStr = yellow(brStr);
  } else {
    brStr = red(brStr);
  }

  console.log(`${magenta('[assets]')} Built ${bold(name)}  ${sizeStr}  ${brStr}`);
};

/**
 * Log a message during data fetching
 *
 * @param {string} key The key of the data being fetched
 * @param  {...unknown} rest
 */
const logData = (key, ...rest) => {
  console.log(cyan(`[${dim('data/')}${key}]`), ...rest);
};

export { logSize, logData };
