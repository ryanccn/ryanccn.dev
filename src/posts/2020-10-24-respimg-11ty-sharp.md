---
title: Responsive Images with Eleventy & Sharp
tags:
  - web
  - eleventy
  - performance
  - javascript
date: 2020-10-24
---

**Responsive** and **multi-format** images have become incredibly important for (especially mobile) performance of content-based websites. In this article, we'll explore how to add responsive images to an **[Eleventy](https://www.11ty.dev/)** site using **[Sharp](https://sharp.pixelplumbing.com/)** as then image-processing library.

> This method resulted from the development of responsive images on my own site: ryanccn.dev. Check it out!

## Prerequisites

1. Necessary NPM packages: `sharp` and `jsdom`.
2. Images in a `src/images` directory
3. Images used are in the basic format of `<img src="/images/something.png">`

> Yes, PNG, but you can always use JPG by replacing all occurrences of PNG

## Sharp

**Sharp** is a high performance Node.js image processing library. It can be used to extract metadata from images, converting images to other formats, resizing images, etc. In this article we'll be using these three features.

Create a little Node.js script at `scripts/sharp.js`, and add this file into your build pipeline by either exporting everything as a function or just running this file within an NPM script.

This will resize all the images to a percentage of the original width that you can define in a config object, and also convert the images to a different format such as **WebP**. :+1:

> I like to paste the code all in one go and put comments for analysis and explanations (for now).

```jsx
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const sharp = require('sharp');

// Define all of the resizes that will be done to these images.
// `src` is the source of these files, a glob pattern
// `dist` is the folder to which the output builds
// `percent` is the percentage that the width will be multiplied by

const resizes = [
  {
    src: './src/images/*.png',
    dist: './src/images/80',
    percent: 80,
  },
  {
    src: './src/images/*.png',
    dist: './src/images/60',
    percent: 60,
  },
  {
    src: './src/images/*.png',
    dist: './src/images/40',
    percent: 40,
  },
  {
    src: './src/images/*.png',
    dist: './src/images/20',
    percent: 20,
  },
];

// The formats to convert to, here this is converting all of these PNG files to the famed WebP format.

const formats = [
  {
    src: './src/images/*.png',
    dist: './src/images/webp',
    format: 'webp',
  },
];

// Runnn the resizes!

resizes.forEach((resize) => {
  // Create the `dist` folder if it doesn't exist already

  if (!fs.existsSync(resize.dist)) {
    fs.mkdirSync(resize.dist, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }

  // Get all of the files that match the glob pattern in `src`

  let files = glob.sync(resize.src);

  files.forEach((file) => {
    // Get the filename, will be used later
    let filename = path.basename(file);

    // Construct the Sharp object
    const image = sharp(file);

    // Retrieve the metadata via Sharp
    image
      .metadata()
      .then((metadata) => {
        // Resize the image to a width specified by the `percent` value and output as PNG
        return image
          .resize(Math.round(metadata.width * (resize.percent / 100)))
          .png()
          .toFile(`${resize.dist}/${filename}`)
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

// Runnn the format converts

formats.forEach((format) => {
  // Create the `dist` folder if it doesn't exist already

  if (!fs.existsSync(format.dist)) {
    fs.mkdirSync(format.dist, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }

  // Find all files matching the glob patterns specified in `src`
  let files = glob.sync(format.src);

  files.forEach((file) => {
    let filename = path.basename(file);
    const image = sharp(file);
    // Convert to WebP via Sharp's inferencing automatically of extensions
    image
      .toFile(`${format.dist}/${filename.replace('png', format.format)}`)
      .catch((err) => {
        console.log(err);
      });
  });
});
```

Now you have the `resizes` and `formats` config objects that can be edited easily to suit your own needs! Simply running this file will produce the converted / resized images in the specified `dist` directories.

**Don't forget to add these to your `.gitignore`!**

## Eleventy

