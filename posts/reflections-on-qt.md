---
title: Reflections on Qt
date: 2022-05-07
---

Recently, I’ve started to learn about [**Qt**](https://qt.io/), a cross-platform framework for building native applications. It was fairly new and interesting to me, because 1. I didn’t write any production-grade C++ before and 2. I always worked with [Electron](https://electronjs.org/) before, so I didn’t know what Qt would feel like.

Working on [PolyMC](https://polymc.org/) sort of forced me to learn about it, and now I like it pretty much! In this post I’ll explore the first impressions I have of Qt.

## Lightweight

Perhaps the first thing that comes to mind when you think of Electron is its huge file size and hefty memory usage. Indeed, bundling a whole browser with an app brings implications of large application bundle sizes and also the associated memory costs of a web rendering engine.

Qt, comparatively, is much more **lightweight**. Qt Widgets interface with **native APIs** that render the UI, making it really fast and requiring no additional rendering overhead other than what apps normally should have. **QML** is also a way to build custom-looking UIs I haven’t explored yet, but it doesn’t look as heavyset as Electron as well.

The fact that it is, after all, **a native executable** compiled from C++ makes it more lightweight as well. Applications using Electron bundle their own `node` in addition to Chromium, and apps frozen from Python include Python in their bundles as well. However, a C++ file, after compilation, simply pops out a Mach-O executable.

Granted, deployable Qt apps have to bundle the Qt frameworks with them. But what is this cost compared with other solutions?

## Fully featured

Qt has a [very wide range of APIs](https://doc.qt.io/qt-6.3/classes.html) available for the application to use. There are built in APIs for anything from simple strings (`QString`) to JSON processing (`QJsonDocument`) to networking (`QtNetwork`). These APIs make development much smoother and require much less use of external libraries, which can sometimes be very painful with C++ build systems.

These APIs interact and work together to create a coherent application. For instance, reading from a `QFile` (perhaps with the path gotten from `QFileInfo` or `QDir`?) returns a `QByteArray`, which can be fed into `QJsonDocument` to create a `QJsonDocument`, which can then be converted into `QJsonObject`s or `QJsonArray`s or some other JSON representation.

In addition, the fact that Qt bundles in these APIs means that they are optimized specifically for interactions between the application and these APIs, rather than, say, Node packages which could be made for anything from servers to CLIs. The way that Qt represents data internally is fully optimized to in these APIs.

In a way, Qt has a **large standard library** for the developer to use. Which is convenient. Think Python’s standard library.

## Looks native

With Electron, I always had a problem with the UI not looking native. When I try to make it native, it just looks phony and misshapen; if I don’t try and roll my custom UI, it doesn’t really fit in with the rest of the OS. (Although indeed most of my apps are Electron.) Personally I think [1Password](https://1password.com/) has a UI that looks pretty native, but I have _never_ been able to make a satisfying one.

Qt, in contrast, **integrates with native APIs** (e.g. Cocoa) to render the UI, so whatever widgets you use in the code, it will all look native on any operating system. On macOS it will look just like any SwiftUI app, except for a few glitches here and there that don’t affect the overall experience as long as you write the app properly.

The widgets also **behave natively**. Buttons get that lighter background when pressed in dark mode, etc., and you don’t have to do anything at all to have those features. It’s like having a component library ready for any platform!

## Qt Creator

**[Qt Creator](https://www.qt.io/product/development-tools)** is the official IDE for Qt, made with Qt. At first I rejected it because it, well, didn’t look so good, but after using it for a while it seems very intuitive to work with.

Different versions of Qt are easily configurable through **kits**. Different kits can have different [CMake](https://cmake.org/) paths, different Qt versions, different compilers (I specify `[ccache](https://ccache.dev/)` for compilers), and all of this is highly configurable while providing sensible defaults.

**Qt Designer** is also built in to the integrated editor, allowing for seamless transition between the business logic and the UI design.

There is a custom new file interface (similar to Xcode’s) that can help create a C++ class, a QML file, or any other sort of thing.

All in all, it’s a pretty good IDE. Although I wouldn’t say I like it better than VS Code 😉

These are my reflections and first impressions on Qt. I’m looking forward to finishing my first Qt app and also working a bit more on PolyMC as I learn more and become able to do more. If you also built cross-platform apps, it would be worth it to give [Qt](https://qt.io/) a try!
