const { html, safe } = require('../../utils/htmlTag');

const header = (data) => {
  return html`<header
    class="contain flex justify-between items-center
    p-6 mt-20 mb-16 rounded-lg sticky top-6 z-50
    bg-gray-50 bg-opacity-60 backdrop-filter backdrop-blur-lg"
  >
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
    <ul class="flex items-center">
      ${safe(
        data.navLinks.links
          .map(
            (link) => html`<li>
              <a href="${link.href}" class="link text-lg font-medium mr-4">
                ${link.title}
              </a>
            </li>`
          )
          .join('\n')
      )}
      ${safe(
        data.navLinks.social
          .map(
            (link) => html`<li
              class="block transition-opacity hover:opacity-70 mr-4 last:mr-0"
            >
              <a href="${link.href}" target="_blank" rel="noreferrer noopener">
                ${link.icon}
              </a>
            </li>`
          )
          .join('\n')
      )}
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
          <meta name="theme-color" content="#5706e0" />

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
