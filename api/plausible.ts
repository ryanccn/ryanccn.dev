import type { VercelApiHandler } from '@vercel/node';
import fetch from 'node-fetch';

const originalUrl = 'https://plausible.io/js/plausible.js';

const randomStr = () => {
  const chars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'];

  let str = '';
  for (let i = 0; i < 20; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }

  return str;
};

const handler: VercelApiHandler = async (_, res) => {
  const replacement = randomStr();
  const origin = await fetch(originalUrl).then((res) => res.text());

  const script = origin
    .replace(/window.plausible/g, `window.${replacement}`)
    .replace(/plausible_ignore/g, 'plausibleIgnore');

  res.setHeader('content-type', 'text/javascript');
  res.setHeader('cache-control', 's-maxage=3600');

  res.send(script);
};

export default handler;
