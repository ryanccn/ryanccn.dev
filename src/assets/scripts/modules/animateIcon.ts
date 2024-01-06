const storageKey = 'animate-me-icon-v1';

const existing = sessionStorage.getItem(storageKey);
if (existing === 'true') {
  document.documentElement.classList.add('no-animate-me-icon');
} else {
  sessionStorage.setItem(storageKey, 'true');
}

export {};
