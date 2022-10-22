---
title: Redesign & Optimizations on v5!
date: 2022-10-22
---

Last week, this website was redesigned. It includes two new fonts (<span class="font-satoshi font-semibold">Satoshi</span> and Inter), a two-column sidebar layout, and various other small changes. In this post I'll go over all of these changes and how I got my Lighthouse scores to 100x4 even with this complicated setup.

## Design

The two-column layout was used in the second iteration of my website over a year ago, inspired by [@tmcw's website](https://macwright.com/). I've come back to this because I wanted to have a simplistic, accessible design without a fully formed navigation bar (which looks overpowered for a personal website).

## Fonts

To make headings stand out more, I decided to add the recently released <a class="font-satoshi font-semibold" href="https://www.fontshare.com/fonts/satoshi">Satoshi</a> for headings. I also added the [Inter](https://rsms.me/inter) font to ensure the body font looks as good as the macOS system font everywhere. This resulted in a much more unique and legible design.

Unfortunately, adding web fonts has tradeoffs. In an initial version which simply used `font-display: swap;`, the [Cumulative Layout Shift](https://web.dev/cls/) was unbearable.Then I tried using `<link rel="preload">`, which despite preventing a lot of layout shift, increased the blocking time so drastically it was quite unacceptable.

I did some reading and research and discovered [Zach Leatherman's guide on web font loading mechanisms](https://www.zachleat.com/web/comprehensive-webfonts/). I chose to adopt the [Critical FOFT with `preload` method](https://www.zachleat.com/web/comprehensive-webfonts/#critical-foft-preload) since it seemed the most future-proof and also worked with Cloudflare Pages's [Early Hints](https://developers.cloudflare.com/pages/platform/early-hints/). Using `fonttools`, I generated a subsetted font that only included Latin glyphs, since most of my website is English. This subsetted font is used in the stylesheet and preloaded. In a second stage, a piece of JavaScript waits for the page load to finish and replaces the subsetted font with the full font (including italic variants) using the [Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API). This reduces the CLS by a lot (depending on whether the fonts or the stylesheet loads faster) and ensures a blazing fast loading speed.

![Waterfall diagram in DevTools Network tab](images/redesign-v5/waterfall.png)

## Icons

For icons in the website, I adopted [Lucide](https://lucide.dev/), an open source continuation of Feather Icons. Branding icons use [Simple Icons](https://simpleicons.org/).

Using [Eleventy shortcodes](https://www.11ty.dev/docs/shortcodes/), I was able to make the SVG source depend on the Node packages of the respective icon libraries. Sprinkling in a bit of magic from [linkedom](https://www.npmjs.com/package/linkedom), custom classes could also be added to the SVG directly as a shortcode argument.

## JavaScript

The underlying JavaScript powering this website has been fundamentally reconstructed. Most of the deferred load JavaScript was removed, and the LQIP removing event listener was moved directly into the `<head>` in order to prevent race conditions where the image would load faster than the script.

The reads API serverless function was removed, instead rendering the reads statically on each build. In the future, there will be more data, and rebuilding the site once a day will be more worth it. At the moment, post reads are fetched from [Plausible](https://plausible.io/) and rendered once a day.

The underlying build system remains [esbuild](https://esbuild.github.io/). It has a highly configurable Node API and is incredibly fast. Fast to the point where I can not set up caching and build once for each page and it still builds fast!

In the future, for more interactive components, I plan on gradually moving to [is-land](https://github.com/11ty/is-land), since that seems to be a good way to implement islands architecture with Eleventy.

## Cloudflare Pages / Porkbun

Domain prices on [Vercel](https://vercel.com/) are way inflated. My `ryanccn.dev` domain costed me $20/year on Vercel, while at [Porkbun](https://porkbun.com/) it only costs around $10. In addition, [Cloudflare Pages](https://pages.cloudflare.com/) has more PoPs around the world and supports more modern protocols such as HTTP/3 and Early Hints. The Cloudflare Workers / Cloudflare Pages Functions platform is also pretty great and fast despite its limited capabilities compared to a Node-based serverless function. [TTFB](https://web.dev/ttfb) on Cloudflare was consistently lower than Netlify or Vercel, which would sometimes cause Lighthouse to warn me to "decrease server response times" of 2s or more.

I've switched my domain from a fully Vercel-controlled setup to a Porkbun / Cloudflare / Cloudflare Pages setup for now, and it works pretty well!

## SvelteKit (almost)

The initial impetus of this redesign initially **wasn't just a redesign**. I had spent the past month rewriting my website in [SvelteKit](https://kit.svelte.dev/), backed by [MongoDB](https://mongodb.com/) and [Prisma](https://prisma.io/), complete with an integrated CMS and various little interactive features such as likes and comments.

As the rewrite was nearing completion and I began deploying it on a subdomain, I realized that the performance of this new site was suboptimal. SvelteKit did not support Incremental Static Generation at the time of writing; transforming the Markdown into HTML caused quite noticeable TTFB. Adopting such a framework also meant that I lost control over a very large part of the website which I could've done better on my own.

SvelteKit does include quite a few built-in optimizations that are leaps and bounds ahead of other frameworks: it automatically inlines critical CSS, includes `<link rel="preload">`s in [the `Link` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link) (therefore preloading the assets even before the document has fully loaded), and many other things.

[Svelte](https://svelte.dev/) also does many unique and interesting things. It doesn't rely on a virtual DOM and updates the DOM surgically and efficiently. The syntax is simple and straightforward, a result of Svelte having its own compiler. It includes its own shared store ([`svelte/store`](https://svelte.dev/tutorial/writable-stores)), which is quite refreshing in DX.

That said, in the end I decided that it was definitely overkill for a simple personal site and didn't have the flexibility to allow me to mess with _everything_ about the website. I prefer fine-grained control over a small, blazing fast website like this one.
