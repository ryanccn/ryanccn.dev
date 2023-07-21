const { html, escapeHTML } = require('./utils');

module.exports = (content) => {
  return html`
    <div
      class="not-prose flex flex-col gap-y-1 border-l-2 border-tailwind-yellow-400 dark:border-tailwind-yellow-600 px-6 py-2 !mb-10"
    >
      <p
        class="text-lg font-bold text-tailwind-yellow-400 dark:text-tailwind-yellow-500"
      >
        Warning!
      </p>
      <p>${escapeHTML(content)}</p>
    </div>
  `.trim();
};
