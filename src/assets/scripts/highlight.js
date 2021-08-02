import { annotate } from 'rough-notation';
import createObserver from './observer';

const parseOptions = (hlElem) => {
  let options = {
    type: hlElem.getAttribute('data-type') ?? 'highlight',
    color: hlElem.getAttribute('data-color') ?? 'rgba(135, 206, 235, 0.6)',
  };

  if (hlElem.getAttribute('data-width')) {
    options.strokeWidth = hlElem.getAttribute('data-width');
  }

  if (hlElem.getAttribute('data-duration')) {
    options.animationDuration = Number(hlElem.getAttribute('data-duration'));
  }

  if (hlElem.getAttribute('data-multiline') === '1') {
    options.multiline = true;
  }

  if (hlElem.getAttribute('data-iterations')) {
    options.iterations = Number(hlElem.getAttribute('data-iterations'));
  }

  return options;
};

const hls = document.querySelectorAll('mark, .highlight');

hls.forEach((hlElem) => {
  const annotation = annotate(hlElem, parseOptions(hlElem));

  createObserver(hlElem, () => {
    if (DEV) {
      console.log('showing annotation with options', parseOptions(hlElem));
    }

    annotation.show();
  });
});
