# ryanccn.dev

My personal website, made with [Eleventy](https://www.11ty.dev/) and [Tailwind CSS](https://tailwindcss.com/)!

## Features

- **Optimized images**, with different formats, sizes, and low-quality image placeholders (LQIP)
- **Social image generation** with [satori](https://github.com/vercel/satori) for every page
- **Build processes** for JavaScript and CSS right in Eleventy through `.11ty.js` templates
- **Syntax highlighting** for blog posts in Markdown using [`@11ty/eleventy-plugin-syntaxhighlight`](https://npm.im/@11ty/eleventy-plugin-syntaxhighlight)
- **Webmentions** support and bridges to social media platforms such as Twitter and Mastodon
- **RSS & Atom feeds** for subscription and syndication
- **Dynamic icon** that syncs with the [PluralKit](https://pluralkit.me/) API
- **GitHub contributions listing** using the GitHub GraphQL API

## Project

- `src/_layouts/`: layouts
- `src/_data/`: global data stuff fed to Eleventy
- `src/utils/`: node scripts & utilities related to the build process
- `src/posts/*.md`: the blog posts, written in Markdown
- `images/`: images for the blog posts

## Get started

```bash
$ pnpm install  # install dependencies
$ pnpm dev      # start development server
$ pnpm build    # run production build
$ pnpm clean    # clean up build artifacts and caches
```

## License(s)

- Code: **MIT** ([`LICENSE`](LICENSE))
- Content & Images: **CC-BY-SA-4.0** ([`LICENSE-content`](LICENSE-content))
