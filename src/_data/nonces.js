const makeNonce = () => crypto.randomUUID().replaceAll('-', '');

export default () => ({
  script: makeNonce(),
});
