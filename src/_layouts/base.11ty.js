const slugify = require('../../utils/slugify');
const { twitter, github } = require('../../utils/icons');

const html = String.raw;

class Page {
  render(data) {
    const socialImg = `${data.domain}/previews/${slugify(data.title)}.png`;

    return html`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>${data.title}</title>

          <link rel="icon" href="/icons/transparent.png" />
          <link rel="apple-touch-icon" href="/icons/solid.png" />
          <meta name="theme-color" content="#5706e0" />

          <meta name="title" content="${data.title}" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="${data.title}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content="@RyanCaoDev" />
          <meta name="twitter:title" content="${data.title}" />
          <meta property="og:image" content="${socialImg}" />
          <meta name="twitter:image" content="${socialImg}" />

          <link rel="stylesheet" href="/assets/tailwind.css" />
          ${data.includePrismCSS
            ? html`<link rel="stylesheet" href="/assets/prism.css" />`
            : ''}

          <script defer src="/assets/main.js"></script>
          ${data.inProduction
            ? html`<script
                defer
                src="https://plausible.ryanccn.dev/ryanccn.dev.js"
              ></script>`
            : ''}
        </head>
        <body
          class="flex flex-col md:flex-row md:space-x-12 my-36 mx-auto w-10/12"
        >
          <header
            class="flex flex-col space-y-3 border-solid border-b-[1.25px] border-gray-300 pb-4 mb-4 md:border-none md:flex-none md:mb-8 md:pb-0"
          >
            <h1 class="flex space-x-2 items-center">
              <img
                src="/icons/50px.png"
                alt=""
                width="25"
                height="25"
                class="w-[25px] h-[25px] rounded-full"
                data-image-no-process="1"
              />
              <span class="text-lg font-bold">Ryan Cao</span>
            </h1>
            <ul class="flex flex-col space-y-1">
              ${data.navLinks
                .map(
                  (link) => html`<li>
                    <a href="${link.href}" class="font-medium hover:underline">
                      ${link.title}
                    </a>
                    ${data.page.url === link.href ? html`<span>⇠</span>` : ''}
                  </li>`
                )
                .join('\n')}
            </ul>
            <ul class="flex space-x-2">
              <a
                href="https://twitter.com/RyanCaoDev"
                class="block text-blue-400 hover:text-blue-300"
                target="_blank"
                rel="noreferrer noopener"
                id="twitter-social-link"
              >
                ${twitter}
              </a>
              <a
                href="https://github.com/ryanccn"
                class="block text-black hover:text-gray-700"
                target="_blank"
                rel="noreferrer noopener"
                id="github-social-link"
              >
                ${github}
              </a>
            </ul>
            <p
              class="text-sm text-gray-200 hover:text-gray-300 transition-colors cursor-default hidden md:block"
            >
              &copy; Ryan Cao 2020-${new Date().getFullYear()}
            </p>
          </header>
          <main class="md:flex-1 md:mb-8">${data.content}</main>
        </body>
      </html>
    `;
  }
}

module.exports = Page;
