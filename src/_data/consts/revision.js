import { execa } from 'execa';

export default async () => {
  return execa`git rev-parse --short HEAD`.then((a) => a.stdout);
};
