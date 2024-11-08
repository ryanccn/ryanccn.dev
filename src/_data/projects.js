// @ts-check

import { z } from 'zod';

const schema = z.record(z.array(
  z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    link: z.string().url(),
    featured: z.boolean().optional(),
  }).strict(),
));

/** @type {z.infer<typeof schema>} */
const data = {
  projects: [
    {
      name: 'Moddermore',
      description: 'Share the mods you use with anyone.',
      link: 'https://moddermore.net/',
    },
    {
      name: 'nrr',
      description: 'Minimal, blazing fast npm scripts runner',
      link: 'https://github.com/ryanccn/nrr',
    },
    {
      name: 'am',
      description: 'A beautiful and feature-packed Apple Music CLI',
      link: 'https://github.com/ryanccn/am',
    },
    {
      name: 'Vendflare',
      description: 'Vencord backend on Cloudflare Workers',
      link: 'https://github.com/ryanccn/vendflare',
    },
    {
      name: 'Modernflux',
      description: 'A modern look and feel for Miniflux',
      link: 'https://github.com/ryanccn/modernflux',
    },
    {
      name: 'morlana',
      description: 'nix-darwin utilities',
      link: 'https://github.com/ryanccn/morlana',
    },
    {
      name: 'nyoom',
      description: 'A small Firefox userchrome manager',
      link: 'https://github.com/ryanccn/nyoom',
    },
    {
      name: 'What the DMARC',
      description: 'Explains your DMARC and SPF records',
      link: 'https://whatthedmarc.ryanccn.dev/',
    },
    {
      name: 'spdx-gen',
      description: 'SPDX license generator',
      link: 'https://github.com/ryanccn/spdx-gen',
    },
    {
      name: 'Mastoroute',
      description: 'Unified share links for Mastodon',
      link: 'https://mastoroute.deno.dev/',
    },
    {
      name: 'flake',
      description: 'System configuration with Nix and nix-darwin',
      link: 'https://github.com/ryanccn/flake',
    },
    {
      name: 'Ryan Mono',
      description: 'My custom Iosevka Nerd Font build',
      link: 'https://github.com/ryanccn/ryan-mono',
    },
    {
      name: 'attic-action',
      description: 'Cache Nix derivations on GitHub Actions with Attic',
      link: 'https://github.com/ryanccn/attic-action',
    },
    {
      name: 'Tenable',
      description: 'An alternative, smaller script and associated proxy for Plausible Analytics',
      link: 'https://github.com/ryanccn/tenable',
    },
    {
      name: '@ryanccn/gql',
      description: 'A tiny GraphQL querying library',
      link: 'https://github.com/ryanccn/gql',
    },
    {
      name: 'nish',
      description: 'ni, implemented in bash',
      link: 'https://github.com/ryanccn/nish',
    },
    {
      name: 'vivid-zsh',
      description: 'zsh plugins for vivid',
      link: 'https://github.com/ryanccn/vivid-zsh',
    },
    {
      name: 'sarif-strip-suppressed',
      description: 'CLI tool to strip suppressed results from SARIF files',
      link: 'https://github.com/ryanccn/sarif-strip-suppressed',
    },
  ],
  archived: [
    {
      name: 'Olek',
      description: 'A minimalistic status page for my hosted services.',
      link: 'https://github.com/ryanccn/olek',
    },
    {
      name: 'clank',
      description: 'A simple CLI that runs your C++ code JIT',
      link: 'https://github.com/ryanccn/clank',
    },
    {
      name: 'bookmarklet',
      description: 'A CLI for creating bookmarklets',
      link: 'https://github.com/ryanccn/bookmarklet',
    },
    {
      name: 'NetNewsWire for Chrome',
      description: 'An extension to detect RSS links from pages and open them in NNW',
      link: 'https://github.com/ryanccn/netnewswire-for-chrome',
    },
    {
      name: 'Osmosis',
      description: 'An experimental Stable Diffusion frontend',
      link: 'https://github.com/ryanccn/osmosis',
    },
    {
      name: 'Blåhaj',
      description: 'A multipurpose, fun Discord bot.',
      link: 'https://github.com/ryanccn/blahaj',
    },
  ],
};

export default schema.parse(data);
