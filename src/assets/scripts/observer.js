/**
@param {Element} elem
@param {() => void} callback
*/
export default (elem, callback) => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
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
