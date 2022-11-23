---
title: Inside a Minecraft Launcher
tags:
  - technical
date: 2022-04-26
---

Recently, I’ve been playing around with writing a Minecraft launcher from scratch, and also contributing to [PolyMC](https://polymc.org) and [ManyMC](https://github.com/MinecraftMachina/ManyMC). Through these ~~harrowing~~ interesting experiences, I have gathered a lot of knowledge about how Minecraft launchers actually work from the inside.

And I thought it would be nice to share this information with those of you who want to work on this topic yourself, since the current documentation isn’t very complete.

## Vanilla

Installing a vanilla version is the basis for everything else. I will write about installing loaders like Fabric and Forge later on, but this is the most basic thing launchers should do.

### 0. The working directory

The working directory depends on the system. In any case it is a specific directory reserved for Minecraft. For the official launcher this is one single directory, while in multi-instance launchers like [MultiMC](https://multimc.org) or [HMCL](https://hmcl.huangyuhui.net), this directory can be customized according to the launcher. However, most of the files you download / generate will be in this directory.

This directory will henceforth be referred to as `.minecraft` for convenience. This is the directory used on Linux.

### 1. The Version Manifest

The version manifest is the single source of truth for what versions there are. The URL is [https://launchermeta.mojang.com/mc/game/version_manifest.json](https://launchermeta.mojang.com/mc/game/version_manifest.json), and the format is approximately like this:

```json
{
  "latest": {
    "release": "1.18.2",
    "snapshot": "22w16b"
  },
  "versions": [
    {
      "id": "22w16b",
      "type": "snapshot",
      "url": "https://launchermeta.mojang.com/v1/packages/891d3bb98263c95e02d37aed36ebfa00d2d6bf9d/22w16b.json",
      "time": "2022-04-20T17:30:03+00:00",
      "releaseTime": "2022-04-20T17:25:32+00:00"
    }
    // ...
  ]
}
```

Obviously, the `latest` key corresponds to the latest versions for releases and snapshots. In the `versions` list, there is an ID (the name of the version), the type (release or snapshot), the URL to the version data, and the time and release time (which don’t really matter that much). The version data URL is going to be used in the next step.

### 2. The Version Data

After selecting the version, the JSON data from `"url"` would be downloaded to `.minecraft/versions/<version being downloaded>/<version>.json`. This version data JSON has a few sections of data:

1. `"arguments"` - arguments to pass

   This contains the arguments to run the main JAR with. The `"jvm"` flags are to be provided _before_ the main JAR, while the `"game"` flags are provided _after_ the main JAR. So a launch script would look something like this:

   ```bash
   java -jar [jvm flags] [main class] [game flags]
   ```

   The flags provided can either be a string or an object with the type

   ```tsx
   interface Rule {
     action: 'allow' | 'disallow';
     features?: { [feature: string]: boolean };
     os?: {
       name?: 'osx' | 'windows' | 'linux';
       version?: string;
       arch?: string;
     };
   }

   interface OptionalArgument {
     rules: Rule[];
     value: string | string[];
   }
   ```

   The `rules` feature is also used in the downloading of libraries in a later step. For platform-specific arguments, there are a list of rules to match, for either operating system, architecture, or the feature (e.g. demo user).

   Do note that there are a few substitutions needed in these arguments. For the JVM arguments, these are the substitutions needed:

   - `${natives_directory}`: the directory of the platform natives (to be mentioned later on)
   - `${launcher_name}`: the name of the launcher
   - `${launcher_version}`: the version of the launcher
   - `${classpath}`: a list of the paths of all the library JARs **and the main JAR** downloaded joined with `:`s
   - `${classpath_separator}`: `:`
   - `${primary_jar}`: the path to main JAR
   - `${library_directory}`: the overall folder in which the libraries were downloaded
   - `${game_directory}`: the “working directory” mentioned before

   For game arguments, there are also some substitutions needed:

   - `${auth_player_name}`: the username of the player
   - `${version_name}`: the name of the version (e.g. `1.18.2`)
   - `${game_directory}`: same as JVM
   - `${assets_root}`: the root folder of the downloaded assets, typically `.minecraft/assets`
   - `${assets_index_name}`: the asset index version to use, typically the minor version (e.g. `1.18`)
   - `${auth_uuid}`: the authentication UUID provided by MSA
   - `${user_type}` : all `mojang` nowadays
   - `${version_type}`: the version type, release or snapshot (although this can display any string)

   For the JVM args, you can also add any optimization arguments you like, such as enabling G1GC.

2. `"assetIndex"` - the index of assets to download

   The textures and music and UI controls are all **assets**, and there is typically an asset index for each minor version. This object has the following type definition:

   ```tsx
   interface AssetIndex {
     id: string;
     sha1: string;
     size: number;
     totalSize: number;
     url: string;
   }
   ```

   where `"sha1"` is the SHA-1 hash of the file, `"size"` is the size of the JSON file, `"totalSize"` is the size of all the assets combined, and `"url"` is yet another JSON file to get for the assets.

3. `"downloads"` - the main JARs to download

   This includes the JARs that you will actually call with `java` on launch. It’s an object containing downloads for both clients and servers in the format `{ sha1: string; size: number; url: string; }`. Again, the SHA-1 hash is provided. The file in `"url"` is downloaded to `.minecraft/versions/<version>/<version>.jar`. For clients, the file to download is `["downloads"]["client"]["url"]`.

4. `"libraries"` - the libraries to download

   This is arguably the most complex part of the downloading process. It will be detailed in its own dedicated section in step 3.

5. `"logging"` - the logging configuration file to provide to `log4j`

   ```tsx
   logging: {
     client: {
       argument: string;

       file: {
         id: string;
         sha1: string;
         size: number;
         url: string;
       }

       type: 'log4j2-xml';
     }
   }
   ```

   This contains an XML config file to provide to `log4j`. Download from `["logging"]["file"]["url"]`. The argument in `["logging"]["client"]["argument"]` should have the special keyword `${path}` replaced with the path the config file was downloaded to. This can be anywhere, but typically in `.minecraft/versions/<version>/log4j2.xml`.

6. `"mainClass"`: the main class to call in the execution of `java`

The others are not very important to our discussion here, and are pretty straightforward, so just look at the JSON if need be.

### 3. The Assets

As you may recall, in the `"assetIndex"` section there was a JSON file to download to `.minecraft/assets/indexes/<id>.json`. This JSON file contains a single `"objects"` key in which there are asset files in the following scheme:

```json
"icons/icon_16x16.png": {
  "hash": "bdf48ef6b5d0d23bbb02e17d04865216179f510a",
  "size": 3665
}
```

The name of the file does not matter. The file URL is derived from the hash as `https://resources.download.minecraft.net/<first 2 hex letters of hash>/<whole hash>`. This file is downloaded to `.minecraft/assets/objects/<first two letters of hash>/<whole hash>`, basically mirroring the URL structure.

### 4. The Libraries

This section downloads the libraries needed for the game. Each library is in this standardized format:

```tsx
interface LibraryDownload {
  path: string;
  sha1: string;
  size: number;
  url: string;
}

interface MojangLibrary {
  downloads: {
    artifact?: LibraryDownload;
    classifiers?: { [classifier: string]: LibraryDownload };
  };
  name: string;
  rules?: Rule[];
  natives?: { [os: string]: string };
}
```

The `LibraryDownload` type is pretty similar to the ones before. The `"rules"` object functions identically to the one for JVM and game arguments. For most libraries, there will be an `"artifact"` key, and all you need is to download `library.downloads.artifact.url` to `.minecraft/libraries/<library.downloads.artifact.path>`. However, for libraries with natives, it is a bit different.

Natives are binaries such as dynamic libraries and DLLs that are specific for each platform. If the `"natives"` key is present, the classifier needed to download will be in `library["natives"][os]`. Then put this classifier into `library.downloads.classifiers[classifier]`, and download the JAR in there to a temporary location. Then, **unzip** (since JARs are zips) the JAR and take the natives (glob: `*.{dylib,so,dll}`) and put them in a directory for the version, typically `.minecraft/versions/<version>/natives`.

This directory is what you substitute `${natives_directory}` for. This is necessary for some libraries like LWJGL and `java-objc-bridge` to work, since they have platform-specific bindings.

### 5. Actually launching

When you launch, simply run the substitutions on the JVM and game arguments previously mentioned. Then execute `java` like this:

```bash
java -jar [JVM args] [main class] [game args]
```

And there you have it! Downloading and launching vanilla Minecraft.

## Fabric / Quilt

For some players, modding makes the experience a lot better. One of these modding toolchains is [Fabric](https://fabricmc.net/), and it is also pretty easy to install on the basis of vanilla.

[Quilt](https://quiltmc.org) is a very recent fork of Fabric that aims to be more community-driven and contain more standardized features. The installation process is similar.

Fabric has an official website called `meta.fabricmc.net` that provides information on Fabric. For a specific vanilla version, you can open up `https://meta.fabricmc.net/v2/versions/loader/<version>` and it will give you a list of compatible Fabric Loader and Intermediary versions.

For Quilt, this would be `https://meta.quiltmc.org/v3/versions/loader/<version>`.

In each object in the list, there is `"loader"`, `"intermediary"`, and `"launcherMeta"`.

```json
// a sample

[
  {
    "loader": {
      "separator": ".",
      "build": 3,
      "maven": "net.fabricmc:fabric-loader:0.14.3",
      "version": "0.14.3",
      "stable": false
    },
    "intermediary": {
      "maven": "net.fabricmc:intermediary:1.18.2",
      "version": "1.18.2",
      "stable": true
    },
    "launcherMeta": {
      "version": 1,
      "libraries": {
        "client": [],
        "common": [
          {
            "name": "net.fabricmc:tiny-mappings-parser:0.3.0+build.17",
            "url": "https://maven.fabricmc.net/"
          },
          {
            "name": "net.fabricmc:sponge-mixin:0.11.3+mixin.0.8.5",
            "url": "https://maven.fabricmc.net/"
          },
          {
            "name": "net.fabricmc:tiny-remapper:0.8.2",
            "url": "https://maven.fabricmc.net/"
          },
          {
            "name": "net.fabricmc:access-widener:2.1.0",
            "url": "https://maven.fabricmc.net/"
          },
          {
            "name": "org.ow2.asm:asm:9.3",
            "url": "https://maven.fabricmc.net/"
          },
          {
            "name": "org.ow2.asm:asm-analysis:9.3",
            "url": "https://maven.fabricmc.net/"
          },
          {
            "name": "org.ow2.asm:asm-commons:9.3",
            "url": "https://maven.fabricmc.net/"
          },
          {
            "name": "org.ow2.asm:asm-tree:9.3",
            "url": "https://maven.fabricmc.net/"
          },
          {
            "name": "org.ow2.asm:asm-util:9.3",
            "url": "https://maven.fabricmc.net/"
          }
        ],
        "server": []
      },
      "mainClass": {
        "client": "net.fabricmc.loader.impl.launch.knot.KnotClient",
        "server": "net.fabricmc.loader.impl.launch.knot.KnotServer"
      }
    }
  }
]
```

In `launcherMeta.libraries` there are a list of libraries to be appended to the vanilla library list. `launcherMeta.libraries.common` and `launcherMeta.libraries.client` are the ones needed for a client. The loader and intermediary also need to be appended.

In `launcherMeta.mainClass`, there are the custom main classes for Fabric or Quilt. Here, don’t use the officially provided main class to launch — use the one provided in `launcherMeta.mainClass.client`.

One thing to notice is that the library format provided by Fabric is different from the traditional Mojang one — it includes a `"name"` key and a `"url"` key. This is a reference to a Maven repository, the packaging format of Java. The name is in the format `org1.org2:package:version`. You can easily derive the download URL from these two attributes by the following template:

```
<maven url>/<org1>/<org2>/<package>/<version>/<package>-<version>.jar
```

After downloading the additional libraries and editing the `mainClass`, just launch the game with the same template as vanilla and a Fabric / Quilt modded client will be up and running!

## Forge & Liteloader

> I am still investigating how Forge and Liteloader work. Will post more information about it in a follow-up post.

## MultiMC-style Launchers

[MultiMC](https://multimc.org) and forks of it use a custom format of their own JSON files called **meta files**. These meta files are generated from the sources cited above, such as `launchermeta.mojang.com` and `meta.fabricmc.net`. (Note how they all use the diction “meta”.) The MultiMC-style meta file is similar, but different from the vanilla ones.

Here is a table of the attributes from the MultiMC wiki:

| uid         | Should be the same as the <name> of the file.                                               |
| ----------- | ------------------------------------------------------------------------------------------- |
| name        | A human-readable name of the software this describes.                                       |
| version     | The version of this patch, or the the library it is for                                     |
| requires    | List of dependencies of this patch. In this case, it depends on version 1.7.2 of Minecraft. |
| order       | DEPRECATED: Used to help sorting patches, lower number means applied earlier.               |
| type        | Type of the package release (release, snapshot, etc.)                                       |
| releaseTime | Package release timestamp (ISO format). Used for sorting versions in lists.                 |
| mainClass   | This is the name of the Java class that will be used for starting the game.                 |
| +tweakers   | WITH LAUNCHWRAPPER ONLY: A list of tweakers passed to Minecraft with --tweakClass           |
| libraries   | A list of libraries (artifacts) used by the game. See below for more info                   |

The libraries format in MultiMC are much more standardized than the Mojang ones. Reference [this](https://github.com/MultiMC/Launcher/wiki/JSON-Patches#libraries) for more details.

MultiMC has a concept of **patches**, in which these different attributes can inherit and override one another. “Minecraft” is a patch, derived from the launcher meta. (Also, LWJGL is removed from the Minecraft patch and placed in its separate patch, for some reason.) Following this pattern, Fabric Loader and Forge are also patches.

Each patch has a `"uid"` to uniquely identify themselves and be able to specify one another.

Patches can depend on one another — for instance, the Minecraft patch depends on the LWJGL patch for that specific version.

An example for Fabric Loader 0.14.3:

```json
{
  "formatVersion": 1,
  "libraries": [
    {
      "name": "net.fabricmc:tiny-mappings-parser:0.3.0+build.17",
      "url": "https://maven.fabricmc.net/"
    },
    {
      "name": "net.fabricmc:sponge-mixin:0.11.3+mixin.0.8.5",
      "url": "https://maven.fabricmc.net/"
    },
    {
      "name": "net.fabricmc:tiny-remapper:0.8.2",
      "url": "https://maven.fabricmc.net/"
    },
    {
      "name": "net.fabricmc:access-widener:2.1.0",
      "url": "https://maven.fabricmc.net/"
    },
    {
      "name": "org.ow2.asm:asm:9.3",
      "url": "https://maven.fabricmc.net/"
    },
    {
      "name": "org.ow2.asm:asm-analysis:9.3",
      "url": "https://maven.fabricmc.net/"
    },
    {
      "name": "org.ow2.asm:asm-commons:9.3",
      "url": "https://maven.fabricmc.net/"
    },
    {
      "name": "org.ow2.asm:asm-tree:9.3",
      "url": "https://maven.fabricmc.net/"
    },
    {
      "name": "org.ow2.asm:asm-util:9.3",
      "url": "https://maven.fabricmc.net/"
    },
    {
      "name": "net.fabricmc:fabric-loader:0.14.3",
      "url": "https://maven.fabricmc.net"
    }
  ],
  "mainClass": "net.fabricmc.loader.impl.launch.knot.KnotClient",
  "name": "Fabric Loader",
  "order": 10,
  "releaseTime": "2022-04-25T22:35:53+00:00",
  "requires": [
    {
      "uid": "net.fabricmc.intermediary"
    }
  ],
  "type": "release",
  "uid": "net.fabricmc.fabric-loader",
  "version": "0.14.3"
}
```

This standard makes downloading and launcher in the launcher a much smoother experience, and separates the concerns of parsing the data from various sources and actually doing the work.

As to the working directories, MultiMC uses shared folders for libraries and assets across instances, since libraries referred to with the same Maven identifier would probably be the same, and assets can be reused. The working directory is set to the individual instance folder, and because you can pass your own `classpath` and `assets_root`, it works flawlessly.

MultiMC uses its own custom `NewLaunch.jar` to launch, though. I’m not sure why that would be used.

## Works Cited

- [wiki.vg](https://wiki.vg/Main_Page)
- [MultiMC JSON Patch Spec](https://github.com/MultiMC/Launcher/wiki/JSON-Patches)
