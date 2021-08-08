---
title: Vercel as a Framework
date: 2020-07-06
---

Vercel is a cloud platform for **static sites** and **Serverless Functions** that fits perfectly with your workflow. It enables developers to host **Jamstack** websites and web services that deploy instantly, scale automatically, and requires no supervision, all with no configuration.

But how do you actually use Vercel as a **framework**? Can a deployment platform also be used as a framework? Turns out, it can. On Full Stack Radio, [Guillermo Rauch said that](https://www.fullstackradio.com/112) yes indeed, Vercel can be used as a framework when you define a `vercel.json` (at that time it was `now.json`), with routes, redirects, rewrites, builds... It all functions like a framework when you're not building a Gatsby / Next / Nuxt site to a static path and then deploying that static path!

## Development

It's fairly easy to use Vercel as a framework. First, you have to [sign up](https://vercel.com/signup/) for Vercel and then create a directory on your own computer. Then, if you want to test and develop a Vercel-as-a-framework app locally, you can use the `vercel dev` command to run the app locally. It all works exactly as when you deploy it to the cloud on Vercel. When you want to deploy it to a shareable URL, use the `vercel` command to deploy it or you can use Vercel's [git integrations](https://vercel.com/docs/v2/git-integrations) to push to GitHub / Bitbucket / GitLab and let Vercel deploy automatically on push. Now... Let's get started!

## Routes

Vercel uses Routes to define the behavior of how a request is handled by the routing layer. For example, you might use a Route to proxy a URL to another, redirect a client, or apply a header with the response to a request.

By default, routing is defined by the filesystem of your deployment. For example, if a user makes a request to `/123.png`, and your `vercel.json` file does not contain any routes with a valid `src` matching that path, it will fallback to the filesystem and serve `/123.png` if it exists.

A Route can be defined within a project's `vercel.json` configuration file as an object within an array assigned to the routes property, like the following which creates a simple proxy from one path to another:

```json
{
  "routes": [{ "src": "/about", "dest": "/about.html" }]
}
```

Vercel Routes have multiple properties for each route object that help define the behavior of a response to each request to a particular path.

### **src**

**Type**: String supporting [PCRE Regex](https://www.pcre.org/original/doc/html/pcrepattern.html) and Route Parameters like `/product/(?<id>[^/]+)`.

For each route, `src` is required to set the path which the behavior will affect.

The following example shows a `vercel.json` configuration that takes a `src` path and proxies it to a destination`dest`path.

```json
// An example `vercel.json` file with a `routes` property that proxies one path to another upon request.

{
  "routes": [{ "src": "/about", "dest": "/about.html" }]
}
```

### **dest**

**Type**: String

`dest` is used to proxy the `src` path to another path, such as another URL or Vercel hosted Serverless Function.

The example for the`src`property shows how both methods work together to create a proxy.

```json
// An example vercel.json file with routes properties that proxy paths to another upon request.

{
  "routes": [
    { "src": "/about", "dest": "https://about.me" },
    { "src": "/action", "dest": "my-serverless-function-action/index" }
  ]
}
```

**NOTE:** You can point the `dest` path to any URL, Vercel hosted Serverless Function, or even non Vercel hosted URLs as shown in the code above. If you don't perform any proxying, you can safely remove `dest`.

```json
// This will route to `/about` without proxying, but routes like this are usually redundant with handle filesystem.

{
  "routes": [{ "src": "/about" }]
}
```

### **headers**

**Type**: Object

The `headers` property is an object supporting [HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) as the keys, with the intended value as the key's value.

An example of using the `headers` property to add [shared caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#Expiration) headers to all files in an `images` directory:

```json
// Setting `cache-control` headers for all paths under an `images` directory with routes.

{
  "routes": [
    {
      "src": "/images/(.*)",
      "headers": { "cache-control": "s-maxage=604800" },
      "dest": "/images/$1"
    }
  ]
}
```

**NOTE:** You can also add custom headers to your `routes`, these are defined in the same way.

### **continue**

**Type**: Boolean

The `continue` property allows routing to continue even though the `src` was matched.

For example, you can use this property in combination with the`headers`property to append headers to a broader group of routes instead of applying it to every route.

```json
// In this case, the `Cache-Control` header will be applied to any route starting with `/blog`.

{
  "routes": [
    {
      "src": "/blog.*",
      "headers": { "Cache-Control": "max-age=3600" },
      "continue": true
    },
    {
      "src": "/blog/([^/]+)",
      "dest": "/blog?slug=$1"
    }
  ]
}
```

### **status**

**Type**: Integer

The `status` property defines the status code that Vercel should respond with when a path is requested.

For example, you can use this property in combination with the`headers`property to create a redirect with the initial status code of 308 (Moved Permanently).

```json
// Redirecting one path to another using the status property to provide a [HTTP status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

{
  "routes": [
    {
      "src": "/about.html",
      "status": 308,
      "headers": { "Location": "/about-us.html" }
    }
  ]
}
```

**NOTE:** In a redirect case as shown above, the `Location` property can also point to non-Vercel hosted URLs.

### **methods**

**Type**: Array

The `methods` property can be used to define what [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) a particular path accepts.

The value of this property can be any [HTTP request method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods), with the default being that the path can accept any method.

As an example, you can use this property when you have an API endpoint and only want to allow `GET` or `POST` request methods:

```json
// Accepting only POST and GET HTTP request methods on an API endpoint.

{
  "routes": [
    {
      "src": "/api/user.js",
      "methods": ["POST", "GET"],
      "dest": "/api/user.js"
    }
  ]
}
```

## Serverless Functions

Now when you look at the last example _(Accepting only...)_ you might be wondering, how do you just put a file in the `api/` directory and then you get it as a dynamic serverless function?

Well, with Vercel, you can deploy Serverless Functions, which are pieces of code written with backend languages that take an HTTP request and provide a response. Currently Vercel supports **Node.js, Python, Go, and Ruby** in-built.

You can use Serverless Functions to handle user authentication, form submission, database queries, custom slack commands, and more.

There is a very key concept in Vercel's Serverless Functions that you have to understand: **builders.** Builders are what builds your scripts in the `api/` directory or some other file that you wish to build. Vercel provides some builders that are already available for you to use, such as [@vercel/go](https://npm.im/@vercel/go), [@vercel/node](https://npm.im/@vercel/node), [@vercel/python](https://npm.im/@vercel/python). Developers can also create their own custom builders (Community Runtimes). For instance, [now-deno](https://npm.im/now-deno) allows you to deploy **Deno** as a serverless function on Vercel.

To give you an example of what serverless functions look like in Vercel:

```jsx
// Returns "Hello [name]!" or "Hello World!" if no name is provided in the query.

module.exports = (req, res) => {
  const { name = 'World' } = req.query;
  res.status(200).send(`Hello ${name}!`);
};
```

Go to [https://node-api.now-examples.now.sh/api/hello?name=reader](https://node-api.now-examples.now.sh/api/hello?name=reader) to check it out! (With your name being "reader.".. 😅)

By default, you can put files with extensions matching supported languages and exported functions in the `/api` directory at your project's root. This will automatically turn them into serverless functions that you can call in your JavaScript.

**NOTE:** If you are using Next.js, use the /pages/api directory instead. [Read more about API functionality with Next.js.](https://nextjs.org/docs/api-routes/introduction)

## Path segments

Deploying Serverless Functions with Vercel gives you the ability to use **path segments** through file names instead of a complex routes file.

Creating a file using any of the [supported languages](https://vercel.com/docs/v2/serverless-functions/supported-languages) in the `/api` directory and wrapping the filename in square brackets, such as `[name].js` will provide you with a file that takes a path segment and gives it to the function when requested with a value! Filesystem routing like this is also provided in Vercel's React framework, Next.js. 🙂

**NOTE:** When using path segments, the value passed is made available to the `req.query` object under the key used for the file name.

When using path segments, **any dynamic filename can be used**, this is indicated by the use of square brackets. The filename for the path segment is used solely for the purpose of providing a key name for accessing the value on the `req.query` object.

For example, creating a `name` directory (within `/api`) that contains a `[name].js` file will allow you to receive the path segment entered when accessing `/api/name/your-name` on the `req.query.name` object.

The following Node.js example code could then use the path segment in its functionality when requested:

```jsx
// An example of a Node.js Serverless Function that takes a name path segment and returns a string using it.

module.exports = (req, res) => {
  const {
    query: { name },
  } = req;

  res.send(`Hello ${name}!`);
};
```

The resulting deployment can be found here: [https://path-segment-with-node.now-examples.now.sh/api/name/reader](https://path-segment-with-node.now-examples.now.sh/api/name/reader).

(Again, your name is "reader".)

## Caching

It is very _very_ easy to utilize caching in your serverless functions with Vercel's CDN layer. You just provide a `Cache-Control` header and 💥! **Caching** is there for you.

Responses with a HTTP status of `200` to a `GET` or `HEAD` request are cached by the Vercel Edge Network. Other status codes are **never cached**.

Additionally, the following are not cached:

- Responses that exceed 10MB in content length.
- Requests that contain the `Range` header.
- Requests that contain the `Authorization` or `Pragma` headers.
- Responses that contain the `no-cache` directive in their `Cache-Control` headers.

When providing a `Cache-Control` is sent from your Serverless Function, it can include any of the following directives, separated by a comma:

- `s-maxage=N`
- `max-age=N, public`
- `max-age=N, immutable`

**NOTE:** Above; where `N` is the number of seconds the response should be cached for.

As an example, you can set the `Cache-Control` header in your Node.js Serverless Functions by using the `response.setHeader` method:

```jsx
// A Node.js Serverless Function that sends a string response and caches that response for a day.

module.exports = (request, response) => {
  response.setHeader('Cache-Control', 's-maxage=86400');
  response.send('Hello world!');
};
```

### Recommended `Cache-Control`

Vercel recommends that you set your cache to have `max-age=0, s-maxage=86400`, with changing `86400` to the amount of seconds you want your response to be cached for.

This recommendation will tell browsers not to cache and let Vercel's edge cache the responses and invalidate when your deployments update, so you never have to worry about stale content. This is the recommended way of using Vercel's caching abilities! 😇

### Purging

Every time you deploy with a custom domain, the cache for that domain is **purged**. This means that users will never see content from a previous deployment on your custom domain and there is no need to invalidate it manually when deploying.

## Conclusion

Using Vercel as a framework is very **powerful**, with features such as dynamic routes, caches... All provided built-in and you just need to provide some information for Vercel to utilize it for you. In addition, routes can be customized on top of filesystem routing provided by Vercel by using the `vercel.json` settings file and introducing some routes in there. Hope this blog post got you interested in using Vercel as a framework! 👋

## Sources

1. [https://vercel.com/docs/v2/serverless-functions/introduction](https://vercel.com/docs/v2/serverless-functions/introduction)
2. [https://vercel.com/docs/v2/serverless-functions/supported-languages](https://vercel.com/docs/v2/serverless-functions/supported-languages)
3. [https://vercel.com/docs/v2/serverless-functions/edge-caching](https://vercel.com/docs/v2/serverless-functions/edge-caching)
4. [https://vercel.com/docs/v2/introduction](https://vercel.com/docs/v2/introduction)
5. [https://vercel.com/docs/configuration#routes](https://vercel.com/docs/configuration#routes)
