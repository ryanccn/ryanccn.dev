import { annotate } from 'rough-notation';

const changeThemeColor = (color) => {
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', color);
};

document
  .querySelector('#twitter-social-link')
  .addEventListener('mouseover', () => {
    changeThemeColor('#60a5fa');
  });

document
  .querySelector('#twitter-social-link')
  .addEventListener('mouseout', () => {
    changeThemeColor('#5706e0');
  });

document
  .querySelector('#github-social-link')
  .addEventListener('mouseover', () => {
    changeThemeColor('#000000');
  });

document
  .querySelector('#github-social-link')
  .addEventListener('mouseout', () => {
    changeThemeColor('#5706e0');
  });

const hls = document.querySelectorAll('.highlight');

hls.forEach((hlElem) => {
  const annotation = annotate(hlElem, {
    type: 'highlight',
    color: 'rgba(135, 206, 235, 0.5)',
    animationDuration: 1000,
  });

  annotation.show();
});

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
