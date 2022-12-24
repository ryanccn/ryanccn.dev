---
title: Why I use Eleventy
tags:
  - opinion
date: 2022-11-04
---

Web development today is a flurry of excitements. New frameworks, new RFCs, new major releases occur almost continuously, each one often hyped as the "next big thing" or some silver bullet for web developers.

I've personally considered many of these frameworks as potential candidates for use on my own website. As I wrote in the [Redesign v5](<https://ryanccn.dev/posts/redesign-v5/#sveltekit-(almost)>) article, I nearly switched to [SvelteKit](https://kit.svelte.dev/) with server side rendering and a database to back it up. I had also considered using [Astro](https://astro.build/) or [Lume](https://lume.land/), two very cool static site generators of the non-client-side-JS type, for a potential rewrite of my website.

In the end, I decided to stick with Eleventy. As you see it today. Here are a few reasons why Eleventy remains my framework of choice for this website.

## Flexibility

One of the most amazing things about Eleventy is that it leaves a lot of things up to the developer to do. Although that could be annoying sometimes, for beginners, perhaps, but if you are a full stack web developer who knows what you're doing, Eleventy can do wonders for you.

For instance, recently I [added static tweet embeds](https://github.com/ryanccn/ryanccn.dev/commit/e62b474c7895b0f71d857b608e0b94b2570d3217) to this website using an [Eleventy shortcode](https://www.11ty.dev/docs/shortcodes/). Eleventy shortcodes simply handle the templating for you, and you are free to do whatever Node.js stuff you want in the shortcode. This particular shortcode calls the Twitter API to fetch tweets and renders them out in static HTML. It includes image optimization with [`eleventy-img`](https://www.11ty.dev/docs/plugins/image/) for avatars (_there's no support for media yet_) and a fully homemade tweet embed layout using [Tailwind CSS](https://tailwindcss.com/), which I already use on my website.

{% tweet '1539851566999805952' %}

The filesystem routing and ability to break out of it is a breath of fresh air. With `permalink`, you can disregard the file/folder structure and do what you want with routes and things rather than having to use hacky ways to work around the framework that is supposed to be helping you develop and iterate faster.

For instance, in my website's build process, I [build a `pages.json` manifest](https://github.com/ryanccn/ryanccn.dev/blob/main/src/generated/pages.json.11ty.js) that my open graph image generator reads to generate these images with [Satori](https://github.com/vercel/satori). Using

```javascript
permalinkBypassOutputDir: true,
eleventyExcludeFromCollections: true,
```

I was able to bypass the set output directory and build the file outside of it, while retaining access to Eleventy supplied data (such as the collections) needed to create the JSON file.

This flexibility is in a way provided by `11ty.js` files, which I also happen to use for building assets. Instead of using complicated npm script setups or bringing in yet another framework like [Vite](https://vitejs.dev/) running in parallel, assets on my website are built directly in Eleventy via Node.js APIs for each of the build tools that I use. For CSS, the PostCSS API is used to build the file, get the string, and write it into `_site/`. For JavaScript, [esbuild](https://esbuild,github.io/)'s Node API is similarly used. The thing worth noting here is all of this is _encapsulated in_ the Eleventy build process - there's no other command running or anything.

Font optimizations are also an essential part of my website. With <span class="font-medium font-display">web fonts</span>, the design system of my website becomes much more legible and unique. However, without the proper optimizations, there will inevitably be [CLS](https://web.dev/cls) and a plethora of other issues.

With Eleventy, I have full control of every single part of the markup and assets, so I have the freedom to do whatever I want: add `<link rel="preload">`s, inline JavaScript into the `<head>`... With various other frameworks, this would not have been possible. You make do with whatever the framework gives you.

I also have a `{% raw %}{{ gitRev }}{% endraw %}` global data file on my website that simply contains the Git revision hash for the commit. It's implemented with [a very simple global data file](https://github.com/ryanccn/ryanccn.dev/blob/main/src/_data/gitRev.js) which runs a subprocess (just once for each build) using `execa`. It's used for asset revving, where I append it as a query string to the end of asset URLs to make assets update on each push, refreshing the Cloudflare CDN and local web browser disk cache.

## No assumptions

Eleventy doesn't try to make assumptions about what you are trying to do. It doesn't drop a heavy client-side JavaScript framework on you from the moment you start building your website; it doesn't assume you need internationalization or anything. It simply does what you tell it to do.

With plugins, you can extend the behavior of Eleventy however you like. It provides an incredibly large API surface for you to hook into various parts of the build process. For example, [transforms](https://www.11ty.dev/docs/config/#transforms) allow you to run any Node.js function on Eleventy-built files, with the output path given to you so that you have some idea what the file is doing in the project.

A wide selection of [template languages](https://www.11ty.dev/docs/languages/) and [plugins](https://www.11ty.dev/docs/plugins/) gives you full control and customization over what your build process is doing and what it's spitting out. If you fetch data during your build process, it's probably a good idea to use [Eleventy Fetch](https://www.11ty.dev/docs/plugins/fetch/) to cache your data somewhere so that repetitive builds don't take forever; if you want optimized images, [`eleventy-img`](https://www.11ty.dev/docs/plugins/image/) can speed up the job of resizing each image into various formats by a lot; if you want to implement islands architecture components into your website to give it interactivity (which is what I am _planning_ on doing), [`<is-land>`](https://www.11ty.dev/docs/plugins/partial-hydration/) could be your best bet! These plugins aren't installed by default, but if you want them, they're always there. If there's nothing available, you could always just roll your own.

This "no assumptions" philosophy is also evident in these individual plugins, both official and community ones. `eleventy-img` has a built-in function to generate markup; but it doesn't _force_ you to use it. In the end, it's you writing your own shortcode and it depends on _you_, the developer, whether you want to use this pre-generated markup or write your own. On this website, I use `linkedom` to generate the markup using DOM APIs, and it works fine!

## Community

Eleventy has a large, friendly, and enthusiastic community that is constantly spitting out new ideas, tips & tricks, plugins, and open source websites. And the Eleventy team is very welcoming towards these community projects: [@eleven_ty](https://twitter.com/eleven_ty) Retweets a ton of them every day. Compare this to [@nextjs](https://twitter.com/nextjs) and you see the difference immediately.

The fact that Eleventy is so simplistic in its design makes it perhaps seem unwelcoming for newcomers. In addition, it doesn't do as much advertising and promotional content as, for instance, Next.js does. This makes the community small, friendly, and progressive, becoming better and better every day.

When you see all these Eleventy sites with incredible performance, it's ultimately because Eleventy doesn't assume things about what you want to build and gives you the flexibility to do whatever you want with the build process so that you _can_ optimize it to the best of your ability if you want to. You are not in a constant battle with the framework - the framework is helping you get things done.
