import { imageSize } from 'image-size';
import lqip from '../lqip.js';

import { html, safe } from '../../utils/htmlTag.js';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * @param {number} w
 * @returns {number[]}
 */
const getWidths = (w) =>
  [640, 750, 828, 1080, 1200, 1920, 2048, 3840, w]
    .filter((a) => a <= w)
    .sort((a, b) => b - a);

const formats = ['avif', 'webp', 'jpeg'];

/**
 * @param {string} src
 * @param {string} alt
 * @param {number | undefined} width
 * @param {number | undefined} height
 */
export default async (src, alt, width, height) => {
  const resolvedPath = src.replace(/^\/images/, 'src/images');

  if (!alt) {
    throw new Error(`No \`alt\` set on ${src}`);
  }

  if (!width || !height) {
    const originalDimensions = imageSize(resolvedPath);

    width ||= originalDimensions.width;
    height ||= originalDimensions.height;
  }

  if (!width || !height) {
    throw new Error(`No \`width\` or \`height\` set on ${src}`);
  }

  if (!isProduction) {
    return html`
      <img
        src="${src}"
        width="${width}"
        height="${height}"
        alt="${alt}"
        loading="lazy"
        decoding="async"
        sizes="100vw"
        style="${`content-visibility: auto;`}"
      >
    `.trim();
  }

  const sources = formats
    .map((format) => {
      const srcset = getWidths(width)
        .map((w) => `/cdn-cgi/image/f=${format},w=${w}${src} ${w}w`)
        .join(', ');

      return html`
        <source type="image/${format}" srcset="${srcset}" sizes="100vw">
      `.trim();
    })
    .join('')
    .trim();

  const lqipURI = await lqip(resolvedPath);

  const imgElem = html`
    <img
      src="/cdn-cgi/image/f=auto${src}"
      width="${width}"
      height="${height}"
      alt="${alt}"
      loading="lazy"
      decoding="async"
      sizes="100vw"
      style="${`content-visibility: auto; background-size: cover; background-image: url("${lqipURI}")`}"
    >
  `.trim();

  return html`<picture>${safe(sources)}${safe(imgElem)}</picture>`.trim();
};
