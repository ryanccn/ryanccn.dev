/** @param {string} slug */
const fetchData = async (slug) => {
  if (!DEV) {
    const req = await fetch(`/api/reads?slug=${slug}`);
    return await req.json();
  } else {
    console.log('mocking a fetch call to', slug, 'read count');
    return 100;
  }
};

(async () => {
  const u = window.location.pathname;
  const f = u.split('/').filter((k) => !!k);

  if (DEV) console.log({ u, f });

  if (f[0] === 'posts' && f.length === 1) {
    const e = document.querySelectorAll('span[data-reads]');

    Promise.all(
      [...e].map(async (ek) => {
        const slug = ek.parentElement.parentElement
          .getAttribute('href')
          .split('/')
          .filter((k) => !!k)[1];
        const a = await fetchData(slug);

        if (a.error || a.value === undefined) return;

        ek.innerHTML = a.value;
      })
    );
  }
})();
