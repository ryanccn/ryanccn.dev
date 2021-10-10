import { VercelApiHandler } from '@vercel/node';
import got from 'got';

const originalUrl = 'https://plausible.io/js/plausible.js';

const randomStr = () => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let str = '';
  for (let i = 0; i < 20; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

const handler: VercelApiHandler = async (_, res) => {
  const replacement = randomStr();
  const origin = await got(originalUrl);

  const script = origin.body
    .replace(/window.plausible/g, `window.${replacement}`)
    .replace(/plausible_ignore/g, 'plausibleIgnore');

  console.log('plausible replacement:', replacement);

  res.setHeader('content-type', 'text/javascript');
  res.setHeader('cache-control', 's-maxage=3600');

  res.send(script);
};

export default handler;
