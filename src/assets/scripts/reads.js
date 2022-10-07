import observe from './observer';

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/** @param {string} slug */
const fetchData = async (slug) => {
  if (!DEV) {
    const req = await fetch(`/api/reads?slug=${slug}`);
    return await req.json();
  } else {
    console.log('mocking a fetch call to', slug, 'read count');
    await sleep(1000);
    return { value: 100 };
  }
};

const u = window.location.pathname;
const f = u.split('/').filter((k) => !!k);

if (DEV) console.log({ u, f });

if (f[0] === 'posts' && f.length === 1) {
  const e = document.querySelectorAll('span[data-reads]');

  for (const ek of e) {
    const linkElem = ek.parentElement.parentElement;

    observe(
      linkElem,
      async () => {
        console.log('reads observer tripped');

        const slug = ek
          .getAttribute('data-reads')
          .split('/')
          .filter((k) => !!k)[1];
        const a = await fetchData(slug);

        if (a.error || a.value === undefined) return;

        ek.innerHTML = a.value;
      },
      0
    );
  }
}
