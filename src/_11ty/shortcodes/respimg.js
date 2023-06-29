const Image = require('@11ty/eleventy-img');
const imageSize = require('image-size');
const lqip = require('../lqip');

const { parseHTML } = require('linkedom');

const { cpus } = require('node:os');

Image.concurrency = cpus().length;

const DISABLE_IMAGE_OPTIMIZATION =
  process.env.DISABLE_IMAGE_OPTIMIZATION === '1' ||
  process.env.DISABLE_IMAGE_OPTIMIZATION === 'true';

module.exports = async (src, alt, width, height) => {
  const { document } = parseHTML('');

  if (!width || !height) {
    const originalDimensions = imageSize.imageSize(src);

    width = originalDimensions.width;
    height = originalDimensions.height;
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

  const lowsrc = stats.png[stats.png.length - 1];

  const lqipURI = await lqip(lowsrc.outputPath);

  const picElem = document.createElement('picture');

  const sizes = '(min-width: 80ch) 80ch, 100vw';

  Object.values(stats).forEach((i) => {
    const srcElem = document.createElement('source');
    srcElem.setAttribute('type', i[0].sourceType);
    srcElem.setAttribute('srcset', i.map((entry) => entry.srcset).join(', '));
    srcElem.setAttribute('sizes', sizes);

    picElem.appendChild(srcElem);
  });

  const newImgElem = document.createElement('img');
  newImgElem.setAttribute('src', lowsrc.url);
  newImgElem.setAttribute('width', width);
  newImgElem.setAttribute('height', height);
  newImgElem.setAttribute('alt', alt);
  newImgElem.setAttribute('loading', 'lazy');
  newImgElem.setAttribute('decoding', 'async');
  newImgElem.setAttribute('sizes', sizes);
  newImgElem.setAttribute(
    'style',
    `content-visibility: auto; background-size: cover; background-image: url("${lqipURI}")`
  );

  picElem.appendChild(newImgElem);

  return picElem.toString();
};
