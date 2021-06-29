const { promisify } = require('util');
const sharp = require('sharp');

const sizeOf = promisify(require('image-size'));

const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

const PIXEL_TARGET = 60;

const ESCAPE_TABLE = {
  '#': '%23',
  '%': '%25',
  ':': '%3A',
  '<': '%3C',
  '>': '%3E',
  '"': "'",
};

const ESCAPE_REGEX = new RegExp(Object.keys(ESCAPE_TABLE).join('|'), 'g');
function escaper(match) {
  return ESCAPE_TABLE[match];
}

async function getDataURI(src) {
  const info = await sizeOf(src);
  const imgDimension = getBitmapDimensions_(info.width, info.height);
  const buffer = await sharp(src)
    .rotate() // Manifest rotation from metadata
    .resize(imgDimension.width, imgDimension.height)
    .png()
    .toBuffer();

  const result = {
    src: parser.format('.png', buffer).content,
    width: info.width,
    height: info.height,
  };

  return result;
}

function getBitmapDimensions_(imgWidth, imgHeight) {
  // Aims for a bitmap of ~P pixels (w * h = ~P).
  // Gets the ratio of the width to the height. (r = w0 / h0 = w / h)
  const ratioWH = imgWidth / imgHeight;
  // Express the width in terms of height by multiply the ratio by the
  // height. (h * r = (w / h) * h)
  // Plug this representation of the width into the original equation.
  // (h * r * h = ~P).
  // Divide the bitmap size by the ratio to get the all expressions using
  // height on one side. (h * h = ~P / r)
  let bitmapHeight = PIXEL_TARGET / ratioWH;
  // Take the square root of the height instances to find the singular value
  // for the height. (h = sqrt(~P / r))
  bitmapHeight = Math.sqrt(bitmapHeight);
  // Divide the goal total pixel amount by the height to get the width.
  // (w = ~P / h).
  const bitmapWidth = PIXEL_TARGET / bitmapHeight;
  return { width: Math.round(bitmapWidth), height: Math.round(bitmapHeight) };
}

module.exports = async function (src) {
  // We wrap the blurred image in a SVG to avoid rasterizing the filter on each layout.
  const dataURI = await getDataURI(src);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 ${dataURI.width} ${dataURI.height}">
                  <filter id="b" color-interpolation-filters="sRGB">
                    <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
                    <feComponentTransfer>
                      <feFuncA type="discrete" tableValues="1 1"></feFuncA>
                    </feComponentTransfer>
                  </filter>
                  <image filter="url(#b)" preserveAspectRatio="none"
                    height="100%" width="100%"
                    xlink:href="${dataURI.src}">
                  </image>
                </svg>`;

  // Optimizes dataURI length by deleting line breaks, and
  // removing unnecessary spaces.
  svg = svg.replace(/\s+/g, ' ');
  svg = svg.replace(/> </g, '><');
  svg = svg.replace(ESCAPE_REGEX, escaper);

  const uri = `data:image/svg+xml;charset=utf-8,${svg}`;
  return uri;
};
