document.addEventListener(
  'load',
  (e) => {
    // @ts-expect-error bah
    if (!e.target || e.target.tagName != 'IMG') {
      return;
    }

    // @ts-expect-error humbug
    e.target.style.backgroundImage = 'none';
  },
  true
);
