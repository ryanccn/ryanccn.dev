---
title: Data Fetching with Next.js
tags:
  - web
  - javascript
  - react
  - nextjs
date: 2020-05-04
---

As everybody knows, most web apps must fetch user data in some way and serve it to the client. There are many _many_ ways to do this, and in this article we're going to cover a few.

## Client-side

Serving the data client-side gives your users a fast experience, because then they can see a speedy fallback page while you load your data rather waiting for it to load server-side. This is best for dashboard apps, not for content-based websites.

(_Personal opinion, comment_ ⬇️ _if you think otherwise_)

There are many many ways to do this, some just using vanilla JS functions such as `fetch`, and others using React specialty such as custom hooks. We're going to explore only some of them here, but the possibilities are endless! :innocent:

### Vanilla JS

You can use `fetch`, `axios`, or many many else libraries that are useful for fetching AJAX data, but here I'm only going to demo the usage of `fetch`.

All JavaScript devs have probably heard of this, because `fetch` is a very _very_ famous function that requires no libraries at all. Of course, you can use libraries such as [isomorphic-fetch](https://npmjs.com/isomorphic-fetch) and [unfetch](https://npmjs.com/unfetch). (But they provide similar functionality, so)

The basic syntax is like this:

```jsx
let promise = fetch(url, [options]);
```

- `url` - the URL to access
- `options` – optional parameters such as methods and headers

The `Response` object provides multiple promise-based methods to access the body in various formats:

- `text()` - return response as text
- `json()` - return response as JSON
- `formData()` - return the response as `FormData`
- `blob()` - return the response as `Blob`
- `arrayBuffer()` - return the response as `ArrayBuffer`

This is just an overall view, so I'm not going to go too deep into the details, but you can [read more about `fetch` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

Onwards!

### SWR

**SWR** is a very cool React Hooks library that allows your app to fetch data through the `useSWR` hook.

The name "SWR" is derived from `stale-while-revalidate`, a HTTP cache invalidation strategy popularized by RFC 5861.

SWR first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again.

The basic API looks like this:

```jsx
import useSWR from 'swr';

function Profile() {
  const { data, error } = useSWR('/api/user', fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return <div>hello {data.name}!</div>;
}
```

Here the `fetcher` object is an asynchronous function that accepts the URL/query as the parameter and then returns the data, making it easy for you to write, for example, a `JSONFetcher` or a `GraphQLFetcher`. You can define those in a separate file, for instance, `fetchers.js` and then import them.

```jsx
// example of fetchers.js

import fetch from 'unfetch';
import { request } from 'graphql-request';
const API = 'https://api.graph.cool/simple/v1/movies';

const GraphQLFetcher = (query) => request(API, query);

const JSONFetcher = (url) => fetch(url).then((r) => r.json());

export { JSONFetcher, GraphQLFetcher };
```

For the detailed API and more examples, visit the [repository](https://github.com/zeit/swr).

### react-query

react-query is another data fetching React Hooks library that has somewhat more features than SWR, including memory caching, et cetera.

An example here:

```jsx
function Todos() {
  const { status, data, error } = useQuery('todos', fetchTodoList);

  if (status === 'loading') {
    return <span>Loading...</span>;
  }

  if (status === 'error') {
    return <span>Error: {error.message}</span>;
  }

  // also status === 'success', but "else" logic works, too
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

Unfortunately, you will have to define `fetchTodoList` yourself rather using the indiscriminate `JSONFetcher`. This is a little bit inconvenient, but there's a lot of benefits too.

And also react-query has a [dedicated devtools](https://github.com/tannerlinsley/react-query-devtools)! :astonished:

That's all for client-side fetching data - now we'll move on to fetching data on the server side. _(This is where Next.js specializes.)_

## Server-side

Next.js specializes a lot in fetching data on the server side. They provide you two built-in ways to do this: `getStaticProps` and `getServerSideProps`.

The difference between them is that `getStaticProps` only fetches the data **once**. After that one fetch, it caches the page and sends you the cached page instead of the live results. This is more useful for stuff that is not going to change often, for example, a marketing page or a blog post. `getServerSideProps` fetches the data every time you query it, so this is good for fetching updating user data.

### `getStaticProps`

When using `getStaticProps`, the site fetches data at **build time**. There's also another scenario, but we'll get to that soon.

If you export an `async` function called `getStaticProps` from a page, Next.js will pre-render this page at build time using the props returned by `getStaticProps`.

```jsx
export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
```

Is how you would do this.

The `context` parameter, as you may have noticed, is an object containing the following keys:

- `params` contains the route parameters for pages using dynamic routes. For example, if the page name is `[id].js`, then params will look like `{ id: ... }`.
- `preview` is `true` if the page is in the preview mode and `false` otherwise.
- `previewData` contains the preview data set by `setPreviewData`.

You should use `getStaticProps` when: _(this is from the Next.js documentation)_

- The data required to render the page is available at build time ahead of a user’s request.
- The data comes from headless CMS.
- The data can be publicly cached (not user-specific).
- The page must be pre-rendered (for SEO) and be very fast - getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

**Warning:** `getStaticProps` can only be exported from a page. You can’t export it from non-page files. Also, you must use `export async function getStaticProps() {}` — it will not work if you add getStaticProps as a property of the page component.

If you use `getStaticProps` with dynamic routes, you **must** also include `getStaticPaths`. Because you have to define the routes to build / render only once!

```jsx
export async function getStaticPaths() {
  return {
    paths: [
      { params: { ... } }
    ],
    fallback: true or false
  };
}
```

The `paths` key decides which pages should be rendered at build time.

```jsx
return {
  paths: [
    { params: { id: '1' } },
    { params: { id: '2' } }
  ],
  fallback: ...
}
```

Would statically generate `.../1` and `.../2`. The `params` are the dynamic elements inside the route.

The `fallback` key, a very recent feature added to Next.js 9.3. If `fallback` is `false`, then any paths not returned by `getStaticPaths` will result in a 404 page. If `fallback` is true, then the behavior of `getStaticProps` changes:

- The paths returned from `getStaticPaths` will be rendered to HTML at build time.
- The paths that have not been generated at build time will not result in a 404 page. Instead, Next.js will serve a "fallback" version of the page on the first request to such a path.
- In the background, Next.js will statically generate the requested path HTML and JSON. This includes running `getStaticProps`.
- When that’s done, the browser receives the JSON for the generated path. This will be used to automatically render the page with the required props. From the user’s perspective, the page will be swapped from the fallback page to the full page.
- At the same time, Next.js adds this path to the list of pre-rendered pages. Subsequent requests to the same path will serve the generated page, just like other pages pre-rendered at build time.

This is pretty useful if you have a lot of pages and you don't want to spend a whole day building your application in order to deploy it. Also, most of the time you wouldn't want to redeploy an app just because of a content addition.

So for example: if you add a page on your CMS, you will have to rebuild your **entire** application in order for it to be served successfully. In contrast, if you use `fallback: true`, when someone requests a page that’s not generated yet, the user will see the page with a loading indicator. Shortly after, `getStaticProps` finishes and the page will be rendered with the requested data. From now on, everyone who requests the same page will get the statically pre-rendered page. 👍

### `getServerSideProps`

If you export an async function called `getServerSideProps` from a page, Next.js will pre-render this page on each request using the data returned by `getServerSideProps`. Looks similar to the `getStaticProps` API, except that you don't have to specify a `getServerSidePaths` - because it's all dynamic on the server side.

```jsx
export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
```

Is how you would use it. There are 3 extra keys in the `context` object:

- `req`: The HTTP IncomingMessage object.
- `res`: The HTTP response object.
- `query`: The query string.

You should use `getServerSideProps` only if you need to pre-render a page whose data must be fetched at request time. Time to first byte (TTFB) will be slower than `getStaticProp` because the server must compute the result on every request, and the result cannot be cached by a CDN without extra configuration.

That's all for this article - in this article, we covered fetching the data using plain client-side JS, two React Hooks libraries, and also the specialty of Next.js, `getStaticProps` and `getServerSideProps`.

Hopefully, now you have a little more understanding about data fetching with this great React framework! 😇
