---
title: Notion in Web Development
tags:
  - ideas
date: 2021-04-23
---

If you hadn't heard of it, Notion is a wonderful workspace that allows you to take notes, create wikis, manage databases (Airtable-style, not Postgres-style), etc. It's a great service that's quickly growing, and in this article, we are going to talk about how Notion can be used in web development.

[Notion - The all-in-one workspace for your notes, tasks, wikis, and databases.](https://notion.so)

## 1. Content Management System

A **content management system** is a system where you manage your content. (Duh.) They are typically used for managing stuff like blog posts, marketing pages, etc. and also can be used for little things like links in the headers or footers, etc.

Notion can be used as a CMS (and a really wonderful one!) because of its unique database structure. For instance, when you create a table, there are items in that table. You can add data via attributes to these items. However, you can also write content _inside_ the item as a page, since everything in Notion is a page. Thus, you have the familiar "Frontmatter + Content" content format that we have in markdown.

This very article is **written in Notion!** Check out the Notion page [here]().

If you have a `posts` database, therefore, you can have attributes such as category or date or slug, and the content being written directly into the Notion page.

An example of how a Notion database of articles would look like. (This is the database for this site! 😄)

Another benefit is that Notion is a rich text editor rather than a plain text one, meaning that the process of writing the content feels much better and is much more fluid. In addition, **components** like the callout above can augment the experience for writer and reader alike.

Projects such as `[notion-api-worker](https://github.com/splitbee/notion-api-worker)` and `[react-notion](https://github.com/splitbee/react-notion)` make it incredibly easy to use your Notion content in your applications and websites. In addition, Notion's **[Content API](https://www.notion.so/api-beta)** is currently in private beta, and we can expect to have a much better experience managing content with it later on!

## 2. To-do list / Kanban

Notion databases are not only tables. There are also different views like Kanban and just a simple todo list in a page, which makes for excellent project progress tracking, issue trackers, etc. This can create an experience similar to [Maintainers](https://maintainers.app) or GitHub projects.

An example of how a Kanban for managing projects would look like. (This is _not_ real.)

This can be used wonderfully, with custom attributes being tailored to your own needs.

## 3. Database

Just like **[Airtable](https://airtable.com/)**, Notion can be used as a no-code solution for a database. Just create a new table and use whatever you want, and then use the unofficial Notion private API or the Content API (if you're a member of the lucky few) to fetch that data and funnel it into your static site generator or server-rendered templates.

For instance, you can manage the projects listed on your personal website in a Notion table with attributes like `href` or `category` or `date`. Then, you can fetch that data and run it through your Eleventy or Next.js or something else.

I hope you enjoyed reading this article, and if you have any revolutionary ideas on how to use Notion in your web application, enlighten me via Twitter DM! 🙉 [@RyanCaoDev](https://twitter.com/RyanCaoDev)
