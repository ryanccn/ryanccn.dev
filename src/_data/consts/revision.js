import { x } from 'tinyexec';

export default () => {
  return x('git', ['rev-parse', '--short', 'HEAD']).then((a) => a.stdout.trim());
};