Eleventy has a very cool feature called **transforms** that can run transforms on any file built out by Eleventy, giving you the output path of the file `outputPath` and the actual content of the built file `content`. What you return will be the new content of that file. :exploding_head: [Read about it on the docs](https://www.11ty.dev/docs/config/#transforms)

Here we'll be using the wonderful library **JSDOM** in order to manipulate the content of the HTML document with a familiar API.

(FYI feed a string of HTML into JSDOM and it will give you common browser APIs such as `querySelector` :smiley:)

You might be thinking now, _why can't we just use shortcodes or custom components_?

The thing is, it will be a better authoring experience in Markdown, since you can use the in-built `![]()` syntax, and the DX in HTML will also be easier since you have semantic HTML before and after the build. :+1:

```jsx
// Add the Eleventy transform via `eleventyConfig`

eleventyConfig.addTransform('responsiveimg', async (content, outputPath) => {
  // Only apply transforms if the output is HTML (not XML or CSS or something)
  if (outputPath.endsWith('.html')) {
    // Feed the content into JSDOM
    const dom = new JSDOM(content);
    const document = dom.window.document;

    // Find the image elements via `querySelectorAll`, replace this selector with your own custom one
    const imageElems = document.querySelectorAll('main article img');

    // If there are no matching elements, just return the original content :)

    if (imageElems.length === 0) {
      return content;
    }

    for (const imgElem of imageElems) {
      // Get the `src` of the image element
      const imgSrc = imgElem.getAttribute('src');

      // Only add this transform for internal images
      if (imgSrc.startsWith('/images/')) {
        let srcSet = [];

        // Replace all of the image sources with a new one that matches the results of the Sharp build

        const imgSrc80 = imgSrc.replace('/images/', '/images/80/');
        const imgSrc60 = imgSrc.replace('/images/', '/images/60/');
        const imgSrc40 = imgSrc.replace('/images/', '/images/40/');
        const imgSrc20 = imgSrc.replace('/images/', '/images/20/');

        // Get the metadata for the file and add it as the `${width}w` needed in defining a `srcset` in HTML for `<img>`

        const img80 = await sharp('./src' + imgSrc80);
        const md80 = await img80.metadata();
        srcSet.push(`${imgSrc80} ${md80.width}w`);

        // Repeat

        const img60 = await sharp('./src' + imgSrc60);
        const md60 = await img60.metadata();
        srcSet.push(`${imgSrc60} ${md60.width}w`);

        // Repeat

        const img40 = await sharp('./src' + imgSrc40);
        const md40 = await img40.metadata();
        srcSet.push(`${imgSrc40} ${md40.width}w`);

        // Repeat

        const img20 = await sharp('./src' + imgSrc20);
        const md20 = await img20.metadata();
        srcSet.push(`${imgSrc20} ${md20.width}w`);

        // Join the `srcset` into a string. that can be added to the `<img>` tag

        srcSet = srcSet.join(', ');

        // Set the `srcset` attribute

        imgElem.setAttribute('srcset', srcSet);

        // Find the new `src` for the WebP image

        const webpSrc = imgSrc
          .replace('/images/', '/images/webp/')
          .replace('.png', '.webp');

        // Create a separate `source` element for the WebP with feature detection via `type`

        const webpElement = document.createElement('source');
        webpElement.setAttribute('srcset', webpSrc);
        webpElement.setAttribute('type', 'image/webp');

        // Wrap the `<img>` and the `<source>` into one `<picture>` tag in order for it to work

        const pictureElement = document.createElement('picture');
        pictureElement.appendChild(webpElement);
        pictureElement.appendChild(imgElem.cloneNode());

        // Replace the `<img>` with the `<picture>`

        imgElem.replaceWith(pictureElement);
      }
    }

    return '<!doctype html>' + document.documentElement.outerHTML;
  }

  return content;
});
```

## Result

So when you have an original Markdown image defined as

```markdown
![SWR Cover](/images/swr-cover.png)
```

You will have the result in the HTML as

```html
<picture>
  <source srcset="/images/webp/swr-cover.webp" type="image/webp" />
  <img
    src="/images/swr-cover.png"
    alt="SWR Cover"
    srcset="
      /images/90/swr-cover.png 1843w,
      /images/80/swr-cover.png 1638w,
      /images/70/swr-cover.png 1434w,
      /images/60/swr-cover.png 1229w,
      /images/50/swr-cover.png 1024w,
      /images/40/swr-cover.png  819w,
      /images/30/swr-cover.png  614w,
      /images/20/swr-cover.png  410w,
      /images/10/swr-cover.png  205w
    "
  />
</picture>
```

Wonderful!

## Credits

Some blog posts really helped me with this whole development process:

1. **[Responsive Images 101](https://cloudfour.com/thinks/responsive-images-101-definitions/)** by **Jason Grigsby** at Cloud Four (I learned all of the responsive images spec from this series, and understood why I shouldn't be using `media` attributes on the `source`s :wink:)
2. **[Blazing fast image transforms with Sharp and Gulp](https://www.webstoemp.com/blog/blazing-fast-image-transforms-with-sharp-gulp/)** by **Jérôme Coupé** (I derived the little Node.js script above from the script that Jérôme wrote in that post :smile:)
