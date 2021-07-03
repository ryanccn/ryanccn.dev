export default () => {
  document.body.addEventListener(
    'load',
    (e) => {
      if (e.target.tagName != 'IMG') {
        return;
      }

      e.target.style.backgroundImage = 'none';
    },
    true
  );
};
