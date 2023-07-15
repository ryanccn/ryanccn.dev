document.addEventListener(
  'load',
  (e) => {
    if (!(e.target instanceof HTMLImageElement)) {
      return;
    }

    if (DEV) console.log(`[lqip] removed for`, e.target);
    e.target.style.backgroundImage = 'none';
  },
  true,
);
