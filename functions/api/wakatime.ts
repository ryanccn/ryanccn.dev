interface Env {
  WAKAPI_URL: string;
  WAKAPI_TOKEN: string;
}

const html = String.raw;
const escapeHtml = (unsafe: string) =>
  unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const formatTime = (input: number) => {
  let ret = '';

  const years = Math.floor(input / 31536000);
  if (years) {
    ret += years + 'y';
  }

  const days = Math.floor((input %= 31536000) / 86400);
  if (days) {
    ret += days + 'd';
  }
  const hours = Math.floor((input %= 86400) / 3600);
  if (hours) {
    ret += hours + 'h';
  }
  const minutes = Math.floor((input %= 3600) / 60);
  if (minutes) {
    ret += minutes + 'm';
  }
  const seconds = input % 60;
  if (seconds) {
    ret += seconds + 's';
  }

  return ret || '0s';
};

export const onRequest: PagesFunction<Env> = async (ctx) => {
  if (!ctx.env.WAKAPI_URL || !ctx.env.WAKAPI_TOKEN)
    throw new Error('Configured incorrectly');

  const period = new URL(ctx.request.url).searchParams.get('period');

  const statsUrl = `${ctx.env.WAKAPI_URL}/api/compat/wakatime/v1/users/current/stats/${period}`;
  const { data } = await fetch(statsUrl, {
    headers: { Authorization: `Basic ${btoa(ctx.env.WAKAPI_TOKEN)}` },
  }).then(
    (res) =>
      res.json() as Promise<{
        data: {
          total_seconds: number;
          languages: { name: string }[];
          projects: { name: string }[];
        };
      }>
  );

  return new Response(
    html`
      <div
        class="bg-surface p-6 rounded-lg flex flex-col gap-y-2 lg:col-span-2"
      >
        <p class="font-semibold text-lg">Time spent</p>
        <p class="font-bold text-4xl">
          ${escapeHtml(formatTime(data.total_seconds))}
        </p>
      </div>
      <div class="bg-surface p-6 rounded-lg flex flex-col gap-y-2">
        <p class="font-semibold text-sm">Top project</p>
        <p class="font-bold text-xl">${escapeHtml(data.projects[0].name)}</p>
      </div>
      <div class="bg-surface p-6 rounded-lg flex flex-col gap-y-2">
        <p class="font-semibold text-sm">Top language</p>
        <p class="font-bold text-xl">${escapeHtml(data.languages[0].name)}</p>
      </div>
    `.trim(),
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
};
