const { html, safe } = require('../../utils/htmlTag');
const esbuild = require('esbuild');
const { join } = require('path');
const logSize = require('../../utils/logSize');

const header = (data) => {
  return html`<header class="navbar contain">
    <a class="flex items-center nav link mr-6" href="/">
      <img
        src="/icons/50px.png"
        alt=""
        width="25"
        height="25"
        class="w-[25px] h-[25px] rounded-full mr-2"
        data-image-no-process="1"
      />

      <span class="text-2xl font-semibold">Ryan Cao</span>
    </a>
    <ul class="flex items-center">
      ${safe(
        data.navLinks.links
          .map(
            (link) => html`<li>
              <a
                href="${link.href}"
                class="nav link ${link.href === data.page.url
                  ? 'active'
                  : ''} text-lg font-medium p-2 mr-4"
              >
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
      <li>
        <button class="block" data-theme-toggle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </button>
      </li>
    </ul>
  </header>`;
};

class Page {
  async render(data) {
    const socialImg = `${data.domain}/previews/${encodeURIComponent(
      this.slug(data.title)
    )}.png`;

    const build = await esbuild.build({
      entryPoints: [join(__dirname, '../assets/scripts/theme.ts')],
      define: {
        DEV: JSON.stringify(
          process.env.NODE_ENV ? process.env.NODE_ENV !== 'production' : true
        ),
      },
      format: 'iife',
      platform: 'browser',
      minify: true,
      bundle: true,
      write: false,
    });

    const themeScript = build.outputFiles[0].text;

    logSize(themeScript.length, '[theme script]');

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

          <script defer async src="/assets/main.js"></script>
          <script>
            ${safe(themeScript)};
          </script>
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
                <p class="text-zinc-500">
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
