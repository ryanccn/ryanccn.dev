// @ts-check

import { z } from 'zod';

const schema = z.array(
  z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    description: z.string().min(1),
    url: z.string().url(),
    formerly: z.boolean().default(false).optional(),
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
    description: 'Maintains a few packages on Nixpkgs',
    url: 'https://nixos.org/',
  },
  {
    name: 'Elk',
    role: 'Triage team',
    description: 'Triages issues and pull requests',
    url: 'https://elk.zone/',
  },
  {
    name: 'Prism Launcher',
    role: 'Community Manager',
    description: 'Managed and moderated the community for two years',
    url: 'https://prismlauncher.org/',
    formerly: true,
  },
];

export default schema.parse(data);
