const Image = require('@11ty/eleventy-img');
const lqip = require('./lqip');
const imageSize = require('image-size');

const { parseHTML } = require('linkedom');

module.exports = async (content, outputPath) => {
  if (outputPath.endsWith('.html')) {
    const { document } = parseHTML(content);

    /* Image optimization */

    const imgElems = [...document.querySelectorAll('img')].filter(
      (i) => i.getAttribute('data-image-no-process') !== '1'
    );

    for (const imgElem of imgElems) {
      const originalSrc = imgElem.getAttribute('src');

      const { width: originalWidth, height: originalHeight } =
        imageSize.imageSize(`./${originalSrc}`);

      const stats = await Image(`./${originalSrc}`, {
        widths: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, originalWidth]
          .filter((a) => a <= originalWidth)
          .sort((a, b) => a - b),
        formats: ['avif', 'webp', 'jpeg'],
        outputDir: './_site/images',
        urlPath: '/images/',
      });

      const lowsrc = stats.jpeg[stats.jpeg.length - 1];

      const lqipURI = await lqip(lowsrc.outputPath);

      const picElem = document.createElement('picture');

      Object.values(stats).forEach((i) => {
        const srcElem = document.createElement('source');
        srcElem.setAttribute('type', i[0].sourceType);
        srcElem.setAttribute(
          'srcset',
          i.map((entry) => entry.srcset).join(', ')
        );
        srcElem.setAttribute('sizes', '100vw');

        picElem.appendChild(srcElem);
      });

      const newImgElem = document.createElement('img');
      newImgElem.setAttribute('src', lowsrc.url);
      newImgElem.setAttribute(
        'width',
        imgElem.getAttribute('width') ?? originalWidth
      );
      newImgElem.setAttribute(
        'height',
        imgElem.getAttribute('height') ?? originalHeight
      );
      newImgElem.setAttribute('alt', imgElem.getAttribute('alt'));
      newImgElem.setAttribute('loading', 'lazy');
      newImgElem.setAttribute('decoding', 'async');
      newImgElem.setAttribute('sizes', '100vw');
      newImgElem.setAttribute(
        'style',
        `content-visibility: auto; background-size: cover; background-image: url("${lqipURI}")`
      );

      picElem.appendChild(newImgElem);

      imgElem.replaceWith(picElem);
    }

    /* External link security */

    const linkElems = [...document.querySelectorAll('a')].filter((e) => {
      if (
        !e.getAttribute('href').startsWith('https://') &&
        !e.getAttribute('href').startsWith('http://')
      ) {
        return false;
      }

      const href = new URL(e.getAttribute('href'));

      return (
        href.hostname !== 'ryanccn.dev' && href.hostname !== 'localhost:8080'
      );
    });

    for (const elem of linkElems) {
      elem.setAttribute('target', '_blank');
      elem.setAttribute('rel', 'noopener noreferrer');
    }

    return document.toString();
  } else {
    return content;
  }
};
