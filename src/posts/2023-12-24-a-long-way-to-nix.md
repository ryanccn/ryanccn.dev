---
title: A Long Way to Nix
tags:
  - nix
date: 2023-12-24
---

## The Journey

### First encounter

It's hard to say when exactly I came into contact with [Nix](https://nixos.org), but it's definitely not hard to recall what my initial response was: one of horror and confusion.

Like many other macOS developers, I use [Homebrew](https://brew.sh/) as my primary system package manager. There's also a plethora of other language-specific package managers like [cargo](https://doc.rust-lang.org/cargo/) or [npm](https://www.npmjs.com/). Aside from their many differences, they have one pattern in common: you run `install` and `uninstall` commands on them. Nix was different; you managed your system packages using… a repository of source code? (I would discover `nix profile install` later on.)

On a whim, I tried [nix-darwin](http://daiderd.com/nix-darwin/) (I didn't use flakes at the time) and found configuration using Nix to be absolutely confusing. Looking back at that early encounter, it occurred to me that had I actually took the time to learn the Nix language and how Nix works on a basic level, perhaps I would've understood it more.

But I didn't have the patience to understand the ins and outs of a package manager that I couldn't even see the benefits of, so I uninstalled Nix and moved on.

### Second try

I installed Nix again when [@getchoo](https://github.com/getchoo) [started](https://github.com/ryanccn/vivid-zsh/pull/1) [adding](https://github.com/ryanccn/nish/pull/2) [flakes](https://github.com/ryanccn/ryan-mono/pull/1) to some of the new projects that I was creating. Obviously, I had to try out what was being added to my projects, and as I messed with the flakes and explored how they worked I gradually began to understand how Nix worked and the power of devshells and reproducible installs gave me a fairly good (second) impression of Nix.

It was also around this time that I started to use `nix profile install` to install some packages. The experience was not much nicer than Homebrew, but I could install from a slightly wider range of sources.

As I started using Nix more and more as a standalone package manager and as a project development environment manager, I learned more about the Nix language, how packages are structured, etc. [Zero to Nix](https://zero-to-nix.com/) helped me a great deal here, with its adept explanations of concepts and easily understandable examples. I began to be more comfortable tweaking Nix to get it to do what I wanted.

### Making the leap

After a month of working with Nix in individual projects and gradually getting more comfortable with it, I decided to once again try my hand at managing my system with Nix. I installed nix-darwin and this time, went straight for [flakes](https://zero-to-nix.com/concepts/flakes). It was a bit messy at first setting everything up, but soon I had a basic config up and running, with most of my Homebrew packages copied over to their Nixpkgs equivalents. [Being the largest software repository in the world](https://repology.org/repositories/graphs) isn’t for nothing! For casks, I managed these within Nix using nix-darwin’s [Homebrew integration](https://daiderd.com/nix-darwin/manual/index.html#opt-homebrew.enable).

This was all fine and well. I had switched over my packages to Nix. But one other pain point I was trying to solve was maintaining dotfiles, and simply managing system packages with Nix didn’t solve that. [Home-Manager](https://nix-community.github.io/home-manager/) did.

Bit by bit, I moved most of my configuration files into Nix, whether by using `home.file` directly or using the built-in `programs` provided by Home Manager. And far from being more complicated, a lot of the configuration was simplified. The wide range of options added by Nix users all over the world allowed for flexible wrapper options (such as `programs.gh.gitCredentialHelper.enable` or `programs.git.diff-so-fancy.enable`). And this is another place where the magic of Nix and Home Manager comes in: the packages and configuration options can be added within modules that are enabled or disabled independently, and these modules are merged together to create your home.

This module system also includes modules provided by flake inputs. By installing the [`ctp-nix`](https://github.com/Stonks3141/ctp-nix) Home Manager module, I could get Catppuccin-related options for a bunch of supported programs and a unified flavor setting. And later on, when I wrote [am](https://github.com/ryanccn/am), I also made it output a Home Manager module so that enabling a launch agent for Discord rich presence running in the background was as easy as `services.am-discord-presence.enable = true;`. The composability and flexibility of managing my home with Home Manager was quite a breath of fresh air.

## The Prize

### Reproducibility

One of Nix’s main tenets is reproducibility. With my development environment configured into a flake, that flake could replicate said environment on any device, even across platforms. I had a experience of this myself when I accidentally messed up my Nix install: I reinstalled Nix with the [Determinate Nix Installer](https://github.com/DeterminateSystems/nix-installer), installed nix-darwin, and proceeded to run `darwin-rebuild switch --flake .` in my flake repository. After downloading a few gigabytes and building for a few minutes, my entire development environment was back: shell prompt, packages, tooling, everything.

### Flexibility

With my system defined, essentially, in code, I could do a wide range of things I couldn’t before. For instance, my shell aliases are defined as an attrset, which are then separately processed and used in both zsh and fish, with additional support for differentiation between abbreviations and aliases in fish.

Overlays also enabled me to patch packages that I installed in a way that wouldn’t be as easy or even possible in other package managers. The IBM Plex font families use `SmBld` and `Medm` for semibold and medium font weights, which aren’t recognized by software such as Typst; to rectify this, I simply added a post-install stage to the derivation that uses `fonttools` to rewrite the font weights into their standard names.

### Compartmentalization

Nix requires a very rigid and strict delineation of build time and runtime dependencies, ensuring that each package only has access to what it needs. Consequently, the chances of a global environment polluting packages and making them non-functional is quite significantly reduced. When I build a Rust CLI from one flake and another from some other flake, they are using their own (and probably different) toolchains and not whatever global one I have installed. This goes back to the reproducibility boon: if it works for them, it likely would work for me. When I install two Python applications, they have their own Python dependencies, which may or may not be the same version. Either way, they can have their own versions, and the global version could be different, but everything works according to what they have specified for themselves.

### Project flakes

In addition to managing my system with Nix, many of my projects now also have flakes and build with Nix. Apart from the obvious benefit that this allows me to install my own projects easily in my flake, it also ensures reproducibility, makes cross-platform support easier, enables project-specific environments / devshells, and can result in significant improvements in the build process as a whole.

I use [rustPlatform](https://ryantm.github.io/nixpkgs/languages-frameworks/rust/#compiling-rust-applications-with-cargo) and [naersk](https://github.com/nix-community/naersk) a lot to build my Rust projects in Nix. By building things in Nix, all of the runtime dependencies are carefully identified, and I sleep well assured that a package that builds on my computer will build everywhere. The build is thus independent of the system configuration, ensuring that it works whatever its environment may be.

The flexibility inherent with Nix also allows for some very fun <sup>[<em>disputed - <a href="https://discord.gg/ty7GCnN87U">discuss</a></em>]</sup> capabilities. For instance, using different toolchains from [fenix](https://github.com/nix-community/fenix) allows for incredibly versatile cross-compilation, enabling building natively for different architectures or different operating systems with a simple configuration. Which is also, incidentally, reproducible.

Nix’s reproducible nature and how it utilizes a content-addressable store has the side effect of enabling much more fine-grained and versatile caching. Since each derivation precisely specifies what dependencies it has and its identifier changes when any part of it changes, caching of independent derivations can be achieved, greatly improving the cache hit rate and efficiency.

---

Since committing myself to using Nix back in July, I have only been more convinced of Nix’s superiority in package management and system configuration. The tenets that it holds dear create a great developer experience and empower Nix users with unparalleled control over their environments. The declarative nature of Nix expressions, along with its unique approach to dependency management, ensures reproducibility across different systems. This not only streamlines the developer experience but also improves open-source collaboration by eliminating the notorious “it works on my machine” dilemma.

Nix represents a shift in mindset and paradigm in package management and build processes; thus, it can often feel foreign or strange to those accustomed to imperative package managers and complex build scripts highly dependent on the system environment. But once you overcome the initial resistance and embrace the principles that Nix is built upon, the reproducibility, flexibility, and convenience that you get is truly unparalleled.
