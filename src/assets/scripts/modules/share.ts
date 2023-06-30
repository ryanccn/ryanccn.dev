window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button[data-share-btn]').forEach((elem) => {
    if ('share' in navigator)
      (elem as HTMLButtonElement).classList.remove('hidden');

    elem.addEventListener('click', () => {
      navigator.share({
        title: document.querySelector('title')!.innerText,
        url: location.href,
      });
    });
  });
});
