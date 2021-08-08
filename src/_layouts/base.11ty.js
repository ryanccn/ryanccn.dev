const html = require('../../utils/htmlTag');

const safe = (a) => ({ value: a, safe: true });

const header = (data) => {
  return html`
    <header class="contain mt-24 mb-28">
      <ul class="flex space-x-4 items-center">
        <li class="mr-6">
          <a href="/" class="nav-link text-xl font-semibold">Ryan Cao</a>
        </li>
        ${safe(
          data.navLinks.links
            .map(
              (link) => html`<li>
                <a href="${link.href}" class="nav-link">${link.title}</a>
              </li>`
            )
            .join('\n')
        )}
        ${safe(
          data.navLinks.social
            .map(
              (link) => html`<li
                class="block transition-opacity hover:opacity-70"
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
      </ul>
    </header>
  `;
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

          <main class="contain min-h-screen">${safe(data.content)}</main>

          <footer class="contain text-center my-28">
            <p class="text-gray-200 hover:text-gray-300 transition-colors">
              &copy; Ryan Cao 2020-${new Date().getFullYear()}
            </p>
          </footer>
        </body>
      </html>
    `;
  }
}

module.exports = Page;
