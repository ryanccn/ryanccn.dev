# ryanccn.dev

My personal website, made with [Eleventy](https://www.11ty.dev/) and [Tailwind CSS](https://tailwindcss.com/)!

## Features

1. **Optimized images**, with different formats, sizes, and low-quality image placeholders (LQIP)
2. **Social image generation** with [`@11tyrocks/eleventy-plugin-social-images`](https://npm.im/@11tyrocks/eleventy-plugin-social-images) for every page
3. **Build processes** for JavaScript and CSS right in Eleventy through `.11ty.js` templates
4. **Syntax highlighting** for blog posts in Markdown using [`@11ty/eleventy-plugin-syntaxhighlight`](https://npm.im/@11ty/eleventy-plugin-syntaxhighlight)

## Project

- `utils/`: node scripts & utilities related to the build process
- `_layouts/`: layouts
- `_data/`: global data stuff fed to Eleventy
- `content/`: the blog posts, written in Markdown
- `images/`: images for the blog posts
- `pages/`: the pages for Eleventy to generate from

## Get started

```bash
$ yarn        # install deps
$ yarn dev    # start development server
$ yarn build  # run production build
$ yarn clean  # clean up build artifacts and caches
```

## License(s)

- Code: **MIT**

  Feel free to copy my code, edit it, or republish it for your own benefit, but please don't rip off my entire site and custmoize some text and make it your own...

- Content: **CC-BY-SA-4.0**

  You could republish my articles or quote them, but this is subject to providing credit and license notice. (aka attribution)
