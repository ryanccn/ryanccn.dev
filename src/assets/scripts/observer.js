/**
@param {Element} elem
@param {() => void} callback
@param {number} pad
*/
export default (elem, callback, pad) => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: pad ? pad : 1.0,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(elem);
      }
    });
  }, options);

  observer.observe(elem);
};
