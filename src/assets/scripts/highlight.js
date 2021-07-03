import { annotate } from 'rough-notation';
import createObserver from './observer';

export default () => {
  const hls = document.querySelectorAll('mark, .highlight');

  hls.forEach((hlElem) => {
    const annotation = annotate(hlElem, {
      type: 'highlight',
      color: 'rgba(135, 206, 235, 0.6)',
      animationDuration: 1000,
    });

    createObserver(hlElem, () => {
      console.log('showing annotation');
      annotation.show();
    });
  });
};
