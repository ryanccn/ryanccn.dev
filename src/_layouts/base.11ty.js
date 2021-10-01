const { html, safe } = require('../../utils/htmlTag');

const header = (data) => {
  return html`<header
    class="navbar"
    x-data="{open: false}"
    @click.away="open = false"
  >
    <div class="flex items-center justify-between md:justify-start">
      <div class="flex items-center">
        <img
          src="/icons/50px.png"
          alt=""
          width="25"
          height="25"
          class="w-[25px] h-[25px] rounded-full mr-2"
          data-image-no-process="1"
        />

        <a href="/" class="link text-2xl font-semibold mr-6">Ryan Cao</a>
      </div>

      <button class="p-2 md:hidden" @click="open = !open">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
    <ul
      :class="open ? 'flex flex-col' : 'hidden md:flex md:flex-row md:items-center'"
    >
      ${safe(
        data.navLinks.links
          .map(
            (link, index) => html`<li
              class="mr-4 ${index === data.navLinks.links.length - 1
                ? 'mb-2 md:mb-0'
                : ''}"
            >
              <a href="${link.href}" class="link text-lg font-medium">
                ${link.title}
              </a>
            </li>`
          )
          .join('\n')
      )}
      <div class="flex">
        ${safe(
          data.navLinks.social
            .map(
              (link) => html`<li
                class="block transition-opacity hover:opacity-70 mr-2 md:mr-4 last:mr-0"
              >
                <a
                  href="${link.href}"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  ${link.icon}
                </a>
              </li>`
            )
            .join('\n')
        )}
      </div>
    </ul>
  </header>`;
};

class Page {
  render(data) {
    const socialImg = `${data.domain}/previews/${encodeURIComponent(
      this.slug(data.title)
    )}.png`;

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

          <meta name="title" content="${data.title}" />
          <meta name="description" content="A blog on web development, etc." />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="${data.title}" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content="@RyanCaoDev" />
          <meta name="twitter:title" content="${data.title}" />

          <meta property="og:image" content="${socialImg}" />
          <meta name="twitter:image" content="${socialImg}" />

          <link rel="stylesheet" href="/assets/tailwind.css" />
          ${data.includePrismCSS
            ? safe(html`<link rel="stylesheet" href="/assets/prism.css" />`)
            : ''}

          <script defer src="/assets/main.js"></script>
          ${data.inProduction
            ? safe(html`<script
                defer
                src="/plausible/script.js"
                data-domain="ryanccn.dev"
                data-api="/plausible/event"
              ></script>`)
            : ''}
        </head>
        <body>
          ${safe(header(data))}

          <main class="contain">${safe(data.content)}</main>

          ${data.page.url !== '/'
            ? safe(html`<footer class="contain text-center my-28">
                <p class="text-gray-500">
                  &copy; Ryan Cao 2020-${new Date().getFullYear()}
                </p>
              </footer>`)
            : ''}
        </body>
      </html>
    `;
  }
}

module.exports = Page;
