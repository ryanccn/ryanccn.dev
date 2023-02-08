import satori from 'satori';

import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { mkdir, readFile, rm } from 'node:fs/promises';

import { format } from 'date-fns';
import { bold, green, cyan, dim, red } from 'kleur/colors';
import pLimit from 'p-limit';
import sharp from 'sharp';

const timeA = performance.now();

const FONTS_DIR = join(fileURLToPath(new URL('.', import.meta.url)), 'fonts');
const FONTS = [
  {
    name: 'Inter',
    weight: 400,
    style: 'normal',
    data: await readFile(join(FONTS_DIR, 'Inter-Regular.otf')),
  },
  {
    name: 'Inter',
    weight: 400,
    style: 'italic',
    data: await readFile(join(FONTS_DIR, 'Inter-Italic.otf')),
  },
  {
    name: 'Inter',
    weight: 500,
    style: 'normal',
    data: await readFile(join(FONTS_DIR, 'Inter-Medium.otf')),
  },
  {
    name: 'Inter',
    weight: 500,
    style: 'italic',
    data: await readFile(join(FONTS_DIR, 'Inter-MediumItalic.otf')),
  },
  {
    name: 'Inter',
    weight: 600,
    style: 'normal',
    data: await readFile(join(FONTS_DIR, 'Inter-SemiBold.otf')),
  },
  {
    name: 'Inter',
    weight: 600,
    style: 'italic',
    data: await readFile(join(FONTS_DIR, 'Inter-SemiBoldItalic.otf')),
  },
  {
    name: 'Inter',
    weight: 700,
    style: 'normal',
    data: await readFile(join(FONTS_DIR, 'Inter-Bold.otf')),
  },
  {
    name: 'Inter',
    weight: 700,
    style: 'italic',
    data: await readFile(join(FONTS_DIR, 'Inter-BoldItalic.otf')),
  },
  {
    name: 'Satoshi',
    weight: 800,
    style: 'normal',
    data: await readFile(join(FONTS_DIR, 'Satoshi-Black.otf')),
  },
  {
    name: 'Satoshi',
    weight: 800,
    style: 'italic',
    data: await readFile(join(FONTS_DIR, 'Satoshi-Black.otf')),
  },
];

const makeImage = async (data) => {
  console.log(
    `[social] Writing ${dim('_site/previews/')}${cyan(data.slug)}${dim('.png')}`
  );

  try {
    const result = await satori(
      {
        type: 'div',
        props: {
          children: [
            {
              type: 'h1',
              props: {
                children: data.title,
                style: {
                  fontFamily: 'Satoshi',
                  fontWeight: 800,
                  fontSize: '80px',
                },
              },
            },
            {
              type: 'div',
              props: {
                style: { display: 'flex', flexDirection: 'column' },
                children: [
                  {
                    type: 'p',
                    props: {
                      children: [
                        {
                          type: 'span',
                          props: {
                            children: 'Ryan Cao',
                            style: { fontWeight: 700, marginRight: '0.625rem' },
                          },
                        },
                        {
                          type: 'span',
                          props: { children: '· ryanccn.dev' },
                        },
                      ],
                      style: {
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        fontSize: '30px',
                        display: 'flex',
                        alignItems: 'baseline',
                      },
                    },
                  },
                  ...(data.date
                    ? [
                        {
                          type: 'p',
                          props: {
                            children: format(new Date(data.date), 'yyyy/MM/dd'),
                            style: {
                              fontFamily: 'Inter',
                              fontWeight: 400,
                              color: '#a3a3a3',
                              fontSize: '30px',
                            },
                          },
                        },
                      ]
                    : []),
                ],
              },
            },
          ],
          style: {
            height: '100vh',
            width: '100vw',
            padding: '4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            background: '#111',
            color: '#fff',
          },
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: FONTS,
      }
    );

    await sharp(Buffer.from(result))
      .png()
      .toFile(`_site/previews/${data.slug}.png`);
  } catch (err) {
    console.error(red(`Error generating ${JSON.stringify(data)}`));
    throw err;
  }
};

const pagesData = await readFile('./pages.json').then(JSON.parse);
const lim = pLimit(10);

await rm('_site/previews', { force: true, recursive: true });
await mkdir('_site/previews');

await Promise.all(pagesData.map((data) => lim(() => makeImage(data))));

const timeB = performance.now();

console.log(bold(green(`[social] Done in ${(timeB - timeA).toFixed(2)}ms!`)));
