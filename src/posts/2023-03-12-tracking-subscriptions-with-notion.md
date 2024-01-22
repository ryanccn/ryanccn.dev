---
title: Tracking Subscriptions with Notion
tags:
  - notion
  - productivity
date: 2023-03-12
---

Subscriptions are becoming more and more widely used as a pricing model for Software as a Services (SaaSes). And they do often make a lot of sense: developers can get a sustainable income, and recurring payments also pay for the services needed to run user facing applications.

However, as a user, it can become rather difficult to track what products you’re subscribed to. Remember that time when you received an invoice in your inbox for something you don’t remember purchasing but you actually did on a whim a year ago? Or that time you signed up for a free trial, forgot about it, and got promptly charged a few days later? These are all issues that I’ve ran into with subscriptions.

No, I haven’t built my own app for it ~~yet~~, but I have created an neat little setup with [Notion](https://www.notion.so/) to track expenses from subscriptions, and I felt it would be worth sharing with some of you out there.

## Formulas

In a Notion database, [formulas](https://www.notion.so/help/formulas) are properties that you could, basically, write code in to derive and calculate a value from other properties.

{% respimg '/images/tracking-subscriptions-with-notion/formula-editing.png', 'A screenshot of the Notion formula editing interface' %}

It uses a JavaScript-like syntax and provides basic constants and functions that you can use to do all sorts of fun things such as custom progress bars and star displays, but in this particular case we’re going to use it to do some _pretty cursed_ calculations to provide insight on how much our subscriptions are costing.

## Basic information

First off, some basic information needs to entered manually into the database. There’s the name, tags, price, billing cycle, and start date.

{% respimg '/images/tracking-subscriptions-with-notion/basic-information.png', 'The basic information on subscriptions in the database' %}

Here, I also have an additional EUR field for when the original price is in euros instead of dollars. (The conversion to USD is not automatic.)

{% respimg '/images/tracking-subscriptions-with-notion/archived.png', 'An example of an archived (ended) subscription' %}

For ended subscriptions, there is a checkbox property right in front that you check when the subscription has ended, and you also put an end date into the Since field. This information will be used later on.

## Effective Annual Cost

The first formula is one for calculating the effective annual cost of each subscription. It’s very simple:

```typescript
prop("Price") * (prop("Billing cycle") == "Monthly" ? 12 : 1);
```

It simply converts monthly pricing to yearly pricing when the yearly pricing is not provided.

{% respimg '/images/tracking-subscriptions-with-notion/effective-annual-costs.png', 'Calculated Effective Annual Costs in the database' %}

## Accumulated Cost

This formula is, for me, the most important one — it allows you to check how much you have spent _in total_ on the subscription. This one, to put it lightly, is not so simple:

```typescript
max(
  prop("Effective Annual Cost") *
    (prop("Billing cycle") == "Yearly"
      ? ceil(
          dateBetween(
            end(prop("Since")) != start(prop("Since"))
              ? end(prop("Since"))
              : now(),
            start(prop("Since")),
            "years",
          ),
        ) + 1
      : (ceil(
          dateBetween(
            end(prop("Since")) != start(prop("Since"))
              ? end(prop("Since"))
              : now(),
            start(prop("Since")),
            "months",
          ),
        ) +
          1) /
        12),
  0,
);
```

Let’s break it down. We already have the effective annual cost from the last formula, and the thing we mainly need to calculate here is how many billing cycles there were for the whole duration of the subscription. Notion has this behavior where any date is in fact a date range, and a date range that has no end date starts and ends at the same date. So, to check whether the subscription has ended or not, one simply has to check `end(prop("Since")) != start(prop("Since")`.

Thus, `dateBetween(end(prop('Since')) != start(prop('Since')) ? end(prop('Since')) : now(), start(prop('Since'), 'years [or months]')` returns the entire timeframe of the subscription in years or in months. If the billing cycle is in years, we just take the timeframe in years and multiply it by the Effective Annual Cost; if it’s in months, we multiply it by the Effective Annual Cost divided by 12.

{% respimg '/images/tracking-subscriptions-with-notion/accumulated-costs.png', 'Calculated Accumulated Costs in the database' %}

## Working on these formulas are horrific!

Working on large formulas in the Notion app itself is indeed a bit painful, with the editor cursor often glitching into wrong places and autocomplete going all over the place, so I ended up writing the formula in a TypeScript project. It was fairly easy to copy the functions that I used into type definitions, and the `prop` function was statically typed with all the properties and their values, complete with autocomplete.

Here’s the type definitions that I wrote for this specific formula:

```typescript
declare interface Props {
  "Billing cycle": "Yearly" | "Monthly";
  "Effective Annual Cost": number;
  "Since": number;
}

declare function max(...a: number[]): number;
declare function min(...a: number[]): number;
declare function ceil(...a: number[]): number;

declare function start(a: number): number;
declare function end(a: number): number;
declare function now(): number;

declare function prop<T extends keyof Props>(key: T): Props[T];

declare function dateBetween(
  a: number,
  b: number,
  c: "years" | "months" | "days",
): number;
```

Hope this blog post helped you get some ideas on how to use Notion’s powerful databases and formulas to organize your own life!
