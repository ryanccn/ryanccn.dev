import { annotate } from 'rough-notation';
import { RoughAnnotationConfig } from 'rough-notation/lib/model';
import createObserver from './observer';

/** @param {Element} hlElem */
const parseOptions = (hlElem) => {
  /** @type {RoughAnnotationConfig} */
  let options = {
    type: hlElem.getAttribute('data-type') ?? 'highlight',
    color: hlElem.getAttribute('data-color') ?? 'rgba(135, 206, 235, 0.6)',
  };

  if (hlElem.getAttribute('data-width')) {
    options.strokeWidth = hlElem.getAttribute('data-width');
  }

  if (hlElem.getAttribute('data-duration')) {
    options.animationDuration = parseInt(hlElem.getAttribute('data-duration'));
    if (isNaN(options.animationDuration)) options.animationDuration = 1;
  }

  if (hlElem.getAttribute('data-multiline') === '1') {
    options.multiline = true;
  }

  if (hlElem.getAttribute('data-iterations')) {
    options.iterations = parseInt(hlElem.getAttribute('data-iterations'));
    if (isNaN(options.iterations)) options.iterations = 1;
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
