---
title: All the Counters
date: 2020-04-18
---

In this post on the [DEV Community](https://dev.to/) (well not the DEV community since I'm serving this on my own **website**) I am going to make a very simple counter app. But I am going to make it in all the languages that I know - Vue, React, Svelte, jQuery, Vanilla, and Alpine.

However, it's completely up to **you** which you think is best!

Let's get started.

## Outline

For the counter, we will need to have three methods: `increment`, `decrement`, and `reset`. The HTML code at first will be all the same - a static web page.

```html
<div>
  <h1></h1>
  <button>+</button>
  <button>-</button>
  <button>0</button>
</div>
```

This will be the basis for developing the frontend later.

The state will only have to include one item: `count`. It will be set by default to 0.

I extremely recommend that you use [CodePen](https://codepen.i/) for this project - it's a great online coding interface! 😉

## React

React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications. **(Wikipedia)**

Firstly, initialize the component. For React, things are done a little differently - you have to include the HTML code **in** the JavaScript via JSX.

For the HTML, only this:

```html
<div id="app"></div>
```

Next up, we will initialize the component in React.

```jsx
class App extends React.Component {
  // The constructor method - we're not doing anything to it yet.
  constructor(props) {
    super(props)
  }
  render() {
    return (
      {/* The HTML code written as JSX here */}
      <div>
        <h1></h1>
        <button>+</button>
        <button>-</button>
        <button>0</button>
      </div>
    )
  }
}

// Render the component into the #app div!
ReactDOM.render(<App />, document.querySelector("#app"))
```

Then we will initialize the state - with `count` being 0.

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
    // Initiate the state in the constructor method
    this.state = {
      count: 0,
    };
  }
  render() {
    return (
      <div>
        // Render the state into the component
        <h1>{this.state.count}</h1>
        <button>+</button>
        <button>-</button>
        <button>0</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

There should now be an `h1` reading **0** on your counter right now.

Next up, adding the three methods to your component and adding them also to the buttons.

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  increment() {
    this.setState((state) => {
      return {
        count: (state.count += 1),
      };
    });
  }
  decrement() {
    this.setState((state) => {
      return {
        count: (state.count -= 1),
      };
    });
  }
  reset() {
    this.setState({
      count: 0,
    });
  }
  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        // onClick - not onclick! (React perk)
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
        <button onClick={this.reset}>0</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

Great job - we're almost finished. But one thing you always **always** have to remember in React: if you access `this` in your methods, you have to bind the method to `this` in the constructor method. ⚠️

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
    // Added code
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.reset = this.reset.bind(this);
  }
  increment() {
    this.setState((state) => {
      return {
        count: (state.count += 1),
      };
    });
  }
  decrement() {
    this.setState((state) => {
      return {
        count: (state.count -= 1),
      };
    });
  }
  reset() {
    this.setState({
      count: 0,
    });
  }
  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
        <button onClick={this.reset}>0</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

Great job! You've created a complete React Counter app! 🎉

You can see the full code [here](https://codepen.io/ryanccn/pen/PoPNeBO).

## React Hooks

To be frank, I am not that skilled in React, so I don't yet know much about the concept of React Hooks.

But you can see the code [here](https://codepen.io/Qluxzz/pen/rNOLzwQ), a counter app implemented with React Hooks! :innocent:

## Vue

Vue.js is an open-source Model–view–viewmodel JavaScript framework for building user interfaces and single-page applications. It was created by Evan You, and is maintained by him and the rest of the active core team members coming from various companies such as Netlify and Netguru. **(Wikipedia)**

A Vue component does not include the HTML code inside the JavaScript like what React does - it just adds functionality (via directives) into the HTML.

First up - the HTML.

```html
<div>
  <h1></h1>
  <button>+</button>`
  <button>-</button>
  <button>0</button>
</div>
```

Then we will initialize the component inside the JavaScript with the `Vue` object.

```jsx
new Vue({
  el: '#app',
});
```

Pretty straightforward! :smile: Let's add the state right now, also inside the Vue config object.

```jsx
new Vue({
  el: '#app',
  data() {
    return {
      count: 0,
    };
  },
});
```

This is a weird thing about Vue: `data` must be a function. Read more about this [here](https://flaviocopes.com/vue-data-function/)!

And then we have to render this state inside the HTML:

```html
<div id="app">
  <h1>{{ count }}</h1>
  <button>+</button>
  <button>-</button>
  <button>0</button>
</div>
```

This is one great thing about Vue - it is simply a template language embedded. Does it remind you of Mustache or Handlebar? Just a visual reminder :joy:. Also, Vue automatically binds the `this` object for you in the template, so you don't have to write `{{ this.count }}` anymore.

Now we will write the methods! All of this is still in the `methods` attribute of the Vue config object.

```jsx
new Vue({
  el: '#app',
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    increment() {
      this.count += 1;
    },
    decrement() {
      this.count -= 1;
    },
    reset() {
      this.count = 0;
    },
  },
});
```

Vue is very straightforward in state management - you don't have to call `setState` or whatever - you could just set it directly as an attribute of `this`. Wonderful!

Interactivity (aka clickabilty) is embedded into the HTML using `v-on` directives. Because we need it so often, Vue even has a shorthand for us - `@`.

```html
<div id="app">
  <h1>{{ count }}</h1>
  <button @click="increment">+</button>
  <button @click="decrement">-</button>
  <button @click="reset">0</button>
</div>
```

That is all is needed for Vue - no `this` object because Vue automaticaly binds it for you.

See the complete code [here](https://codepen.io/ryanccn/pen/eYpZrPw/)!

## Svelte

Svelte is a free and open-source JavaScript framework written by Rich Harris. Svelte applications do not include framework references. Instead, building a Svelte applications generates code to manipulate the DOM, which may give better client run-time performance. **(Wikipedia)**

Very sadly, Svelte is not at all supported by CodePen, JSFiddle, or any other of the great websites. However, instead of local development, you could use the [Svelte REPL](https://svelte.dev/repl). It's also very cool, and provides hot reloading.

Svelte is extremely straightforward (even more than Vue). Its code doesn't feel like another framework - it's just JavaScript.

Initializing the component:

```html
<script></script>

<h1></h1>
<button>+</button>
<button>-</button>
<button>0</button>
```

That's it. No `ReactDOM.render`, no `Vue`. It's just done for you. Adding the state to the app:

```jsx
let count = 0;
```

Still very simple. Svelte does all the stuff for you. The 3 methods:

```jsx
let count = 0;
const increment = () => {
  count += 1;
};
const decrement = () => {
  count -= 1;
};
const reset = () => {
  count = 0;
};
```

Here I'm using ES6 arrow functions, and functions are just defined as normal. Svelte automatically turns it into an accessible method. 🌈

The HTML is still really straightforward. It's kind of like React with curly braces `{}` being rendered as JavaScript.

```html
<script>
  let count = 0;
  const increment = () => {
    count += 1;
  };
  const decrement = () => {
    count -= 1;
  };
  const reset = () => {
    count = 0;
  };
</script>

<h1>{count}</h1>
<button on:click="{increment}">+</button>
<button on:click="{decrement}">-</button>
<button on:click="{reset}">0</button>
```

Pretty great right? That's Svelte's motto:

> Write less code, no virtual DOM, truly reactive.

## jQuery

jQuery is a JavaScript library designed to simplify HTML DOM tree traversal and manipulation, as well as event handling, CSS animation, and Ajax. It is free, open-source software using the permissive MIT License. As of May 2019, jQuery is used by 73% of the 10 million most popular websites. **(Wikipedia)**

The HTML:

```html
<div>
  <h1 id="count">0</h1>
  <button id="increment">+</button>
  <button id="decrement">-</button>
  <button id="reset">0</button>
</div>
```

Note that I added `id`s to all of the elements. This is for easy targeting in jQuery. Also, I initiated the "state" by adding 0 already to the `h1`. So let's define the methods!

```jsx
$('#increment').click(() => {
  let count = parseInt($('#count').text());
  $('#count').text((count += 1));
});
$('#decrement').click(() => {
  let count = parseInt($('#count').text());
  $('#count').text((count -= 1));
});
$('#reset').click(() => {
  let count = parseInt($('#count').text());
  $('#count').text(0);
});
```

To be frank, jQuery is still pretty cool, even today.

See the full code [here](https://codepen.io/ryanccn/pen/jObqxgd).

## Vanilla JS 🦄

Again, we will use `id`s to target these elements. (Just for ease of use.)

```html
<div>
  <h1 id="count">0</h1>
  <button>+</button>
  <button>-</button>
  <button>0</button>
</div>
```

Then, we will first target the count element using `querySelector`:

```jsx
const counter = document.querySelector('#count');
```

Adding the `onclick` attributes to the HTML directly:

```html
<div>
  <h1 id="count">0</h1>
  <button onclick="increment()">+</button>
  <button onclick="decrement()">-</button>
  <button onclick="reset()">0</button>
</div>
```

Now let's add the callback methods inside the JavaScript.

```jsx
const counter = document.querySelector('#count');

function increment() {
  let c = parseInt(counter.innerText);
  counter.innerText = c += 1;
}

function decrement() {
  let c = parseInt(counter.innerText);
  counter.innerText = c -= 1;
}

function reset() {
  counter.innerText = 0;
}
```

Bingo! You've created a counter completely out of vanilla JavaScript.

Full code [here](https://codepen.io/ryanccn/pen/KKdzedL).

## Alpine

The last is the best - Alpine is a rugged, minimal framework for composing JavaScript behavior in your markup. It offers you the reactive and declarative nature of big frameworks like Vue or React at a much lower cost. You get to keep your DOM, and sprinkle in behavior as you see fit. **(Alpine README)**

It is simply a great "framework" to include very miniature interactions inside your HTML without much loading of the Virtual DOM or something.

After you have added Alpine to your pen / fiddle / HTML file, just copy / paste the initial HTML.

```html
<div>
  <h1></h1>
  <button>+</button>
  <button>-</button>
  <button>0</button>
</div>
```

Then, adding the state is extremely fun, just add the `x-data` attribute to whatever `div` you think is right for a component. Here, I'm going to add it globally:

```html
<div x-data="{count: 0}">
  <h1 x-text="count"></h1>
  <button>+</button>
  <button>-</button>
  <button>0</button>
</div>
```

Using the `x-text` allows you to render a part of the state into an element. It automatically escapes the string for you (in case of XSS attacks).

Next, we will add the callbacks, which are still pretty easy - directly into the HTML we go!

```html
<div x-data="{count: 0}">
  <h1 x-text="count"></h1>
  <button @click="count += 1">+</button>
  <button @click="count -= 1">-</button>
  <button @click="count = 0">0</button>
</div>
```

That is ridiculously simple, but you don't have to write **any** JavaScript in order to use this JavaScript framework. 👼

## Sum-up

In this post I showed you how to make a very simple counter app in React, Vue, Svelte, jQuery, Vanilla JavaScript, and Alpine. If you have any more examples to add, please add them in the comments below!
