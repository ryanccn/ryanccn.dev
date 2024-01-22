---
title: "Performance Tales, Part 1: Why So Performant?"
tags:
  - web
  - update
  - performance
date: 2024-01-22
---

A few days ago, I came across a quite interesting blog post entitled [Weird Things Engineers Believe About Development](https://birtles.blog/2024/01/06/weird-things-engineers-believe-about-development/#my-blog-is-representative-of-web-development-at-large). One of the mentioned weird beliefs is "my blog is representative of Web development at large", which immediately struck me as highly relatable. I, too, spend way too much time tweaking this website, and the technologies I use on this website are nothing like the technologies I use for other projects.

For most of the apps or websites that I build, I use "modern" JavaScript frameworks like [Next.js](https://nextjs.org/) or [SvelteKit](https://kit.svelte.dev/). These frameworks are versatile, include modern interactivity with libraries like React or Svelte, have excellent developer experiences, provide both server and client functionality, and allow for seamless integration between the two ends. You might not have complete control over what your website ends up building to, but you get a Swiss Army knife that provides a whole toolchain that you can use to build your website or app.

For this website, however, I am currently using [Eleventy](https://www.11ty.dev/). Eleventy is a simple static site generator that does not include any asset bundling or interactivity or whatever by default, leading many to consider it to not be one of the "modern" frameworks. And admittedly, sometimes working with it can be a pain, since you have to do an enormous amount of work by yourself in order for certain things to work.

Why? There is one prominent reason, and it's quite simple.

**Performance.**

"Modern" frameworks like SvelteKit or Nuxt can probably make this website work in far less code and effort, and the maintenance burden would perhaps be less. But these frameworks don't provide the fine-grained control that I can have over my website with Eleventy, since with Eleventy, I control every part of the process. But this begs the question: _why_ do I place so much emphasis on the performance of this website?

First and foremost, I would like to admit that a small part of my incessant pursuit of performance on this website is due to the brownie points from a 4x100 Lighthouse score. However, as many observers have tirelessly and astutely pointed out, chasing Lighthouse scores is not a particularly worthwhile endeavor because they may not always represent the user experience accurately and a lot of the audits are out of date. That being said, Lighthouse scores are a pretty good baseline to aim for, even if you're not requiring yourself to reach 100s.

I aim for the best performance that there can possibly be while maintaining the functionalities that I want to have on this website, **because I can**. This website doesn't have much interactivity; it doesn't require whole frontend frameworks to facilitate said interactivity, and it doesn't have complex functionality. I find it a great challenge to be able to strike a balance between performance and functionality, and I do my best to obtain the best performance without sacrificing the features that I want most on this website.

**Higher performance improves user experience.** Network conditions and device capabilities can greatly vary, and if you're not building something for a very specific niche, it is better to optimize for page size and computational requirements so that users can have the best experience regardless of their situation. This site takes just around 5s to load on a slow 3G connection, while some other personal websites I've seen take almost 30s to load under similar network conditions, with little to no interactivity despite (relatively) huge JavaScript bundles! In addition, parsing and evaluating assets like JavaScript or CSS takes computing power, and excessive animations or resource-intensive processes such as rendering videos or applying lots of blur can make end user devices laggy or even nonresponsive.

This is, of course, not to say that you should go to great lengths to avoid interactivity or eschew styling altogether. As is the case with everything, this is a matter of balance, and for most content-oriented sites, care should be token so that there is no excessive interactivity or unnecessarily large bundles that don't contribute significantly towards the user experience.

**Performance is also an accessibility issue.** Privileged web developers might often be living in a bubble where they assume that everyone else has the same conditions as theirs. Large bundles? Network speeds have become so fast nowadays, there's no need to worry about loading them! Complex 3D animations? High-end devices have excellent graphic chips that can definitely handle the load! What many may fail to realize is that socioeconomic conditions and digital capabilities greatly vary. As MDN Web Docs writes in [The "why" of web performance](https://developer.mozilla.org/en-US/docs/Learn/Performance/why_web_performance):

> As an example, consider the loading experience of CNN.com, which at the time of this writing had over 400 HTTP requests with a file size of over 22.6MB.
>
> - Imagine loading this on a desktop computer connected to a fibre optic network. This would seem relatively fast, and the file size would be largely irrelevant.
> - Imagine loading that same site using tethered mobile data on a nine-year-old iPad while commuting home on public transportation. The same site will be slow to load, possibly verging on unusable depending on cell coverage. You might give up before it finishes loading.
> - Imagine loading that same site on a $35 Huawei device in a rural India with limited coverage or no coverage. The site will be very slow to load—if it loads at all—with blocking scripts possibly timing out, and adverse CPU impact causing browser crashes if it does load.

The great variation in the capabilities of the devices users are using to access the Internet and their device's connection speeds should be taken into account when developing a website, and optimizing performance _is_ a worthwhile endeavor towards ensuring that users from different backgrounds around the world can access your website easily.

**Small websites are environmentally cleaner.** Loading websites across the Internet consumes a lot of energy, whether it's from data centers, in transit, or on the users' devices. Optimizing websites for speed and performance can reduce the amount of data stored and transferred, as well as the power consumed by the user's device, leading to lower carbon emissions. Additionally, by optimizing the weight of pages and speeding up loading times, the carbon consumption linked to each navigation can be reduced, resulting in a lower overall environmental impact. And this goes for any website. Every byte reduced in traffic counts as a small part in improving our environment and mitigating climate change, one step at a time.

---

This is just the start of a series of blog posts in which I will explore the multitude of decisions I've made when optimizing the performance of this very website, covering a variety of facets such as web fonts, JavaScript bundling, and image loading. To keep up to date with the latest blog posts, you can subscribe to [the RSS feed](/feed/rss.xml) or follow me on the social media platforms listed in the navigational area!
