---
title: The Web Renaissance
date: 2021-08-05
---

Quite a few modern and interesting advancements have popped up in the last few months. [Astro](https://astro.build/) was publicly released, [Solid.js](https://www.solidjs.com/) reached version 1.0... These better and better technologies are significant of a trend, which I call **the Web Renaissance**. There are quite a few factors behind this renewed interest and usage of the web and websites.

## Feature Parity

Back in the 2000s, native apps were not as popular as they were, and web apps were seen as the future.

> Write amazing apps for the iPhone, using modern web standards. (Steve Jobs, 2007)

However, as time passed, SDKs were developed for advanced capabilities such as proximity detection, camera, animation, location, offline access, and a whole bunch of other features that web apps couldn't access with JavaScript APIs. This led to more and more native apps being developed, since many of these capabilities were quite essential to apps and user experience.

More recently, Web APIs for these different capabilities have emerged into the new web standards, and websites have become more powerful at achieving such goals. Here is the list of Web APIs, experimental and deprecated, on MDN:

{% respimg 'images/web-apis.png' 'List of Web APIs from MDN' %}

[https://developer.mozilla.org/en-US/docs/Web/API](https://developer.mozilla.org/en-US/docs/Web/API)

As you can probably see, currently the Web has a _lot_ of capabilities, and these technologies can be used to build truly amazing apps. For instance, [**Wormhole**](https://wormhole.app) is based upon WebTorrent, WebRTC, and the Web Crypto API to create a truly peer-to-peer and end-to-end-encrypted file sending experience. Similarly, [**Excalidraw**](https://excalidraw.com), a wonderful sketching and brainstorming app, [uses the File System Access API](https://blog.excalidraw.com/browser-fs-access/) to make the read / save experience more seamless rather than having to upload and download on every change; it uses WebSockets to implement peer-to-peer live collaboration; and it also uses the Web Crypto API to make the collaboration process end-to-end encrypted.

Another reason for the increased use of the web is the advent of PWAs, or **Progressive Web Apps**. This is a collection of technologies that are able to make web apps feel more native and more powerful. Benefits of PWAs include

- **Installability** - A web app could be installed to a home screen icon and have its own application rather than be in the browser frame.
- **Network independence** - Service workers can store requests offline, sending responses to the Cache API to be stored, and using IndexedDB or Web Storage to store application data, enabling users to use web apps without a connection to the Internet.
- **Notifications** - A PWA can use the Push API, the Notifications API, and the Background Sync API to enable background sync for web apps and ensure that the latest information gets to users.
- **Share targets** - A PWA can be used as a share target, meaning it would appear in the system Share menu as an app.
- And many, many more!

All of these features provide more feature parity with native apps, which makes using web apps more feasible as an option.

## Cross-platform app development

Building native apps _with_ web technologies and additional capabilities layered on top, accessible by JavaScript APIs is another use of the Web that is becoming more and more common. [Electron](https://www.electronjs.org/) is a leader in this space, allowing developers to use **web technologies** — HTML/JS/CSS — to develop native desktop apps that can be run on Windows, Mac, and Linux distros, with access to native system APIs facilitated via Electron's packages. [Capacitor](https://capacitorjs.com/) is a mobile equivalent built by Ionic, wrapping web apps into native iOS and Android apps, with Capacitor’s native plugin APIs providing the interface to native system APIs.

This allows web developers to use the technologies that we know and love into the realm of native app development, which **lowers the barrier of entry** and also helps web devs to create better apps instead of having to make do with unfamiliar technologies.

## Less gatekeepers

Anyone can buy a domain with $5 - $120, depending on what sort of domain you are buying, and you can easily get a server yourself or use one of the big services out there, such as Vercel or Netlify, to deploy your apps. All you need for development is a computer with sufficient specs. Again, as Steve Jobs said,

> The smallest company in the world can look as large as the largest company on the web.

In addition, there are no single, monopolistic distribution channels that you have to go through in order to make your apps usable and installable to users for web apps. In iOS and iPadOS, **Apple is the gatekeeper**, requiring app developers to sign up for their Apple Developer Program, which is $99/yr, and [takes 30% of app developers' revenue](https://ia.net/topics/monopolies-apple-and-epic). However, you have **no other option**, because how else are you going to distribute your apps? The App Store is the only method. And on Mac, if although code signing _does_ provide security benefits, developers who don't pay or don't want to pay have to put up with macOS preventing users from opening your app in one step.

> In the Microsoft world, certificates have to be obtained through external providers like Digicert, for instance, who will happily provide you with nothing more than the certificate at the wonderful cost of "just" 474 US$/year. (Gabriel Saillard, [original article](https://gaby.dev/posts/code-signing))

In contrast, in the web world, although SSL certificates costed a lot at first, **Let's Encrypt** and Certbot came around, providing free SSL certificates for any domain, making websites more secure around the world and lowering the barrier of entry for conscientious developers who want security for their users or just devs who don't want their websites to have the dreaded red broken lock icon.

In fact, on iOS, the Web is still being restricted from its full potential, because Apple **only allows WebKit** to be used in iOS browser apps, and so apps like Google Chrome or Brave are just UI improvements, while the core rendering engine **remains the same**. Many Web APIs do not have support in WebKit, and PWAs aren't even installable in desktop Safari. Although the Safari team may want to make the web a better place, it may be conflicting with the business interests of Apple, since the rise of the Web would mean the fall of native apps (and thus revenue from the App Store). This certainly needs to change.

## Conclusion

Interestingly, I'm writing this article in the Notion web app, which is obviously a web app; I'm going to paste it in Visual Studio Code, which was built using Electron; the source code gets pushed to GitHub, a website; Vercel, with a web frontend, builds my website on-demand; and it gets published to ryanccn.dev, which is this website.

Web apps are probably going to become **more and more prevalent** as it becomes more plausible to use them instead of native apps, because they are getting more capabilities, have less gatekeepers and provide more freedom, and have more opportunities to be used in platforms other than the Web Platform itself.

That's all for this article — hope you got some idea of the current state of the Web! 👋
