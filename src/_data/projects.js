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
      name: 'ryanccn.dev',
      description: 'My personal website, made with Eleventy and Tailwind CSS!',
      link: 'https://github.com/ryanccn/ryanccn.dev',
    },
    {
      name: 'nrr',
      description: 'Minimal, blazing fast Node.js script runner',
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
      name: 'nyoom',
      description: 'A CLI Firefox userchrome manager',
      link: 'https://github.com/ryanccn/nyoom',
    },
    {
      name: 'What the DMARC',
      description: 'Explains your DMARC and SPF records',
      link: 'https://whatthedmarc.ryanccn.dev/',
    },
    {
      name: 'Blåhaj',
      description: 'A multipurpose, fun Discord bot.',
      link: 'https://github.com/ryanccn/blahaj',
    },
    {
      name: 'Mastoroute',
      description: 'Unified share links for Mastodon',
      link: 'https://mastoroute.deno.dev/',
    },
    {
      name: 'Daenerys',
      description: 'Gain insights from DNS records',
      link: 'https://daenerys.vercel.app/',
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
      name: 'Tenable',
      description: 'An alternative, smaller script and associated proxy for Plausible Analytics',
      link: 'https://github.com/ryanccn/tenable',
    },
    {
      name: 'Choirpack',
      description: 'Simple and powerful Node.js package manager utilities built around Corepack',
      link: 'https://github.com/ryanccn/choirpack',
    },
    {
      name: 'attic-action',
      description: 'Cache Nix derivations on GitHub Actions with Attic',
      link: 'https://github.com/ryanccn/attic-action',
    },
    {
      name: 'sarif-strip-suppressed',
      description: 'CLI tool to strip suppressed results from SARIF files',
      link: 'https://github.com/ryanccn/sarif-strip-suppressed',
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
  ],
  mods: [
    {
      name: 'Vanillish',
      description: 'A lightweight and beautiful vanilla experience',
      link: 'https://modrinth.com/modpack/vanillish',
      featured: true,
    },
    {
      name: 'EmuNO',
      description: 'Disables various macOS-specific behaviors, making your life better',
      link: 'https://modrinth.com/mod/emuno',
      featured: true,
    },
    {
      name: 'uwuify chat',
      description: 'uwuify the chat messages owo',
      link: 'https://modrinth.com/mod/uwuify-chat',
    },
    {
      name: 'quilted-dependabot',
      description: 'Update certain dependencies for Quilt',
      link: 'https://github.com/RyanModDev/quilted-dependabot',
    },
  ],
  contributions: [
    {
      name: 'Vencord',
      description: 'The cutest Discord client mod',
      link: 'https://vencord.dev/',
    },
    {
      name: 'Fig',
      description: 'Autocomplete for terminals',
      link: 'https://github.com/withfig/autocomplete',
    },
    {
      name: 'InvokeAI',
      description: 'Stable Diffusion web interface',
      link: 'https://invoke-ai.github.io/InvokeAI/',
    },
    {
      name: 'jet',
      description: 'Eleventy & Tailwind site template',
      link: 'https://github.com/marcamos/jet',
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
      name: 'Myriad Bows',
      description: 'A Myriad enchantment for bows that consumes arrows depending on your luck',
      link: 'https://github.com/RyanModDev/MyriadBows',
    },
  ],
};

export default schema.parse(data);
