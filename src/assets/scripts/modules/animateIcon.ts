const storageKey = 'ami-v2';

const existing = sessionStorage.getItem(storageKey);
if (existing) {
  document.documentElement.classList.add('no-animate-me-icon');
} else {
  sessionStorage.setItem(storageKey, '1');
}
