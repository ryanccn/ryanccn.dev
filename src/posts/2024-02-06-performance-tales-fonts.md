---
title: "Performance Tales, Part 2: A Robust Web Font Loading Strategy"
tags:
  - web
  - performance
  - update
date: 2024-02-06
---

On the issue of web fonts, I've gone back and forth several times for this website. I've used [IBM Plex Sans](https://www.ibm.com/plex/), [Public Sans](https://public-sans.digital.gov/), [Satoshi](https://www.fontshare.com/fonts/satoshi), and these are just the ones that I could remember off the top of my head. Web fonts are a heavy performance cost: they have comparatively large sizes, are essential for the correct rendering and layout of a web page, and have various complicated techniques in optimization. When done badly, web fonts can introduce significant [Cumulative Layout Shift](https://web.dev/articles/cls) if asynchronously loaded and severely delayed [Largest Contentful Paint](https://web.dev/articles/lcp) if synchronously loaded.

Currently, I'm using [Inter](https://rsms.me/inter) for this website. There are various reasons why I chose this font family: it looks great, it's good for both UI and prose, it has a variable font, and it has many font features that I can use.

On the optimization side, there are many established treatises in the community on how best to approach font optimization, with one of the most notable ones being Zach Leatherman's [A Comprehensive Guide to Font Loading Strategies](https://www.zachleat.com/web/comprehensive-webfonts/). I also read a lot of other articles on font optimization before deciding upon the approach that is currently deployed, an approach that, in my humble opinion, is a solid middle ground between performance and overengineering.

Using fonttools' [pyftsubset](https://fonttools.readthedocs.io/en/latest/subset/index.html) tool, I split the Inter font family up into eleven different subsets that cover the entire character range that Inter supports, with seven of them being the standard alphabet subsets used by Google Fonts (`latin`, `latin-ext`, etc.) and the rest being the miscellaneous glyphs that are not in the standard alphabet ranges, split roughly equally by size. In addition, the layout features that the variable font supports are also hardcoded in during the subsetting process so that only the font features that I actually use on the website (`'zero', 'ss01', 'cv01', 'cv10'`) are included in the font and the rest are stripped out.

To achieve this, I wrote a little Python script that calls the `pyftsubset` CLI under the hood that runs the commands for each character range subset and also handles the layout features in the options sent to `pyftsubset`.

{% raw %}

```python {11-23,33-46}
import subprocess
import argparse

from rich.progress import track

from os import makedirs, listdir
from os.path import getsize
from shutil import rmtree


SUBSETS = {
    "latin": "U+0-FF, U+131, U+152, U+153, U+2BB, U+2BC, U+2C6, U+2DA, U+2DC, U+300, U+301, U+303, U+304, U+308, U+309, U+323, U+329, U+2000-206F, U+2074, U+20AC, U+2122, U+2190-2193, U+2212, U+2215, U+FEFF, U+FFFD",
    "latin-ext": "U+0100-02AF, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF",
    "greek": "U+0370-03FF",
    "greek-ext": "U+1F00-1FFF",
    "cyrillic": "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
    "cyrillic-ext": "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F",
    "vietnamese": "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB",
    "rest-1": "U+2B0-2BA, U+2BD-2C5, U+2C7-2D9, U+2DB, U+2DD-2FF, U+302, U+306, U+307, U+30A, U+30C, U+30F, U+313, U+315, U+31B, U+326-328, U+32C, U+337, U+338, U+342, U+343, U+346-36F, U+E3F, U+1D43, U+1D47-1D49, U+1D4D, U+1D4F, U+1D50, U+1D52, U+1D56-1D58, U+1D5B, U+1D62-1D65, U+1D9C, U+1DA0, U+1DBB, U+1DBF-1DF5, U+1DFC-1DFF, U+2070, U+2071, U+2075-208E, U+2090-209C, U+20DB-20DE, U+20E8, U+20F0",
    "rest-2": "U+2100, U+2101, U+2103, U+2105, U+2106, U+2109, U+2117, U+211E-2121, U+2126, U+212A, U+212B, U+212E, U+2132, U+213B, U+214D, U+2150-217F, U+2183-2186, U+2189, U+2194-2199, U+21A9, U+21AA, U+21B0, U+21B1, U+21B3-21B5, U+21BA, U+21BB, U+21D0, U+21D2, U+21D4, U+21DE, U+21DF, U+21E4, U+21E5, U+21E7, U+21EA, U+2202, U+2205, U+2206, U+220F, U+2211, U+221A, U+221E, U+222B, U+2236, U+2248, U+2260, U+2264, U+2265, U+2295-2298, U+2303-2305, U+2318, U+2325-2327, U+232B, U+2380, U+2387, U+238B, U+23CE, U+23CF, U+2423, U+2460-2468, U+24B6-24CF, U+24EA, U+25A0-25A2, U+25AA, U+25B2, U+25B3, U+25B6, U+25B7, U+25BA-25BD, U+25C0, U+25C1, U+25C4-25C7, U+25CA, U+25CB, U+25CF, U+25E6, U+25EF, U+2600, U+2605, U+2606, U+263C, U+2661, U+2665, U+26A0, U+2713, U+2717, U+2756, U+2764, U+2780-2788, U+27EF, U+27F5-27FA, U+2913, U+2A38, U+2B06, U+2B12, U+2B13, U+2B1C, U+2B24, U+2E18, U+A92E, U+E000, U+E002-E05E, U+E06A-E094",
    "rest-3": "U+E095-E0BD, U+E0C8-E0CC, U+E0D7-E0E6, U+E0F3-E0F5, U+E106, U+E109, U+E10A, U+E10C-E10F, U+E111-E113, U+E117, U+E118, U+E121, U+E122, U+E124, U+E12A-E15E, U+E163, U+E1C3, U+E1D2-E2DC, U+EE01-EE07",
    "rest-4": "U+EE09-EEE1, U+F6C3, U+1F12F-1F149, U+1F16A, U+1F16B, U+1F850, U+1F852",
}

parser = argparse.ArgumentParser()
parser.add_argument("-f", "--features")

args = parser.parse_args()

rmtree("result")
makedirs("result")

for subset in track(SUBSETS, description="Building roman subset fonts..."):
    u_range = SUBSETS[subset]
    subp_args = [
        "pyftsubset",
        "InterVariable.ttf",
        f"--unicodes={u_range}",
        "--flavor=woff2",
        f"--output-file=result/inter-roman-{subset}.woff2",
    ]

    if args.features is not None:
        subp_args.append(f"--layout-features+={args.features}")

    subprocess.run(subp_args, check=True)


for subset in track(SUBSETS, description="Building italic subset fonts..."):
    u_range = SUBSETS[subset]
    subp_args = [
        "pyftsubset",
        "InterVariable-Italic.ttf",
        f"--unicodes={u_range}",
        "--flavor=woff2",
        f"--output-file=result/inter-italic-{subset}.woff2",
    ]

    if args.features is not None:
        subp_args.append(f"--layout-features+={args.features}")

    subprocess.run(subp_args, check=True)
```

{% endraw %}

This script generates the dozens of subsetted and optimized font files that I can directly use in my website.

In addition to heavily optimizing these font files, I also use [preloading](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload) to minimize layout shift and improve loading speed. Since references to font files are defined in CSS and the browser is not aware of the fonts until it parses the CSS, preloading the font files makes them available to the browser sooner and tells it to download the font files before it even touches the CSS. For this website, I include a preload link for the roman Latin subset, since italics can be generated with font composition early on and most of the pages on this website only include characters in the Latin subset.

```html
<link
  rel="preload"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
  href="/fonts/inter/inter-roman-latin.woff2"
>
```

When it comes to the CSS, I bundle the font-related CSS rules (`font-face`s) into a separate, minified CSS bundle and inline them into the `<head>` so that the font is made known to the browser early on, before the full stylesheet is loaded.

Through a combination of using a variable font, font subsetting, stripping out unused features, and preloading, the Inter web font on this website has a small size and loads blazingly fast, with nearly no layout shift on faster networks and minimal layout shift on slower networks. For a great deal of use cases, the [system font stack](https://systemfontstack.com/) without any web fonts is quite enough. However, if you want that unique look on your website or have branding guidelines to abide by, a wide array of modern tools can help you load web fonts performantly and effectively!
