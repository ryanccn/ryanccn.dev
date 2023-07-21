module.exports = async () => {
  const { execa } = await import('execa');
  return await execa('git', ['rev-parse', '--short', 'HEAD']).then(
    (a) => a.stdout,
  );
};
