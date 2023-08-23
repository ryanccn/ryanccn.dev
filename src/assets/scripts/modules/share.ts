window.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll<HTMLButtonElement>('button[data-share-btn]')
    .forEach((elem) => {
      if ('share' in navigator) {
        elem.classList.remove('hidden');

        elem.addEventListener('click', () => {
          navigator.share({
            title: document.title,
            url: location.href,
          });
        });
      }
    });
});
