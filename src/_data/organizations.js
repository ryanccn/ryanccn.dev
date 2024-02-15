// @ts-check

import { z } from 'zod';

const schema = z.array(
  z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    description: z.string().min(1),
    url: z.string().url(),
  }).strict(),
);

/** @type {z.infer<typeof schema>} */
const data = [
  {
    name: 'Catppuccin',
    role: 'Maintainer',
    description: 'Maintains quite a few ports and userstyles',
    url: 'https://github.com/catppuccin',
  },
  {
    name: 'NixOS',
    role: 'Nixpkgs Maintainer',
    description: 'Maintains packages on Nixpkgs',
    url: 'https://nixos.org/',
  },
  {
    name: 'Prism Launcher',
    role: 'Community Manager & Bot Maintainer',
    description: 'Manages the community and also maintains the community Discord bot',
    url: 'https://prismlauncher.org/',
  },
  {
    name: 'Elk',
    role: 'Triage team',
    description: 'Triages issues and pull requests',
    url: 'https://elk.zone/',
  },
];

export default schema.parse(data);
