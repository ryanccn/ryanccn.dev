const html = String.raw;

const navLinkClasses = 'text-black hover:text-blue-500 transition-colors';

const header = (data) => {
  return html`
    <header
      class="flex justify-between mb-16 p-8 bg-white bg-opacity-50 backdrop-blur-lg sticky top-0 z-50"
    >
      <a class="flex space-x-2 items-center ${navLinkClasses}" href="/">
        <img
          src="/icons/50px.png"
          alt=""
          width="25"
          height="25"
          class="w-[25px] h-[25px] rounded-full"
          data-image-no-process="1"
        />
        <span class="text-lg font-bold capitalize">Ryan Cao</span>
      </a>
      <ul class="flex space-x-4 items-center">
        ${data.navLinks.links
          .map(
            (link) => html`<li>
              <a
                href="${link.href}"
                class="text-lg font-medium ${navLinkClasses}"
              >
                ${link.title}
              </a>
            </li>`
          )
          .join('\n')}
        ${data.navLinks.social
          .map(
            (link) => html`<li
              class="block transition-transform transform-gpu scale-100 hover:scale-125"
            >
              <a href="${link.href}" target="_blank" rel="noreferrer noopener">
                ${link.icon}
              </a>
            </li>`
          )
          .join('\n')}
      </ul>
    </header>
  `;
};

class Page {
  render(data) {
    const socialImg = `${data.domain}/previews/${this.slug(data.title)}.png`;

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
                src="/plausible/script.js"
                data-domain="ryanccn.dev"
                data-api="/plausible/event"
              ></script>`
            : ''}
        </head>
        <body class="flex flex-col mb-20 mx-auto">
          ${header(data)}
          <main class="mx-auto w-10/12 md:w-8/12 lg:w-7/12 min-h-screen">
            ${data.content}
          </main>
          <footer class="text-center mt-16">
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
