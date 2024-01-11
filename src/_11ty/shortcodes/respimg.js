import Image from '@11ty/eleventy-img';
import { imageSize } from 'image-size';
import lqip from '../lqip.js';

import { cpus } from 'node:os';
import { html, safe } from '../../utils/htmlTag.js';

Image.concurrency = cpus().length / 2;

const DISABLE_IMAGE_OPTIMIZATION =
  process.env.DISABLE_IMAGE_OPTIMIZATION === '1' ||
  process.env.DISABLE_IMAGE_OPTIMIZATION === 'true';

export default async (src, alt, width, height) => {
  if (!width || !height) {
    const originalDimensions = imageSize(src);

    width ||= originalDimensions.width;
    height ||= originalDimensions.height;
  }

  const stats = await Image(src, {
    widths: !DISABLE_IMAGE_OPTIMIZATION
      ? [640, 750, 828, 1080, 1200, 1920, 2048, 3840, width]
          .filter((a) => a <= width)
          .sort((a, b) => a - b)
      : [width],
    formats: !DISABLE_IMAGE_OPTIMIZATION ? ['avif', 'webp', 'png'] : ['png'],
    outputDir: './_site/images',
    urlPath: '/images/',
  });

  const bestSrc = stats.png[stats.png.length - 1];
  const lqipURI = await lqip(bestSrc.outputPath);

  const sources = Object.values(stats)
    .map(
      (i) =>
        html`<source
          type="${safe(i[0].sourceType)}"
          srcset="${i.map((entry) => entry.srcset).join(', ')}"
          sizes="100vw"
        >`,
    )
    .join('')
    .trim();

  const imgElem = html`
    <img
      src="${bestSrc.url}"
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
