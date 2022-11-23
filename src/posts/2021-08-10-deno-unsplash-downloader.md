---
title: Building a Unsplash Downloader with Deno
tags:
  - tutorial
date: 2021-08-10
---

A few days ago, a friend asked me to help him download 25,000 images from [Unsplash](https://unsplash.com/) as 250x250 thumbnails in order to feed it into his machine learning model. This was an interesting task, and I decided to write it in Deno.

If you haven't heard of [Deno](https://deno.land/), it's a runtime for JavaScript, similar to Node, that has more features such as built-in TypeScript, ESM imports, a security sandbox, and many others. The ecosystem hasn't quite fully developed yet for more production uses, but it's quite nifty for writing little scripts like renaming files programmatically, etc.

So I set out to write this script.

```bash
$ mkdir unsplash-dl && cd $_
```

## Input

My friend provided me with a `data.json` that contained a list of all the Unsplash image IDs, like this:

```json
[
  "XMyPniM9LF0",
  "rDLBArZUl1c",
  "cNDGZ2sQ3Bo",
  "iuZ_D1eoq9k",
  "BeD3vjQ8SI0",
  "dO0KS_QGnzY",
  "ocwmWiNAWGs",
  "cGe1PV_yEso"
  // ...
]
```

So first of all in the script, we have to read the JSON file and parse it.

```ts
const imgList: string[] = JSON.parse(await Deno.readTextFile('./data.json'));
```

We define `imgList`'s type to be `string[]` explicitly for better type inferences, since by default `JSON.parse` returns an object with type `any`.

And now we have the list of image IDs.

## Download

First, we have to get the URL for the actual Unsplash image, resized to 250x250. Fortunately, Unsplash has a service [source.unsplash.com](https://source.unsplash.com/) which provides these image resizing features with a simple URL scheme: `https://source.unsplash.com/{id}/{width}x{height}`.

It would be better to put this functionality into a function by itself, so:

```ts
const download = async (img: string) => {
  const url = `https://source.unsplash.com/${img}/250x250`;

  // ...
};
```

Then, we have to actually _download_ the image.

> Note: These images were verified to be JPEG images, so we can save them as `.jpg` files directly.

This required the `writeAll` function, so add this to the top of the script:

```ts
import { writeAll } from 'https://deno.land/std@0.103.0/io/util.ts';
```

```ts
const download = async (img: string) => {
  const url = `https://source.unsplash.com/${img}/250x250`;
  const res = await fetch(url);

  if (!res.ok || !res.body) {
    const percentage = ((count / 25000) * 100).toFixed(2);
    console.log(
      `[${percentage}%] ${img} download error: ${res.status} ${res.statusText}`
    );

    count++;
    return;
  }

  const file = await Deno.open(`./downloads/${img}.jpg`, {
    create: true,
    write: true,
  });

  for await (const chunk of res.body) {
    await writeAll(file, chunk);
  }

  file.close();
};
```

We log the error if the response is empty or has a non-`2xx` status code and continue. If the response is okay, we split the `body` into chunks and write them to a file in the `./downloads/` directory.

Do note that you have to **create the `downloads/` directory** manually, or else it would throw an error.

For good measure, let's add a counter to see where we are in our progress.

```ts
// Add this before the `imgList` definition

let cnt = 0;
```

```ts
// Add this after `file.close();`

const percentage = ((count / 25000) * 100).toFixed(2);
console.log(`[${percentage}%] ${img} downloaded`);

count++;
```

We display a **percentage** with two places after the decimal to show our progress.

And that is our `download` function.

## Finding undownloaded files

There is always the possibility of Internet outages or accidental shutdowns or some other unfortunate accident which interrupts our script, so we have to be prepared to resume / pause the script at any time.

Fortunately, we can detect whether the downloaded file exists to see if any image has been downloaded. Deno has no built-in function to detect whether a file exists, but if you run `Deno.stat` on a nonexistent file it will throw an error, so we can implement our `exists` function like this:

```ts
const exists = async (imgId: string) => {
  try {
    await Deno.stat(`./downloads/${imgId}.jpg`);
  } catch {
    return false;
  }

  return true;
};
```

Then, we filter our `imgList` for only the ones that _actually need downloading_, so edit your original definition of `imgList` to add a filter. `Array.prototype.filter` doesn't support using async functions yet, however, our `exists` function is an async function, so we'll have to use this workaround:

```ts
const imgList: string[] = JSON.parse(await Deno.readTextFile('./data.json'));
let filteredImgList: string[] = [];

for (const img of imgList) {
  if (await exists(img)) {
    count++;
  } else {
    filteredImgList = [...filteredImgList, img];
  }
}
```

## Download the list with concurrency

We would like to download these images with concurrency, since that would be faster; however, we wouldn't want infinite concurrency like `Promise.all`'s default behavior, because that would make each request very very slow and thousands of simultaneous writes to the filesystem. Which does not bring optimal performance.

We can limit concurrency via the [`p-limit`](https://github.com/sindresorhus/p-limit) library. We import it at the top of our script, from [Skypack](https://skypack.dev):

```ts
import pLimit from 'https://cdn.skypack.dev/p-limit?dts';
```

`?dts` adds type information for Deno.

Then, add this after your definition of the `download` function:

```ts
const limit = pLimit(5);

await Promise.all(
  filteredImgList.map((i) => {
    return limit(() => download(i));
  })
);
```

The `limit` function takes in our async function and returns an async function that has concurrency limited to 5, which (from trial and error) seems to be most optimal for download speed.

## Run the script

If you've lost track of what we've written so far and where to put the code blocks, here's the [full script](https://gist.github.com/ryanccn/fd3b7e6898cf7aadb1c94b191401f721).

Now that our script's finished, let's run it in the terminal!

```
$ deno run -A mod.ts

[0.00%] XMyPniM9LF0 download successful
...
[99.97%] 0fh58lD8AuI download successful
[99.98%] 0s0WCiys0ZI download successful
[99.98%] 0SqUthjger8 download successful
[99.98%] 0HGKG23yMew download successful
[99.99%] 0FVQQhggj2o download successful
[99.99%] 0ex5ixoTnRw download successful
[100.00%] 0PHJAnuCDtA download successful
```

It works beautifully. 🥳🥳🥳

That's all for this post! I hope you had fun building this little Deno script 😊
