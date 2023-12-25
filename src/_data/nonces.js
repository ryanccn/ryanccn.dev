const makeNonce = () => crypto.randomUUID().replace(/-/g, '');

export default () => ({
  script: makeNonce(),
});
