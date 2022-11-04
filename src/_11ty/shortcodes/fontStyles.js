const { readFile } = require('fs/promises');

module.exports = async () => {
  const inter = await readFile('./src/assets/fonts/inter/inter.css', 'utf-8');
  const satoshi = await readFile(
    './src/assets/fonts/satoshi/satoshi.css',
    'utf-8'
  );

  return inter + satoshi;
};
