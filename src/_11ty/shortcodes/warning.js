const { html } = require('../../utils/htmlTag');

module.exports = (content) => {
  return html`
    <div
      class="not-prose !mb-10 flex flex-col gap-y-1 border-l-2 border-tailwind-yellow-500 px-6 py-2"
    >
      <p class="text-lg font-bold text-tailwind-yellow-500">Warning!</p>
      <p>${content}</p>
    </div>
  `.trim();
};
