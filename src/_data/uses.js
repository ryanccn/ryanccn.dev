// @ts-check

import { z } from 'zod';

const schemaTags = z.union([
  z.literal('openSource'),
  z.literal('freemium'),
  z.literal('paid'),
  z.literal('macos'),
  z.literal('ios'),
]);

const schema = z.record(z.array(
  z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    url: z.string().url(),
    tags: z.array(schemaTags).default([]).optional(),
    date: z.string().regex(/\d\d\d\d-\d\d-\d\d/).optional(),

    previously: z.array(z.object({
      name: z.string().min(1),
      url: z.string().url(),
    }).strict()).optional(),

    accessories: z.array(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        url: z.string().url(),
      }).strict(),
    ).optional(),
  }).strict(),
));

/** @type {z.infer<typeof schema>} */
const data = {
  'apps.general': [
    {
      name: 'Firefox',
      url: 'https://www.mozilla.org/en-US/firefox/',
      description: 'Everyday browser',
      tags: ['openSource'],
      accessories: [
        {
          name: 'arkenfox',
          url: 'https://github.com/arkenfox/user.js',
          description: 'Privacy hardening settings',
        },
        {
          name: 'nyoom',
          url: 'https://github.com/ryanccn/nyoom',
          description: 'Command line userchrome manager',
        },
        {
          name: 'edge-frfox',
          url: 'https://github.com/bmFtZQ/edge-frfox',
          description: 'Microsoft Edge userchrome',
        },
      ],
    },
    {
      name: 'Ungoogled Chromium',
      description: 'Private, fast Chromium-based browser',
      url: 'https://github.com/ungoogled-software/ungoogled-chromium',
      tags: ['openSource'],
    },
    {
      name: 'Orion',
      description: 'Private, fast WebKit-based browser',
      url: 'https://browser.kagi.com/',
    },
    {
      name: '1Password',
      description: 'Secure and reliable cross-platform password manager',
      url: 'https://1password.com/',
      tags: ['paid'],
    },
    {
      name: 'Things',
      description: 'Simple to-do list app',
      url: 'https://culturedcode.com/things/',
      tags: ['paid', 'macos'],
    },
    {
      name: 'Notion',
      description: 'Collaborative documents and databases',
      url: 'https://notion.so/',
      tags: ['freemium'],
    },
    {
      name: 'Obsidian',
      description: 'Private and flexible note-taking app',
      url: 'https://obsidian.md/',
    },
    {
      name: 'Apple Music',
      description: 'Music with a large library, local music sync, and Dolby Atmos',
      url: 'https://www.apple.com/apple-music/',
      tags: ['paid', 'macos'],
    },
    {
      name: 'Dato',
      description: 'Menu bar calendar and better notifications',
      url: 'https://sindresorhus.com/dato',
      tags: ['paid', 'macos'],
    },
    {
      name: 'Vesktop',
      url: 'https://github.com/Vencord/Vesktop',
      description: 'Discord desktop app with Vencord pre-installed',
      tags: ['openSource'],
    },
  ],
  'apps.dev': [
    {
      name: 'Ghostty',
      url: 'https://mitchellh.com/ghostty',
      description: 'GPU-accelerated terminal emulator pushing modern features.',
      date: '2024-02-22',
      previously: [
        { name: 'WezTerm', url: 'https://wezfurlong.org/wezterm/index.html' },
        { name: 'iTerm2', url: 'https://iterm2.com/' },
      ],
      tags: ['openSource'],
    },
    {
      name: 'Visual Studio Code',
      url: 'https://code.visualstudio.com/',
      description: 'General purpose IDE',
      tags: ['openSource'],
    },
    {
      name: 'Figma',
      url: 'https://figma.com/',
      description: 'Designs, mockups, logo and icon design',
      tags: ['freemium'],
    },
    {
      name: 'Orbstack',
      url: 'https://orbstack.dev/',
      description: 'Faster, native Docker engine',
      tags: ['freemium', 'macos'],
    },
    {
      name: 'MongoDB Compass',
      url: 'https://www.mongodb.com/products/compass',
      description: 'MongoDB database viewer and editor',
    },
    {
      name: 'DBngin',
      url: 'https://dbngin.com/',
      description: 'PostgreSQL/MySQL/Redis local server management',
      tags: ['macos'],
    },
  ],
  'apps.utilities': [
    {
      name: 'Raycast',
      url: 'https://raycast.com/',
      description: 'Powerful, developer-oriented Spotlight alternative',
      tags: ['freemium', 'macos'],
    },
    {
      name: 'IINA',
      url: 'https://iina.io/',
      description: 'Video and audio player',
      tags: ['openSource', 'macos'],
    },
    {
      name: 'CleanShot X',
      url: 'https://cleanshot.com/',
      description: 'Enhanced screenshot app',
      tags: ['paid', 'macos'],
    },
    {
      name: 'Clop',
      url: 'https://lowtechguys.com/clop/',
      description: 'Image, video, PDF and clipboard optimizer',
      tags: ['openSource', 'freemium', 'macos'],
    },
    {
      name: 'Ice',
      url: 'https://github.com/jordanbaird/Ice',
      description: 'Powerful menu bar manager for macOS',
      tags: ['openSource', 'macos'],
      date: '2024-09-05',
    },
    {
      name: 'Stats',
      url: 'https://github.com/exelban/stats',
      description: 'Menu bar system statistics',
      tags: ['openSource', 'macos'],
    },
    {
      name: 'Amphetamine',
      url: 'https://apps.apple.com/us/app/amphetamine/id937984704',
      description: 'Preventing system sleep',
      accessories: [
        {
          name: 'Amphetamine Enhancer',
          url: 'https://github.com/x74353/Amphetamine-Enhancer',
          description: 'Helper application to enhance Amphetamine\'s features',
        },
      ],
      tags: ['macos'],
    },
    {
      name: 'AlDente',
      url: 'https://apphousekitchen.com/',
      description: 'macOS battery performance optimization',
      previously: [
        { name: 'BatFi', url: 'https://micropixels.software/apps/batfi' },
      ],
      tags: ['macos', 'freemium'],
      date: '2024-09-05',
    },
    {
      name: 'MediaMate',
      url: 'https://wouter01.github.io/MediaMate/',
      description: 'Beautiful macOS HUD replacement',
      date: '2024-02-15',
      tags: ['paid', 'macos'],
    },
    {
      name: 'Velja',
      url: 'https://sindresorhus.com/velja',
      description: 'Powerful browser picker',
      tags: ['macos'],
    },
    {
      name: 'Pure Paste',
      url: 'https://sindresorhus.com/pure-paste',
      description: 'Paste as plain text by default',
      tags: ['macos'],
    },
    {
      name: 'Sleeve',
      url: 'https://replay.software/sleeve',
      description: 'Music accessory',
      tags: ['paid', 'macos'],
    },
    {
      name: 'Espanso',
      url: 'https://github.com/espanso/espanso',
      description: 'Cross-platform text expander',
      tags: ['openSource'],
      date: '2024-10-15',
    },
    {
      name: 'DaisyDisk',
      url: 'https://daisydiskapp.com/',
      description: 'Visual disk space analyzer and cleaner',
      tags: ['macos', 'paid'],
      date: '2024-10-15',
    },
    {
      name: 'System Color Picker',
      url: 'https://sindresorhus.com/system-color-picker',
      description: 'Choosing and manipulating colors',
      tags: ['macos'],
    },
    {
      name: 'Upscayl',
      url: 'https://upscayl.github.io/',
      description: 'Occasionally upscaling images',
      tags: ['openSource'],
    },
    {
      name: 'KnockKnock',
      url: 'https://objective-see.org/products/knockknock.html',
      description: 'macOS persistent software scans',
      tags: ['openSource', 'macos'],
    },
    {
      name: 'RansomWhere?',
      url: 'https://objective-see.org/products/ransomwhere.html',
      description: 'macOS ransomware detection',
      tags: ['openSource', 'macos'],
    },
  ],
  'apps.browserExtensions': [
    {
      name: 'uBlock Origin',
      url: 'https://github.com/gorhill/uBlock',
      description: 'Ad and tracker blocking',
      tags: ['openSource'],

    },
    {
      name: '1Password',
      url: 'https://1password.com/downloads/browser-extension/',
      description: '1Password browser integration',
      tags: ['paid'],
    },
    {
      name: 'Stylus',
      url: 'https://github.com/openstyles/stylus',
      description: 'Custom CSS styling and theming',
      tags: ['openSource'],
    },
    {
      name: 'Refined GitHub',
      url: 'https://github.com/refined-brand-github/refined-brand-github',
      description: 'Better GitHub UX',
      tags: ['openSource'],
    },
    {
      name: 'Tabliss',
      url: 'https://tabliss.io/',
      description: 'Beautiful, customizable New Tab page',
    },
    {
      name: 'AdGuard',
      url: 'https://adguard.com/en/adguard-ios/overview.html',
      description: 'Safari ad and tracker blocking',
      date: '2024-02-15',
      previously: [{ name: '1Blocker', url: 'https://1blocker.com/' }],
      tags: ['freemium', 'ios'],
    },
  ],
  'services.general': [
    {
      name: '1Password',
      url: 'https://1password.com/',
      description: 'Secure and reliable cross-platform password manager',
      tags: ['paid'],
    },
    {
      name: 'Tuta',
      url: 'https://tuta.com/',
      description: 'Privacy-friendly custom domain email',
      tags: ['freemium'],
    },
    {
      name: 'Notion',
      url: 'https://notion.so/',
      description: 'Collaborative documents and databases',
      tags: ['freemium'],
    },
    {
      name: 'Apple Music',
      url: 'https://www.apple.com/apple-music/',
      description: 'Music with a large library, local music sync, and Dolby Atmos',
      previously: [{ name: 'Spotify', url: 'https://open.spotify.com/' }],
      tags: ['paid'],
    },
  ],
  'services.webDev': [
    {
      name: 'GitHub',
      url: 'https://github.com/',
      description: 'Project source code hosting',
    },
    {
      name: 'Vercel',
      url: 'https://vercel.com/',
      description: 'Web app and static site hosting',
      tags: ['freemium'],
    },
    {
      name: 'Cloudflare',
      url: 'https://cloudflare.com/',
      description: 'DNS, static sites, serverless functions, etc.',
      tags: ['freemium'],
    },
    {
      name: 'Plausible',
      url: 'https://plausible.io/',
      description: 'Privacy-respecting analytics',
      tags: ['openSource', 'paid'],
    },
    {
      name: 'Railway',
      url: 'https://railway.app/',
      description: 'Occasional server hosting',
      tags: ['paid'],
    },
    {
      name: 'Deno Deploy',
      url: 'https://deno.com/deploy',
      description: 'Edge functions built with Deno',
      tags: ['freemium'],
    },
    {
      name: 'Amazon Web Services',
      url: 'https://aws.amazon.com/',
      description: 'A wide variety of cloud services',
      tags: ['paid'],
    },
    {
      name: 'Porkbun',
      url: 'https://porkbun.com/',
      description: 'Domain purchases and management',
    },
    {
      name: 'MongoDB Atlas',
      url: 'https://www.mongodb.com/atlas',
      description: 'NoSQL MongoDB databases',
      tags: ['freemium'],
    },
    {
      name: 'Upstash',
      url: 'https://upstash.com/',
      description: 'Redis databases and queues',
      tags: ['freemium'],
    },
    {
      name: 'Neon',
      url: 'https://neon.tech/',
      description: 'Serverless Postgres',
      tags: ['openSource', 'freemium'],
    },
    {
      name: 'Doppler',
      url: 'https://doppler.com/',
      description: 'Secrets orchestration',
      tags: ['freemium'],
    },
  ],
};

export default schema.parse(data);
