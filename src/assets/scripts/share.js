document.querySelectorAll('button[data-share-button]').forEach((e) => {
  e.addEventListener('click', () => {
    if ('share' in navigator) {
      const options = {
        url: location.href,
        title: document.title,
        text: document.title,
      };

      if (DEV) {
        console.log('triggered system share with options', options);
      }

      navigator.share(options);
    } else {
      if (DEV) {
        console.log('system share not supported, falling back to Twitter');
      }

      open(
        'https://twitter.com/intent/tweet?url=' +
          encodeURIComponent(location.href),
        '_blank'
      );
    }
  });
});
