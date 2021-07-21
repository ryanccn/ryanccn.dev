import { annotate } from 'rough-notation';
import createObserver from './observer';

const hls = document.querySelectorAll('mark, .highlight');

hls.forEach((hlElem) => {
  const annotation = annotate(hlElem, {
    type: hlElem.getAttribute('data-hl-type') ?? 'highlight',
    color: hlElem.getAttribute('data-hl-color') ?? 'rgba(135, 206, 235, 0.6)',
    animationDuration: 1000,
  });

  createObserver(hlElem, () => {
    if (DEV) {
      console.log('showing annotation');
    }

    annotation.show();
  });
});
