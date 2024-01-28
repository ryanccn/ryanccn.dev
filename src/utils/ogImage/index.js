import satori from 'satori';
import { renderAsync } from '@resvg/resvg-js';
import { format } from 'date-fns';

import pLimit from 'p-limit';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { cpus } from 'node:os';
import { blue, dim } from 'kleur/colors';

await mkdir('_site/og', { recursive: true });

const weights = [
  { name: 'Thin', italic: 'ThinItalic', weight: 100 },
  { name: 'ExtraLight', italic: 'ExtraLightItalic', weight: 200 },
  { name: 'Light', italic: 'LightItalic', weight: 300 },
  { name: 'Regular', italic: 'Italic', weight: 400 },
  { name: 'Medium', italic: 'MediumItalic', weight: 500 },
  { name: 'SemiBold', italic: 'SemiBoldItalic', weight: 600 },
  { name: 'Bold', italic: 'BoldItalic', weight: 700 },
  { name: 'ExtraBold', italic: 'ExtraBoldItalic', weight: 800 },
  { name: 'Black', italic: 'BlackItalic', weight: 900 },
];

const fonts = [];

for (const weight of weights) {
  const [roman, italic] = await Promise.all([
    readFile(`./src/utils/ogImage/fonts/Inter-${weight.name}-frozen.ttf`),
    readFile(`./src/utils/ogImage/fonts/Inter-${weight.italic}-frozen.ttf`),
  ]);

  fonts.push(
    {
      name: 'Inter Frozen',
      data: roman,
      weight: weight.weight,
      style: 'normal',
    },
    {
      name: 'Inter Frozen',
      data: italic,
      weight: weight.weight,
      style: 'italic',
    },
  );
}

/**
 * @param {{ title: string, date: string }} data data for generating the SVG
 * @returns {Promise<string>} the rendered SVG
 */
const svg = async ({ title, date }) =>
  await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',

          fontFamily: 'Inter Frozen',
          fontSize: '64px',
          backgroundColor: '#141414',
          color: '#f5f5f5',

          padding: '2.25em',
          width: '100vw',
          height: '100vh',
        },

        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '1em',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      textWrap: 'balance',
                      fontSize: '2em',
                      fontWeight: 800,
                      letterSpacing: '-0.025em',
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
              },
              children: date
                ? [
                    {
                      type: 'span',
                      props: {
                        style: {
                          color: '#a3a3a3',
                          fontSize: '1em',
                          fontWeight: 500,
                        },
                        children: format(date, 'yyyy-MM-dd'),
                      },
                    },
                  ]
                : [],
            },
          },
          {
            type: 'svg',
            props: {
              style: {
                position: 'absolute',
                bottom: 0,
                right: 0,
                margin: '2em',
                transform: 'scale(0.9)',
                transformOrigin: 'bottom right',
                color: '#a3a3a3',
              },

              width: '148',
              height: '166',
              viewBox: '0 0 74 83',

              children: [
                {
                  type: 'path',
                  props: {
                    d: 'M5.97779 18.4773C7.09209 15.168 9.32068 8.54941 7.64924 3.58546C5.72527 -2.12848 0.127717 9.37674 2.63489 10.2041C5.14206 11.0314 16.0065 10.2041 16.8422 11.0314C17.6779 11.8587 18.3372 16.7814 16.8422 23.4413C15.1708 30.8872 28.5423 44.9517 42.7497 9.37674C30.2138 24.2686 46.9283 50.5968 56.957 13.5134C51.9426 37.5058 58.6284 86.318 45.2568 80.5267C29.491 73.6985 48.5997 46.6064 54.4498 39.1605C60.2999 33.0934 71.1643 20.9593 72 17.65',
                    stroke: 'currentColor',
                    strokeWidth: '4',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      fonts,
      width: 1200 * 2,
      height: 630 * 2,
    },
  );

const pageData = JSON.parse(await readFile('pages.json'));

const lim = pLimit(cpus().length);

await Promise.all(
  pageData.map(({ title, slug, date }) =>
    lim(async () => {
      const renderedSvg = await svg({ title, date });
      const png = await renderAsync(renderedSvg).then((r) => r.asPng());

      await writeFile(`_site/og/${slug}.png`, png);

      console.log(
        `${blue('[og]')} Generated ${dim('_site/og/')}${slug}${dim('.png')}`,
      );
    }),
  ),
);
